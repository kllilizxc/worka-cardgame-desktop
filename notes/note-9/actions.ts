import {z,requestExtension,readExtension,OperationRejectedError} from '@dsh-workbench/runtime';
import {contentQueries,contentActions,jsonObject,localActions,configureProjectContract,referenceDocumentSchema,featureChoicesSchema,type ContentQueryName,type ContentQueryInput,type ContentQueryOutput} from './contract';

import { realpath, stat, readFile } from 'node:fs/promises';
import { basename, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import type { NoteActionContext, NoteQueryContext, JsonValue } from "@dsh-workbench/runtime";
import {note,stateSchema,viewStateInputSchema} from "./model";
export { note } from "./model";
type ActionContext = NoteActionContext<typeof note>;
type QueryContext = NoteQueryContext<typeof note>;
import { encodeContentRef } from "./content-model";
import type {
  CardGameConfig,
  CardData,
  ContentList,
  DocumentData,
  DocumentMeta,
  GraphData,
  MediaData,
  MovePreviewData,
  ReferenceResource,
  StatusData,
} from "./content-model";

export type {
  AssetData,
  AssetFilters,
  AssetItem,
  BacklinkItem,
  CardData,
  CardItem,
  CardGameConfig,
  CardGameNotes,
  ContentKind,
  ContentList,
  ContentRef,
  DirectoryItem,
  DocumentData,
  DocumentMeta,
  DocumentItem,
  GraphData,
  LibraryItem,
  LibraryMode,
  LibraryState,
  MediaData,
  MovePreviewData,
  RecentChangeItem,
  RecentChangesData,
  ReferenceResource,
  StatusData,
  VersionItem,
} from "./content-model";

type QueryInput = Record<string, unknown> & { projectId?: string };

 async function pinReference(input:z.input<typeof contentActions.pinReference.input>, ctx: ActionContext) {
  return requestContent('pinReference', input, ctx);
}

/** Prepare this note's native conversation; opening it never submits a prompt. */
 async function discussAudio(_input: {}, ctx: ActionContext) {
  await projectFor(ctx);
  if (!ctx.host.agent.prepare) throw Error('宿主没有提供原生会话，请检查工作台连接。');
  return ctx.host.agent.prepare({ noteId: ctx.note.id });
}

/** Retain the local desktop's selection entry without sending an automatic prompt. */
 async function discussSelection(input: { itemIds?: string[] }, ctx: ActionContext) {
  const config = await ctx.config.read();
  const kind = config.value?.mode === 'cards' ? 'card' : config.value?.mode === 'assets' ? 'asset' : undefined;
  const ids = [...new Set(input.itemIds?.filter(id => typeof id === 'string' && id.trim()) ?? [])].slice(0, 3);
  if (!kind || !ids.length) throw Error('请先选择卡牌或资源。');
  if (!ctx.host.agent.prepare) throw Error('宿主没有提供原生会话。');
  for (const id of ids) {
    const target = await readOp('pinnedReferenceTarget', { kind, id }, ctx);
    await pinReference({ kind, id, revision: target.revision }, ctx);
  }
  return ctx.host.agent.prepare({ noteId: ctx.note.id });
}

/** Keep the existing registered local document sources and compare-and-save contract. */
 async function addResource(input: { path: string; title?: string }, ctx: ActionContext) {
  if (!input.path?.trim() || !isAbsolute(input.path.trim())) throw new OperationRejectedError('请填写本机文件或资料目录的绝对路径。');
  const path = await realpath(input.path.trim());
  const info = await stat(path);
  if (!info.isFile() && !info.isDirectory()) throw new OperationRejectedError('请选择普通文件或资料目录。');
  const entry = info.isDirectory() ? await realpath(resolve(path, 'index.md')) : path;
  const local = relative(path, entry);
  if (info.isDirectory() && (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local))) throw new OperationRejectedError('资料入口不在登记目录内。');
  if (!['.md', '.markdown', '.txt', '.json'].includes(extname(entry).toLowerCase())) throw new OperationRejectedError('阅读器支持 Markdown、JSON 和文本。');
  if ((await stat(entry)).size > 2 * 1024 * 1024) throw new OperationRejectedError('文件超过 2 MB，请选择较小的阅读入口。');
  await readFile(entry);
  const resource = { path, title: input.title?.trim() || basename(path), ...(info.isDirectory() ? { root: path } : {}) };
  const snapshot = await ctx.config.read();
  if (snapshot.value.resources?.some(item => item.path === path)) throw new OperationRejectedError('这份资料已经登记。');
  await ctx.config.update(draft => { draft.resources = [...(snapshot.value.resources ?? []), resource]; }, { expectedRevision: snapshot.revision });
  return resource;
}

