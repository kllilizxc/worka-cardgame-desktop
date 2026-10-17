import type { MergeProposalOperation } from './model';
/** Only a recorded proposal may choose the repository and revisions. No shell evaluation. */
export declare function proposalDiff(operation: MergeProposalOperation): Promise<{
    base: any;
    head: any;
    diff: any;
}>;
