import {cardgameQueries} from './cardgame-operations';
export {prepareFormalPreview,pinPreviewReference,removePinnedReference} from './cardgame-operations';
import {candidateSchema,dataSchema,feedbackSchema,receiveInputSchema,renameInputSchema} from './schemas';
import {z} from '@dsh-workbench/runtime';
import { note, type CandidateSpec, type Data, type SurfaceFailure } from './model';
import { candidateSnapshot } from './projection';
export { note } from './model';
import { createHash } from 'node:crypto';
import type {NoteActionContext, Snapshot} from '@dsh-workbench/runtime';
type ActionContext = NoteActionContext<typeof note>;
export type * from './model';

export const events = {
  changed:note.event({visibility:'public',name:'candidates.changed',description:"候选登记、来源、标题、运行意图或移除发生变化；检查结果由反馈事件报告。",payload:z.object({key:z.string(),title:z.string(),revision:z.string(),removed:z.boolean()}),objectRef:'/key',objectLabel:'/title',revision:'/revision'}),
  feedbackReported:note.event({visibility:'public',name:'candidates.feedbackReported',description:"候选检查的明确结果或用户授权修复请求，需要联动执行台核对。",payload:feedbackSchema.extend({originNoteId:z.string().nullable()}),objectRef:'/candidateKey',objectLabel:'/title',revision:'/runId'}),
};

async function command(name:string,input:unknown,ctx:ActionContext){
  if(!ctx.host.previews.command)throw Error('请更新宿主以启用持久预览运行器');
  return ctx.host.previews.command(name,input as any);
}
export const receive = note.action({visibility:'public',"description":"接收或更新同一 key 的执行候选；接收不代表启动或验收通过。","objectRef":"/candidate/key","receipt":"queryable",input:receiveInputSchema,output:z.union([z.looseObject({renamed:z.number()}),z.looseObject({candidate:z.object({key:z.string()}),accepted:z.boolean(),startRequested:z.boolean(),started:z.literal(false)}),z.looseObject({accepted:z.boolean(),key:z.string(),desired:z.enum(['running','stopped'])})])}, async (ctx, input) => {
  return input?.operation==='rename'?renameCandidates(ctx,input):command('receive',input,ctx);
});
export const start = note.action({"description":"启动指定候选或预览界面。","visibility":"private",input:z.object({key:z.string(),surface:z.string().optional(),restart:z.boolean().optional()}),output:z.looseObject({accepted:z.boolean(),key:z.string(),desired:z.enum(['running','stopped'])})}, async (ctx, input) => {
  return command('start',input,ctx);
});
export const stop = note.action({"description":"停止指定候选或预览界面。","visibility":"private",input:z.object({key:z.string(),surface:z.string().optional()}),output:z.looseObject({accepted:z.boolean(),key:z.string(),desired:z.enum(['running','stopped'])})}, async (ctx, input) => {
  return command('stop',input,ctx);
});
export const verify = note.action({"description":"请求核验候选的项目验收检查。","visibility":"private",input:z.object({key:z.string(),surface:z.string().optional()}),output:z.looseObject({accepted:z.boolean()})}, async (ctx, input) => {
  return command('verify',input,ctx);
});
export const check = note.action({"description":"请求运行候选的项目检查。","visibility":"private",input:z.object({key:z.string(),surface:z.string().optional()}),output:z.looseObject({accepted:z.boolean()})}, async (ctx, input) => {
  return command('check',input,ctx);
});
export const attach = note.action({"description":"设置候选是否在预览区展示。","visibility":"private",input:z.object({key:z.string(),attached:z.boolean().optional()}),output:z.looseObject({key:z.string(),attached:z.boolean()})}, async (ctx, input) => {
  return command('attach',input,ctx);
});
export const archive = note.action({"description":"停止并归档一个候选。","visibility":"private",input:z.object({key:z.string()}),output:z.looseObject({archived:z.boolean(),key:z.string().optional(),reason:z.string().optional()})}, async (ctx, input) => {
  return command('archive',input,ctx);
});
export const archiveByFeature = note.action({visibility:'public',"description":"按明确 feature ID 归档对应候选并停止预览进程。","receipt":"queryable",input:z.object({featureId:z.string().optional(),title:z.string().optional(),repos:z.array(z.string()).optional()}),output:z.looseObject({accepted:z.boolean(),matched:z.array(z.string()),skipped:z.array(z.string())})}, async (ctx, input) => {
  const featureId=input.featureId?.trim();
  if(!featureId)throw new Error('归档预览需要明确的 featureId');
  return command('archiveByFeature',{featureId},ctx);
});
export const restore = note.action({"description":"从归档区恢复一个候选。","visibility":"private",input:z.object({key:z.string()}),output:z.looseObject({restored:z.boolean(),key:z.string().optional(),reason:z.string().optional()})}, async (ctx, input) => {
  return command('restore',input,ctx);
});
export const forget = note.action({"description":"删除已归档候选的登记记录。","visibility":"private",input:z.object({key:z.string()}),output:z.looseObject({removed:z.boolean(),reason:z.string().optional()})}, async (ctx, input) => {
  return command('forget',input,ctx);
});
export const background = note.background({
  async start(ctx) {
    await command('refresh', {}, ctx);
    await seedEventCursor(ctx);
  },
  state: reconcileState,
});

