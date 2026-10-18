import type { CandidateInput, CandidateSpec, SurfaceDisplay, Data, CandidateDisplay, DisplayData } from './model';
import type { Snapshot } from '@dsh-workbench/runtime';
/**
 * Candidates may be registered standalone (any note or conversation) or synced from a delegation.
 * Standalone keys are self-chosen; delegation-sourced keys stay anchored to that delegation so
 * results route back to the original task. Provenance is optional metadata, never a requirement.
 */
export declare function validateCandidateIdentity(input: Partial<Pick<CandidateInput, 'key' | 'delegationId' | 'originNoteId'>>): void;
/** One row per surface, exactly as the host reported it. */
export type PreviewRow = {
    candidate: CandidateDisplay;
    surface: string;
    name: string;
    url?: string;
    status?: SurfaceDisplay;
    desired: NonNullable<CandidateSpec['desired']>[string];
};
export declare function previewRows(data: Pick<DisplayData, 'candidates'>): PreviewRow[];
/** Stable display state derived only from host status. */
export declare function rowState(row: PreviewRow): 'stopped' | 'starting' | 'checking' | 'ready' | 'unchecked' | 'verificationFailed' | 'failed' | 'stopping' | 'repairing' | 'waiting';
/** Shared stable-identity projection used by the public query and update checks. */
export declare function candidateSnapshot(state: Snapshot<Data>, key: string): {
    candidate: {
        [x: string]: unknown;
        key: string;
        title?: string | undefined;
        originNoteId?: string | undefined;
        delegationId?: string | undefined;
        featureId?: string | undefined;
        adapter?: string | undefined;
        repos?: Record<string, {
            repo: string;
            commit: string;
        }> | undefined;
        options?: Record<string, unknown> | undefined;
        cwd?: string | undefined;
        revision?: string | undefined;
        argv?: string[] | undefined;
        url?: string | undefined;
        readinessPath?: string | undefined;
        embed?: boolean | undefined;
        receivedAt: number;
        desired?: Record<string, "running" | "stopped"> | undefined;
        surfaces?: {
            name: string;
            title?: string | undefined;
            url: string;
        }[] | undefined;
        status?: Record<string, {
            [x: string]: unknown;
            phase: "failed" | "preparing" | "queued" | "ready" | "starting" | "stopped" | "stopping" | "verifying";
            url?: string | undefined;
            pass: string;
            since: number;
            updatedAt: number;
            message?: string | undefined;
            steps?: {
                id: string;
                label: string;
                state: "completed" | "failed" | "pending" | "running" | "skipped";
                detail?: string | undefined;
            }[] | undefined;
            verified?: {
                ok: boolean;
                at: number;
                checks: {
                    name: string;
                    ok: boolean;
                    detail?: string | undefined;
                    fix?: string | undefined;
                    owner?: "project" | "user" | undefined;
                }[];
            } | undefined;
            failure?: {
                message: string;
                owner: "framework" | "project" | "user";
                step?: string | undefined;
                log?: string | undefined;
                attempts: number;
                handling: "agent" | "agent-done" | "awaiting-approval" | "exhausted" | "retrying" | "waiting-user";
                handlingNote?: string | undefined;
                retryAt?: number | undefined;
                reportId?: string | undefined;
                session?: string | undefined;
                delegationId?: string | undefined;
                at: number;
            } | undefined;
            source?: string | undefined;
            logDir?: string | undefined;
        }> | undefined;
        repair?: {
            rounds: number;
            source: string;
            delegationId?: string | undefined;
            lastFailure?: string | undefined;
        } | undefined;
    };
    revision: string;
} | null;
