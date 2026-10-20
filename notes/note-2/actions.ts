import { emptyInputSchema, evidenceSchema, delegationInputSchema, candidateInputSchema, candidateSchema, checkpointInputSchema, publicDelegationSchema, executionResultSchema, checkpointResultSchema, manualResultSchema, requirementInputSchema, previewFeedbackInputSchema, previewFeedbackResultSchema, requirementSchema, submitInputSchema } from './schemas';
import {proposalDiff} from './inspection-artifacts';
import { promptFor } from "./prompt";
import { boardResult, hydrate, needsShelving, shelve, sourceKey } from "./archive";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
import type { NoteActionContext, AgentResult, JsonValue, Snapshot } from "@dsh-workbench/runtime";
import { z, currentTaskOutcome, taskOutcome } from "@dsh-workbench/runtime";
import { delegationDisplayName } from "./display";
import {
  note, delegationSchema, normalizeState, taskProgress, taskResult,
  activeElapsedMs,
  requirementProgress,
  asRefId,
  candidateFromProposal,
  cloneJson,
  workSources,
  emptyState,
  normalizeCandidate,
  recordedExecutionStatus,
  executionStatusRepairs,
  resultSnapshot,
  sourceFromConnection,
  sourceIdentity,
  type CandidateLaunch,
  type CheckpointInput,
  type Delegation,
  type DelegationStatus,
  type ExecutionContext,
  type ExecutionDeskState,
  type DelegationSource,
  type Evidence,
  type MergeProposalOperation,
  type PreviewDelivery,
  type Proposal,
  type SubmitInput,
  type DirectTaskSource,
} from "./model";
export { note } from "./model";


export const events = {
  changed: note.event({visibility:'public', name:"tasks.changed",description:"任务状态、实际成果或需求版本变化；按稳定任务 ID 查询最新任务。",payload:z.object({delegationId:z.string(),title:z.string(),status:z.string(),archived:z.boolean(),summary:z.string(),requirementVersion:z.number(),revision:z.string()}),objectRef:"/delegationId",objectLabel:"/title",revision:"/revision",}),
  candidateReady: note.event({visibility:'public', name:"tasks.candidateReady",description:"原任务提交了候选启动规格；由预览联动核对并投递。",payload:candidateSchema.extend({delegationId:z.string(),originNoteId:z.string(),key:z.string(),title:z.string()}),objectRef:"/delegationId",objectLabel:"/title",revision:"/revision",}),
  previewControlRequested: note.event({visibility:'public', name:"tasks.previewControlRequested",description:"用户从原任务请求停止或重启该候选预览。",payload:z.object({delegationId:z.string(),key:z.string(),originNoteId:z.string(),operation:z.enum(['stop','restart']),revision:z.string(),requestId:z.string()}),objectRef:"/delegationId",revision:"/revision",}),
  previewTitleChanged: note.event({visibility:'public', name:"tasks.previewTitleChanged",description:"原任务显示名称变化，预览节点需同步同一来源候选名称。",payload:z.object({delegationId:z.string(),originNoteId:z.string(),rawTitle:z.string(),title:z.string(),revision:z.string()}),objectRef:"/delegationId",objectLabel:"/title",revision:"/revision",}),
};

// Native execution events wake the owner immediately; polling only repairs missed events.
const RECONCILE_INTERVAL_MS = 5 * 60_000;
const LONG_WAIT_MS = 30 * 60 * 1_000;
/**
 * A dispatch that failed before any native session was created has no external
 * effect to duplicate, so the desk retries it itself instead of parking the
 * work in an unexplained "unknown". Retries are bounded, then handed to the
 * user with a concrete reason instead of an opaque failure.
 */
const DISPATCH_RETRY_LIMIT = 4;
const DISPATCH_RETRY_BASE_MS = 15_000;
const inFlightDispatches = new Set<string>();

type DeskSnapshot = { value: ExecutionDeskState; revision: string };
type Mutation<T> = { result: T; changed: boolean };

async function readDesk(ctx: ExecutionContext): Promise<DeskSnapshot> {
  const row = await ctx.state.read();
  return { value: normalizeState(row.value), revision: row.revision };
}

function isConflict(error: unknown): boolean {
  const text = String(error);
  return /conflict|revision|cas|version/i.test(text);
}

/** Commit the business change before idempotent file work; the draft never performs effects. */
async function mutateDesk<T>(ctx: ExecutionContext, fn: (state: ExecutionDeskState, now: number) => Mutation<T>): Promise<T> {
  const at=Date.now();
  let result!: T;
  const saved=await ctx.state.update(state=>{
    const mutation=fn(state,at);
    result=mutation.result===undefined?mutation.result:cloneJson(mutation.result);
  });
  // The full body remains recoverable in state until its corresponding file writes succeed.
  const compact=cloneJson(saved.value);
  if(Object.values(compact.delegations).some(needsShelving)) {
    await Promise.all(shelve(compact.delegations,ctx.db).map(write=>write()));
    try {
      await ctx.state.update(state=>{state.delegations=compact.delegations;},{expectedRevision:saved.revision});
    } catch(error) {
      // A newer business change wins; its full body will be shelved on a later mutation/start.
      if(!isConflict(error))throw error;
    }
  }
  return result;
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function scope(value: unknown): string[] {
  if (!Array.isArray(value)) return ["仅处理当前来源和明确目标", "保留可核对证据", "不自动合并、发布或扩大权限"];
  const result = value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map(item => item.trim());
  return result.length ? [...new Set(result)] : ["仅处理当前来源和明确目标"];
}

async function selectedConnection(input: SubmitInput | undefined, ctx: ExecutionContext): Promise<DirectTaskSource> {
  const key = input?.key?.trim();
  const goal = input?.goal?.trim();
  if (!key && !goal) throw new Error("请从关联交付入口提交，或指定稳定 key 和 goal");
  if (!key) throw new Error("直接提交需要稳定 key");
  const stableKey = key;
  const direct = () => {
    const directValue: JsonValue = { goal: goal!, scope: scope(input?.scope) };
    return {
      id: "direct/" + stableKey,
      key: stableKey,
      version: "direct-v1",
      instruction: goal!,
      deliveryId: "manual:direct/" + stableKey,
      source: { noteId: ctx.note.id, path: "", revision: "direct-v1", value: directValue },
      chain: [],
    };
  };
  if (!goal) throw new Error('直接提交需要 goal');
  return direct();
}

async function ensureSchedule(ctx: ExecutionContext): Promise<void> {
  const pendingRetry=Object.values((await readDesk(ctx)).value.delegations).some(d=>d.nextDispatchAt!==undefined);
  const intervalMs=pendingRetry?DISPATCH_RETRY_BASE_MS:RECONCILE_INTERVAL_MS;
  const current=await ctx.host.schedules.get("execution-desk:"+ctx.note.id);
  if(current&&!current.paused&&current.when?.every==="interval"&&current.when.intervalMs===intervalMs)return;
  await ctx.host.schedules.upsert("execution-desk:" + ctx.note.id, {
    when: { every: "interval", intervalMs },
    noteId: ctx.note.id,
    action: { name: "reconcile", input: {} },
    paused: false,
  });
}

/** Only explicit pending work can wake the owner; a missing report is not work. */
function hasPendingWork(d:Delegation):boolean {
  return Boolean(d.continueRequested||d.pendingContinuation||d.feedback?.some(f=>f.pending));
}
function shouldContinue(d:Delegation):boolean {
  return Boolean(d.continueRequested||!d.execution?.verification&&hasPendingWork(d));
}
function followupInput(d:Delegation){
  return {delegationId:d.id};
}

function shouldKeepReconcileSchedule(delegation: Delegation): boolean {
  // Archived delegations are parked by the user and do not keep the schedule alive
  if (delegation.archived === true) return false;
  // Stow is an explicit user pause. Its cancellation result may still be
  // collected in the current process, but a restored note must not wake and
  // start recovery for that stopped owner.
  if (delegation.status === "paused" || delegation.execution?.stopRequested === true) return false;
  // A deferred redispatch is real pending work and must keep the desk awake.
  if (delegation.nextDispatchAt !== undefined) return true;
  if (delegation.pendingContinuation === true || delegation.feedback?.some(item=>item.pending) || delegation.continueRequested === true) return true;
  if (delegation.status === "dispatching" || delegation.status === "running" || delegation.status === "unknown") return true;
  const nativeStatus = delegation.execution?.status;
  if (nativeNeedsObservation(nativeStatus)) return true;
  return false;
}

function needsInterruptedNeedsInputRecovery(delegation: Delegation): boolean {
  if (delegation.execution?.stopRequested === true || delegation.outcome?.status !== "needs-input") return false;
  // Legacy versions persisted this exact host sentinel before structured results existed.
  return delegation.execution?.result?.interrupted === true || delegation.execution?.error === "interrupted";
}

/** Reinstall the durable wakeup when an activated note is restored. */
async function activate(ctx: ExecutionContext) {
  // A desk written before tasks had files moves their bulky content there once, on activation.
  await mutateDesk(ctx, state => ({ changed: Object.values(state.delegations).some(needsShelving), result: undefined }));
  // Reproject durable terminal facts on upgrade; never wake a business run.
  const corrected = await mutateDesk<Delegation[]>(ctx, (state, at) => {
    const changed: Delegation[] = [];
    for (const repair of executionStatusRepairs(state)) {
      const task = state.delegations[repair.delegationId]!;
      task.statusCorrection = {runId: repair.runId, previousStatus: repair.previousStatus, previousUpdatedAt: repair.previousUpdatedAt, correctedAt: at};
      task.status = repair.status;
      task.updatedAt = at;
      changed.push(task);
    }
    return {changed: changed.length > 0, result: changed};
  });
  for (const task of corrected) await clearObsoleteNotices(ctx, task);
  const state = (await readDesk(ctx)).value;
  const needsWake = Object.values(state.delegations).some(delegation =>
    shouldKeepReconcileSchedule(delegation) || needsInterruptedNeedsInputRecovery(delegation),
  );
  if (needsWake) {
    const scheduleKey = "execution-desk:" + ctx.note.id;
    const schedule = await ctx.host.schedules.get(scheduleKey);
    const dispatchStatus = (schedule as unknown as { dispatchStatus?: string } | undefined)?.dispatchStatus;
    const retry = (ctx.host.schedules as unknown as { retry?: (key: string) => Promise<unknown> }).retry;
    if (dispatchStatus === "ambiguous" && retry) await retry(scheduleKey);
    await ensureSchedule(ctx);
  }
  return setup(ctx);
}

export const background = note.background({start:activate,state:reconcileState});

const eventCursorKey = 'skill-events:execution-tasks';
function projectEvents(data: ExecutionDeskState) {
  return Object.fromEntries(Object.values(data.delegations ?? {}).map(task => [task.id, {
    title: delegationDisplayName(task),
    status: task.status,
    archived: task.archived === true,
    summary: task.outcome?.summary ?? '',
    requirementVersion: task.requirementVersion ?? 1,
    fingerprint: digest(canonicalJson({ status: task.status, archived: task.archived, outcome: task.outcome,
      requirementVersion: task.requirementVersion, executionVersion: task.execution?.requirementVersion, pendingContinuation: task.pendingContinuation })),
  }]));
}

/** Update initialization seeds the cursor and never dispatches tasks. */
async function setup(ctx: ExecutionContext) {
  if (await ctx.db.read(eventCursorKey)) return;
  const state = (await readDesk(ctx)).value;
  await ctx.db.write(eventCursorKey, projectEvents(state));
}

/** Publish current task changes from the durable cursor without a worker subscription. */
async function reconcileState(ctx: ExecutionContext, snapshot: Snapshot<ExecutionDeskState>) {
  const previous = await ctx.db.read<ReturnType<typeof projectEvents>>(eventCursorKey);
  const current = projectEvents(normalizeState(snapshot.value));
  if (!previous) { await ctx.db.write(eventCursorKey, current); return; }
  for (const [delegationId, task] of Object.entries(current)) {
    if (previous[delegationId]?.fingerprint === task.fingerprint) continue;
    await events.changed.publish(ctx, { delegationId, title: task.title, status: task.status,
      archived: task.archived, summary: task.summary, requirementVersion: task.requirementVersion, revision: snapshot.revision },
    { key: `${delegationId}:${snapshot.revision}`, ...(snapshot.origin ? { cause: { chain: [...snapshot.origin.chain] } } : {}) });
  }
  await ctx.db.write(eventCursorKey, current);
}

/** Source-specific instructions remain authoritative; delivery references live in runtime context. */
async function currentInstruction(ctx: ExecutionContext, delegation: Delegation): Promise<Delegation> {
  return delegation;
}

async function followupGuidance(ctx: ExecutionContext): Promise<string> {
  const note = await ctx.notes.read(ctx.note.id);
  return [
    ...(note?.codeDirectory ? ["按需操作参考：" + note.codeDirectory + "/README.md（Development baseline / Candidate preview / Proposal）。"] : []),
    "关联入口见当前 Workbench collaboration context；按需读取连线说明并完成适用交付。",
  ].join("\n");
}

function statusForRun(status: string | undefined): DelegationStatus {
  if (status === undefined || status === "queued" || status === "running" || status === "started" || status === "accepted") return "running";
  if (status === "completed") return "completed";
  if (status === "needs-input") return "needs-input";
  if (status === "cancelled") return "cancelled";
  if (status === "failed") return "failed";
  return "unknown";
}

function nativeInFlight(status: string | undefined): boolean {
  return ["started", "accepted", "queued", "running", "dispatching", "cancel-requested"].includes(status ?? "");
}

function nativeNeedsObservation(status: string | undefined): boolean {
  return nativeInFlight(status) || status === "needs-input" || status === "unknown";
}

function activeElapsedExcludingApproval(delegation: Delegation, at: number): number {
  let elapsed = activeElapsedMs(delegation, at);
  if (delegation.approvalWaitSince !== undefined && delegation.activeSince !== undefined) {
    elapsed = Math.max(0, elapsed - Math.max(0, at - delegation.approvalWaitSince));
  }
  return elapsed;
}

function finishActive(delegation: Delegation, at: number): void {
  const elapsed = activeElapsedExcludingApproval(delegation, at);
  delegation.activeMs = elapsed;
  delegation.activeSince = undefined;
}

function outcomeBelongsToExecution(delegation: Delegation): boolean {
  if (delegation.outcome?.requestId === undefined && delegation.execution?.verification !== true) return true;
  return delegation.outcome?.requestId !== undefined
    && delegation.outcome.requestId === delegation.execution?.requestId;
}

function finishAtForResult(delegation: Delegation, now: number, interrupted: boolean, previousCheckedAt?: number): number {
  if (!interrupted) return now;
  const checkedAt = previousCheckedAt ?? delegation.execution?.result?.checkedAt ?? delegation.updatedAt;
  return typeof checkedAt === "number" && Number.isFinite(checkedAt) ? Math.min(now, checkedAt) : now;
}

/** End an approval wait without adding that interval to active execution. */
function resumeActiveAfterApproval(delegation: Delegation, at: number): void {
  if (delegation.approvalWaitSince === undefined) {
    if (delegation.activeSince === undefined) delegation.activeSince = at;
    return;
  }
  delegation.activeMs = activeElapsedExcludingApproval(delegation, at);
  delegation.approvalWaitMs += Math.max(0, at - delegation.approvalWaitSince);
  delegation.approvalWaitSince = undefined;
  delegation.activeSince = at;
}

function mergeEvidence(existing: Evidence[], incoming: Evidence[]): Evidence[] {
  const result = [...existing];
  for (const item of incoming) {
    const duplicate = result.some(current => JSON.stringify(current) === JSON.stringify(item));
    if (!duplicate) result.push(cloneJson(item));
  }
  return result;
}

function validateEvidence(value: unknown): Evidence[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("evidence 必须是数组");
  return value.map(item => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("证据格式无效");
    const candidate = item as Partial<Evidence>;
    if (!["text", "file", "commit", "url", "record"].includes(candidate.kind ?? "") || !text(candidate.summary, "")) throw new Error("证据需要 kind 和 summary");
    return {
      ...(typeof candidate.id === "string" ? { id: candidate.id } : {}),
      kind: candidate.kind!,
      summary: candidate.summary!.trim(),
      ...(typeof candidate.ref === "string" ? { ref: candidate.ref } : {}),
    } as Evidence;
  });
}

