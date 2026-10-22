import { z } from '@dsh-workbench/runtime';
export declare const pinChangeReference: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    productionId: z.ZodString;
    revision: z.ZodNumber;
    candidateId: z.ZodOptional<z.ZodString>;
    commit: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const removePinnedReference: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    key: z.ZodString;
}, z.core.$strip>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const discussChange: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    productionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const cardgameQueries: {
    changes: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{
        cursor: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        filter: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, z.ZodObject<{
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
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    candidateDiff: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        productionId: z.ZodString;
        candidateId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    pinnedReferences: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            title: z.ZodString;
            anchor: z.ZodOptional<z.ZodString>;
            kind: z.ZodString;
            revision: z.ZodString;
            freshness: z.ZodString;
        }, z.core.$strip>>;
        limit: z.ZodNumber;
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
};
