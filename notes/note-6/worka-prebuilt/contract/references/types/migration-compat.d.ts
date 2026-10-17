import type { NoteActionContext, NoteQueryContext } from "@dsh-workbench/runtime";
import type { note } from "./model";
type ActionContext = NoteActionContext<typeof note>;
type QueryContext = NoteQueryContext<typeof note>;
type ExecutionTargetResolution = {
    noteId?: string;
    matched: boolean;
    delegationId?: string;
    reason: string;
    candidates: Array<{
        id: string;
        title: string;
    }>;
};
export declare function resolveExecutionTarget(input: {
    featureId: string;
    repository?: string;
}, ctx: QueryContext): Promise<ExecutionTargetResolution>;
type DeliveryFailureReport = Record<string, unknown>;
/** Preserve the failed delivery identity and fingerprint in one idempotent inbox notification. */
export declare function receiveDeliveryFailure(input: DeliveryFailureReport, ctx: ActionContext): Promise<{
    ok: boolean;
    failure: {
        summary: string;
        repairable: string;
    };
    connectionId?: undefined;
    deliveryId?: undefined;
    fingerprint?: undefined;
    notificationKey?: undefined;
} | {
    failure?: undefined;
    ok: boolean;
    connectionId: string;
    deliveryId: string;
    fingerprint: string;
    notificationKey: string;
}>;
export {};
