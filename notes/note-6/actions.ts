import {resolveExecutionTarget,receiveDeliveryFailure as receiveFailure} from './migration-compat';
import {cardgameQueries} from './cardgame-operations';
export {pinChangeReference,removePinnedReference,discussChange} from './cardgame-operations';
import {z,isCommandOutcomeError} from '@dsh-workbench/runtime';
import {note} from './model';
import {projectTracker} from './projection';
export {note} from './model';
import {featureReceiptSchema,getFeatureSchema,summarySchema,viewSchema,gameCandidateInputSchema,gameAdoptionSchema} from './schemas';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';


export const events = {
  archived:note.event({visibility:'public', name:'features.archived',description:"用户归档一条稳定 feature ID；关联预览按此事件归档候选。",payload:z.object({featureId:z.string(),title:z.string(),revision:z.string()}),objectRef:'/featureId',objectLabel:'/title',revision:'/revision'}),
};

export const queries = {
 ...cardgameQueries,
 resolveExecutionTarget:note.query({description:'按实际关联的 feature ID 定位执行任务。',visibility:'private',input:z.object({featureId:z.string(),repository:z.string().optional()}),output:z.json()},async(ctx,input)=>resolveExecutionTarget(input,ctx)),
  projectChoices: note.query({"description":"读取当前实例中可关联的项目。","visibility":"private",input:z.object({}).nullable(),output:z.object({items:z.array(z.object({id:z.string(),name:z.string()}))})}, async (ctx, _input) => {
    const state = await ctx.resources.read<any>({ name: 'extension.official-feature-tracker.state', input: {} });
    if (state.error) throw new Error(state.error);
    const home = state.data?.context?.home;
    if (typeof home !== 'string' || !home) throw new Error('功能台账尚未提供项目目录');
    const config = JSON.parse(await readFile(resolve(home, 'projects.json'), 'utf8'));
    return { items: Object.entries(config.repos ?? {}).map(([id, repo]) => ({ id, name: String((repo as any).name ?? (repo as any).repo ?? (repo as any).repository ?? id).replace(/^github.com[/-]/, '') })) };
  }),

  summary: note.query({visibility:'public', "description":"读取功能记录的摘要与数据源状态。",input:z.object({}).nullable(),output:summarySchema}, async (ctx, _input) => {
    const result=await ctx.resources.read<any>({name:'extension.official-feature-tracker.summary',input:{}});
    if(result.error)throw new Error(result.error);return result.data;
  }),

  diagnostics: note.query({"description":"读取功能台账的数据源诊断。","visibility":"private",input:z.object({}).nullable(),output:z.object({syncing:z.boolean(),runtimeError:z.string().nullable().optional(),nextSyncAt:z.number(),ci:z.record(z.string(),z.unknown())})}, async (ctx, _input) => {
    const value=await ctx.resources.read<any>({name:'extension.official-feature-tracker.diagnostics',input:{}});
    if(value.error)throw new Error(value.error);return value.data;
  }),

  view: note.query({"description":"读取功能、合并、检查和部署进展。","visibility":"private",input:z.object({}).nullable(),output:viewSchema}, async (ctx, _input) => {
    const [snapshot, candidateSnapshot] = await Promise.all([
      ctx.resources.read<any>({ name: 'extension.official-feature-tracker.state', input: {} }),
      ctx.resources.read<any>({ name: 'extension.cardgame-content.query', input: { op: 'featureCandidates' } }).catch(() => undefined),
    ]);
    if (snapshot.error) throw new Error(snapshot.error);
    return projectTracker(snapshot.data, candidateSnapshot?.data?.items ?? []);
  }),
  getFeature: note.query({visibility:'public', "description":"按稳定 feature ID 读取原始功能记录及项目上下文。",input:z.object({id:z.string()}),output:getFeatureSchema}, async (ctx, input) => {
    const [record,state] = await Promise.all([
      ctx.resources.read<any>({name:'extension.official-feature-tracker.feature',input}),
      ctx.resources.read<any>({name:'extension.official-feature-tracker.state',input:{}}),
    ]);
    if (record.error || state.error) throw new Error(record.error || state.error);
    return {...record.data,context:state.data.context,existingFeatures:state.data.features.map((feature:any)=>({id:feature.id,title:feature.title,summary:feature.summary,links:feature.links.map((link:any)=>({repo:link.repo,repository:link.repoName,branches:link.branches}))}))};
  }),
};


const archiveReceiptSchema = z.object({id:z.string(),archived:z.boolean(),title:z.string().optional(),revision:z.string()});
const archiveEventErrorSchema = z.object({message:z.string(),code:z.literal('command-outcome').optional(),executionId:z.string().optional(),
  status:z.enum(['failed','ambiguous','cancelled','completed']).optional(),detailExpired:z.boolean().optional()});