/** Read the current instance config; the project ID is never inferred from content rows. */
async function projectFor(ctx: QueryContext | ActionContext, input: Record<string, unknown> = {}): Promise<string> {
  const config = await ctx.config.read();
  const configured = typeof config.value?.projectId === "string" ? config.value.projectId.trim() : "";
  const supplied = typeof input.projectId === "string" ? input.projectId.trim() : "";
  const projectId = configured || supplied;
  if (!projectId) throw new Error("CardGame 便笺尚未配置 projectId");
  return projectId;
}

/**
 * All display reads go through the single content extension query resource.
 * `snapshot.data` is the backend payload; the snapshot envelope is never exposed.
 */
function readOp<K extends ContentQueryName>(op:K,rawInput:(ContentQueryInput<K> & {projectGeneration?:string}) | null | undefined,ctx:QueryContext):Promise<ContentQueryOutput<K>>;
async function readOp(op:ContentQueryName,rawInput:unknown,ctx:QueryContext):Promise<ContentQueryOutput<ContentQueryName>> {
  const input = rawInput && typeof rawInput === "object" && !Array.isArray(rawInput)
    ? rawInput as QueryInput
    : {};
  const projectId = await projectFor(ctx, input);
  const {query,targetPath,parentPath,id,limit,...rest}=input;
  const normalized: Record<string, unknown> = {
    ...rest,
    ...(query !== undefined && rest.q === undefined ? { q: query } : {}),
    ...(limit !== undefined ? { limit } : {}),
    ...(op === "directories" && parentPath !== undefined && rest.directory === undefined ? { directory: parentPath } : {}),
    ...(op === "movePreview" && targetPath !== undefined && rest.toPath === undefined ? { toPath: targetPath } : {}),
    ...(op === "graph" && limit !== undefined && rest.maxNodes === undefined ? { maxNodes: limit } : {}),
    ...(op === "versions" && id !== undefined && rest.assetId === undefined ? { assetId: id } : {}),
    ...(op !== "versions" && id !== undefined ? { id } : {}),
    projectId,
    op,
  };
  if (op === 'assets') {
    const config = await ctx.config.read();
    if (config.value?.assetScope) normalized.assetScope = config.value.assetScope;
  }
  const contract=contentQueries[op];
  const resourceInput=await contract.resource.input.parseAsync({...normalized,op:op==='candidateDiff'?'gameCandidateDiff':op});
  const snapshot=await readExtension(ctx.resources,contract.resource,resourceInput);
  if (snapshot.error && snapshot.data === undefined) throw new Error(snapshot.error);
  if (snapshot.data === undefined) throw new Error(`CardGame 内容查询 ${op} 没有返回数据`);
  return snapshot.data;
}

async function readReferenceDocument(input: QueryInput, ctx: QueryContext): Promise<z.output<typeof referenceDocumentSchema>> {
  const resourceInput=z.json().parse(input);
  const snapshot = await ctx.resources.read<Record<string, unknown>>({ name: "extension.reference.file", input: resourceInput });
  if (snapshot.error && snapshot.data === undefined) throw new Error(snapshot.error);
  if (!snapshot.data) throw new Error("注册资料没有返回内容");
  return referenceDocumentSchema.parseAsync(snapshot.data);
}

