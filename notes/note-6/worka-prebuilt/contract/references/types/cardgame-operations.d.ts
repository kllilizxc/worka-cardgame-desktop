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
}, z.core.$strip>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    }, z.core.$strip>>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    }, z.core.$strip>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    pinnedReferences: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
};
