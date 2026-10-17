import type { Delegation } from "./model";
export declare function isExecuting(item: Pick<Delegation, "status">): boolean;
type DeskTaskForSort = Pick<Delegation, "id" | "createdAt" | "updatedAt" | "outcome" | "execution">;
/** Sort durable task activity first; completion time breaks ties for legacy records. */
export declare function compareDeskTasks(a: DeskTaskForSort, b: DeskTaskForSort): number;
/** A source-facing card label; the full delegation goal remains execution prompt data. */
export declare function delegationDisplayName(item: Pick<Delegation, "source" | "goal" | "title">): string;
/** The current owner turn, shown in both the desk and its native session. */
export declare function executionDisplayName(item: Pick<Delegation, "source" | "goal" | "title" | "origin" | "execution">): string;
export {};