function validateOperation(value: unknown): MergeProposalOperation {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("proposal operation 格式无效");
  const operation = value as Partial<MergeProposalOperation> & { kind?: string; url?: string };
  const common = [operation.repository, operation.targetRef, operation.expectedBase, operation.head];
  if (!common.every(item => typeof item === "string" && item.trim())) throw new Error("proposal operation 缺少准确仓库、targetRef、expectedBase 或 head");
  if (operation.kind === "git-merge") {
    return {
      kind: "git-merge",
      repository: operation.repository!,
      targetRef: operation.targetRef!,
      expectedBase: operation.expectedBase!,
      head: operation.head!,
      ...(typeof operation.worktree === "string" ? { worktree: operation.worktree } : {}),
    };
  }
  if (operation.kind === "pr-merge" && typeof operation.url === "string" && operation.url.trim()) {
    let url: URL;
    try { url = new URL(operation.url); }
    catch { throw new Error("PR 提案链接必须是 HTTPS URL"); }
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("PR 提案链接必须是 HTTPS URL");
    return {
      kind: "pr-merge",
      repository: operation.repository!,
      targetRef: operation.targetRef!,
      expectedBase: operation.expectedBase!,
      head: operation.head!,
      url: url.href,
    };
  }
  throw new Error("proposal operation 必须是 git-merge 或带 URL 的 pr-merge");
}

function validateProposal(value: unknown): Proposal {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("proposal 格式无效");
  const proposal = value as Partial<Proposal>;
  if (!text(proposal.id, "") || !text(proposal.summary, "") || !Array.isArray(proposal.operations) || !Array.isArray(proposal.evidence)) throw new Error("proposal 需要 id、summary、operations 和 evidence");
  if (proposal.status === "approved" || proposal.status === "applied") throw new Error("approved/applied 只能由宿主在真实校验后写入");
  return {
    id: proposal.id!.trim(),
    summary: proposal.summary!.trim(),
    operations: proposal.operations.map(validateOperation),
    evidence: proposal.evidence.map(item => {
      if (typeof item !== "string" || !item.trim()) throw new Error("proposal evidence 必须是非空文本");
      return item.trim();
    }),
    status: proposal.status ?? "pending-approval",
  };
}

function proposalList(input: CheckpointInput): Proposal[] {
  const values = [...(input.proposals ?? [])];
  if (input.proposal) values.push(input.proposal);
  return values.map(validateProposal);
}

/** One candidate revision is one durable handoff event. */
function previewRequestId(delegationId: string, payload: Record<string, unknown>, nonce?: string): string {
  const fingerprint = digest(JSON.stringify(Object.keys(payload).sort().map(key => [key, payload[key]])));
  return ["preview", delegationId, fingerprint, ...(nonce ? [nonce] : [])].join(":");
}

async function deliverCandidate(ctx: ExecutionContext, delegation: Delegation, options: { nonce?: string } = {}): Promise<PreviewDelivery> {
  const candidate = delegation.candidate;
  if (!candidate) throw new Error("委托没有候选启动规格");
  const payload = {
    key: delegation.id,
    title: delegationDisplayName(delegation),
    delegationId: delegation.id,
    originNoteId: ctx.note.id,
    cwd: candidate.cwd,
    revision: candidate.revision,
    argv: candidate.argv,
    url: candidate.url,
    ...(candidate.readinessPath ? { readinessPath: candidate.readinessPath } : {}),
    ...(candidate.adapter ? { adapter: candidate.adapter } : {}),
    ...(candidate.repos ? { repos: candidate.repos } : {}),
    ...(candidate.options ? { options: candidate.options } : {}),
    ...(candidate.featureId ? { featureId: candidate.featureId } : {}),
    ...(candidate.start === true ? { start: true } : {}),
    ...(candidate.embed === true ? { embed: true } : {}),
  };
  const eventKey=previewRequestId(delegation.id,payload,options.nonce);
  const prior=await mutateDesk(ctx,(state,at)=>{
    const target=state.delegations[delegation.id];
    if(!target||canonicalJson(target.candidate)!==canonicalJson(candidate))return {result:undefined,changed:false};
    if(target.preview?.eventKey===eventKey&&target.preview.status==='delivered')
      return {result:target.preview,changed:false};
    target.preview={key:delegation.id,status:'pending',eventKey,requestedAt:at};target.updatedAt=at;
    return {result:undefined,changed:true};
  });
  if(prior)return prior;
  let delivery:PreviewDelivery={key:delegation.id,status:'pending',eventKey,requestedAt:Date.now()};
  try {
    await events.candidateReady.publish(ctx, payload,
      { key: eventKey, exclusive: true });
  } catch (error) {
    delivery = { ...delivery, status: "failed", checkedAt: Date.now(), error: error instanceof Error ? error.message : String(error) };
  }
  if(delivery.status==='pending')return (await readDesk(ctx)).value.delegations[delegation.id]?.preview??delivery;
  return mutateDesk(ctx, (state,at) => {
    const target = state.delegations[delegation.id];
    if (!target || canonicalJson(target.candidate) !== canonicalJson(candidate)||target.preview?.eventKey!==eventKey) return { result: delivery, changed: false };
    target.preview = delivery;
    target.updatedAt = at;
    return { result: delivery, changed: true };
  });
}

/** Receipt from the preview node for the original candidate and relation. */
export const recordPreviewDelivery = note.action({visibility:'public',
  description: "核对候选版本后记录预览节点已收到启动规格。", input: z.object({delegationId:z.string(),revision:z.string(),previewNoteId:z.string(),eventKey:z.string()}), output: z.object({delegationId:z.string(),delivered:z.boolean(),stale:z.boolean()}), receipt: "queryable",
}, async (ctx, input) => {
  if(!ctx.caller.skillCause?.chain.length||!input?.delegationId?.trim()||!input.revision?.trim()||!input.previewNoteId?.trim()||!input.eventKey?.trim())
    throw Error('预览接收回执需要连线身份、原任务和候选版本');
  return mutateDesk(ctx,(state,at)=>{
    const task=state.delegations[input.delegationId];
    if(!task?.candidate||task.candidate.revision!==input.revision||task.preview?.eventKey!==input.eventKey)
      return {changed:false,result:{delegationId:input.delegationId,delivered:false,stale:true}};
    if(task.preview?.noteId&&task.preview.noteId!==input.previewNoteId)throw Error('候选已属于另一预览节点');
    const changed=task.preview?.status!=='delivered'||task.preview.noteId!==input.previewNoteId;
    if(changed){task.preview={key:task.id,status:'delivered',noteId:input.previewNoteId,eventKey:input.eventKey,requestedAt:task.preview?.requestedAt??at,checkedAt:at};task.updatedAt=at;}
    return {changed,result:{delegationId:task.id,delivered:true,stale:false}};
  });
});

const noticeTypes = {
  '执行需要补充信息': ['needs-input', 'needs-input', 'action'],
  '执行失败': ['failed', 'failed', 'action'],
  '执行状态需要核对': ['needs-review', 'needs-review', 'action'],
  '暂停请求需要核对': ['stop-review', 'needs-review', 'action'],
  '执行持续较久，仍在继续': ['long-running', 'info', 'silent'],
  '无法建立执行会话，已停止自动重试': ['dispatch-failed', 'failed', 'action'],
  '交付需要处理': ['delivery-failed', 'failed', 'action'],
  '执行结果可查看': ['result', 'completed', 'result'],
} as const;
async function notify(ctx: ExecutionContext, delegation: Delegation, title: keyof typeof noticeTypes, body: string): Promise<void> {
  const [code, kind, attention] = noticeTypes[title];
  const sessionId = delegation.owner?.sessionId;
  const detail = body.trim() && body !== 'needs-input' ? body : `${delegation.goal}。请打开会话查看需要补充的信息。`;
  await ctx.host.notifications.upsert({
    key: `delegation:${delegation.id}:${code}`, kind, attention,
    ...(code === 'result' ? { occurrenceId: `${delegation.outcome?.requestId ?? delegation.execution?.runId ?? delegation.id}:result` } : {}),
    title: `${title} · ${delegation.goal}`,
    summary: `${delegation.goal}：${detail.replace(/\s+/g, ' ').slice(0, 180)}`,
    body: detail, noteId: ctx.note.id, runId: delegation.execution?.runId,
    target: sessionId ? { type: 'conversation', id: sessionId } : { type: 'note', id: ctx.note.id },
  });
}
async function clearObsoleteNotices(ctx: ExecutionContext, delegation: Delegation): Promise<void> {
  if (!ctx.host.notifications.clear) return; // Released hosts may not expose lifecycle yet.
  const notices = await ctx.host.notifications.list({ noteId: ctx.note.id, includeResolved: true });
  const feedback = [...new Map(delegation.feedback?.map(f=>[JSON.stringify([f.connectionId,f.subject]),f])).values()];
  for (const notice of notices) {
    if (!notice.key.startsWith(`delegation:${delegation.id}:`) || notice.clearedAt) continue;
    const code = notice.key.slice(`delegation:${delegation.id}:`.length);
    const clear = code === 'inspection-review' ? !delegation.proposals.some(p=>p.operations.length&&p.evidence.length&&!['applied','rejected'].includes(p.status||''))
      : ['needs-input', '执行需要补充信息'].includes(code) ? delegation.status !== 'needs-input'
      : ['long-running', '执行持续较久，仍在继续'].includes(code) ? delegation.status !== 'running'
      : ['delivery-failed', '交付需要处理'].includes(code) ? delegation.preview?.status !== 'failed' && feedback.length > 0 && feedback.every(f => f.status === 'passed')
      : ['needs-review', '执行状态需要核对', 'failed', '执行失败', 'dispatch-failed', '无法建立执行会话，已停止自动重试'].includes(code) ? ['running', 'review', 'completed'].includes(delegation.status) : false;
    if (clear) await ctx.host.notifications.clear(notice.key, { occurrenceId: notice.occurrenceId });
  }
}

/** Explicit result acknowledgement is independent of run and business status. */
export const markResultRead = note.action({
  description: "确认当前结果已读，不确认之后产生的结果。", input: z.object({delegationId:z.string(),recordedAt:z.number()}), output: z.object({changed:z.boolean()}), visibility: 'private',
}, async (ctx, input) => {
  const result = await mutateDesk(ctx, state => {
    const d = state.delegations[input.delegationId];
    if (!d) throw new Error('找不到 delegation');
    if (d.outcome?.recordedAt !== input.recordedAt || (d.resultReadAt ?? 0) >= input.recordedAt) return {changed:false,result:{changed:false,occurrenceId:undefined as string|undefined}};
    d.resultReadAt = input.recordedAt;
    return {changed:true,result:{changed:true,occurrenceId:`${d.outcome.requestId ?? d.execution?.runId ?? d.id}:result`}};
  });
  if (result.changed) {
    const key = `delegation:${input.delegationId}:result`;
    const notice = (await ctx.host.notifications.list({noteId:ctx.note.id})).find(n=>n.key===key && n.occurrenceId===result.occurrenceId);
    if (notice) await ctx.host.notifications.markRead(key,{occurrenceId:notice.occurrenceId});
  }
  return {changed:result.changed};
});