type ContentActionName=keyof typeof contentActions;
type ActionOutput<K extends ContentActionName>=z.output<(typeof contentActions)[K]['output']>;
function requestContent<K extends ContentActionName>(method:K,input:z.input<(typeof contentActions)[K]['input']> & {projectGeneration?:string},ctx:ActionContext):Promise<ActionOutput<K>>;
async function requestContent(method:ContentActionName,input:unknown,ctx:ActionContext):Promise<ActionOutput<ContentActionName>> {
  const contract=contentActions[method];
  const parsed=await contract.method.input.parseAsync({...((input&&typeof input==='object')?input:{}),projectId:await projectFor(ctx)});
  return requestExtension(ctx.host.extensions,contract.method,parsed);
}

/**
 * Reject the current asset version. When an earlier adopted version exists the
 * asset is reverted to it; either way a high-priority rework Todo is opened
 * with a deep link back to the asset.
 */
 async function rejectAssetVersion(input: { assetId: string; reason?: string }, ctx: ActionContext) {
  if (typeof input?.assetId !== "string" || !input.assetId.trim()) throw new Error("rejectAssetVersion 需要 assetId");
  const projectId = await projectFor(ctx, input as Record<string, unknown>);
  const reason = typeof input.reason === "string" && input.reason.trim() ? input.reason.trim() : undefined;
  const asset = await readOp("asset", { id: input.assetId }, ctx);
  const currentVersionId = asset.currentVersionId;
  const versions = await readOp("versions", { id: input.assetId, limit: 100 }, ctx);
  const previous = versions.items
    .filter(version => Boolean(version.adopted) && version.id !== currentVersionId)
    .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))[0];
  const previousVersionId = previous ? previous.id : undefined;
  if (previousVersionId) await requestContent("adoptVersion", { assetId: input.assetId, versionId: previousVersionId }, ctx);
  const assetName = [asset.name, asset.title].find((value): value is string => typeof value === "string" && Boolean(value.trim()));
  const todo = await requestContent("createTodo", {
    title: `返修：${assetName ?? input.assetId}`,
    description: [`资源 ${input.assetId} 当前版本${currentVersionId ? ` ${currentVersionId}` : ""} 被否决`, previousVersionId ? `已回退到版本 ${previousVersionId}` : "没有可回退的历史版本，未回退", ...(reason ? [`原因：${reason}`] : [])].join("；"),
    priority: "high",
    category: "返修",
    context: { projectId, kind: "asset", id: input.assetId },
  }, ctx);
  const todoRecord = todo && typeof todo === "object" && !Array.isArray(todo) ? (todo as Record<string, unknown>).item : undefined;
  const todoId = todoRecord && typeof todoRecord === "object" && typeof (todoRecord as Record<string, unknown>).id === "string" ? (todoRecord as Record<string, unknown>).id as string : undefined;
  return { reverted: Boolean(previousVersionId), ...(previousVersionId ? { versionId: previousVersionId } : {}), todoId };
}

 async function createCardWorkflow(input:z.input<typeof localActions.createCardWorkflow.input>, ctx: ActionContext) {
  const config = await ctx.config.read();
  const projectId = await projectFor(ctx, input);
  const noteId = config.value?.notes?.production;
  if (!noteId) throw new OperationRejectedError('尚未关联卡牌制作便笺');
  if (!input.itemIds?.length) throw new OperationRejectedError('请先选中卡牌');
  if (!input.featureId?.trim()) throw new OperationRejectedError('请先选择所属功能');
  if (input.draft && input.itemIds.length !== 1) throw new OperationRejectedError('原始数据编辑只能针对一张卡');
  let draftDefinition:z.output<typeof jsonObject>|undefined;
  let draftPresentation:z.output<typeof jsonObject>|undefined;
  if (input.draft) {
    const source = await readOp('card', { id: input.itemIds[0], ...(input.projectGeneration ? { projectGeneration: input.projectGeneration } : {}) }, ctx);
    const original = jsonObject.safeParse(source.json.cardFace??{}), requested = jsonObject.safeParse(input.draft.cardFace??{});
    if(!original.success||!requested.success)throw new OperationRejectedError('卡面数据需要 JSON 对象');
    const originalFace=original.data,requestedFace=requested.data;
    const { themeId: oldTheme, ...originalStructure } = originalFace ?? {};
    const { themeId: nextTheme, ...requestedStructure } = requestedFace ?? {};
    const stable=(value:unknown):string=>value&&typeof value==='object'?Array.isArray(value)?`[${value.map(stable).join(',')}]`:`{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${stable(item)}`).join(',')}}`:JSON.stringify(value)??'null';
    if (stable(originalStructure) !== stable(requestedStructure)) throw new OperationRejectedError('卡面资源与布局请在制作单中修改');
    const { cardFace: _cardFace, ...definition } = input.draft;
    draftDefinition = definition;
    if (typeof nextTheme === 'string' && nextTheme !== oldTheme) draftPresentation = { themeId: nextTheme };
  }
  const requestId = input.requestId?.trim() || ctx.idempotencyKey;
  const result=contentActions.createCardBatch.output.parse(await ctx.step.run('create-card-batch',async()=>z.json().parse(await requestContent('createCardBatch', {cardIds: input.itemIds, featureId: input.featureId, ...(requestId ? { requestId } : {}),
    ...(input.projectGeneration ? { projectGeneration: input.projectGeneration } : {}),
    ...(input.expectedRevision ? { sourceRevisions: { [input.itemIds[0]!]: input.expectedRevision } } : {}), brief:`卡面制作 · ${input.itemIds.join('、')}`},ctx))));
  if (draftDefinition) {
    await ctx.step.run('save-card-draft',async()=>z.json().parse(await requestContent('saveCardDraft',{productionId:result.production.id,
      ...(input.projectGeneration ? { projectGeneration: input.projectGeneration } : {}),
      cardId: input.itemIds[0], baseRevision: result.production.revision, definition: draftDefinition,
      ...(draftPresentation?{presentation:draftPresentation}:{})},ctx)));
  }
  return { noteId, itemId: encodeContentRef({ projectId, kind: 'production', id: result.production.id }) };
}

 async function switchCardTheme(input: { id: string; themeId: string; expectedRevision: string }, ctx: ActionContext) {
  const card = await readOp('card', { id: input.id }, ctx);
  const definition = card.json;
  const face=jsonObject.parse(definition.cardFace);
  if (!jsonObject.parse(face.variants)[input.themeId]) throw new OperationRejectedError('这个主题尚未组装，请先进入卡牌工作流');
  return requestContent('updateCard', { id: input.id, expectedRevision: input.expectedRevision, patch: { cardFace: { ...face, themeId: input.themeId } } }, ctx);
}

const action_pinReference=note.action({...{"description":"明确固定当前对象与修订到项目共享上下文，不发送消息。","visibility":"public"},...contentActions.pinReference},(ctx,input)=>pinReference(input,ctx));
export {action_pinReference as pinReference};
const action_removePinnedReference=note.action({...{"description":"从项目共享上下文移除指定固定引用，不删除对象。","visibility":"public"},...contentActions.removePinnedReference},(ctx,input)=>requestContent('removePinnedReference',input,ctx));
export {action_removePinnedReference as removePinnedReference};
const action_discussAudio=note.action({...{"description":"discussAudio","visibility":"public"},...localActions.discussAudio},(ctx,input)=>discussAudio(input,ctx));
export {action_discussAudio as discussAudio};
const action_discussSelection=note.action({...{"description":"固定所选对象并打开原生会话，等待用户输入。","visibility":"public"},...localActions.discussSelection},(ctx,input)=>discussSelection(input,ctx));
export {action_discussSelection as discussSelection};
const action_addResource=note.action({...{"description":"保留登记可读取的本机文件或资料目录的入口。","visibility":"public"},...localActions.addResource},(ctx,input)=>addResource(input,ctx));
export {action_addResource as addResource};
const action_prepareBattleExperiment=note.action({...{"description":"显式准备当前版本或恢复固定版本的本机自动对局执行器。","visibility":"public"},...contentActions.prepareBattleExperiment},(ctx,input)=>requestContent('prepareBattleExperiment',input,ctx));
export {action_prepareBattleExperiment as prepareBattleExperiment};
const action_stopBattleExperiment=note.action({...{"description":"停止本机实验进程，保留已保存报告。","visibility":"public"},...contentActions.stopBattleExperiment},(ctx,input)=>requestContent('stopBattleExperiment',input,ctx));
export {action_stopBattleExperiment as stopBattleExperiment};
const action_analyzeStoryPaths=note.action({...{"description":"明确启动剧情初始状态路径检查；复用游戏规则并保存有范围限制的报告，不修改游戏或玩家存档。","visibility":"public"},...contentActions.analyzeStoryPaths},(ctx,input)=>requestContent('analyzeStoryPaths',input,ctx));
export {action_analyzeStoryPaths as analyzeStoryPaths};
const action_saveDocument=note.action({...{"description":"saveDocument","visibility":"public"},...contentActions.saveDocument},(ctx,input)=>requestContent('saveDocument',input,ctx));
export {action_saveDocument as saveDocument};
const action_moveDocument=note.action({...{"description":"moveDocument","visibility":"public"},...contentActions.moveDocument},(ctx,input)=>requestContent('moveDocument',input,ctx));
export {action_moveDocument as moveDocument};
const action_updateCard=note.action({...{"description":"updateCard","visibility":"public"},...contentActions.updateCard},(ctx,input)=>requestContent('updateCard',input,ctx));
export {action_updateCard as updateCard};
const action_updateAsset=note.action({...{"description":"updateAsset","visibility":"public"},...contentActions.updateAsset},(ctx,input)=>requestContent('updateAsset',input,ctx));
export {action_updateAsset as updateAsset};
const action_registerCandidates=note.action({...{"description":"将明确的制作产物登记为未采用的资源候选版本。","visibility":"public","receipt":"queryable"},...contentActions.registerCandidates},(ctx,input)=>requestContent('registerCandidates',input,ctx));
export {action_registerCandidates as registerCandidates};
const action_adoptVersion=note.action({...{"description":"按候选身份采用明确版本，返回实际资源和版本 ID。","visibility":"public","receipt":"queryable"},...contentActions.adoptVersion},(ctx,input)=>requestContent('adoptVersion',input,ctx));
export {action_adoptVersion as adoptVersion};
const action_compileStory=note.action({...{"description":"compileStory","visibility":"public"},...contentActions.compileStory},(ctx,input)=>requestContent('compileStory',input,ctx));
export {action_compileStory as compileStory};
const action_stageStoryCandidate=note.action({...{"description":"stageStoryCandidate","visibility":"public"},...contentActions.stageStoryCandidate},(ctx,input)=>requestContent('stageStoryCandidate',input,ctx));
export {action_stageStoryCandidate as stageStoryCandidate};
const action_stageDocumentsCandidate=note.action({...{"description":"stageDocumentsCandidate","visibility":"public"},...contentActions.stageDocumentsCandidate},(ctx,input)=>requestContent('stageDocumentsCandidate',input,ctx));
export {action_stageDocumentsCandidate as stageDocumentsCandidate};
const action_rejectAssetVersion=note.action({...{"description":"rejectAssetVersion","visibility":"public"},...localActions.rejectAssetVersion},(ctx,input)=>rejectAssetVersion(input,ctx));
export {action_rejectAssetVersion as rejectAssetVersion};
const action_createCardWorkflow=note.action({...{"description":"createCardWorkflow","visibility":"public"},...localActions.createCardWorkflow},(ctx,input)=>createCardWorkflow(input,ctx));
export {action_createCardWorkflow as createCardWorkflow};
const action_switchCardTheme=note.action({...{"description":"switchCardTheme","visibility":"public"},...localActions.switchCardTheme},(ctx,input)=>switchCardTheme(input,ctx));
export {action_switchCardTheme as switchCardTheme};
export const queries={
preferences:note.query({description:'读取旧版保存的界面偏好，作为当前查看者本地选择的初值。',visibility:'private',requiresConfig:false,input:z.object({}),output:stateSchema},async(ctx)=>(await ctx.state.read()).value),
overview: note.query({description:'读取小卡所需的状态与最多四条概览。',visibility:'private',requiresConfig:false,input:z.object({}),output:z.object({summary:z.string(),items:z.array(z.object({id:z.string(),title:z.string(),status:z.string()})).max(4)})},async(ctx)=>{
  const config=(await ctx.config.read()).value;
  if(!config.projectId)return {summary:'展开后连接 CardGame 项目',items:[]};
  if(config.mode==='knowledge'&&config.presentation!=='story')return {summary:`${config.resources?.length??0} 份资料入口`,items:(config.resources??[]).slice(0,4).map(item=>({id:item.path,title:item.title,status:'资料'}))};
  if(config.presentation==='story'){
    const page=await readOp('gameCatalog',{kind:'story',limit:4},ctx);
    return {summary:`${page.total} 个剧情`,items:page.items.slice(0,4).map(item=>({id:item.id,title:item.title??item.id,status:'剧情'}))};
  }
  const status=await readOp('status',{},ctx);
  if(config.presentation==='balance')return {summary:`${status.cards} 张卡牌 · 展开查看数值与对局报告`,items:[]};
  if(config.mode==='cards'){
    const page=await readOp('cards',{limit:4},ctx);
    return {summary:`${status.cards} 张卡牌`,items:page.items.slice(0,4).map(item=>({id:item.id,title:item.name??item.id,status:item.kind??'卡牌'}))};
  }
  const page=await readOp('assets',{limit:4},ctx);
  return {summary:`${page.total} 份${config.assetScope==='audio'?'音频':'资源'}`,items:page.items.slice(0,4).map(item=>({id:item.id,title:item.name??item.title??item.id,status:item.kind??'资源'}))};
}),
cardEditInput:note.query({description:'读取可编辑卡牌定义及保存所基于的业务修订。',visibility:'private',input:z.object({id:z.string(),projectId:z.string(),projectGeneration:z.string().optional()}),output:z.object({text:z.string(),featureId:z.string(),itemId:z.string(),projectId:z.string(),projectGeneration:z.string(),revision:z.string()})},async(ctx,input)=>{
 const card=await readOp('card',input,ctx);
 if(!card.projectGeneration)throw Error('项目绑定尚未就绪');
 return {text:JSON.stringify(card.json,null,2),featureId:'',itemId:input.id,projectId:input.projectId,projectGeneration:card.projectGeneration,revision:card.revision};
}),
pinnedReferenceTarget:note.query({...{"description":"核对待固定对象、剧情节点、数值指标或报告比较的当前身份。","visibility":"public"},input:contentQueries.pinnedReferenceTarget.input,output:contentQueries.pinnedReferenceTarget.output},(ctx,input)=>readOp('pinnedReferenceTarget',input,ctx)),
pinnedReferences:note.query({...{"description":"读取本项目共享固定引用并核对当前修订。","visibility":"public"},input:contentQueries.pinnedReferences.input,output:contentQueries.pinnedReferences.output},(ctx,input)=>readOp('pinnedReferences',input,ctx)),
battleExperiments:note.query({...{"description":"读取固定版本实验状态和历史报告，不自动启动进程。","visibility":"public"},input:contentQueries.battleExperiments.input,output:contentQueries.battleExperiments.output},(ctx,input)=>readOp('battleExperiments',input,ctx)),
battleSources:note.query({...{"description":"读取当前项目的候选身份供准备独立对局快照，不返回本机路径。","visibility":"public"},input:contentQueries.battleSources.input,output:contentQueries.battleSources.output},(ctx,input)=>readOp('battleSources',input,ctx)),
battleComparison:note.query({...{"description":"按实验及报告 ID 比较同设置的历史对局，仅统计两侧均完成的种子。","visibility":"public"},input:contentQueries.battleComparison.input,output:contentQueries.battleComparison.output},(ctx,input)=>readOp('battleComparison',input,ctx)),
storyExecutionReport:note.query({...{"description":"读取已保存的条件路径检查报告、执行状态及正文版本是否匹配；不启动检查。","visibility":"public"},input:contentQueries.storyExecutionReport.input,output:contentQueries.storyExecutionReport.output},(ctx,input)=>readOp('storyExecutionReport',input,ctx)),
candidateDiff:note.query({...{"description":"candidateDiff","visibility":"public"},input:contentQueries.candidateDiff.input,output:contentQueries.candidateDiff.output},(ctx,input)=>readOp('candidateDiff',input,ctx)),
balanceOverview:note.query({...{"description":"读取正式卡牌定义统计及修订，不提供未经对局测量的胜率。","visibility":"public"},input:contentQueries.balanceOverview.input,output:contentQueries.balanceOverview.output},(ctx,input)=>readOp('balanceOverview',input,ctx)),
gameDeck:note.query({...{"description":"按游戏目录中的卡组 ID 读取构成及卡牌引用。","visibility":"public"},input:contentQueries.gameDeck.input,output:contentQueries.gameDeck.output},(ctx,input)=>readOp('gameDeck',input,ctx)),
gameCatalog:note.query({...{"description":"分页读取正式剧情、牌组或遭遇的稳定目录身份。","visibility":"public"},input:contentQueries.gameCatalog.input,output:contentQueries.gameCatalog.output},(ctx,input)=>readOp('gameCatalog',input,ctx)),
storyAnalysis:note.query({...{"description":"按剧情目录 ID 读取版本绑定的节点、分支与结构检查；条件可达性尚未模拟。","visibility":"public"},input:contentQueries.storyAnalysis.input,output:contentQueries.storyAnalysis.output},(ctx,input)=>readOp('storyAnalysis',input,ctx)),
featureChoices:note.query({...{"description":"featureChoices","visibility":"public"},input:z.object({}).nullish(),output:featureChoicesSchema},async(ctx)=>{const owner=await ctx.notes.read(ctx.note.id);const notes=await ctx.notes.lookup({desktopId:owner.desktopId});const trackers=notes.filter(note=>!note.archived&&note.actions?.includes('setArchiveStatus')&&note.actions?.includes('confirmGameCandidate'));if(trackers.length!==1)throw Error(trackers.length?'本桌面有多个功能进展便笺，请先确定使用哪一个':'本桌面没有可用的功能进展便笺');const snapshot=await ctx.resources.read({name:'extension.official-feature-tracker.state',input:{targetNoteId:trackers[0]!.id}});if(snapshot.error)throw Error(snapshot.error);const state=z.object({features:z.array(z.object({id:z.string(),title:z.string(),archived:z.boolean().optional()}))}).parse(snapshot.data);return {items:state.features.filter(item=>!item.archived).map(({id,title})=>({id,title}))};}),
status:note.query({...{"description":"status","visibility":"public"},input:contentQueries.status.input,output:contentQueries.status.output},(ctx,input)=>readOp('status',input,ctx)),
documents:note.query({...{"description":"documents","visibility":"public"},input:contentQueries.documents.input,output:contentQueries.documents.output},(ctx,input)=>readOp('documents',input,ctx)),
directories:note.query({...{"description":"directories","visibility":"public"},input:contentQueries.directories.input,output:contentQueries.directories.output},(ctx,input)=>readOp('directories',input,ctx)),
document:note.query({...{"description":"按 ID 或登记路径读取一份知识文档的当前内容与版本。","visibility":"public"},input:contentQueries.document.input,output:contentQueries.document.output},(ctx,input)=>readOp('document',input,ctx)),
documentMeta:note.query({...{"description":"documentMeta","visibility":"public"},input:contentQueries.documentMeta.input,output:contentQueries.documentMeta.output},(ctx,input)=>readOp('documentMeta',input,ctx)),
referenceDocument:note.query({...{"description":"referenceDocument","visibility":"public"},input:z.object({resourcePath:z.string(),path:z.string().optional()}).nullish(),output:referenceDocumentSchema},(ctx,input)=>readReferenceDocument(input??{},ctx)),
backlinks:note.query({...{"description":"backlinks","visibility":"public"},input:contentQueries.backlinks.input,output:contentQueries.backlinks.output},(ctx,input)=>readOp('backlinks',input,ctx)),
graph:note.query({...{"description":"graph","visibility":"public"},input:contentQueries.graph.input,output:contentQueries.graph.output},(ctx,input)=>readOp('graph',input,ctx)),
movePreview:note.query({...{"description":"movePreview","visibility":"public"},input:contentQueries.movePreview.input,output:contentQueries.movePreview.output},(ctx,input)=>readOp('movePreview',input,ctx)),
cards:note.query({...{"description":"cards","visibility":"public"},input:contentQueries.cards.input,output:contentQueries.cards.output},(ctx,input)=>readOp('cards',input,ctx)),
card:note.query({...{"description":"按稳定卡牌 ID 读取定义和源文件版本。","visibility":"public"},input:contentQueries.card.input,output:contentQueries.card.output},(ctx,input)=>readOp('card',input,ctx)),
assets:note.query({...{"description":"分页查找资源库内的素材。","visibility":"public"},input:contentQueries.assets.input,output:contentQueries.assets.output},(ctx,input)=>readOp('assets',input,ctx)),
asset:note.query({...{"description":"按资源 ID 读取当前素材及采用版本。","visibility":"public"},input:contentQueries.asset.input,output:contentQueries.asset.output},(ctx,input)=>readOp('asset',input,ctx)),
versions:note.query({...{"description":"按资源 ID 读取候选与历史版本。","visibility":"public"},input:contentQueries.versions.input,output:contentQueries.versions.output},(ctx,input)=>readOp('versions',input,ctx)),
inspection:note.query({...{"description":"inspection","visibility":"public"},input:contentQueries.inspection.input,output:contentQueries.inspection.output},(ctx,input)=>readOp('inspection',input,ctx)),
recentChanges:note.query({...{"description":"recentChanges","visibility":"public"},input:contentQueries.recentChanges.input,output:contentQueries.recentChanges.output},(ctx,input)=>readOp('recentChanges',input,ctx)),
storyBuilds:note.query({...{"description":"storyBuilds","visibility":"public"},input:contentQueries.storyBuilds.input,output:contentQueries.storyBuilds.output},(ctx,input)=>readOp('storyBuilds',input,ctx)),
storyScenePage:note.query({...{"description":"storyScenePage","visibility":"public"},input:contentQueries.storyScenePage.input,output:contentQueries.storyScenePage.output},(ctx,input)=>readOp('storyScenePage',input,ctx)),
media:note.query({...{"description":"media","visibility":"public"},input:contentQueries.media.input,output:contentQueries.media.output},(ctx,input)=>readOp('media',input,ctx))
};

export const setViewState=note.action({description:'保存本便笺的界面选择。',visibility:'private',requiresConfig:false,input:viewStateInputSchema,output:z.object({revision:z.string()})},async(ctx,input)=>{
  const saved=await ctx.state.update(draft=>{
    if(input.patch){
      const {views,...fields}=input.patch;
      Object.assign(draft,fields);
      if(views)Object.assign(draft.views??={},views);
    }
    if(input.bookmark){
      const {key,saved}=input.bookmark;
      const bookmarks=(draft.bookmarks??[]).filter(value=>value!==key);
      draft.bookmarks=(saved?[...bookmarks,key]:bookmarks).slice(-200);
    }
    if(input.filter){
      const views=draft.views??={},filter=input.filter;
      views.assetsFilters=[...(views.assetsFilters??[]).filter(value=>value.name!==filter.name),filter].slice(-20);
    }
  });
  return {revision:saved.revision};
});

/** Explicit owner selection binds this desktop; imported config never grants filesystem access. */
export const configureProject = note.action({
  description: '选择本机 CardGame 项目目录，并连接此桌面的卡牌、资源、剧情、制作与预览便笺。',
  visibility: 'private', requiresConfig: false,
  input:configureProjectContract.input,output:configureProjectContract.output,
}, async (ctx, input) => requestExtension(ctx.host.extensions,configureProjectContract,input));
