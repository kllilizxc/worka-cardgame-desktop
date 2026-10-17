import {z} from '@dsh-workbench/runtime';

import type { NoteActionContext, NoteQueryContext, JsonValue } from "@dsh-workbench/runtime";
import { note } from "./note-model";
export { note } from "./note-model";
type ActionContext = NoteActionContext<typeof note>;
type QueryContext = NoteQueryContext<typeof note>;

export interface ProductionState {
  projectId?: string;
  selectedId?: string;
  query?: string;
}

/** Explicit card workflow actions share the existing production backend. */
 async function cardWorkflow(input: { operation: string; [key: string]: any }, ctx: ActionContext) {
  const allowed = new Set(['createCardBatch', 'setCardDrafts', 'saveCardDraft', 'approveCardDrafts', 'requestCardArt', 'reuseCardArt', 'attachCardArt', 'assembleCardFaces', 'integrateCard', 'saveDeckPlan', 'confirmDeckDraft', 'prepareDeckArt', 'stageDeckCandidate']);
  if (!allowed.has(input.operation)) throw new Error('未知卡牌工作流动作');
  const { operation, ...payload } = input;
  return command(operation, { ...payload, projectId: await project(payload, ctx) }, ctx);
}

export interface ProductionInput {
  projectId: string;
  productionId?: string;
  id?: string;
  brief: string;
  targetAsset?: Record<string, unknown>;
  pinnedRefs?: Array<Record<string, unknown> | string>;
  batch?: unknown;
  todoId?: string;
}

async function project(input: Record<string, unknown>, ctx: ActionContext | QueryContext): Promise<string> {
  const configured = await ctx.config.read().catch(() => undefined);
  const projectId = typeof input.projectId === "string" && input.projectId.trim()
    ? input.projectId.trim()
    : typeof configured?.value?.projectId === "string" && configured.value.projectId.trim()
      ? configured.value.projectId.trim()
      : "";
  if (!projectId) throw new Error("CardGame 便笺尚未配置 projectId");
  return projectId;
}

async function command(method: string, input: Record<string, unknown>, ctx: ActionContext): Promise<any> {
  return ctx.host.extensions.request("cardgame-content", method, input);
}

async function readOp<T>(op: string, input: Record<string, unknown>, ctx: QueryContext): Promise<T> {
  const projectId = await project(input as unknown as Record<string, unknown>, ctx);
  const snapshot = await ctx.resources.read<T>({ name: "extension.cardgame-content.query", input: { ...input, projectId, op } as JsonValue });
  if (snapshot.error && snapshot.data === undefined) throw new Error(snapshot.error);
  if (snapshot.data === undefined) throw new Error(`CardGame 制作查询 ${op} 没有返回数据`);
  return snapshot.data;
}

function resultRecord(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, any> : {};
}

/** Prefer backend-assigned candidate/version identities over local proposals. */
function candidatesFromReceipt(receipt: { result?: unknown }, fallback: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  if (Array.isArray(receipt.result)) {
    const values = receipt.result.filter((value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value)));
    if (values.length) return values;
  }
  const result = resultRecord(receipt.result);
  for (const key of ["candidates", "candidateRefs", "versions", "items"]) {
    if (Array.isArray(result[key])) {
      const values = result[key].filter((value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value)));
      if (values.length) return values;
    }
  }
  return fallback;
}

function adoptionIdentity(receipt: { result?: unknown }): { assetId?: string; versionId?: string; candidateId?: string } {
  const result = resultRecord(receipt.result);
  const asset = resultRecord(result.asset);
  const version = resultRecord(result.version);
  const currentVersion = resultRecord(result.currentVersion);
  return {
    ...(typeof (result.assetId ?? asset.id ?? result.id) === "string" ? { assetId: result.assetId ?? asset.id ?? result.id } : {}),
    ...(typeof (result.versionId ?? version.id ?? result.currentVersionId ?? currentVersion.id) === "string" ? { versionId: result.versionId ?? version.id ?? result.currentVersionId ?? currentVersion.id } : {}),
    ...(typeof (result.candidateId ?? currentVersion.candidateId) === "string" ? { candidateId: result.candidateId ?? currentVersion.candidateId } : {}),
  };
}