/** Read-only reconciliation of notification lifecycle; never starts an agent. */
export const refreshNotices = note.action({
  description: "核对任务通知，不启动执行。", input: emptyInputSchema, output: z.object({checked:z.number()}), visibility: 'private',
}, async (ctx, _input) => {
  const row = await readDesk(ctx);
  for (const d of Object.values(row.value.delegations)) await clearObsoleteNotices(ctx, d);
  return {checked:Object.keys(row.value.delegations).length};
});

function resultText(result: AgentResult<JsonValue>): string {
  return result.text ?? result.error ?? result.status;
}

type SourceUnit = { id?: string; path: string; value: JsonValue; reappeared?: boolean };

function workFacts(value: JsonValue): JsonValue {
  return Object.fromEntries(Object.entries(workSources(value)).map(([key, source]) => [key, (source as Record<string, JsonValue>).value!]));
}

function pointerToken(value: string): string {
  return value.replaceAll("~", "~0").replaceAll("/", "~1");
}

function sourceUnitsForValue(value: JsonValue, base: string): SourceUnit[] {
  const one = (item: JsonValue, path: string, id?: string): SourceUnit => ({ value: cloneJson(item), path, ...(id ? { id } : {}) });
  const items = (collection: JsonValue, path: string): SourceUnit[] => {
    if (Array.isArray(collection)) {
      return collection.map(item => {
        const object = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, JsonValue> : undefined;
        const id = object && typeof object.id === "string" ? object.id : object && typeof object.key === "string" ? object.key : undefined;
        if (!id) throw new Error("集合来源的每一项需要稳定 id 或 key");
        return one(item, path + "/" + pointerToken(id), id);
      });
    }
    if (collection && typeof collection === "object") {
      const object = collection as Record<string, JsonValue>;
      if (typeof object.id === "string" || typeof object.key === "string") return [one(collection, path, typeof object.id === "string" ? object.id : object.key as string)];
      return Object.entries(object).map(([id, item]) => one(item, path + "/" + pointerToken(id), id));
    }
    throw new Error("集合来源必须是数组或 map");
  };
  if (Array.isArray(value)) return items(value, base);
  if (value && typeof value === "object") {
    const object = value as Record<string, JsonValue>;
    if (typeof object.id === "string" || typeof object.key === "string") return [one(value, base, typeof object.id === "string" ? object.id : object.key as string)];
    // Only named collection fields are expanded. This keeps ordinary objects
    // such as {goal, scope} as one delegation instead of guessing from arrays.
    for (const field of ["items", "findings", "records"]) {
      if (Object.hasOwn(object, field)) return items(object[field]!, base + "/" + pointerToken(field));
    }
    if (/(^|\/)(items|findings|records)$/.test(base)) return items(value, base);
  }
  return [one(value, base)];
}

/** The direct manual source is one unit. Historical collection identities remain in persisted tasks. */
function sourceUnits(connection: DirectTaskSource): SourceUnit[] {
  const current = sourceUnitsForValue(connection.source.value, connection.source.path || "");
  return current;
}

function canonicalJson(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const object = value as Record<string, unknown>;
  return "{" + Object.keys(object).sort().map(key => JSON.stringify(key) + ":" + canonicalJson(object[key])).join(",") + "}";
}

function sameJson(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

/**
 * Proposal ids identify immutable review versions.  The host binds an
 * approval receipt to the complete proposal payload, so replacing a proposal
 * with the same id would make a previously approved receipt unverifiable.
 * A later checkpoint may repeat that id, but a changed proposal must use a
 * new id.  This also keeps completion evidence on the delegation/checkpoint
 * instead of turning a post-apply narrative into a new proposal version.
 */
function mergeProposals(existing: Proposal[], incoming: Proposal[]): { proposals: Proposal[]; latest?: Proposal } {
  const merged = [...existing];
  let latest: Proposal | undefined;
  for (const proposal of incoming) {
    const index = merged.findIndex(item => item.id === proposal.id);
    if (index < 0) {
      merged.push(proposal);
      latest = proposal;
      continue;
    }
    const previous = merged[index]!;
    if (!sameJson(
      { summary: previous.summary, operations: previous.operations },
      { summary: proposal.summary, operations: proposal.operations },
    )) {
      throw new Error("同一 proposal id 的操作内容不可修改；请使用新的 proposal id");
    }
    // Keep the first payload byte-for-byte stable, including evidence and
    // status.  Those fields participate in the host's exact approval hash.
    latest = previous;
  }
  return { proposals: merged, ...(latest ? { latest } : {}) };
}

async function registerDelegation(
  ctx: ExecutionContext,
  connection: DirectTaskSource | { identity: string; source: DelegationSource },
  unit: SourceUnit,
  input: SubmitInput,
): Promise<{ delegation: Delegation; created: boolean; shouldDispatch: boolean }> {
  const businessKey = input.businessKey?.trim();
  const explicit = 'identity' in connection;
  const identity = businessKey ? JSON.stringify({businessKey}) : explicit ? connection.identity : sourceIdentity(connection, unit.path, connection.id.startsWith("direct/") ? connection.key : undefined);
  const delegationId = input.delegationId ?? digest(identity);
  const source = explicit ? cloneJson(connection.source) : sourceFromConnection(connection, unit);
  if (input.requirement !== undefined) source.value = cloneJson(input.requirement) as JsonValue;
  const updateId = input.updateId;
  const fingerprint = digest(canonicalJson({source: source.value, goal: input.goal, scope: input.scope}));
  const existingSource=(await ctx.state.read()).value.delegations[delegationId]?.source;
  const filed = existingSource ? await ctx.db.read<DelegationSource>(sourceKey(delegationId,existingSource.revision)) ?? await ctx.db.read<DelegationSource>(sourceKey(delegationId)) : undefined;
  return mutateDesk(ctx, (state, at): Mutation<{ delegation: Delegation; created: boolean; shouldDispatch: boolean }> => {
    const existing = state.delegations[delegationId];
    // The board keeps only identity fields of a source; compare and merge against its file.
    const known = existing && (existing.source.shelved && filed?.revision === existing.source.revision ? filed : existing.source);
    if (input.delegationId && !existing) throw new Error("找不到追加目标任务");
    const receipt = updateId && existing?.updates?.find(update => update.id === updateId);
    if (receipt) {
      if (receipt.fingerprint !== fingerprint) throw new Error("updateId 已用于另一份需求变更");
      return {changed:false,result:{delegation:existing!,created:false,shouldDispatch:false}};
    }
    if (businessKey && existing) {
      source.value = {goal:existing.goal, sources:{...workSources(known!.value), ...workSources(source.value)}};
    }
    if (!existing) {
      const requestId = "delegation:" + delegationId + ":start";
      const delegation: Delegation = {
        id: delegationId,
        sourceIdentity: identity,
        ...(input.origin ? {origin:cloneJson(input.origin),workType:input.workType||"investigation",nextAction:input.nextAction} : {}),
        requirementVersion: 1,
        updates: updateId ? [{id:updateId,fingerprint,version:1,receivedAt:at}] : [],
        ...(businessKey ? {businessKey} : {}),
        source,
        goal: text(input.goal, unit.value && typeof unit.value === 'object' && !Array.isArray(unit.value) ? text(unit.value.title, text(unit.value.summary, '处理交办事项')) : '处理交办事项'),
        scope: scope(input.scope),
        status: "dispatching",
        execution: { requestId, requirementVersion: 1, status: "dispatching", trigger:{reason:"business-input",source:source.revision} },
        pendingRequestId: requestId,
        continuationSeq: 0,
        activeMs: 0,
        activeSince: at,
        approvalWaitMs: 0,
        longWaitNotified: false,
        evidence: [],
        proposals: [],
        createdAt: at,
        updatedAt: at,
      };
      state.delegations[delegationId] = delegation;
      return { changed: true, result: { delegation, created: true, shouldDispatch: true } };
    }
    const valueChanged = (Boolean(updateId) && input.goal !== undefined && input.goal.trim() !== existing.goal) || (Boolean(updateId) && input.scope !== undefined && !sameJson(scope(input.scope), existing.scope)) || !sameJson(businessKey ? workFacts(known!.value) : known!.value, businessKey ? workFacts(source.value) : source.value);
    const reappeared = unit.reappeared === true;
    if (updateId) existing.updates = [...(existing.updates ?? []), {id:updateId,fingerprint,version:(existing.requirementVersion ?? 1) + (valueChanged || reappeared ? 1 : 0),receivedAt:at}];
    if (!valueChanged && existing.source.revision === source.revision && !reappeared) {
      return { changed: Boolean(updateId), result: { delegation: existing, created: false, shouldDispatch: false } };
    }
    if(valueChanged || reappeared) existing.requirementHistory = [...(existing.requirementHistory ?? []), {version:existing.requirementVersion ?? 1,goal:existing.goal,scope:cloneJson(existing.scope),source:cloneJson(known!)}];
    existing.source = businessKey ? {...known!, value:source.value, shelved:undefined} : source;
    if(input.origin){existing.origin=cloneJson(input.origin);existing.workType=input.workType||existing.workType;existing.nextAction=input.nextAction||existing.nextAction;}
    existing.updatedAt = at;
    if (!valueChanged && !reappeared) return { changed: true, result: { delegation: existing, created: false, shouldDispatch: false } };
    existing.requirementVersion = (existing.requirementVersion ?? 1) + 1;
    // A changed source may carry a new task, not just evidence for its old title.
    // Duplicate deliveries and grouped multi-source goals keep their identity.
    if (valueChanged && !businessKey) {
      if (input.goal?.trim()) existing.goal = input.goal.trim();
      if (input.scope !== undefined) existing.scope = scope(input.scope);
    }
    // Preserve the user's archive decision while retaining incoming requirements.
    // Explicit restore/resume owns reopening; source delivery never does.
    if (existing.archived) {
      existing.pendingContinuation = true;
      return { changed: true, result: { delegation: existing, created: false, shouldDispatch: false } };
    }
    // A source revision changes the goal input. Preserve one owner, but reopen
    // reviewable/failed work; unknown and paused work still require a human.
    let shouldDispatch = false;
    if (["review", "completed", "failed", "cancelled", "needs-input"].includes(existing.status)) {
      existing.outcome = undefined;
      existing.status = "review";
      existing.pendingContinuation = undefined;
      existing.approvalWaitSince = undefined;
      existing.archived = false;
      existing.archivedAt = undefined;
      shouldDispatch = true;
    } else if (["running", "dispatching", "paused", "unknown", "blocked"].includes(existing.status)) {
      existing.pendingContinuation = true;
    }
    return { changed: true, result: { delegation: existing, created: false, shouldDispatch } };
  });
}

/**
 * True only when a failure provably happened before anything was dispatched:
 * no owner session was ever bound and no native run id exists. With no
 * external effect to duplicate, redispatching is safe. Every other unknown
 * still needs the read-only verification path, because the work may have run.
 */
function canRedispatch(delegation: Delegation | undefined): boolean {
  if (!delegation) return false;
  if (delegation.owner) return false;
  if (delegation.execution?.runId) return false;
  if (delegation.execution?.stopRequested === true) return false;
  if (delegation.archived === true) return false;
  return true;
}

/**
 * Retry a dispatch-boundary failure a bounded number of times. The request id
 * must change: the previous one is tied to an attempt that never produced a
 * run. When the budget is spent the desk stops guessing and hands the real
 * error to the user instead of leaving an unexplained "unknown".
 */
async function scheduleDispatchRetry(ctx: ExecutionContext, id: string, error: string): Promise<Delegation> {
  const outcome = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[id];
    if (!delegation) throw new Error("找不到 delegation");
    const attempts = (delegation.dispatchAttempts ?? 0) + 1;
    delegation.dispatchAttempts = attempts;
    delegation.lastDispatchError = error;
    if (attempts >= DISPATCH_RETRY_LIMIT) {
      finishActive(delegation, at);
      delegation.nextDispatchAt = undefined;
      delegation.pendingRequestId = undefined;
      delegation.status = "failed";
      delegation.execution = {
        ...(delegation.execution ?? { requestId: "delegation:" + id + ":exhausted" }),
        status: "failed",
        error,
        runId: undefined,
      };
      delegation.updatedAt = at;
      return { changed: true, result: { delegation, exhausted: true } };
    }
    const requestId = "delegation:" + id + ":retry:" + attempts;
    delegation.continuationSeq += 1;
    delegation.pendingRequestId = requestId;
    delegation.verificationStarted = undefined;
    // Keep the desk awake until the deferred attempt runs.
    delegation.nextDispatchAt = at + DISPATCH_RETRY_BASE_MS * attempts;
    delegation.status = "dispatching";
    if (delegation.activeSince === undefined) delegation.activeSince = at;
    delegation.execution = { requestId, status: "dispatching", error, runId: undefined };
    delegation.updatedAt = at;
    return { changed: true, result: { delegation, exhausted: false } };
  });
  if (outcome.exhausted) {
    await notify(
      ctx,
      outcome.delegation,
      "无法建立执行会话，已停止自动重试",
      `“${outcome.delegation.goal}”连续 ${DISPATCH_RETRY_LIMIT} 次未能建立执行会话，最后一次原因：${error}。自动重试已停止，可稍后重新交办。`,
    );
  } else {
    await ensureSchedule(ctx);
  }
  return outcome.delegation;
}

