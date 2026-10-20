import { z } from 'zod';
export declare const changeSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    productionId: z.ZodString;
    featureId: z.ZodOptional<z.ZodString>;
    todoId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    revision: z.ZodNumber;
    requirementRevision: z.ZodNumber;
    round: z.ZodNumber;
    updatedAt: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    stage: z.ZodEnum<{
        adopted: "adopted";
        cancelled: "cancelled";
        checking: "checking";
        draft: "draft";
        failed: "failed";
        generated: "generated";
        interrupted: "interrupted";
        "needs-input": "needs-input";
        paused: "paused";
        review: "review";
        running: "running";
        stale: "stale";
        undone: "undone";
    }>;
    candidates: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodString;
        targetId: z.ZodString;
        commit: z.ZodString;
        status: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            undone: "undone";
        }>;
        current: z.ZodBoolean;
        previewVerified: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const changePageSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        productionId: z.ZodString;
        featureId: z.ZodOptional<z.ZodString>;
        todoId: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodNumber;
        round: z.ZodNumber;
        updatedAt: z.ZodString;
        detail: z.ZodOptional<z.ZodString>;
        stage: z.ZodEnum<{
            adopted: "adopted";
            cancelled: "cancelled";
            checking: "checking";
            draft: "draft";
            failed: "failed";
            generated: "generated";
            interrupted: "interrupted";
            "needs-input": "needs-input";
            paused: "paused";
            review: "review";
            running: "running";
            stale: "stale";
            undone: "undone";
        }>;
        candidates: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodString;
            targetId: z.ZodString;
            commit: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            current: z.ZodBoolean;
            previewVerified: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    nextCursor: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const diffSchema: z.ZodObject<{
    candidateId: z.ZodString;
    commit: z.ZodString;
    baseCurrent: z.ZodBoolean;
    comparison: z.ZodString;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        changed: z.ZodBoolean;
        binary: z.ZodBoolean;
        truncated: z.ZodBoolean;
        beforeBytes: z.ZodNumber;
        afterBytes: z.ZodNumber;
        before: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        after: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const referencesSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        title: z.ZodString;
        anchor: z.ZodOptional<z.ZodString>;
        kind: z.ZodString;
        revision: z.ZodString;
        freshness: z.ZodString;
    }, z.core.$strip>>;
    limit: z.ZodNumber;
}, z.core.$strip>;
export type GameChange = z.output<typeof changeSchema>;
export type Diff = z.output<typeof diffSchema>;
