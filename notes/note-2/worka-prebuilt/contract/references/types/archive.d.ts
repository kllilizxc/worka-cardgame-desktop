import type { ExecutionContext, Delegation, DelegationSource, Evidence, NativeResult } from "./model";
/**
 * State is the desk's board: what each task is now, small enough to read
 * whole. Everything a task accumulates (the full source it came from, every
 * requirement version, feedback diagnostics, the evidence behind its results)
 * is its file in the note database. Business code keeps reading and writing
 * whole delegations; `shelve` moves what is new and bulky into the file when
 * the desk is written, and `hydrate` brings it back where the full text
 * matters. A copied or shared desk has no file: reads fall back to the board.
 */
type DbHost = ExecutionContext["db"];
export declare const sourceKey: (id: string, revision?: string) => string;
export declare const evidenceKey: (id: string) => string;
export declare const feedbackKey: (id: string, feedbackId: string) => string;
/** What the board keeps of a source: identity, and the few fields people and linked notes read. */
export declare function boardSource(source: DelegationSource): DelegationSource;
type Write = () => Promise<unknown>;
/**
 * Move what is new and bulky out of the board, returning the file writes to
 * make before the board is saved (so the board never points at a missing
 * file). Only unmarked content is moved; a settled board costs nothing.
 */
export declare function shelve(delegations: Record<string, Delegation>, db: DbHost): Write[];
/** Whether a task still carries content the board no longer keeps (a desk written before tasks had files). */
export declare function needsShelving(d: Delegation): boolean;
/** A native result as the board keeps it: a long text keeps its beginning. Short results are returned as they are. */
export declare function boardResult(result: NativeResult): NativeResult;
/** The task with its file: full source and feedback details, and its evidence. Missing records leave the board's version. */
export declare function hydrate(db: Pick<DbHost, "read">, d: Delegation): Promise<Delegation>;
export declare function mergeEvidence(existing: Evidence[], incoming: Evidence[]): Evidence[];
export {};