/** Run one deferred redispatch reserved by scheduleDispatchRetry. */
async function retryDispatch(ctx: ExecutionContext, id: string): Promise<void> {
  if (inFlightDispatches.has(id)) return;
  const delegation = (await readDesk(ctx)).value.delegations[id];
  if (!delegation || !canRedispatch(delegation)) return;
  if (delegation.pendingRequestId === undefined) return;
  await mutateDesk(ctx, (state, at) => {
    const current = state.delegations[id];
    if (!current || !canRedispatch(current)) return { changed: false, result: undefined };
    current.nextDispatchAt = undefined;
    current.updatedAt = at;
    return { changed: true, result: undefined };
  });
  await dispatchNew(ctx, delegation, { cwd: delegation.owner?.cwd }, delegation.source.value);
}

async function dispatchNew(ctx: ExecutionContext, delegation: Delegation, input: SubmitInput, source: JsonValue) {
  let sessionId = delegation.owner?.sessionId;
  inFlightDispatches.add(delegation.id);
  try {
    if (!ctx.host.agent.prepare) throw new Error("宿主没有提供 agent.prepare");
    const prepared = await ctx.host.agent.prepare({
      noteId: ctx.note.id,
      cwd: input.cwd,
      delegationId: delegation.id,

    });
    sessionId = prepared.sessionId;
    await mutateDesk(ctx, (state, at) => {
      const current = state.delegations[delegation.id];
      if (!current || current.pendingRequestId !== delegation.execution?.requestId) return { changed: false, result: undefined };
      current.owner = { sessionId: prepared.sessionId, noteId: ctx.note.id, ...(input.cwd ? { cwd: input.cwd } : {}) };
      current.updatedAt = at;
      return { changed: true, result: undefined };
    });
    const run = await ctx.host.agent.run({
      requestId: delegation.execution!.requestId,
      sessionId: prepared.sessionId,
      noteId: ctx.note.id,
      cwd: input.cwd,
      delegationId: delegation.id,

      prompt: promptFor(await currentInstruction(ctx, await hydrate(ctx.db, delegation)), false, ctx.note.id, false, undefined, await followupGuidance(ctx)),
    });
    const updated = await mutateDesk(ctx, (state, at) => {
      const current = state.delegations[delegation.id];
      if (!current || current.execution?.requestId !== delegation.execution?.requestId) return { changed: false, result: current };
      const requestId = current.execution?.requestId ?? delegation.execution?.requestId ?? ("delegation:" + delegation.id + ":start");
      current.execution = { ...(current.execution ?? { requestId }), requestId, runId: run.id, status: run.status ?? "running" };
      current.pendingRequestId = undefined;
      // The dispatch finally reached a run, so no redispatch stays pending.
      current.nextDispatchAt = undefined;
      current.status = statusForRun(run.status);
      if (current.status !== "running" && current.status !== "dispatching") finishActive(current, at);
      else if (current.activeSince === undefined) current.activeSince = at;
      current.updatedAt = at;
      return { changed: true, result: current };
    });
    return { ...publicDelegation(updated), sessionId, runId: run.id };
  } catch (error) {
    // Let recovery reserve its own durable request after this dispatch has
    // failed; otherwise the in-flight guard would mistake recovery for the
    // original dispatch and return the unknown record unchanged.
    inFlightDispatches.delete(delegation.id);
    const current = (await readDesk(ctx)).value.delegations[delegation.id];
    if (canRedispatch(current)) {
      const retried = await scheduleDispatchRetry(ctx, delegation.id, String(error));
      return { ...publicDelegation(retried), sessionId, recovery: "redispatch" };
    }
    const unknown = await recoverUnknown(ctx, delegation.id, String(error));
    return { ...publicDelegation(unknown), sessionId, recovery: "verification" };
  } finally {
    inFlightDispatches.delete(delegation.id);
  }
}

/** Explicit additions share the same registration, receipts and native owner as submit. */
export const append = note.action({
  description: "向原任务追加有幂等回执的要求。", input: z.object({delegationId:z.string(),updateId:z.string(),content:z.string(),delivery:z.enum(['queue','steer']).optional()}), output: executionResultSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId || !input.updateId?.trim() || !input.content?.trim()) throw new Error("追加需要 delegationId、updateId 和 content");
  const task = (await readDesk(ctx)).value.delegations[input.delegationId];
  if (!task) throw new Error("找不到追加目标任务");
  return acceptRequirement(ctx, {
    source:{noteId:task.source.noteId ?? ctx.note.id,objectId:task.source.itemId ?? task.id,revision:input.updateId,value:{adjustment:input.content.trim()}},
    delegationId:task.id,updateId:input.updateId,goal:task.goal,scope:task.scope,delivery:input.delivery ?? 'steer',
  });
});

/** Explicit user-created work uses a fresh direct source; never reuses the invocation connection. */
export const addManual = note.action({
  description: "手动新增独立任务并交办。", input: z.object({goal:z.string().optional(),scope:z.array(z.string()).optional(),cwd:z.string().optional()}), output: manualResultSchema, visibility: 'private',
}, async (ctx, input) => {
  const goal = text(input?.goal, "");
  if (goal.length === 0) throw new Error("手动新增需要任务目标");
  const scopeLines = Array.isArray(input?.scope) ? input.scope.map(item => item.trim()).filter(Boolean) : [];
  const cwd = typeof input?.cwd === "string" ? input.cwd.trim() : "";
  const key = "manual/" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  return submit({key, goal, ...(scopeLines.length ? {scope: scopeLines} : {}), ...(cwd ? {cwd} : {})}, ctx);
});
/** Internal manual-task registration; relation requests use acceptRequirement. */
async function submit(input: SubmitInput = {}, ctx: ExecutionContext) {
  const connection = await selectedConnection(input, ctx);
  const allUnits = sourceUnits(connection).filter(unit => {
    return true;
  });
  if (input.contextOnly) {
    return mutateDesk(ctx, state => {
      let count = 0;
      for (const unit of allUnits) {
        const identity = sourceIdentity(connection, unit.path);
        const d = input.delegationId ? state.delegations[input.delegationId] : Object.values(state.delegations).find(d => d.sourceIdentity === identity);
        if (!d) continue;
        d.source = sourceFromConnection(connection, unit);
        count++;
      }
      return {changed:count > 0,result:{count,contextOnly:true as const}};
    });
  }
  let units = allUnits;
  if (input.itemId !== undefined) {
    if (!input.itemId.trim()) throw new Error("itemId 不能为空");
    units = allUnits.filter(unit => unit.id === input.itemId);
    if (units.length === 0) throw new Error("找不到来源 itemId：" + input.itemId);
  }
  if (!units.length) return { count: 0, delegations: [] };
  if (input.delegationId && units.length !== 1) throw new Error("追加到已有任务必须选择单一来源事项");
  if (input.businessKey !== undefined) {
    if (!input.businessKey.trim()) throw new Error('businessKey 不能为空');
    units = [{path:'', reappeared:units.some(unit => unit.reappeared), value:{
      goal:text(input.goal, '处理交办事项'),
      sources:Object.fromEntries(units.map(unit => [sourceIdentity(connection,unit.path), cloneJson(sourceFromConnection(connection,unit)) as unknown as JsonValue])),
    }}];
  }
  await ensureSchedule(ctx);
  const responses: Array<z.infer<typeof executionResultSchema>> = [];
  for (const unit of units) {
    const registered = await registerDelegation(ctx, connection, unit, input);
    if (registered.created) responses.push(await dispatchNew(ctx, registered.delegation, input, registered.delegation.source.value));
    else if (registered.shouldDispatch) responses.push(await resume(ctx, { delegationId: registered.delegation.id }));
    else if (input.resumePaused === true && registered.delegation.status === 'paused' && !registered.delegation.archived) responses.push(await resume(ctx, {delegationId:registered.delegation.id}));
    else if (input.delivery === 'steer' && !registered.delegation.archived && registered.delegation.pendingContinuation && registered.delegation.status === 'running') responses.push(await resume(ctx, {delegationId:registered.delegation.id, delivery:'steer'}));
    else responses.push(publicDelegation(registered.delegation));
  }
  const first = responses[0];
  return {
    desk: {noteId:ctx.note.id},
    count: responses.length,
    delegations: responses,
    delegationId: first?.delegationId,
    sourceKey: first?.sourceKey,
    status: first?.status,
    sessionId: first?.sessionId,
    runId: first?.runId,
    requestId: first?.requestId,
    outcome: first?.outcome,
    requirementVersion: first?.requirementVersion,
    handledVersion: first?.handledVersion,
    updateStatus: first?.updateStatus,
    recovery: first?.recovery,
  };
}

/** Public execution node action. The source snapshot is an explicit argument; no foreign state path or old link lookup is used. */
export const acceptRequirement = note.action({visibility:'public',
  description: "根据来源节点公开快照创建任务或追加原任务；沿用原任务 ID 与 owner，暂停或归档任务不会自动恢复。", input: requirementInputSchema, output: executionResultSchema, objectRef: "/delegationId",
}, async (ctx, input) => {
  const source = input.source;
  if (!source?.noteId?.trim() || !source.objectId?.trim() || !source.revision?.trim() || !input.updateId?.trim() || !input.goal?.trim())
    throw new Error('交办需要来源节点、事项、修订号、更新 ID 和目标');
  if (input.delegationId) {
    const existing = (await readDesk(ctx)).value.delegations[input.delegationId];
    if (!existing) throw new Error('找不到原任务');
    const sameSource = (!existing.source.noteId || existing.source.noteId === source.noteId)
      && (!existing.source.itemId || existing.source.itemId === source.objectId);
    if (!sameSource) {
      const previous = input.previousSourceRef;
      const full = await hydrate(ctx.db as never, existing);
      const todoSource = source.value && typeof source.value === 'object' && !Array.isArray(source.value)
        ? (source.value as Record<string, JsonValue>).source : undefined;
      const imported = todoSource && typeof todoSource === 'object' && !Array.isArray(todoSource)
        ? todoSource as Record<string, JsonValue> : undefined;
      const original = full.source.value && typeof full.source.value === 'object' && !Array.isArray(full.source.value)
        ? full.source.value as Record<string, JsonValue> : undefined;
      if (!previous || existing.source.noteId !== previous.noteId || existing.source.itemId !== previous.objectId
        || original?.slackItemId !== previous.objectId || imported?.kind !== 'slack' || imported.itemId !== previous.objectId)
        throw new Error('原任务与来源事项不一致');
    }
  }
  const identity = JSON.stringify({ noteId: source.noteId, objectId: source.objectId });
  const deliverySource: DelegationSource = { key: source.objectId, id: `skill/${source.noteId}`, version: source.revision,
    noteId: source.noteId, itemId: source.objectId, revision: source.revision, value: cloneJson(source.value) as JsonValue };
  const submitInput: SubmitInput = { delegationId: input.delegationId, updateId: input.updateId, goal: input.goal.trim(), scope: input.scope,
    cwd: input.cwd, delivery: input.delivery ?? 'queue', requirement: source.value };
  await ensureSchedule(ctx);
  const registered = await registerDelegation(ctx, { identity, source: deliverySource }, { id: source.objectId, path: '', value: source.value as JsonValue }, submitInput);
  const result = registered.created ? await dispatchNew(ctx, registered.delegation, submitInput, registered.delegation.source.value)
    : registered.shouldDispatch ? await resume(ctx, { delegationId: registered.delegation.id })
      : submitInput.delivery === 'steer' && !registered.delegation.archived && registered.delegation.pendingContinuation && registered.delegation.status === 'running'
        ? await resume(ctx, { delegationId: registered.delegation.id, delivery: 'steer' })
        : publicDelegation(registered.delegation);
  return { ...result, delegationId: registered.delegation.id };
});

/** A connected receiver returns evidence to the original owner, never a new task. */
/** A multi-repository preview reports every commit; the task's single revision matches any of them. */
function sameCandidate(candidate:{revision?:string}|undefined,report:{revision?:string;commits?:string[]}){
  return !candidate?.revision||candidate.revision===report.revision||Boolean(report.commits?.includes(candidate.revision));
}

