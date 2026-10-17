import type { StoreRef, AgentResult, JsonValue } from '@dsh-workbench/runtime';
import type { ExecutionDeskState, Delegation, DelegationSource, DirectTaskSource, NativeResult, CandidateLaunch, GoalOutcomeStatus, Proposal, DelegationStatus } from './model';
export declare function taskProgress(task: Delegation, revision: string): {
    delegationId: string;
    status: "blocking" | "done" | "in_progress";
    conclusion: string;
    revision: string;
    requirementVersion: number;
    archived: boolean;
};
export declare function taskResult(task: Delegation, revision: string): {
    delegationId: string;
    title: string;
    status: "blocked" | "cancelled" | "completed" | "dispatching" | "failed" | "needs-input" | "paused" | "review" | "running" | "unknown";
    archived: boolean;
    summary: string;
    replySuggestion: string;
    revision: string;
};
export declare function emptyState(): ExecutionDeskState;
export declare function asRefId(ref: StoreRef | undefined): string | undefined;
export declare function cloneJson<T>(value: T): T;
/**
 * Identity deliberately excludes connection configuration and data revisions.
 * The state reference plus a stable item path/id names the business item; the
 * latest revision is retained on the source as evidence of what was processed.
 */
export declare function sourceIdentity(connection: Pick<DirectTaskSource, "key" | "id" | "version" | "source">, itemPath?: string, businessKey?: string): string;
export declare function sourceFromConnection(connection: DirectTaskSource, item?: {
    id?: string;
    path?: string;
    value?: JsonValue;
}): DelegationSource;
export declare function resultSnapshot(result: AgentResult<JsonValue>, checkedAt?: number): NativeResult;
export declare function activeElapsedMs(delegation: Pick<Delegation, "activeMs" | "activeSince">, now?: number): number;
export declare function terminalStatus(status: DelegationStatus): boolean;
export declare function outcomeToDelegationStatus(status: GoalOutcomeStatus): DelegationStatus;
/** Execution state is independent of delivery, preview and merge results. */
export declare function recordedExecutionStatus(task: Pick<Delegation, "status" | "execution">): DelegationStatus;
/** Pure upgrade preview: no dispatch, state writes or archive restoration. */
export declare function executionStatusRepairs(state: ExecutionDeskState): {
    delegationId: string;
    runId: string;
    previousStatus: "blocked" | "cancelled" | "completed" | "dispatching" | "failed" | "needs-input" | "review" | "running" | "unknown";
    previousUpdatedAt: number;
    status: "blocked" | "cancelled" | "completed" | "dispatching" | "failed" | "needs-input" | "paused" | "review" | "running" | "unknown";
}[];
/** The newest proposal operation that names a runnable candidate worktree. */
export declare function candidateFromProposal(proposal: Proposal | readonly Proposal[] | undefined): {
    cwd: string;
    revision: string;
} | undefined;
/**
 * A partial launch spec is allowed: cwd and revision fall back to the reviewed
 * proposal candidate. argv and url must come from the owner, because the note
 * layer cannot know how an arbitrary project starts.
 */
export declare function normalizeCandidate(value: unknown, fallback?: {
    cwd: string;
    revision: string;
}): CandidateLaunch | undefined;
export declare function workSources(value: JsonValue): Record<string, JsonValue>;
/** Acceptance and completion are different facts; legacy outcomes belong to version one. */
export declare function requirementProgress(task: Delegation): "saved" | "queued" | "delivered" | "handled";
export declare function normalizeState(value: unknown): ExecutionDeskState;