const eventCursorKey='skill-events:candidates';
function projectEvents(data:import('./model').Data){
  return Object.fromEntries((data.candidates??[]).map(candidate=>{
    // Runtime checks update status timestamps and pass IDs during startup.
    // Their actual results have a separate feedback event; this event follows
    // candidate registration, source, title, desired state, and removal.
    const {status:_status,repair:_repair,...definition}=candidate;
    return [candidate.key,{
      title:candidate.title??candidate.key,
      revision:createHash('sha256').update(JSON.stringify(definition)).digest('hex'),
    }];
  }));
}

/** Seed only once; startup is finite and the provider owns preview lifetimes. */
async function seedEventCursor(ctx:ActionContext){
  if(await ctx.db.read(eventCursorKey))return;
  const initial=await ctx.state.read();
  await ctx.db.write(eventCursorKey,projectEvents(initial.value));
}

/** The host invokes this finite projection when committed candidate state changes. */
async function reconcileState(ctx:ActionContext,snapshot:Snapshot<Data>){
  const previous=await ctx.db.read<ReturnType<typeof projectEvents>>(eventCursorKey);
  const current=projectEvents(snapshot.value);
  if(!previous){await ctx.db.write(eventCursorKey,current);return;}
  const keys=[...new Set([...Object.keys(previous),...Object.keys(current)])].filter(key=>previous[key]?.revision!==current[key]?.revision);
  for(const key of keys){
    const candidate=current[key]??previous[key]!;
    await events.changed.publish(ctx,{key,title:candidate.title,revision:candidate.revision,removed:!current[key]},
      {key:`${key}:${candidate.revision}`,...(snapshot.origin?{cause:{chain:[...snapshot.origin.chain]}}:{})});
  }
  await ctx.db.write(eventCursorKey,current);
}

export const requestRepair = note.action({"description":"请求处理当前失败轮次的修复。","visibility":"private",input:z.object({key:z.string(),surface:z.string().optional()}),output:z.looseObject({accepted:z.boolean(),session:z.string().optional(),reason:z.string().optional()})}, async (ctx, input) => {
  return command('requestRepair',input,ctx);
});
export const refreshFeedback = note.action({"description":"重试投递候选的待处理反馈。","visibility":"private",input:z.object({key:z.string()}),output:z.looseObject({checked:z.boolean()})}, async (ctx, input) => {
  return command('refreshFeedback',input,ctx);
});