/** Public preview feedback entry: provenance and exact task identity come from the Skill relation. */
export const acceptPreviewFeedback = note.action({visibility:'public',
  description: "记录并处理已关联候选的准确检查轮次；只有用户授权的修复请求才唤醒原任务。", input: previewFeedbackInputSchema, output: previewFeedbackResultSchema, receipt: "queryable",
}, async (ctx, input) => {
  const relationId=ctx.caller.skillCause?.chain.at(-1);
  if(!relationId||!input?.id?.trim()||!input.delegationId?.trim()||!input.sourceNoteId?.trim()||input.originNoteId!==ctx.note.id||!input.summary?.trim()||!['passed','failed','unchecked'].includes(input.status))
    throw Error('预览反馈需要已登记联动、原任务和完整结果');
  const before=(await readDesk(ctx)).value.delegations[input.delegationId];
  if(!before)throw Error('找不到反馈对应的原委托');
  if(before.preview?.noteId&&before.preview.noteId!==input.sourceNoteId)throw Error('预览来源与原任务不匹配');
  if(input.candidateKey===before.id&&input.revision&&!sameCandidate(before.candidate,input))
    return {received:true,handling:'superseded',summary:'候选已更新',delegationId:before.id};
  const subject=`preview:${input.candidateKey}`;
  const result=await mutateDesk(ctx,(state,at)=>{
    const d=state.delegations[input.delegationId];
    if(!d)throw Error('找不到反馈对应的原委托');
    const existing=d.feedback?.find(item=>item.id===input.id&&item.connectionId===relationId);
    if(existing)return {changed:false,result:{task:d,item:existing,duplicate:true}};
    const manual=input.status==='failed'&&(input.autoRepair!==true||input.repairable==='manual');
    const pending=input.status==='failed'&&!manual;
    for(const item of d.feedback??[])if(item.connectionId===relationId&&item.subject===subject)item.pending=false;
    const item:NonNullable<Delegation['feedback']>[number]={id:input.id,connectionId:relationId,subject,status:input.status,
      summary:input.summary,diagnostics:input.diagnostics,instruction:'只修复此候选的已核实失败，不扩大任务范围',
      receivedAt:at,pending,manual,...(input.autoRepair?{auto:true}:{}),candidateKey:input.candidateKey,
      revision:input.revision,...(input.commits?{commits:input.commits}:{}),surface:input.surface,runId:input.runId};
    d.feedback=[...(d.feedback??[]),item];d.updatedAt=at;
    return {changed:true,result:{task:d,item,duplicate:false}};
  });
  const d=result.task;
  if(input.status==='passed')await clearObsoleteNotices(ctx,d);
  if(input.status==='failed'&&result.item.manual&&!result.duplicate)
    await notify(ctx,d,'交付需要处理','预览失败，需要你处理：'+input.summary);
  else if(input.status==='failed'&&result.item.pending&&!d.archived&&d.status!=='paused'&&!d.execution?.stopRequested){
    await ensureSchedule(ctx);
    const idle=!d.pendingRequestId&&!['running','dispatching','unknown'].includes(d.status);
    if(idle)await resume(ctx, {delegationId:d.id,repairFeedbackId:input.id});
    else await resume(ctx, {delegationId:d.id});
  }
  const current=(await readDesk(ctx)).value.delegations[d.id]!;
  const feedback=current.feedback?.find(item=>item.id===input.id&&item.connectionId===relationId)!;
  const handling=feedback.repairRequestId
    ? current.execution?.requestId===feedback.repairRequestId&&['running','dispatching','accepted'].includes(current.execution.status)?'running':'completed'
    : current.archived||current.status==='paused'||current.execution?.stopRequested?'paused'
    : feedback.manual?'needs-input'
    : feedback.pending?['running','dispatching'].includes(current.status)?'queued':'queued':'completed';
  return {received:true,handling,summary:current.outcome?.summary??feedback.summary,delegationId:d.id,
    ...(current.owner?.sessionId?{sessionId:current.owner.sessionId}:{}),duplicate:result.duplicate};
});

function publicDelegation(delegation: Delegation) {
  return {
    delegationId: delegation.id,
    sourceKey: delegation.source.key,
    requirementVersion: delegation.requirementVersion ?? 1,
    handledVersion: delegation.outcome ? delegation.outcome.requirementVersion ?? 1 : undefined,
    updateStatus: requirementProgress(delegation),
    status: delegation.status,
    sessionId: delegation.owner?.sessionId,
    runId: delegation.execution?.runId,
    requestId: delegation.execution?.requestId,
    outcome: delegation.outcome?.status,
    pendingContinuation: delegation.pendingContinuation,
    verification: delegation.execution?.verification,
    verificationStarted: delegation.verificationStarted,
    continueRequested: delegation.continueRequested,
    archived: delegation.archived,
  };
}

async function markUnknown(ctx: ExecutionContext, id: string, error: string, notifyUser = false): Promise<Delegation> {
  const updated = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[id];
    if (!delegation) throw new Error("找不到 delegation");
    finishActive(delegation, at);
    delegation.status = "unknown";
    delegation.pendingRequestId = undefined;
    delegation.execution = { ...(delegation.execution ?? { requestId: "delegation:" + id + ":unknown" }), status: "unknown", error };
    delegation.updatedAt = at;
    return { changed: true, result: delegation };
  });
  if (notifyUser) await notify(ctx, updated, "执行状态需要核对", error);
  return updated;
}

/**
 * A missing native result is an ambiguous boundary, not a user decision. Keep
 * the unknown fact durable, then let the same owner perform a read-only
 * verification turn before asking the user to resolve a real blockage.
 */
async function recoverUnknown(ctx: ExecutionContext, id: string, error: string, forceVerification = false): Promise<Delegation> {
  const current = (await readDesk(ctx)).value.delegations[id];
  if (current?.execution?.stopRequested === true) return current;
  const marked = await markUnknown(ctx, id, error, false);
  if (!marked.verificationStarted || forceVerification) {
    return startVerification(ctx, id, forceVerification, {
      requestId: marked.execution?.requestId,
      runId: marked.execution?.runId,
    });
  }
  await notify(ctx, marked, "执行状态需要核对", error);
  return marked;
}

async function applyResult(ctx: ExecutionContext, id: string, result: AgentResult<JsonValue>): Promise<{ delegation: Delegation; notices: Array<[keyof typeof noticeTypes, string]> }> {
  const applied = await mutateDesk<{ delegation: Delegation; notices: Array<[keyof typeof noticeTypes, string]>; previousStatus?: string }>(ctx, (state, at) => {
    const delegation = state.delegations[id];
    if (!delegation || !delegation.execution) return { changed: false, result: { delegation: delegation!, notices: [] as Array<[keyof typeof noticeTypes, string]> } };
    if (delegation.execution.runId && delegation.execution.runId !== result.runId) return {changed:false,result:{delegation,notices:[]}};
    const beforeState={...delegation};
    const before = delegation.status;
    const snapshot = resultSnapshot(result, at);
    const nativeStatus = result.status as string;
    const previousCheckedAt = delegation.execution.result?.checkedAt;
    // Compare as the board keeps it: an unchanged long result stays as filed instead of rewriting the desk.
    const unchanged=!nativeNeedsObservation(nativeStatus)&&delegation.execution.result&&isDeepStrictEqual(boardResult({...snapshot,checkedAt:previousCheckedAt!}),delegation.execution.result);
    if(unchanged)snapshot.checkedAt=previousCheckedAt!;
    delegation.execution = { ...delegation.execution, status: result.status, result: unchanged ? delegation.execution.result! : snapshot, error: result.error };
    // A host interruption is a new recovery boundary. Clear the guard only
    // for a verification turn carrying that durable fact; an ordinary
    // unknown result remains single-shot and cannot spin indefinitely.
    if (delegation.execution.verification === true && result.interrupted === true && nativeStatus !== "completed") {
      delegation.verificationStarted = undefined;
    }
    delegation.pendingRequestId = undefined;
    const notices: Array<[keyof typeof noticeTypes, string]> = [];
    // A run that finishes after its task was archived is recorded, but neither reopens the task nor notifies.
    if (delegation.archived) { delegation.updatedAt = at; return { changed: true, result: { delegation, notices } }; }
    if (nativeInFlight(nativeStatus)) {
      if (before !== "paused") {
        if (delegation.approvalWaitSince !== undefined) resumeActiveAfterApproval(delegation, at);
        delegation.status = "running";
        if (delegation.activeSince === undefined) delegation.activeSince = at;
        if (!delegation.longWaitNotified && activeElapsedExcludingApproval(delegation, at) >= LONG_WAIT_MS) {
          delegation.longWaitNotified = true;
          notices.push(["执行持续较久，仍在继续", "目标“" + delegation.goal + "”已累计执行超过 30 分钟，系统会继续等待，不会自动重跑。"]);
        }
      }
    } else {
      finishActive(delegation, finishAtForResult(delegation, at, result.interrupted === true, previousCheckedAt));
      if (nativeStatus === "completed") {
        delegation.status = recordedExecutionStatus(delegation);
      }
      else if (nativeStatus === "needs-input") {
        // This fact comes from the host's pending question/approval registry.
        delegation.status = "needs-input";
        delegation.approvalWaitSince ??= at;
        if (before !== "needs-input") notices.push(["执行需要补充信息", resultText(result)]);
      } else if (nativeStatus === "cancelled") {
        // A user stow/stop records the intent explicitly. A cancellation with
        // no such intent is only recoverable automatically when the host marks
        // the shutdown interruption. A native user's own stop is a terminal
        // cancellation and must not silently restart the work.
        delegation.status = delegation.execution.stopRequested || before === "paused"
          ? "paused"
          : result.interrupted === true
            ? "unknown"
            : "cancelled";
      } else if (nativeStatus === "failed") {
        delegation.status = "failed";
        if (delegation.status === "failed" && before !== "failed") notices.push(["执行失败", resultText(result)]);
      } else {
        delegation.status = delegation.execution.stopRequested ? "paused" : "unknown";
        // A regular native unknown is followed by a read-only recovery turn.
        // Notify only when that recovery itself is inconclusive.
        if (!delegation.execution.stopRequested && delegation.execution.verification && before !== "unknown") notices.push(["执行状态需要核对", resultText(result)]);
      }
    }
    // Compare the persisted JSON shape: absent and undefined fields are equivalent.
    const changed=JSON.stringify(beforeState)!==JSON.stringify(delegation);
    if(changed)delegation.updatedAt = at;
    return { changed, result: { delegation, notices, previousStatus: before } };
  });
  if ('previousStatus' in applied && applied.previousStatus !== applied.delegation.status) {
    await clearObsoleteNotices(ctx, applied.delegation);
    if (['review', 'completed'].includes(applied.delegation.status) && outcomeBelongsToExecution(applied.delegation) && applied.delegation.outcome) await notify(ctx, applied.delegation, '执行结果可查看', applied.delegation.outcome.summary);
  }
  for (const [title, body] of applied.notices) await notify(ctx, applied.delegation, title, body);
  return applied;
}

/** Attach a result recovered by its durable request id before normal mapping. */
async function adoptPendingResult(ctx: ExecutionContext, id: string, requestId: string, result: AgentResult<JsonValue>): Promise<boolean> {
  return mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[id];
    if (!delegation?.execution || delegation.execution.runId || (delegation.pendingRequestId !== requestId && delegation.execution.requestId !== requestId)) {
      return { changed: false, result: false };
    }
    delegation.execution = { ...delegation.execution, requestId, runId: result.runId, status: result.status };
    delegation.pendingRequestId = undefined;
    delegation.updatedAt = at;
    return { changed: true, result: true };
  });
}

/**
 * Start one same-owner read-only recovery turn. This is deliberately a new
 * request id: the original request remains in the execution evidence while
 * the recovery request can itself be recovered by request id after a crash.
 */
async function startVerification(
  ctx: ExecutionContext,
  id: string,
  force = false,
  original?: { requestId?: string; runId?: string },
): Promise<Delegation> {
  const snapshot = await readDesk(ctx);
  const existing = snapshot.value.delegations[id];
  if (!existing) throw new Error("找不到 delegation");
  if (existing.execution?.stopRequested === true) return existing;
  if (existing.pendingRequestId || inFlightDispatches.has(id)) return existing;
  if (!force && existing.verificationStarted) return existing;
  if (["running", "dispatching"].includes(existing.status) && existing.execution?.runId) return existing;

  await ensureSchedule(ctx);
  inFlightDispatches.add(id);
  try {
    const reservation = await beginContinuation(ctx, id, true);
    if (!reservation.reserved) return reservation.delegation;
    let sessionId = reservation.delegation.owner?.sessionId;
    if (!sessionId) {
      if (!ctx.host.agent.prepare) throw new Error("宿主没有提供 agent.prepare");
      const prepared = await ctx.host.agent.prepare({
        noteId: ctx.note.id,
        cwd: reservation.delegation.owner?.cwd,
        delegationId: id,

      });
      sessionId = prepared.sessionId;
      await mutateDesk(ctx, (state, at) => {
        const current = state.delegations[id];
        if (!current || current.pendingRequestId !== reservation.requestId) return { changed: false, result: undefined };
        current.owner = { sessionId: prepared.sessionId, noteId: ctx.note.id, ...(reservation.delegation.owner?.cwd ? { cwd: reservation.delegation.owner.cwd } : {}) };
        current.updatedAt = at;
        return { changed: true, result: undefined };
      });
    }
    const run = await ctx.host.agent.run({
      requestId: reservation.requestId,
      sessionId,
      noteId: reservation.delegation.owner?.noteId ?? ctx.note.id,
      cwd: reservation.delegation.owner?.cwd,
      delegationId: id,

      prompt: promptFor(await hydrate(ctx.db, reservation.delegation), true, ctx.note.id, true, original),
    });
    const updated = await mutateDesk(ctx, (state, at) => {
      const current = state.delegations[id];
      if (!current || current.pendingRequestId !== reservation.requestId) return { changed: false, result: current };
      current.execution = { ...current.execution, requestId: reservation.requestId, runId: run.id, status: run.status ?? "running", verification: true, stopRequested: undefined };
      current.pendingRequestId = undefined;
      current.status = statusForRun(run.status);
      if (current.status !== "running" && current.status !== "dispatching") finishActive(current, at);
      current.updatedAt = at;
      return { changed: true, result: current };
    });
    return updated;
  } catch (error) {
    const current = (await readDesk(ctx)).value.delegations[id];
    if (canRedispatch(current)) return scheduleDispatchRetry(ctx, id, String(error));
    return markUnknown(ctx, id, String(error), true);
  } finally {
    inFlightDispatches.delete(id);
  }
}

