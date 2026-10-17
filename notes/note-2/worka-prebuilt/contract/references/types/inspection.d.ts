import type { Delegation } from './model';
import type { z } from '@dsh-workbench/runtime';
import type { inspectionOriginSchema, workTypeSchema } from './schemas';
export type InspectionOrigin = z.infer<typeof inspectionOriginSchema>;
export type WorkType = z.infer<typeof workTypeSchema>;
export declare function inspectionPresentation(d: Delegation): {
    type: string;
    needsReview: boolean;
    next: string;
    proposals: {
        id: string;
        summary: string;
        operations: ({
            repository: string;
            targetRef: string;
            expectedBase: string;
            head: string;
            kind: "git-merge";
            worktree?: string | undefined;
        } | {
            repository: string;
            targetRef: string;
            expectedBase: string;
            head: string;
            kind: "pr-merge";
            url: string;
        })[];
        evidence: string[];
        status?: "applied" | "approved" | "draft" | "pending-approval" | "rejected" | "unknown" | undefined;
    }[];
};
