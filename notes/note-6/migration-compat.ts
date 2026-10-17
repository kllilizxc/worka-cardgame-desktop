import type {NoteActionContext,NoteQueryContext} from "@dsh-workbench/runtime";
import type {note} from "./model";
type ActionContext=NoteActionContext<typeof note>;
type QueryContext=NoteQueryContext<typeof note>;

type ConnectedNodeGroup = { nodes: Array<{ noteId: string; queries: string[] }> };
type RelatedObjectBinding = {
  source: { noteId?: string; objectId: string };
  target: { noteId: string; objectId: string; title?: string; label?: string };
};
type ExecutionTargetResolution = {
  noteId?: string;
  matched: boolean;
  delegationId?: string;
  reason: string;
  candidates: Array<{ id: string; title: string }>;
};

/** Resolve only explicit feature-to-task object links exposed by the current Workbench relations API. */
function resolveExecutionLinks(featureId: string, connected: ConnectedNodeGroup[], relations: RelatedObjectBinding[]): ExecutionTargetResolution {
  const deskNoteIds = new Set(connected.flatMap(group => group.nodes
    .filter(node => node.queries.includes("progress"))
    .map(node => node.noteId)));
  const targets = new Map<string, RelatedObjectBinding["target"]>();
  for (const binding of relations) {
    if (binding.source.objectId !== featureId || !deskNoteIds.has(binding.target.noteId)) continue;
    targets.set(JSON.stringify([binding.target.noteId, binding.target.objectId]), binding.target);
  }
  const exact = [...targets.values()];
  const candidates = exact.slice(0, 8).map(target => ({
    id: target.objectId,
    title: target.title ?? target.label ?? target.objectId,
  }));
  if (exact.length === 1) {
    return {
      noteId: exact[0]!.noteId,
      delegationId: exact[0]!.objectId,
      matched: true,
      reason: "exact-feature-id",
      candidates,
    };
  }
  const fallbackNoteId = exact.length === 0 && deskNoteIds.size === 1 ? [...deskNoteIds][0] : undefined;
  return {
    ...(fallbackNoteId ? { noteId: fallbackNoteId } : {}),
    matched: false,
    reason: exact.length === 0 ? "no-exact-feature-id" : "ambiguous",
    candidates,
  };
}

export async function resolveExecutionTarget(input: { featureId: string; repository?: string }, ctx: QueryContext): Promise<ExecutionTargetResolution> {
    const featureId = input?.featureId?.trim();
    if (!featureId) return { matched: false, reason: "missing-feature-id", candidates: [] };
    const [connected, relations] = await Promise.all([
      ctx.resources.read<ConnectedNodeGroup[]>({name:"connectedNodes",input:{}}),
      ctx.resources.read<RelatedObjectBinding[]>({name:"relatedObjects",input:{}}),
    ]);
    if (connected.error || relations.error) throw new Error(connected.error || relations.error);
    return resolveExecutionLinks(featureId, connected.data ?? [], relations.data ?? []);
  }

type DeliveryFailureReport = Record<string, unknown>;

function reportRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}
function reportText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function describeReportValue(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  const record = reportRecord(value);
  if (record && typeof record.message === "string") return record.message;
  if (value === undefined || value === null) return undefined;
  try { return JSON.stringify(value); } catch { return String(value); }
}

/** Preserve the failed delivery identity and fingerprint in one idempotent inbox notification. */
export async function receiveDeliveryFailure(input: DeliveryFailureReport, ctx: ActionContext) {
  const report = reportRecord(input);
  if (!report || (report.kind !== undefined && report.kind !== "delivery-failure")) {
    return {ok:false, failure:{summary:"交付失败回执格式无效", repairable:"manual"}};
  }
  const connection = reportRecord(report.connection);
  const connectionId = reportText(report.connectionId) ?? reportText(connection?.id) ?? reportText(report.id);
  const connectionKey = reportText(report.connectionKey) ?? reportText(connection?.key) ?? reportText(report.key) ?? connectionId;
  const deliveryId = reportText(report.deliveryId) ?? reportText(connection?.deliveryId);
  const fingerprint = reportText(report.fingerprint);
  if (!connectionId || !deliveryId || !fingerprint) {
    return {ok:false, failure:{summary:"交付失败回执缺少连接、原 deliveryId 或稳定指纹", repairable:"manual"}};
  }
  const instruction = reportText(report.instruction) ?? reportText(connection?.instruction);
  const stage = reportText(report.stage);
  const repairable = reportText(report.repairable);
  const error = describeReportValue(report.error);
  const diagnostics = describeReportValue(report.diagnostics);
  const lines = [
    `连接：${connectionKey}（${connectionId}）`,
    `原 deliveryId：${deliveryId}`,
    stage ? `阶段：${stage}` : undefined,
    repairable ? `可修复性：${repairable}` : undefined,
    instruction ? `关联指令：${instruction}` : undefined,
    error ? `错误：${error}` : undefined,
    diagnostics ? `诊断：${diagnostics}` : undefined,
    `指纹：${fingerprint}`,
  ].filter((line): line is string => !!line);
  const key = `delivery-failure:${connectionId}:${fingerprint}`;
  const notification = await ctx.host.notifications.upsert({
    key,
    occurrenceId: fingerprint,
    title: `交付失败：${connectionKey}`.slice(0, 160),
    body: lines.join("\n"),
    noteId: ctx.note.id,
    target: {type:"connection",id:connectionId},
  }, {occurrenceId:fingerprint});
  return {ok:true, connectionId, deliveryId, fingerprint, notificationKey:notification.key};
}