/** Reconcile native execution facts and keep goal completion for an explicit checkpoint. */
export const reconcile = note.action({
  description: "核对原生执行事实并继续已授权的待办工作。", input: delegationInputSchema.partial(), output: z.object({active:z.boolean(),delegations:z.array(publicDelegationSchema)}), visibility: 'private',
}, async (ctx, input) => {
  const snapshot = await readDesk(ctx);
  const delegations = Object.values(snapshot.value.delegations).filter(d=>!input?.delegationId||d.id===input.delegationId);
  for (const delegation of delegations) {
    if (inFlightDispatches.has(delegation.id)) continue;
    if(delegation.archived||delegation.status==='paused'&&delegation.feedback?.some(item=>item.pending))continue;
    if (!delegation.execution?.runId) {
      // A dispatch-boundary failure left nothing dispatched, so the desk can
      // finish the retry itself instead of asking for a read-only check.
      if (canRedispatch(delegation)) {
        if (delegation.nextDispatchAt !== undefined) {
          if (Date.now() >= delegation.nextDispatchAt) await retryDispatch(ctx, delegation.id);
          continue;
        }
        // A record that provably never dispatched must not stay parked in an
        // unexplained unknown: schedule the bounded retry for it.
        if (delegation.status === "unknown" || delegation.status === "dispatching") {
          await scheduleDispatchRetry(
            ctx,
            delegation.id,
            delegation.lastDispatchError ?? delegation.execution?.error ?? "投递未建立会话",
          );
          continue;
        }
      }
      const requestId = delegation.pendingRequestId ?? delegation.execution?.requestId;
      if (requestId && (delegation.status === "dispatching" || delegation.status === "unknown" || needsInterruptedNeedsInputRecovery(delegation))) {
        let result: AgentResult<JsonValue>;
        try {
          // The request id is the durable idempotency key written before the
          // dispatch. The host resolves it to the original native run.
          result = await ctx.host.agent.result(requestId, { wait: false });
        } catch (error) {
          await recoverUnknown(ctx, delegation.id, String(error));
          continue;
        }
        const adopted = await adoptPendingResult(ctx, delegation.id, requestId, result);
        if (!adopted) continue;
        const applied = await applyResult(ctx, delegation.id, result);
        const current = (await readDesk(ctx)).value.delegations[delegation.id];
        if ((result.status === "unknown" || current?.status === "unknown") && !current?.execution?.stopRequested) {
          if (current && !current.execution?.stopRequested && !current.verificationStarted) {
            await startVerification(ctx, delegation.id, false, {
              requestId: current.execution?.requestId,
              runId: current.execution?.runId,
            });
          }
        } else if (needsInterruptedNeedsInputRecovery(delegation) && result.status !== "completed" && result.status !== "needs-input") {
          await startVerification(ctx, delegation.id, false, {
            requestId: current?.execution?.requestId ?? delegation.execution?.requestId,
            runId: current?.execution?.runId ?? delegation.execution?.runId,
          });
        } else if (result.status === "completed" && current && shouldContinue(current)) {
          await resume(ctx, followupInput(current));
        }
        void applied;
      } else if (needsInterruptedNeedsInputRecovery(delegation) && delegation.execution?.status === "completed") {
        await mutateDesk(ctx, (state, at) => {
          const current = state.delegations[delegation.id];
          if (!current || current.execution?.stopRequested || current.outcome?.status !== "needs-input") return { changed: false, result: undefined };
          current.status = recordedExecutionStatus(current);
          current.updatedAt = at;
          return { changed: true, result: undefined };
        });
      } else if (delegation.status === "dispatching" || (delegation.status === "unknown" && !delegation.verificationStarted) || needsInterruptedNeedsInputRecovery(delegation)) {
        await recoverUnknown(ctx, delegation.id, "执行意图已保存，但缺少原生 requestId；先只读核对，不会自动重发原动作。");
      } else if (delegation.status === "unknown" && delegation.verificationStarted) {
        await notify(ctx, delegation, "执行状态需要核对", "只读恢复核对也没有可用的原生运行记录；请核对已有产物或外部效果后记录阻塞。");
      }
      continue;
    }
    const terminalNeedsFollowup = delegation.execution.status === "completed" && shouldContinue(delegation);
    const shouldCheck = input?.delegationId === delegation.id
      || nativeNeedsObservation(delegation.execution.status)
      || delegation.status === "dispatching"
      || delegation.status === "running"
      || delegation.status === "paused"
      || delegation.status === "needs-input"
      || delegation.status === "unknown"
      || terminalNeedsFollowup
      || needsInterruptedNeedsInputRecovery(delegation);
    if (!shouldCheck) continue;
    let result: AgentResult<JsonValue>;
    try {
      result = await ctx.host.agent.result(delegation.execution.runId, { wait: false });
    } catch (error) {
      await recoverUnknown(ctx, delegation.id, String(error));
      continue;
    }
    const applied = await applyResult(ctx, delegation.id, result);
    if ((result.status === "unknown" || applied.delegation.status === "unknown") && !applied.delegation.execution?.stopRequested) {
      const current = (await readDesk(ctx)).value.delegations[delegation.id];
      if (current && !current.execution?.stopRequested && !current.verificationStarted) {
        await startVerification(ctx, delegation.id, false, {
          requestId: current.execution?.requestId,
          runId: current.execution?.runId,
        });
      }
      continue;
    }
    if (needsInterruptedNeedsInputRecovery(delegation) && result.status !== "completed" && result.status !== "needs-input") {
      const current = (await readDesk(ctx)).value.delegations[delegation.id];
      if (current && !current.execution?.stopRequested && !current.verificationStarted) {
        await startVerification(ctx, delegation.id, false, {
          requestId: current.execution?.requestId ?? delegation.execution?.requestId,
          runId: current.execution?.runId ?? delegation.execution?.runId,
        });
      }
      continue;
    }
    // A changed item received while its owner was active is a pending
    // continuation, not a second concurrent native run. Start it only after
    // the previous run has a durable terminal fact and keep its session.
    if (result.status === "completed" && shouldContinue(applied.delegation)) {
      await resume(ctx, followupInput(applied.delegation));
    }
  }
  const latest = await readDesk(ctx);
  const active = Object.values(latest.value.delegations).some(shouldKeepReconcileSchedule);
  if (!active) await ctx.host.schedules.pause("execution-desk:" + ctx.note.id);
  else await ensureSchedule(ctx);
  return { active, delegations: Object.values(latest.value.delegations).map(publicDelegation) };
});

/** Record the actual goal outcome after a separate review turn. */
export const checkpoint = note.action({
  description: "记录当前任务的实际结果、证据、提案与候选。", input: checkpointInputSchema, output: checkpointResultSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input || !input.delegationId || !input.summary?.trim()) throw new Error("checkpoint 需要 delegationId 和 summary");
  if (input.status !== undefined && !["completed", "blocked", "needs-input", "failed", "cancelled", "unknown", "continue"].includes(input.status as string)) {
    throw new Error("checkpoint status 无效；请使用 completed、blocked、needs-input、failed、cancelled、unknown 或 continue");
  }
  if (input.replySuggestion !== undefined && typeof input.replySuggestion !== "string") throw new Error("replySuggestion 需要文本");
  const list = (value: unknown, name: string): string[] => {
    if (!Array.isArray(value) || value.some(item => typeof item !== "string" || !item.trim())) throw new Error(name + " 需要非空文本数组（没有事项时传 []）");
    return value.map(item => item.trim());
  };
  const hasFacts = input.remainingWork !== undefined || input.blockers !== undefined;
  if (!hasFacts && input.status === undefined) throw new Error("checkpoint 需要 remainingWork 和 blockers；没有事项时传 []");
  const remainingWork = hasFacts ? list(input.remainingWork, "remainingWork") : [];
  const blockers = hasFacts ? list(input.blockers, "blockers")
    : input.status && !["completed", "continue"].includes(input.status) ? [input.summary.trim()] : [];
  const outcomeStatus = blockers.length ? "blocked" : remainingWork.length ? "incomplete" : "completed";
  const evidence = validateEvidence(input.evidence);
  const proposals = proposalList(input);
  const before = (await readDesk(ctx)).value.delegations[input.delegationId];
  if (!before) throw new Error("找不到 delegation");
  const candidate = normalizeCandidate(input.candidate, candidateFromProposal([...before.proposals, ...proposals]));
  const continueRequested = !hasFacts && input.status === "continue";
  const updated = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[input.delegationId];
    if (!delegation) throw new Error("找不到 delegation");
    if(continueRequested&&delegation.execution?.completionCheck)throw Error("本轮只补充任务结果，请记录 completed 或 needs-input；继续工作需用户操作");
    if(continueRequested&&delegation.execution?.repairFeedbackId)throw Error("本次仅授权一轮预览修复，请在当前执行内完成验证并记录 completed 或 blocked；再次修复需用户授权");
    const handledVersion = input.requirementVersion ?? 1;
    if (!Number.isInteger(handledVersion) || handledVersion < 1 || handledVersion > (delegation.execution?.requirementVersion ?? 1)) throw new Error("requirementVersion 超出已投递的需求版本");
    // An older in-flight tool call must not replace the newer run's result or candidate.
    if (handledVersion < (delegation.execution?.requirementVersion ?? 1)) return {changed:false,result:delegation};
    const nativeActive = Boolean(delegation.execution && ["queued", "accepted", "running", "dispatching"].includes(delegation.execution.status));
    if (!nativeActive) finishActive(delegation, at);
    else if (delegation.activeSince === undefined) delegation.activeSince = at;
    if (delegation.approvalWaitSince !== undefined) {
      delegation.approvalWaitMs += Math.max(0, at - delegation.approvalWaitSince);
      delegation.approvalWaitSince = undefined;
    }
    if(delegation.origin){
      if(input.workType==='code-repair'&&(!input.repairTitle?.startsWith('修复')||!evidence.length))throw Error('代码修复需要具体修复名称和确认依据');
      if(input.workType)delegation.workType=input.workType;
      if(input.repairTitle&&input.repairTitle!==delegation.goal){delegation.requirementHistory=[...(delegation.requirementHistory||[]),{version:delegation.requirementVersion||1,goal:delegation.goal,scope:cloneJson(delegation.scope),source:cloneJson(delegation.source)}];delegation.goal=input.repairTitle;}
      if(input.nextAction)delegation.nextAction=input.nextAction;
    }
    delegation.evidence = mergeEvidence(delegation.evidence, evidence);
    if (proposals.length) {
      const merged = mergeProposals(delegation.proposals, proposals);
      delegation.proposals = merged.proposals;
      delegation.proposal = merged.latest;
    }
    if (candidate) delegation.candidate = cloneJson(candidate);
    if (continueRequested) {
      // A recovery turn cannot grant itself business completion. This durable
      // command is consumed by reconcile after the current native turn ends.
      delegation.outcome = undefined;
      delegation.pendingContinuation = true;
      delegation.continueRequested = true;
      delegation.status = recordedExecutionStatus(delegation);
    } else {
      // A concrete outcome supersedes an earlier request to continue. Leaving
      // either marker set would make reconcile reopen an already checkpointed
      // goal after the native turn completes.
      const hasNewerRequirement = handledVersion < (delegation.requirementVersion ?? 1);
      delegation.pendingContinuation = hasNewerRequirement || undefined;
      delegation.continueRequested = undefined;
      delegation.outcome = {
        requirementVersion: handledVersion,
        status: outcomeStatus,
        remainingWork,
        blockers,
        summary: input.summary.trim(),
        proposals: cloneJson(delegation.proposals),
        ...(input.replySuggestion?.trim() ? { replySuggestion:input.replySuggestion.trim() } : {}),
        recordedAt: at,
        ...(delegation.execution?.requestId ? { requestId: delegation.execution.requestId } : {}),
      };
      delegation.status = recordedExecutionStatus(delegation);
    }
    delegation.updatedAt = at;
    return { changed: true, result: delegation };
  });
  if ((input.requirementVersion ?? 1) < (updated.execution?.requirementVersion ?? 1)) return publicDelegation(updated);
  if (continueRequested && updated.execution?.status === "completed") {
    return {
      ...(await resume(ctx, { delegationId: updated.id })),
      summary: input.summary.trim(),
      evidence,
      proposals: updated.proposals,
    };
  }
  if (before.status !== updated.status) {
    await clearObsoleteNotices(ctx, updated);
    if (['review', 'completed'].includes(updated.status) && !updated.origin) await notify(ctx, updated, '执行结果可查看', input.summary);
    else if (updated.status === 'needs-input') await notify(ctx, updated, '执行需要补充信息', input.summary);
    else if (updated.status === 'failed') await notify(ctx, updated, '执行失败', input.summary);
    else if (['blocked', 'unknown'].includes(updated.status)) await notify(ctx, updated, '执行状态需要核对', input.summary);
  }
  if(updated.origin){
    const review=updated.proposals.filter(p=>p.operations.length&&p.evidence.length&&!['applied','rejected'].includes(p.status||''));
    if(review.length)await ctx.host.notifications.upsert({key:`delegation:${updated.id}:inspection-review`,occurrenceId:digest(canonicalJson(review)),kind:'needs-review',attention:'action',title:`需要你审阅修复方案 · ${updated.goal}`,summary:input.summary,noteId:ctx.note.id,target:{type:'note',id:ctx.note.id,path:updated.id}});
  }
  // Recording a result must not re-deliver an already registered candidate.
  // An explicit candidate remains supported for older callers.
  const preview = candidate && !continueRequested && !updated.pendingContinuation ? await deliverCandidate(ctx, updated) : updated.preview;
  return {
    ...publicDelegation(updated),
    summary: updated.outcome?.summary,
    evidence,
    proposals: updated.proposals,
    candidate: updated.candidate,
    preview,
  };
});

/**
 * Records a candidate launch spec on an existing delegation and synchronizes the
 * launch option. This is the desk's explicit re-sync path: an outcome recorded
 * before the preview route existed, a failed delivery, or a changed candidate.
 */