/** A relation records the verified Desk handling state for one exact failed pass. */
export const recordFeedback = note.action({visibility:'public',"description":"核对候选失败轮次后保存执行台修复处理状态。","receipt":"queryable",input:z.object({key:z.string(),surface:z.string(),runId:z.string(),reportId:z.string(),handling:z.string(),summary:z.string().optional(),delegationId:z.string().optional(),sessionId:z.string().optional()}),output:z.looseObject({stored:z.boolean(),key:z.string(),runId:z.string(),duplicate:z.boolean().optional()})}, async (ctx, input) => {
  if(!ctx.caller.skillCause?.chain.length)throw Error('需要已登记联动的反馈回执');
  if(!input?.key?.trim()||!input.runId?.trim()||!input.reportId?.trim())throw Error('需要候选和失败轮次');
  const handling:{[key:string]:string}={unreceived:'awaiting-approval',superseded:'awaiting-approval',queued:'agent',running:'agent',paused:'waiting-user','needs-input':'waiting-user',completed:'agent-done'};
  const nextHandling=handling[input.handling];
  if(!nextHandling)throw Error('未知反馈处理状态');
  const row = await ctx.state.read();
  const candidate = row.value.candidates.find(value => value.key === input.key);
  const surface = candidate?.status?.[input.surface];
  if (!candidate || !surface?.failure || surface.pass !== input.runId)
    throw Error('候选失败轮次已变化，请重新核对');
  const withReceipt = (failure: SurfaceFailure): SurfaceFailure => ({
    ...failure, handling: nextHandling as SurfaceFailure['handling'],
    handlingNote: input.summary?.trim().slice(0, 300) || failure.handlingNote,
    reportId: input.reportId,
    ...(input.sessionId ? { session: input.sessionId } : {}),
    ...(input.delegationId ? { delegationId: input.delegationId } : {}),
  });
  const candidates = row.value.candidates.map(value => value.key !== input.key ? value : {
    ...value,
    ...(['unreceived', 'superseded'].includes(input.handling) && value.repair ? {
      repair: { ...value.repair, rounds: Math.max(0, value.repair.rounds - 1), lastFailure: undefined },
    } : {}),
    ...(input.delegationId && !value.delegationId && value.repair ? {
      repair: { ...value.repair, delegationId: input.delegationId },
    } : {}),
    status: Object.fromEntries(Object.entries(value.status ?? {}).map(([name, entry]) => [name,
      entry.pass === input.runId && entry.phase === 'failed' && entry.failure ? { ...entry, failure: withReceipt(entry.failure) } : entry,
    ])),
  });
  if (JSON.stringify(candidates) === JSON.stringify(row.value.candidates))
    return { stored: true, key: input.key, runId: input.runId, duplicate: true };
  await ctx.state.update(draft => { draft.candidates = candidates; }, { expectedRevision: row.revision });
  if (input.handling === 'completed') await command('refresh', {}, ctx);
  return { stored: true, key: input.key, runId: input.runId };
});

/** Rename one standalone candidate by key, or every candidate of one source task. Preview lifecycle is untouched. */
export const rename = note.action({visibility:'public',"description":"按原任务或候选 key 更新显示名称，不影响预览运行状态。","receipt":"queryable",input:renameInputSchema,output:z.looseObject({renamed:z.number()})}, (ctx, input) => renameCandidates(ctx, input));

async function renameCandidates(ctx: ActionContext, input: z.infer<typeof renameInputSchema>) {
  const title = input.title.trim();
  const key = input.key?.trim();
  const originNoteId = input.originNoteId?.trim();
  const delegationId = input.delegationId?.trim();
  if (!title || (!key && !(originNoteId && delegationId))) throw Error("预览命名需要候选 key 或来源任务，以及标题");
  const matches = (item: CandidateSpec) => key ? item.key === key : item.originNoteId === originNoteId && item.delegationId === delegationId;
  const row = await ctx.state.read();
  const renamed = [...row.value.candidates, ...(row.value.archivedCandidates ?? [])].filter(item => matches(item) && item.title !== title).length;
  if (!renamed) return { renamed: 0 };
  await ctx.state.update(draft => {
    for (const item of [...draft.candidates, ...(draft.archivedCandidates ?? [])]) {
      if (matches(item)) item.title = title;
    }
  }, { expectedRevision: row.revision });
  return { renamed };
}

/** The host writes every surface status into note state; the view reads it as-is. */
export const queries = {
 ...cardgameQueries,
  candidate: note.query({visibility:'public',"description":"按稳定候选 key 读取配置、检查和运行结果。","objectRef":"/candidate/key","revision":"/revision",input:z.object({key:z.string()}),output:z.looseObject({candidate:candidateSchema,revision:z.string()}).nullable()}, async (ctx, input) => {
    if(!input?.key?.trim())throw Error('候选 key 不能为空');
    return candidateSnapshot(await ctx.state.read(), input.key);
  }),
  view: note.query({"description":"读取候选、归档和运行状态。","visibility":"private",input:z.object({}).nullable(),output:dataSchema}, async (ctx, _input) => {
    return (await ctx.state.read()).value;
  }),
};

export const setViewState=note.action({description:'保存本便笺的界面选择，核对当前修订。',visibility:'private',requiresConfig:false,input:z.object({patch:z.record(z.string(),z.json()),expectedRevision:z.string()}),output:z.object({revision:z.string()})},async(ctx,input)=>{const saved=await ctx.state.update(draft=>{Object.assign(draft,input.patch);},{expectedRevision:input.expectedRevision});return {revision:saved.revision};});
