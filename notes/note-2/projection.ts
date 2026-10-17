import {currentTaskOutcome,taskOutcome} from '@dsh-workbench/runtime';
import type {StoreRef,AgentResult,JsonValue} from '@dsh-workbench/runtime';
import type {ExecutionDeskState,Delegation,DelegationSource,DirectTaskSource,NativeResult,CandidateLaunch,GoalOutcomeStatus,Proposal,MergeProposalOperation,DelegationStatus} from './model';

export function taskProgress(task:Delegation,revision:string) {
  const status=['blocked','failed','unknown','needs-input'].includes(task.status)?'blocking' as const:taskOutcome(task).todoStatus;
  const outcome=currentTaskOutcome(task);
  return {delegationId:task.id,status,conclusion:outcome?.summary??'',revision,requirementVersion:task.requirementVersion??1,archived:task.archived===true};
}
export function taskResult(task:Delegation,revision:string) {
  const outcome=currentTaskOutcome(task);
  return {delegationId:task.id,title:task.goal,status:task.status,archived:task.archived===true,summary:outcome?.summary??'',replySuggestion:outcome?.replySuggestion??'',revision};
}

export function emptyState(): ExecutionDeskState {
  return { version: 1, delegations: {} };
}

export function asRefId(ref: StoreRef | undefined): string | undefined {
  if (!ref) return undefined;
  return typeof ref === "string" ? ref : ref.id;
}

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Identity deliberately excludes connection configuration and data revisions.
 * The state reference plus a stable item path/id names the business item; the
 * latest revision is retained on the source as evidence of what was processed.
 */
export function sourceIdentity(
  connection: Pick<DirectTaskSource, "key" | "id" | "version" | "source">,
  itemPath = connection.source.path,
  businessKey?: string,
): string {
  const source = connection.source;
  return JSON.stringify({
    ...(source.stateRef ? {stateRef:source.stateRef} : {noteId:source.noteId}),
    itemPath: itemPath || source.path || "",
    ...(businessKey ? { businessKey } : {}),
  });
}

export function sourceFromConnection(connection: DirectTaskSource, item?: { id?: string; path?: string; value?: JsonValue }): DelegationSource {
  return {
    key: connection.key,
    id: connection.id,
    version: connection.version,
    instruction: connection.instruction,
    deliveryId: connection.deliveryId,
    noteId: connection.source.noteId,
    stateRef: connection.source.stateRef,
    path: connection.source.path,
    ...(item?.id ? { itemId: item.id } : {}),
    ...(item?.path ? { itemPath: item.path } : {}),
    revision: connection.source.revision,
    value: cloneJson(item?.value ?? connection.source.value),
  };
}

export function resultSnapshot(result: AgentResult<JsonValue>, checkedAt = Date.now()): NativeResult {
  return {
    status: result.status,
    ...(result.interrupted === true ? { interrupted: true } : {}),
    ...(result.text === undefined ? {} : { text: result.text }),
    ...(result.value === undefined ? {} : { value: cloneJson(result.value) }),
    ...(result.error === undefined ? {} : { error: result.error }),
    checkedAt,
  };
}

export function activeElapsedMs(delegation: Pick<Delegation, "activeMs" | "activeSince">, now = Date.now()): number {
  return Math.max(0, delegation.activeMs + (delegation.activeSince === undefined ? 0 : Math.max(0, now - delegation.activeSince)));
}

export function terminalStatus(status: DelegationStatus): boolean {
  return status === "completed" || status === "cancelled" || status === "failed";
}

export function outcomeToDelegationStatus(status: GoalOutcomeStatus): DelegationStatus {
  // Legacy declarations cannot manufacture a native question or cancellation.
  if (status === "needs-input" || status === "failed" || status === "cancelled" || status === "unknown") return "blocked";
  return status === "incomplete" ? "review" : status;
}

/** Execution state is independent of delivery, preview and merge results. */
export function recordedExecutionStatus(task: Pick<Delegation, "status" | "execution">): DelegationStatus {
  if (task.execution?.stopRequested || task.status === "paused") return "paused";
  const status = task.execution?.status;
  if (["queued", "dispatching"].includes(status ?? "")) return "dispatching";
  if (["started", "accepted", "running", "cancel-requested"].includes(status ?? "")) return "running";
  if (task.execution?.result?.interrupted && ["unknown", "ambiguous", "failed", "cancelled"].includes(status ?? "")) return "unknown";
  if (status === "completed" || status === "failed" || status === "needs-input") return status;
  if (status === "cancelled") return "cancelled";
  return status === undefined ? task.status : "unknown";
}

/** Pure upgrade preview: no dispatch, state writes or archive restoration. */
export function executionStatusRepairs(state: ExecutionDeskState) {
  return Object.values(state.delegations).flatMap(task => {
    if (task.archived || task.status === 'paused' || task.execution?.stopRequested || !task.execution?.runId) return [];
    if (!['completed', 'failed', 'cancelled', 'unknown', 'ambiguous', 'needs-input'].includes(task.execution.status)) return [];
    const status = recordedExecutionStatus(task);
    return task.status === status ? [] : [{delegationId: task.id, runId: task.execution.runId, previousStatus: task.status, previousUpdatedAt: task.updatedAt, status}];
  });
}