export const setCandidate = note.action({
  description: "记录候选启动规格并同步预览。", input: z.object({delegationId:z.string(),candidate:candidateInputSchema.optional(),sync:z.boolean().optional(),retry:z.boolean().optional()}), output: checkpointResultSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId) throw new Error("setCandidate 需要 delegationId");
  const current = (await readDesk(ctx)).value.delegations[input.delegationId];
  if (!current) throw new Error("找不到 delegation");
  const candidate = normalizeCandidate(input.candidate, candidateFromProposal(current.proposals));
  if (!candidate) throw new Error("setCandidate 需要候选启动规格");
  const updated = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[input.delegationId];
    if (!delegation) throw new Error("找不到 delegation");
    delegation.candidate = cloneJson(candidate);
    delegation.updatedAt = at;
    return { changed: true, result: delegation };
  });
  const preview = input.sync === false ? updated.preview : await deliverCandidate(ctx, updated, input.retry ? { nonce: crypto.randomUUID() } : {});
  return { ...publicDelegation(updated), candidate: updated.candidate, preview };
});

/** Re-delivers the recorded candidate; retry uses a fresh requestId for one real re-delivery. */
export const syncPreview = note.action({
  description: "重新投递已记录的候选。", input: z.object({delegationId:z.string(),retry:z.boolean().optional()}), output: checkpointResultSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId) throw new Error("syncPreview 需要 delegationId");
  const current = (await readDesk(ctx)).value.delegations[input.delegationId];
  if (!current) throw new Error("找不到 delegation");
  if (!current.candidate) throw new Error("该委托还没有候选启动规格");
  const preview = await deliverCandidate(ctx, current, input.retry ? { nonce: crypto.randomUUID() } : {});
  return { ...publicDelegation(current), candidate: current.candidate, preview };
});

/** Preview lifecycle is independent of the owner agent's pause state. */
export const controlPreview = note.action({
  description: "请求停止或重启任务候选预览。", input: z.object({delegationId:z.string(),operation:z.enum(['stop','restart'])}), output: z.object({operation:z.enum(['stop','restart']),status:z.string(),eventId:z.string()}), visibility: 'private',
}, async (ctx, input) => {
  if(!['stop','restart'].includes(input.operation))throw Error('未知预览操作');
  const delegation=(await readDesk(ctx)).value.delegations[input.delegationId];
  if(!delegation?.candidate)throw Error('该委托还没有候选启动规格');
  const requestId=`preview-control:${delegation.id}:${input.operation}:${crypto.randomUUID()}`;
  const event=await events.previewControlRequested.publish(ctx,{
    operation:input.operation,key:delegation.id,originNoteId:ctx.note.id,delegationId:delegation.id,
    revision:delegation.candidate.revision,requestId,
  },{key:requestId,exclusive:true});
  return {operation:input.operation,status:'pending',eventId:event.id};
});

/** CardGame's play surface keeps repair controls on the owning execution desk. */
export const requestPreviewRepair = note.action({
  description: "请求关联预览按已记录的失败反馈修复。", input: z.object({delegationId:z.string(),feedbackId:z.string()}), output: z.object({accepted:z.boolean(),session:z.string().optional(),reason:z.string().optional()}), visibility: 'private',
}, async (ctx, input) => {
  if(ctx.caller.kind!=='user')throw Error('预览修复需要用户手动触发');
  const config=(await ctx.config.read()).value;
  if(!config.projectId)throw Error('执行台尚未绑定项目');
  return ctx.host.extensions.request('cardgame-content','requestPreviewRepair',{...input,projectId:config.projectId});
});

async function beginContinuation(ctx: ExecutionContext, id: string, verification = false, repairFeedbackId?: string, completionCheck=false): Promise<{ delegation: Delegation; requestId: string; reserved: boolean }> {
  return mutateDesk(ctx, (state, at): Mutation<{ delegation: Delegation; requestId: string; reserved: boolean }> => {
    const delegation = state.delegations[id];
    if (!delegation) throw new Error("找不到 delegation");
    const repairOrigin=repairFeedbackId??(verification?delegation.execution?.repairFeedbackId:undefined);
    const repair=repairFeedbackId?delegation.feedback?.find(f=>f.id===repairFeedbackId):undefined;
    if(repairFeedbackId){
      if(!repair?.candidateKey||repair.status!=='failed')throw Error('该预览反馈不可修复');
      if(repair.repairRequestId)return {changed:false,result:{delegation,requestId:repair.repairRequestId,reserved:false}};
      const latest=delegation.feedback?.findLast(f=>f.connectionId===repair.connectionId&&f.subject===repair.subject);
      if(latest!==repair||repair.candidateKey===delegation.id&&!sameCandidate(delegation.candidate,repair))throw Error('候选或失败记录已更新，请刷新后操作');
      if(delegation.archived||delegation.status==='paused'||delegation.execution?.stopRequested)throw Error('请先恢复原任务');
      if(delegation.pendingRequestId||delegation.status==='running'||delegation.status==='dispatching'||delegation.status==='unknown')throw Error('原任务仍在执行或等待核对，请稍后修复');
    }
    if (delegation.pendingRequestId) return { changed: false, result: { delegation, requestId: delegation.pendingRequestId, reserved: false } };
    const requestId = "delegation:" + id + (verification ? ":verify:" : ":continue:") + (delegation.continuationSeq + 1);
    if (delegation.approvalWaitSince !== undefined) {
      delegation.approvalWaitMs += Math.max(0, at - delegation.approvalWaitSince);
      delegation.approvalWaitSince = undefined;
    }
    const trigger={reason:completionCheck?"missing-result":repairFeedbackId?"preview-repair":verification?"restart-recovery":delegation.pendingContinuation?"business-input":"continue",source:repairFeedbackId??delegation.source.revision};
    if(repair)repair.repairRequestId=requestId;
    delegation.continuationSeq += 1;
    delegation.pendingRequestId = requestId;
    if (verification) {
      // The verification turn observes the existing goal outcome; it does not
      // turn that observation into a new completion or erase pending input.
      delegation.verificationStarted = true;
    } else {
      // A normal continuation gets a fresh goal checkpoint. Keep a compact
      // trace of the prior outcome so it cannot make the next native result
      // look complete.
      delegation.outcome = undefined;
      for(const item of delegation.feedback??[])item.pending=false;
      delegation.pendingContinuation = undefined;
      delegation.verificationStarted = undefined;
      delegation.continueRequested = undefined;
      delegation.archived = false;
      delegation.archivedAt = undefined;
    }
    delegation.status = "dispatching";
    delegation.activeSince = at;
    delegation.execution = {
      ...(delegation.execution ?? { requestId }),
      requestId,
      requirementVersion: delegation.requirementVersion ?? 1,
      runId: undefined,
      status: "dispatching",
      error: undefined,
      stopRequested: undefined,
      ...(verification ? { verification: true } : { verification: undefined }),
      repairFeedbackId:repairOrigin,
      completionCheck:verification?delegation.execution?.completionCheck:completionCheck,
      trigger,
    };
    delegation.updatedAt = at;
    return { changed: true, result: { delegation, requestId, reserved: true } };
  });
}

/** Continue an owned session. Unknown executions first get a read-only check. */
export const resume = note.action({
  description: "继续原任务会话；先核对未知执行。", input: z.object({delegationId:z.string(),repairFeedbackId:z.string().optional(),completionCheck:z.boolean().optional(),delivery:z.enum(['queue','steer']).optional()}), output: executionResultSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId) throw new Error("resume 需要 delegationId");
  const snapshot = await readDesk(ctx);
  const existing = snapshot.value.delegations[input.delegationId];
  if (!existing) throw new Error("找不到 delegation");
  if(input.repairFeedbackId&&!existing.feedback?.some(f=>f.id===input.repairFeedbackId&&f.connectionId===ctx.caller.skillCause?.chain.at(-1)))throw Error("修复请求来源不匹配");
  if (!input.repairFeedbackId && (existing.status === "unknown" || existing.execution?.status === "unknown")) {
    // A record that never bound a session has nothing to verify: an explicit
    // continue grants a fresh retry budget instead of asking for a read-only
    // check that could never find a run.
    if (canRedispatch(existing)) {
      await mutateDesk(ctx, (state, at) => {
        const current = state.delegations[existing.id];
        if (!current || current.nextDispatchAt !== undefined) return { changed: false, result: undefined };
        current.dispatchAttempts = 0;
        current.updatedAt = at;
        return { changed: true, result: undefined };
      });
      const retried = await scheduleDispatchRetry(
        ctx,
        existing.id,
        existing.lastDispatchError ?? "继续前该委托从未建立执行会话",
      );
      return { ...publicDelegation(retried), recovery: "redispatch" };
    }
    const recovered = await recoverUnknown(ctx, existing.id, "继续前发现原生执行状态未知；已启动只读核对，不会盲目重放。", true);
    return { ...publicDelegation(recovered), recovery: "verification" };
  }
  if (!input.repairFeedbackId && !existing.pendingContinuation && !existing.feedback?.some(item=>item.pending) && !existing.continueRequested && existing.outcome?.status === "completed") return publicDelegation(existing);
  if (!input.repairFeedbackId && (existing.status === "running" || existing.status === "dispatching") && existing.execution?.runId && !(input.delivery === "steer" && existing.pendingContinuation && !existing.execution?.stopRequested)) return publicDelegation(existing);
  await ensureSchedule(ctx);
  inFlightDispatches.add(existing.id);
  let reservation: Awaited<ReturnType<typeof beginContinuation>>;
  try {
    reservation = await beginContinuation(ctx, existing.id, false, input.repairFeedbackId, input.completionCheck);
  } catch (error) {
    inFlightDispatches.delete(existing.id);
    throw error;
  }
  if (!reservation.reserved) {
    inFlightDispatches.delete(existing.id);
    return publicDelegation(reservation.delegation);
  }
  let sessionId = reservation.delegation.owner?.sessionId;
  try {
    if (!sessionId) {
      if (!ctx.host.agent.prepare) throw new Error("宿主没有提供 agent.prepare");
      const prepared = await ctx.host.agent.prepare({ noteId: ctx.note.id, cwd: reservation.delegation.owner?.cwd, delegationId: existing.id });
      sessionId = prepared.sessionId;
      await mutateDesk(ctx, (state, at) => {
        const current = state.delegations[existing.id];
        if (!current || current.pendingRequestId !== reservation.requestId) return { changed: false, result: undefined };
        current.owner = { sessionId: prepared.sessionId, noteId: ctx.note.id, ...(reservation.delegation.owner?.cwd ? { cwd: reservation.delegation.owner.cwd } : {}) };
        current.updatedAt = at;
        return { changed: true, result: undefined };
      });
    }
    const run = await ctx.host.agent.run({
      requestId: reservation.requestId,
      delivery: input.delivery,
      sessionId,
      noteId: reservation.delegation.owner?.noteId ?? ctx.note.id,
      cwd: reservation.delegation.owner?.cwd,
      delegationId: existing.id,

      prompt: promptFor(await currentInstruction(ctx, await hydrate(ctx.db, reservation.delegation)), true, ctx.note.id, false, undefined, await followupGuidance(ctx)),
    });
    const updated = await mutateDesk(ctx, (state, at) => {
      const current = state.delegations[existing.id];
      if (!current || current.pendingRequestId !== reservation.requestId) return { changed: false, result: current };
      current.execution = { ...current.execution, requestId: reservation.requestId, runId: run.id, status: run.status ?? "running", stopRequested: undefined };
      current.pendingRequestId = undefined;
      current.status = statusForRun(run.status);
      if (current.status !== "running" && current.status !== "dispatching") finishActive(current, at);
      current.updatedAt = at;
      return { changed: true, result: current };
    });
    return { ...publicDelegation(updated), sessionId, runId: run.id };
  } catch (error) {
    inFlightDispatches.delete(existing.id);
    const current = (await readDesk(ctx)).value.delegations[existing.id];
    if (canRedispatch(current)) {
      const retried = await scheduleDispatchRetry(ctx, existing.id, String(error));
      return { ...publicDelegation(retried), sessionId, recovery: "redispatch" };
    }
    const unknown = await recoverUnknown(ctx, existing.id, String(error));
    return { ...publicDelegation(unknown), sessionId, recovery: "verification" };
  } finally {
    inFlightDispatches.delete(existing.id);
  }
});

/** Stow the owner: pause future reconciliation and request cancellation of owned active runs. */
export const stow = note.action({
  description: "暂停后续核对并请求停止活动执行。", input: emptyInputSchema, output: z.object({paused:z.number(),stopFailures:z.array(z.string())}), visibility: 'private',
}, async (ctx, _input) => {
  await ctx.host.schedules.pause("execution-desk:" + ctx.note.id);
  const toStop = await mutateDesk(ctx, (state, at) => {
    const ids: string[] = [];
    let changed = false;
    for (const delegation of Object.values(state.delegations)) {
      if (!["dispatching", "running"].includes(delegation.status)) continue;
      changed = true;
      finishActive(delegation, at);
      delegation.status = "paused";
      if (delegation.execution) delegation.execution = { ...delegation.execution, status: delegation.execution.runId ? "cancel-requested" : "dispatching", stopRequested: Boolean(delegation.execution.runId) };
      delegation.pendingRequestId = undefined;
      delegation.updatedAt = at;
      const runId = delegation.execution?.runId;
      if (runId) ids.push(runId);
    }
    return { changed, result: ids };
  });
  const failures: string[] = [];
  for (const runId of toStop) {
    try {
      if (ctx.host.agent.stop) await ctx.host.agent.stop(runId);
    } catch (error) {
      failures.push(runId + ": " + String(error));
    }
  }
  if (failures.length) {
    const state = await readDesk(ctx);
    const first = Object.values(state.value.delegations).find(item => item.execution?.runId === toStop[0]);
    if (first) await notify(ctx, first, "暂停请求需要核对", failures.join("；"));
  }
  return { paused: toStop.length, stopFailures: failures };
});