async function registerReturnedCandidates(projectId: string, productionId: string, round: number, requestId: string, candidates: Array<Record<string, unknown>>, ctx: ActionContext) {
  if (!candidates.length) return { status: "skipped", candidates: [] };
  try {
    const registrationRequestId = `asset-candidates:${projectId}:${productionId}:${round}:${requestId}`;
    const event = await ctx.events.publish("cardgame.production.candidatesRequested",
      { projectId, productionId, round, requestId: registrationRequestId, candidates } as JsonValue,
      { key: registrationRequestId, exclusive: true });
    return { status: "queued", requestId: registrationRequestId, eventId: event.id, duplicate: event.duplicate };
  } catch (cause) {
    return { status: "failed", error: cause instanceof Error ? cause.message : String(cause) };
  }
}

/** Keep the existing CardGame card discussion entry available after activation. */
 async function discussCardBatch(input: { projectId: string; productionId: string; cardId?: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const detail = await readOp<any>('cardBatch', { projectId, productionId: input.productionId }, ctx as unknown as QueryContext);
  if (!ctx.host.agent.prepare) throw new Error('宿主没有提供原生会话');
  const session = await ctx.host.agent.prepare({ noteId: ctx.note.id });
  const prompt = [
    `用户要继续卡牌工作流：${detail.production.brief}。projectId=${projectId}，productionId=${input.productionId}，baseRevision=${detail.production.revision}。`,
    input.cardId ? `当前选中卡牌：${input.cardId}。先读取 cardBatch，再按用户要求微调。` : '请结合项目现有 units.json、效果类型和世界观生成卡组草稿，并调用 cardWorkflow(operation=setCardDrafts) 保存，不要只在对话中输出。',
    ...(detail.batch?.deck ? [`这是独立牌组制作：${detail.batch.deck.title}，目标 ${detail.batch.deck.targetSize} 张总量（不是牌种数）。先读取现有规则与同类卡，设计原创命名、合法效果和副本数量。用 setCardDrafts 同时保存 cards 与 deckPlan（保留 id=${detail.batch.deck.id}，entries=[{cardId,count}]，总量等于 targetSize）。不要写入正式默认牌组，不调用生图；停在用户确认整套草案。单张修改用 saveCardDraft，数量调整用 saveDeckPlan，保留其余卡与素材。`] : []),
    '沿用原有执行效果结构。已确认卡牌用 saveCardDraft 逐张修改；不能覆盖人工确认。停在人工微调步骤，由用户核对。',
    '插画由 Codex 内置 imagegen 承接；本宿主没有该生图接口时保存 requestCardArt 交接，不得假装已生成或改用收费接口。',
  ].join('\n');
  await ctx.host.agent.run({ noteId: ctx.note.id, sessionId: session.sessionId, prompt });
  return session;
}

/** Save or edit a draft. This action never invokes a model connection. */
 async function upsertRequest(input: ProductionInput, ctx: ActionContext) {
  const projectId = await project(input as unknown as Record<string, unknown>, ctx);
  return command("upsertProduction", { ...(input as unknown as Record<string, unknown>), projectId }, ctx);
}

 async function updateProduction(input: { projectId: string; productionId: string; baseRevision: number; patch: Record<string, unknown> }, ctx: ActionContext) {
  return command("updateProduction", { ...input, projectId: await project(input, ctx) }, ctx);
}

/**
 * Reserve a durable round, then publish its immutable snapshot to the
 * Production/Desk Skill relation. The same requestId retries the same event.
 */
 async function generate(input: { projectId: string; productionId: string; requestId?: string; newRound?: boolean; round?: number; businessKey?: string; scope?: string[]; cwd?: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const reserved = await command("reserveProduction", { ...input, projectId }, ctx);
  const requestId = reserved.requestId as string;
  const submit = reserved.submit ?? reserved.input;
  const event = await ctx.events.publish("cardgame.production.generationRequested",
    { projectId, productionId: input.productionId, requestId, round: reserved.round?.round, submit } as JsonValue,
    { key: requestId, exclusive: true });
  return { ...reserved, status: "queued", eventId: event.id, duplicate: event.duplicate };
}

/** The Skill relation persists the exact execution receipt for this round. */
 async function bindExecution(input: { projectId: string; productionId: string; requestId: string; receipt: Record<string, unknown> }, ctx: ActionContext) {
  return command("bindProduction", { ...input, projectId: await project(input, ctx) }, ctx);
}

/** Retry the same reserved round and requestId after an ambiguous transport. */
 async function retry(input: { projectId: string; productionId: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const detail = await readOp<any>("production", { projectId, productionId: input.productionId }, ctx as unknown as QueryContext);
  const round = detail.production?.rounds?.at(-1);
  if (!round?.requestId) throw new Error("当前制作请求还没有可重试轮次");
  return generate({ projectId, productionId: input.productionId, requestId: round.requestId, round: round.round }, ctx);
}

/** Start a new round while retaining the same execution owner businessKey. */
 async function newRound(input: { projectId: string; productionId: string; scope?: string[]; cwd?: string }, ctx: ActionContext) {
  return generate({ ...input, newRound: true }, ctx);
}

/** Delivery receiver for the existing execution note. */
 async function receiveResult(input: Record<string, unknown>, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const received = await command("productionResult", { ...input, projectId }, ctx);
  // A late result is durable evidence of an old round only.  It must never
  // trigger candidate registration for the current production again.
  if (received?.stale) return received;
  const production = resultRecord(received?.production);
  const requestId = typeof input.requestId === "string" ? input.requestId : "";
  const roundValue = typeof input.round === "number" ? input.round : Number(input.round);
  const round = Array.isArray(production.rounds)
    ? production.rounds.find((value: any) => value?.requestId === requestId && (Number.isNaN(roundValue) || value?.round === roundValue))
    : undefined;
  const result = resultRecord(round?.result);
  const status = typeof result.status === "string" ? result.status : typeof input.status === "string" ? input.status : "completed";
  const candidates = Array.isArray(result.candidateRefs) ? result.candidateRefs.filter((value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value))) : [];
  const registrationComplete = production.candidateRegistration?.status === "completed";
  if (status === "completed" && !registrationComplete && typeof input.productionId === "string" && requestId && typeof round?.round === "number") {
    const assetRegistration = await registerReturnedCandidates(input.projectId as string, input.productionId, round.round, requestId, candidates, ctx);
    return { ...received, assetRegistration };
  }
  return received;
}

/** Register bounded candidate references in the asset backend after delivery. */
 async function registerCandidates(input: { projectId: string; productionId: string; round?: number; candidates: Array<Record<string, unknown>>; requestId?: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const requestId = input.requestId ?? `asset-candidates:${projectId}:${input.productionId}:${input.round ?? 0}`;
  const event = await ctx.events.publish("cardgame.production.candidatesRequested",
    { ...input, projectId, requestId } as JsonValue, { key: requestId, exclusive: true });
  return { status: "queued", requestId, eventId: event.id, duplicate: event.duplicate };
}

/** Record asset identities returned by the Skill relation's library call. */
 async function recordCandidates(input: { projectId: string; productionId: string; round?: number; candidates: Array<Record<string, unknown>>; requestId: string }, ctx: ActionContext) {
  return command("recordCandidates", { ...input, projectId: await project(input, ctx) }, ctx);
}

/** Adopt a candidate through the asset backend; adoption is a separate fact. */
 async function adoptAsset(input: { projectId: string; productionId: string; candidateId: string; assetId?: string; versionId?: string; requestId?: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const requestId = input.requestId ?? `adopt-asset:${projectId}:${input.productionId}:${input.candidateId}`;
  const event = await ctx.events.publish("cardgame.production.adoptionRequested",
    { ...input, projectId, requestId } as JsonValue, { key: requestId, exclusive: true });
  return { status: "queued", requestId, eventId: event.id, duplicate: event.duplicate };
}

/** Record the exact adopted asset/version returned by the library. */
 async function recordAdoption(input: { projectId: string; productionId: string; candidateId: string; assetId: string; versionId: string; requestId: string }, ctx: ActionContext) {
  return command("recordAdoption", { ...input, projectId: await project(input, ctx) }, ctx);
}

 async function bindTodo(input: { projectId: string; todoId: string; productionId: string; todoBaseRevision?: number; productionBaseRevision?: number }, ctx: ActionContext) {
  return command("bindTodo", { ...input, projectId: await project(input, ctx) }, ctx);
}

/** Reject a candidate: mark it in the production record and open a high-priority rework Todo. */
 async function rejectCandidate(input: { projectId: string; productionId: string; candidateId: string; baseRevision: number; reason?: string; requestId?: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  if (!input.candidateId) throw new Error("rejectCandidate 需要 candidateId");
  const requestId = input.requestId ?? `reject-candidate:${projectId}:${input.productionId}:${input.candidateId}`;
  return command("rejectCandidate", { ...input, projectId, requestId }, ctx);
}


/** Fill missing source metadata on an existing draft without recreating its cards. */
 async function linkCompanion(input: { projectId: string; productionId: string; baseRevision: number; todoId: string; sourceCardId: string; sourceRevision: string }, ctx: ActionContext) {
  const projectId = await project(input, ctx);
  const [detail, todo, source] = await Promise.all([readOp<any>('production', { projectId, productionId: input.productionId }, ctx as unknown as QueryContext), readOp<any>('todo', { projectId, id: input.todoId }, ctx as unknown as QueryContext), readOp<any>('card', { projectId, id: input.sourceCardId }, ctx as unknown as QueryContext)]);
  if (detail.production.revision !== input.baseRevision) throw new Error('制作单已变化，请刷新后重试');
  if (todo.item.productionId && todo.item.productionId !== input.productionId) throw new Error('待办已关联另一制作单');
  if (source.kind !== 'unit' || source.revision !== input.sourceRevision) throw new Error('配套单位已变化，请刷新后重试');
  if (detail.production.batch?.kind !== 'card-generation') throw new Error('这不是卡牌制作单');
  const companion = { cardId: source.id, revision: source.revision };
  const result = await command('updateProduction', { projectId, productionId: input.productionId, baseRevision: input.baseRevision, patch: { batch: { ...detail.production.batch, companion } } }, ctx);
  return command('bindTodo', { projectId, productionId: input.productionId, todoId: input.todoId, todoBaseRevision: todo.item.revision, productionBaseRevision: result.revision }, ctx);
}

 const operationQueries = {
  async productionContext(input: { projectId: string; productionId: string }, ctx: QueryContext) {
    const [detail, choices] = await Promise.all([readOp<any>('production', input, ctx), queries.featureChoices({}, ctx)]);
    const production = detail.production;
    const [todo, source] = await Promise.all([production.todoId ? readOp<any>('todo', { projectId: input.projectId, id: production.todoId }, ctx) : undefined, production.batch?.companion ? readOp<any>('card', { projectId: input.projectId, id: production.batch.companion.cardId }, ctx) : undefined]);
    return { feature: choices.items.find((item: any) => item.id === production.featureId), todo: todo?.item, source };
  },

  async companionChoices(input: { projectId: string }, ctx: QueryContext) {
    const [features, units, todos] = await Promise.all([queries.featureChoices({}, ctx), readOp<any>('cards', { ...input, kind: 'unit', limit: 200 }, ctx), readOp<any>('todos', { ...input, limit: 200 }, ctx)]);
    return { features: features.items, units: (units.items ?? []).filter((item: any) => item.kind === 'unit'), todos: (todos.items ?? []).filter((item: any) => !item.productionId && item.status !== 'done') };
  },
  async sourceCard(input: { projectId: string; id: string }, ctx: QueryContext) { return readOp<any>('card', input, ctx); },

  async featureChoices(_input: unknown, ctx: QueryContext) {
    const owner = await ctx.notes.read(ctx.note.id);
    const notes = await ctx.notes.lookup({ desktopId: owner.desktopId });
    const trackers = notes.filter(note => !note.archived && note.actions?.includes('setArchiveStatus') && note.actions?.includes('confirmGameCandidate'));
    if (trackers.length !== 1) throw new Error(trackers.length ? '本桌面有多个功能进展便笺，请先确定使用哪一个' : '本桌面没有可用的功能进展便笺');
    const snapshot = await ctx.resources.read<any>({ name: 'extension.official-feature-tracker.state', input: { targetNoteId: trackers[0]!.id } });
    if (snapshot.error && snapshot.data === undefined) throw new Error(snapshot.error);
    return { items: Array.isArray(snapshot.data?.features) ? snapshot.data.features.filter((item: any) => !item.archived).map((item: any) => ({ id: String(item.id), title: String(item.title) })) : [] };
  },
  async cardBatch(input: { projectId: string; productionId: string }, ctx: QueryContext) { return readOp<any>('cardBatch', input, ctx); },
  async cardFaceThemes(input: { projectId: string }, ctx: QueryContext) { return readOp<any>('cardFaceThemes', input, ctx); },
  async productions(input: { projectId: string; cursor?: string; limit?: number; q?: string; status?: string; todoId?: string }, ctx: QueryContext) {
    return readOp<any>("productions", input, ctx);
  },
  async production(input: { projectId: string; productionId: string; historyCursor?: string; historyLimit?: number }, ctx: QueryContext) {
    return readOp<any>("production", { ...input, id: input.productionId }, ctx);
  },
  async media(input: { projectId: string; path?: string; id?: string; variant?: string }, ctx: QueryContext) {
    return readOp<any>("media", input, ctx);
  },
  async workflowStatus(input: { projectId: string }, ctx: QueryContext) {
    return readOp<any>("workflowStatus", input, ctx);
  },
};

function jsonResult(value:unknown){return JSON.parse(JSON.stringify(value??null));}
const action_cardWorkflow=note.action({...{"description":"cardWorkflow","visibility":"public"},input:z.looseObject({"operation":z.string()}),output:z.json()},async(ctx,input)=>jsonResult(await cardWorkflow(input as any,ctx)));
export {action_cardWorkflow as cardWorkflow};
const action_discussCardBatch=note.action({...{"description":"discussCardBatch","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"cardId":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await discussCardBatch(input as any,ctx)));
export {action_discussCardBatch as discussCardBatch};
const action_upsertRequest=note.action({...{"description":"按 Todo 身份幂等建立或更新制作单草稿，不启动生成。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string().optional(),"id":z.string().optional(),"brief":z.string(),"targetAsset":z.record(z.string(),z.json()).optional(),"pinnedRefs":z.array(z.union([z.record(z.string(),z.json()),z.string()])).optional(),"batch":z.json().optional(),"todoId":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await upsertRequest(input as any,ctx)));
export {action_upsertRequest as upsertRequest};
const action_updateProduction=note.action({...{"description":"updateProduction","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"baseRevision":z.number(),"patch":z.record(z.string(),z.json())}),output:z.json()},async(ctx,input)=>jsonResult(await updateProduction(input as any,ctx)));
export {action_updateProduction as updateProduction};
const action_generate=note.action({...{"description":"仅在用户明确点击生成后预留轮次并发布执行请求。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"requestId":z.string().optional(),"newRound":z.boolean().optional(),"round":z.number().optional(),"businessKey":z.string().optional(),"scope":z.array(z.string()).optional(),"cwd":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await generate(input as any,ctx)));
export {action_generate as generate};
const action_bindExecution=note.action({...{"description":"把执行台回执及任务 ID 记录到原制作轮次。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"requestId":z.string(),"receipt":z.record(z.string(),z.json())}),output:z.json()},async(ctx,input)=>jsonResult(await bindExecution(input as any,ctx)));
export {action_bindExecution as bindExecution};
const action_retry=note.action({...{"description":"retry","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string()}),output:z.json()},async(ctx,input)=>jsonResult(await retry(input as any,ctx)));
export {action_retry as retry};
const action_newRound=note.action({...{"description":"newRound","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"scope":z.array(z.string()).optional(),"cwd":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await newRound(input as any,ctx)));
export {action_newRound as newRound};
const action_receiveResult=note.action({...{"description":"按请求 ID、轮次和需求修订接收执行结果；过期轮次只记历史。","visibility":"public","receipt":"queryable"},input:z.record(z.string(),z.json()),output:z.json()},async(ctx,input)=>jsonResult(await receiveResult(input as any,ctx)));
export {action_receiveResult as receiveResult};
const action_registerCandidates=note.action({...{"description":"发布向资源库登记候选版本的请求。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"round":z.number().optional(),"candidates":z.array(z.record(z.string(),z.json())),"requestId":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await registerCandidates(input as any,ctx)));
export {action_registerCandidates as registerCandidates};
const action_recordCandidates=note.action({...{"description":"记录资源库回执中的候选版本身份。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"round":z.number().optional(),"candidates":z.array(z.record(z.string(),z.json())),"requestId":z.string()}),output:z.json()},async(ctx,input)=>jsonResult(await recordCandidates(input as any,ctx)));
export {action_recordCandidates as recordCandidates};
const action_adoptAsset=note.action({...{"description":"用户明确选择候选后发布资源采用请求。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"candidateId":z.string(),"assetId":z.string().optional(),"versionId":z.string().optional(),"requestId":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await adoptAsset(input as any,ctx)));
export {action_adoptAsset as adoptAsset};
const action_recordAdoption=note.action({...{"description":"记录资源库回执中的采用版本身份。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"candidateId":z.string(),"assetId":z.string(),"versionId":z.string(),"requestId":z.string()}),output:z.json()},async(ctx,input)=>jsonResult(await recordAdoption(input as any,ctx)));
export {action_recordAdoption as recordAdoption};
const action_bindTodo=note.action({...{"description":"把制作单 ID 与来源 Todo ID 双向持久化绑定。","visibility":"public","receipt":"queryable"},input:z.looseObject({"projectId":z.string(),"todoId":z.string(),"productionId":z.string(),"todoBaseRevision":z.number().optional(),"productionBaseRevision":z.number().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await bindTodo(input as any,ctx)));
export {action_bindTodo as bindTodo};
const action_rejectCandidate=note.action({...{"description":"rejectCandidate","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"candidateId":z.string(),"baseRevision":z.number(),"reason":z.string().optional(),"requestId":z.string().optional()}),output:z.json()},async(ctx,input)=>jsonResult(await rejectCandidate(input as any,ctx)));
export {action_rejectCandidate as rejectCandidate};
const action_linkCompanion=note.action({...{"description":"linkCompanion","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"baseRevision":z.number(),"todoId":z.string(),"sourceCardId":z.string(),"sourceRevision":z.string()}),output:z.json()},async(ctx,input)=>jsonResult(await linkCompanion(input as any,ctx)));
export {action_linkCompanion as linkCompanion};
export const queries={"productionContext":note.query({...{"description":"productionContext","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["productionContext"](input??{} as any,ctx))),
"companionChoices":note.query({...{"description":"companionChoices","visibility":"public"},input:z.looseObject({"projectId":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["companionChoices"](input??{} as any,ctx))),
"sourceCard":note.query({...{"description":"sourceCard","visibility":"public"},input:z.looseObject({"projectId":z.string(),"id":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["sourceCard"](input??{} as any,ctx))),
"featureChoices":note.query({...{"description":"featureChoices","visibility":"public"},input:z.json().nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["featureChoices"](input??{} as any,ctx))),
"cardBatch":note.query({...{"description":"cardBatch","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["cardBatch"](input??{} as any,ctx))),
"cardFaceThemes":note.query({...{"description":"cardFaceThemes","visibility":"public"},input:z.looseObject({"projectId":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["cardFaceThemes"](input??{} as any,ctx))),
"productions":note.query({...{"description":"按项目和 Todo ID 分页核对已有制作单。","visibility":"public"},input:z.looseObject({"projectId":z.string(),"cursor":z.string().optional(),"limit":z.number().optional(),"q":z.string().optional(),"status":z.string().optional(),"todoId":z.string().optional()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["productions"](input??{} as any,ctx))),
"production":note.query({...{"description":"按项目和制作单 ID 读取当前要求、轮次及回执。","visibility":"public"},input:z.looseObject({"projectId":z.string(),"productionId":z.string(),"historyCursor":z.string().optional(),"historyLimit":z.number().optional()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["production"](input??{} as any,ctx))),
"media":note.query({...{"description":"media","visibility":"public"},input:z.looseObject({"projectId":z.string(),"path":z.string().optional(),"id":z.string().optional(),"variant":z.string().optional()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["media"](input??{} as any,ctx))),
"workflowStatus":note.query({...{"description":"workflowStatus","visibility":"public"},input:z.looseObject({"projectId":z.string()}).nullable(),output:z.json()},async(ctx,input)=>jsonResult(await operationQueries["workflowStatus"](input??{} as any,ctx)))};

export const setViewState=note.action({description:'保存本便笺的界面选择，核对当前修订。',visibility:'private',requiresConfig:false,input:z.object({patch:z.record(z.string(),z.json()),expectedRevision:z.string()}),output:z.object({revision:z.string()})},async(ctx,input)=>{const saved=await ctx.state.update(draft=>{Object.assign(draft,input.patch);},{expectedRevision:input.expectedRevision});return {revision:saved.revision};});

export const events={event0:note.event({...{"name": "cardgame.production.generationRequested", "description": "准确的制作轮次和请求 ID 已持久化，等待执行台接收。", "objectRef": "/productionId", "revision": "/round", "visibility": "public"},payload:z.json()}),event1:note.event({...{"name": "cardgame.production.candidatesRequested", "description": "向资源库登记制作结果的候选文件并回填实际版本 ID。", "objectRef": "/productionId", "visibility": "public"},payload:z.json()}),event2:note.event({...{"name": "cardgame.production.adoptionRequested", "description": "用户明确采用一个候选版本；回执须保留实际资源与版本 ID。", "objectRef": "/candidateId", "visibility": "public"},payload:z.json()})};