/** The newest proposal operation that names a runnable candidate worktree. */
export function candidateFromProposal(proposal: Proposal | readonly Proposal[] | undefined): { cwd: string; revision: string } | undefined {
  const proposals: readonly Proposal[] = proposal === undefined
    ? []
    : Array.isArray(proposal)
      ? (proposal as readonly Proposal[])
      : [proposal as Proposal];
  for (const item of [...proposals].reverse()) {
    const operation = item.operations.find(
      (entry: MergeProposalOperation): entry is Extract<MergeProposalOperation, { kind: "git-merge" }> => entry.kind === "git-merge" && Boolean(entry.worktree),
    );
    if (operation?.worktree) return { cwd: operation.worktree, revision: operation.head };
  }
  return undefined;
}

/**
 * A partial launch spec is allowed: cwd and revision fall back to the reviewed
 * proposal candidate. argv and url must come from the owner, because the note
 * layer cannot know how an arbitrary project starts.
 */
export function normalizeCandidate(value: unknown, fallback?: { cwd: string; revision: string }): CandidateLaunch | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("candidate 需要对象");
  const record = value as Record<string, unknown>;
  const field = (name: "cwd" | "revision") => (typeof record[name] === "string" ? (record[name] as string).trim() : "");
  if (fallback && ((field("cwd") && field("cwd") !== fallback.cwd) || (field("revision") && field("revision") !== fallback.revision))) {
    throw new Error("candidate 与提案中的候选工作区或提交不一致");
  }
  const cwd = field("cwd") || fallback?.cwd || "";
  const revision = field("revision") || fallback?.revision || "";
  const url = typeof record.url === "string" ? record.url.trim() : "";
  const argv = Array.isArray(record.argv)
    ? record.argv.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim())
    : [];
  const adapter = typeof record.adapter === "string" && record.adapter.trim() ? record.adapter.trim() : undefined;
  const repos = record.repos && typeof record.repos === "object" && !Array.isArray(record.repos)
    ? Object.fromEntries(Object.entries(record.repos as Record<string, unknown>).flatMap(([role, value]) => {
      const item = value as {repo?: unknown; commit?: unknown};
      return typeof item?.repo === "string" && item.repo.trim() && typeof item.commit === "string" && item.commit.trim() ? [[role, {repo: item.repo.trim(), commit: item.commit.trim()}]] : [];
    }))
    : undefined;
  if (repos && !Object.keys(repos).length) throw new Error("candidate.repos 需要 {repo, commit}");
  if ((!repos && (!cwd || !revision)) || (!adapter && (!url || !argv.length))) throw new Error("candidate 需要 repos 或 cwd+revision，以及 argv+url 或预览项目 adapter");
  const readinessPath = typeof record.readinessPath === "string" && record.readinessPath.trim() ? record.readinessPath.trim() : undefined;
  const options = record.options && typeof record.options === "object" && !Array.isArray(record.options) ? record.options as Record<string, JsonValue> : undefined;
  const featureId = typeof record.featureId === "string" && record.featureId.trim() ? record.featureId.trim() : undefined;
  return { cwd, revision, argv, url, ...(readinessPath ? { readinessPath } : {}), ...(adapter ? { adapter } : {}), ...(repos ? { repos } : {}), ...(options ? { options } : {}), ...(featureId ? { featureId } : {}), ...(record.start === true ? { start: true } : {}), ...(record.embed === true ? { embed: true } : {}) };
}

export function workSources(value: JsonValue): Record<string, JsonValue> {
  if (value && typeof value === 'object' && !Array.isArray(value) && value.sources && typeof value.sources === 'object' && !Array.isArray(value.sources)) return value.sources as Record<string, JsonValue>;
  return {};
}

/** Acceptance and completion are different facts; legacy outcomes belong to version one. */
export function requirementProgress(task: Delegation): "saved" | "queued" | "delivered" | "handled" {
  if (task.pendingContinuation) return "queued";
  const version=task.requirementVersion ?? 1;
  if (task.outcome && (task.outcome.requirementVersion ?? 1)===version) return "handled";
  if (!task.pendingRequestId && task.execution?.runId && (task.execution.requirementVersion ?? 1)===version) return "delivered";
  return "saved";
}

export function normalizeState(value: unknown): ExecutionDeskState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptyState();
  const candidate = cloneJson(value) as Partial<ExecutionDeskState>;
  if (!candidate.delegations || typeof candidate.delegations !== "object" || Array.isArray(candidate.delegations)) return emptyState();
  // Legacy preview feedback is evidence, never outstanding permission to run.
  for (const d of Object.values(candidate.delegations)) {
    if (Array.isArray(d.evidence) === false) d.evidence = [];
    if (Array.isArray(d.proposals) === false) d.proposals = [];
    if (Array.isArray(d.scope) === false) d.scope = [];
    for (const f of d.feedback ?? []) {
      // Automatic repair is granted per report by the preview's round budget (`auto`).
      if ((f.candidateKey || f.id.startsWith("preview-result:")) && !f.auto) { f.pending = false; f.manual = f.status === "failed"; }
    }
  }
  return {
    version: 1,
    ...(typeof candidate.title === "string" ? { title: candidate.title } : {}),
    ...(typeof candidate.description === "string" ? { description: candidate.description } : {}),
    delegations: candidate.delegations as Record<string, Delegation>,
  };
}