const archiveResultSchema = z.object({accepted:z.boolean(),receipt:archiveReceiptSchema.nullable(),receiptVerified:z.boolean(),event:z.discriminatedUnion('status',[
  z.object({status:z.literal('not-required')}),z.object({status:z.literal('not-published'),reason:z.string()}),z.object({status:z.literal('published'),eventId:z.string()}),
  z.object({status:z.enum(['failed','unconfirmed']),error:archiveEventErrorSchema}),
])});

/** The tracker receipt and the subsequent event publication are separate facts. */
export const setArchiveStatus = note.action({"description":"更新功能的归档标记并发布归档事件。","visibility":"private",input:z.object({id:z.string(),archived:z.boolean()}),output:archiveResultSchema}, async (ctx, input) => {
  const receipt = await ctx.host.extensions.request('official-feature-tracker','archive',input);
  const checked = archiveReceiptSchema.safeParse(receipt);
  if (!checked.success || checked.data.id !== input.id || checked.data.archived !== input.archived || !checked.data.revision) {
    return {accepted:false,receipt:checked.success?checked.data:null,receiptVerified:false,event:{status:'not-published' as const,reason:'归档请求已受理，但无法核对功能记录修订号'}};
  }
  const committed = checked.data;
  if (!input.archived) return {accepted:true as const,receipt:committed,receiptVerified:true,event:{status:'not-required' as const}};
  try {
    const event = await events.archived.publish(ctx, {featureId:input.id,title:committed.title??input.id,revision:committed.revision},
      {key:`${input.id}:${committed.revision}:archived`});
    return {accepted:true as const,receipt:committed,receiptVerified:true,event:{status:'published' as const,eventId:event.id}};
  } catch (error) {
    const unconfirmed = isCommandOutcomeError(error) && (error.status === 'ambiguous' || error.status === 'completed' || error.detailExpired);
    return {accepted:true as const,receipt:committed,receiptVerified:true,event:{status:unconfirmed?'unconfirmed' as const:'failed' as const,error:{
      message:error instanceof Error ? error.message : String(error),
      ...(isCommandOutcomeError(error) ? {code:'command-outcome' as const,executionId:error.executionId,status:error.status,detailExpired:error.detailExpired} : {}),
    }}};
  }
});

/** The file commit emits a resource event; no duplicate state mirror is written. */
/** Update the authoritative feature using its current baseRevision. */
export const recordFeature = note.action({"description":"按当前版本保存功能记录。","visibility":"private",input:z.object({id:z.string(),baseRevision:z.string().nullable(),patch:z.strictObject({title:z.string().optional(),summary:z.string().optional(),next:z.string().optional(),body:z.string().optional(),links:z.array(z.strictObject({repo:z.string(),branches:z.array(z.string())})).optional()})}),output:featureReceiptSchema}, async (ctx, input) => {
  return ctx.host.extensions.request('official-feature-tracker', 'feature.save', input);
});

export const confirmGameCandidate = note.action({"description":"核对候选身份后采用游戏改动。","visibility":"private",input:gameCandidateInputSchema,output:gameAdoptionSchema}, async (ctx, input) => {
  return ctx.host.extensions.request('cardgame-content', 'confirmGameCandidate', input);
});

export const undoGameCandidate = note.action({"description":"核对采用记录后撤销游戏改动。","visibility":"private",input:gameCandidateInputSchema.extend({adoptionId:z.string()}),output:gameAdoptionSchema}, async (ctx, input) => {
  return ctx.host.extensions.request('cardgame-content', 'undoGameCandidate', input);
});

/** The host keeps monitoring alive without retaining an idle note worker. */
export const background=note.background({resources:[{name:"extension.official-feature-tracker.summary",input:{}}]});

export const refresh = note.action({"description":"请求刷新功能台账的数据源。","visibility":"private",input:z.object({}).nullable(),output:z.object({accepted:z.boolean()})}, async (ctx, _input) => {
  return ctx.host.extensions.request('official-feature-tracker','refresh',{});
});

export const receiveDeliveryFailure=note.action({description:'按失败交付身份幂等保存修复回执。',visibility:'public',input:z.record(z.string(),z.json()),output:z.union([z.object({ok:z.boolean(),failure:z.object({summary:z.string(),repairable:z.string()})}),z.object({ok:z.boolean(),connectionId:z.string(),deliveryId:z.string(),fingerprint:z.string(),notificationKey:z.string()})])},async(ctx,input)=>receiveFailure(input,ctx));

export const setViewState=note.action({description:'保存本便笺的界面选择，核对当前修订。',visibility:'private',requiresConfig:false,input:z.object({patch:z.record(z.string(),z.json()),expectedRevision:z.string()}),output:z.object({revision:z.string()})},async(ctx,input)=>{const saved=await ctx.state.update(draft=>{Object.assign(draft,input.patch);},{expectedRevision:input.expectedRevision});return {revision:saved.revision};});