/** Archive a completed or inactive delegation to keep the workspace clean. */
export const archiveDelegation = note.action({
  description: "归档任务并按需暂停核对。", input: delegationInputSchema, output: publicDelegationSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId) throw new Error("archiveDelegation 需要 delegationId");
  const updated = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[input.delegationId];
    if (!delegation) throw new Error("找不到 delegation");
    if (delegation.archived) return { changed: false, result: delegation };
    delegation.archived = true;
    delegation.archivedAt = at;
    delegation.updatedAt = at;
    return { changed: true, result: delegation };
  });
  // If no other active delegations remain, pause the schedule
  const latest = await readDesk(ctx);
  const active = Object.values(latest.value.delegations).some(shouldKeepReconcileSchedule);
  if (!active) await ctx.host.schedules.pause("execution-desk:" + ctx.note.id);
  return { ...publicDelegation(updated), archived: true };
});

/** Restore an archived delegation back to the active list. */
export const restoreDelegation = note.action({
  description: "恢复归档任务并按需重新核对。", input: delegationInputSchema, output: publicDelegationSchema, visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId) throw new Error("restoreDelegation 需要 delegationId");
  const updated = await mutateDesk(ctx, (state, at) => {
    const delegation = state.delegations[input.delegationId];
    if (!delegation) throw new Error("找不到 delegation");
    if (!delegation.archived) return { changed: false, result: delegation };
    delegation.archived = false;
    delegation.archivedAt = undefined;
    delegation.updatedAt = at;
    return { changed: true, result: delegation };
  });
  if (shouldKeepReconcileSchedule(updated)) {
    await ensureSchedule(ctx);
  }
  return { ...publicDelegation(updated), archived: false };
});

/** Adopt an existing conversation without dispatching or replacing its history. */
export const adopt = note.action({
  description: "关联既有会话，不投递新执行或替换历史。", input: submitInputSchema.extend({sessionId:z.string(),ownerNoteId:z.string()}), output: publicDelegationSchema, visibility: 'private',
}, async (ctx, input) => {
  if (ctx.caller.kind !== 'user') throw new Error('关联旧任务需要用户操作');
  if (!input.sessionId || !input.ownerNoteId) throw new Error('旧任务需要原会话和所属便笺');
  const connection = await selectedConnection(input,ctx);
  const units = sourceUnits(connection).filter(unit => input.itemId === undefined || unit.id === input.itemId);
  if (units.length !== 1) throw new Error('旧任务关联需要单一来源');
  const registered = await registerDelegation(ctx,connection,units[0]!,input);
  const task = await mutateDesk(ctx,(state,at)=>{
    const task = state.delegations[registered.delegation.id]!;
    if (task.owner) {
      if (task.owner.sessionId !== input.sessionId) throw new Error('该来源已经关联另一会话');
      return {changed:false,result:task};
    }
    task.owner = {sessionId:input.sessionId,noteId:input.ownerNoteId};
    task.execution = undefined;task.pendingRequestId=undefined;task.activeSince=undefined;
    task.status='paused';task.updatedAt=at;
    return {changed:true,result:task};
  });
  return publicDelegation(task);
});

/** User followups in the native conversation are executions of this same task. */
export const observeOwner = note.action({
  description: "将所有者会话中的新执行关联到同一任务。", input: z.object({delegationId:z.string(),sessionId:z.string(),requestId:z.string()}), output: publicDelegationSchema, visibility: 'private',
}, async (ctx, input) => {
  const result=await ctx.host.agent.result(input.requestId,{wait:false});
  const task=await mutateDesk(ctx,(state,at)=>{
    const task=state.delegations[input.delegationId];
    if(!task||task.owner?.sessionId!==input.sessionId)throw new Error('会话不属于该任务');
    if(task.execution?.requestId===input.requestId)return {changed:false,result:task};
    finishActive(task,at);
    task.execution={requestId:input.requestId,runId:input.requestId,status:result.status,requirementVersion:task.requirementVersion ?? 1};
    task.status=statusForRun(result.status);task.outcome=undefined;task.pendingRequestId=undefined;task.pendingContinuation=undefined;task.continueRequested=undefined;
    task.archived=false;task.archivedAt=undefined;task.activeSince=at;task.updatedAt=at;
    return {changed:true,result:task};
  });
  await ensureSchedule(ctx);
  return publicDelegation(task);
});

/** Update display metadata without changing the goal, source identity or execution. */
export const setTitle = note.action({
  description: "更新显示名称并同步关联预览。", input: z.object({delegationId:z.string(),title:z.string()}), output: z.object({delegationId:z.string(),title:z.string()}), visibility: 'private',
}, async (ctx, input) => {
  if (!input?.delegationId || typeof input.title !== "string" || !input.title.trim()) throw new Error("setTitle 需要 delegationId 和非空 title");
  const title = input.title.trim();
  const result = await mutateDesk(ctx, (state,at) => {
    const task = state.delegations[input.delegationId];
    if (!task) throw new Error("找不到 delegation");
    const changed = task.title !== title;
    task.title = title;
    if(changed)task.updatedAt=at;
    return { changed, result: { delegationId: task.id, title } };
  });
  const task = (await readDesk(ctx)).value.delegations[input.delegationId]!;
  if (task.preview || task.candidate) {
    const label=delegationDisplayName(task);
    await events.previewTitleChanged.publish(ctx, {
      delegationId:task.id,originNoteId:ctx.note.id,rawTitle:title,title:label,revision:String(task.updatedAt),
    },{key:`preview-title:${task.id}:${task.updatedAt}`,exclusive:true});
  }
  return result;
});

export const inspectProposal = note.action({
  description: "读取已记录合并提案的实际差异。", input: z.object({delegationId:z.string(),proposalId:z.string(),operationIndex:z.number()}), output: z.object({base:z.string(),head:z.string(),diff:z.string()}), visibility: 'private',
}, async (ctx, input) => {
 const d=(await readDesk(ctx)).value.delegations[input.delegationId];
 const p=d?.proposals.find(p=>p.id===input.proposalId);
 const operation=p?.operations[input.operationIndex];
 if(!operation)throw Error('找不到已记录的提案');
 return proposalDiff(operation);
});


/** A task's file, read on demand by the view, Agents and linked notes that need the full text. */
export const queries = {
workspace:note.query({description:'读取展开执行台展示的委托业务记录。',visibility:'private',input:z.object({}),output:z.object({delegations:z.record(z.string(),delegationSchema)})},async(ctx)=>({delegations:normalizeState((await ctx.state.read()).value).delegations})),
overview:note.query({description:'读取执行台小卡的活动数和最多四项状态。',visibility:'private',input:z.object({}),output:z.object({summary:z.string(),items:z.array(z.object({id:z.string(),title:z.string(),status:z.string()})).max(4)})},async(ctx)=>{
 const state=normalizeState((await ctx.state.read()).value);
 const active=Object.values(state.delegations).filter(item=>!item.archived);
 return {summary:`${active.length} 项活动委托`,items:active.slice(0,4).map(item=>({id:item.id,title:item.goal,status:taskProgress(item,'').status}))};
}),
  evidence:note.query({description:"读取任务的执行证据。",input:delegationInputSchema,output:z.array(evidenceSchema),visibility:"private"},async(ctx,input)=>{
    const task=(await ctx.state.read()).value.delegations[input.delegationId];
    if(!task)throw new Error("找不到任务 "+input.delegationId);
    return (await hydrate(ctx.db,task)).evidence;
  }),
  /** A linked note receives a small business projection, never the execution desk state path. */
  progress: note.query({visibility:'public',
  description: "按稳定任务 ID 读取适合来源待办同步的当前进展、结论和修订号。", input: delegationInputSchema, output: z.object({delegationId:z.string(),status:z.enum(['todo','in_progress','blocking','done']),conclusion:z.string(),revision:z.string(),requirementVersion:z.number(),archived:z.boolean()}), objectRef: "/delegationId", revision: "/revision",
}, async (ctx, input) => {
    if (!input?.delegationId?.trim()) throw new Error('任务 ID 不能为空');
    const row = await ctx.state.read();
    const task = normalizeState(row.value).delegations[input.delegationId];
    if (!task) throw new Error('找不到任务 ' + input.delegationId);
    return taskProgress(task,row.revision);
  }),
  /** Small user-facing task result for a related source note; no source or private task state is exposed. */
  result: note.query({visibility:'public',
  description: "按稳定任务 ID 读取用户可见的执行状态、结论和建议回复，不暴露任务私有状态。", input: delegationInputSchema, output: z.object({delegationId:z.string(),title:z.string(),status:z.string(),archived:z.boolean(),summary:z.string(),replySuggestion:z.string(),revision:z.string()}), objectRef: "/delegationId", revision: "/revision",
}, async (ctx, input) => {
    if (!input?.delegationId?.trim()) throw new Error('任务 ID 不能为空');
    const row = await ctx.state.read();
    const task = normalizeState(row.value).delegations[input.delegationId];
    if (!task) throw new Error('找不到任务 ' + input.delegationId);
    return taskResult(task,row.revision);
  }),
  /** Public handling projection for one exact preview report; no foreign state read. */
  previewFeedback: note.query({visibility:'public',
  description: "按原任务和报告 ID 读取这一轮预览反馈的实际处理状态。", input: z.object({delegationId:z.string(),reportId:z.string()}), output: previewFeedbackResultSchema.extend({reportId:z.string(),revision:z.string()}), revision: "/revision",
}, async (ctx, input) => {
    if(!input?.delegationId?.trim()||!input.reportId?.trim())throw Error('预览反馈查询需要任务和报告 ID');
    const row=await ctx.state.read();
    const task=normalizeState(row.value).delegations[input.delegationId];
    if(!task)throw Error('找不到任务 '+input.delegationId);
    const feedback=task.feedback?.find(item=>item.id===input.reportId);
    if(!feedback)return {received:false,handling:'unreceived',delegationId:task.id,reportId:input.reportId,revision:row.revision};
    const handling=feedback.repairRequestId
      ? task.execution?.requestId===feedback.repairRequestId&&['running','dispatching','accepted'].includes(task.execution.status)?'running':'completed'
      : task.archived||task.status==='paused'||task.execution?.stopRequested?'paused'
      : feedback.manual||['blocked','needs-input','failed','unknown'].includes(task.status)?'needs-input'
      : feedback.pending?'queued':'completed';
    const repairSummary=feedback.repairRequestId&&feedback.repairRequestId===task.execution?.requestId
      ? task.outcome?.summary??task.execution?.error:undefined;
    return {received:true,handling,summary:repairSummary??feedback.summary,delegationId:task.id,reportId:input.reportId,
      ...(task.owner?.sessionId?{sessionId:task.owner.sessionId}:{}),revision:row.revision};
  }),
  /** One task with its full source, evidence, feedback details and past requirements; `path` (JSON Pointer) selects a part. */
  task: note.query({visibility:'public',
  description: "按稳定任务 ID 读取任务、来源、需求历史和执行证据。", input: delegationInputSchema.extend({path:z.string().optional()}), output: z.unknown(),
}, async (ctx, input) => {
    const request = input;
    const id = typeof request.delegationId === "string" ? request.delegationId : "";
    const row = await ctx.state.read();
    const task = normalizeState(row.value).delegations[id];
    if (!task) throw new Error("找不到任务 " + id);
    const full = await hydrate(ctx.db as never, task);
    const history = await ctx.db.list<NonNullable<Delegation["requirementHistory"]>[number]>(`delegation/${id}/requirement/`, { limit: 1000 });
    if (history.items.length) full.requirementHistory = history.items.map(item => item.value);
    return pointerAt(full as unknown as JsonValue, typeof request.path === "string" ? request.path : "");
  }),
  /** Active tasks with their full current and past requirements, for matching new work against them. */
  requirements: note.query({visibility:'public',
  description: "读取未归档任务及完整当前和历史要求，供新要求匹配。", input: emptyInputSchema, output: z.array(requirementSchema),
}, async (ctx, _input) => {
    const row = await ctx.state.read();
    const tasks = Object.values(normalizeState(row.value).delegations).filter(task => !task.archived);
    return Promise.all(tasks.map(async task => {
      const full = await hydrate(ctx.db as never, task);
      const history = await ctx.db.list<{ goal: string; scope: string[]; source: DelegationSource }>(`delegation/${task.id}/requirement/`, { limit: 1000 });
      return { id: task.id, goal: task.goal, scope: task.scope,
        sourceRef: { noteId: task.source.noteId ?? '', objectId: task.source.itemId ?? '' },
        source: full.source.value, history: history.items.map(item => ({ goal: item.value.goal, scope: item.value.scope, source: item.value.source?.value })) };
    }));
  }),
};

function pointerAt(value: JsonValue, path: string): JsonValue {
  if (!path) return value;
  let current: JsonValue | undefined = value;
  for (const token of path.replace(/^\//, "").split("/").map(part => part.replace(/~1/g, "/").replace(/~0/g, "~"))) {
    current = current && typeof current === "object" ? (current as Record<string, JsonValue>)[token] : undefined;
    if (current === undefined) throw new Error("任务中没有 " + path);
  }
  return current;
}
