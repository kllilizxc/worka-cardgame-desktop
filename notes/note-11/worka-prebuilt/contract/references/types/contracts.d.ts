import { z } from '@dsh-workbench/runtime';
export * from './model';
export declare const delegateTodoInputSchema: z.ZodObject<{
    itemId: z.ZodString;
    goal: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    resumePaused: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const feedbackInputSchema: z.ZodObject<{
    itemId: z.ZodString;
    status: z.ZodEnum<{
        blocking: "blocking";
        done: "done";
        in_progress: "in_progress";
        todo: "todo";
    }>;
    conclusion: z.ZodString;
    expectedRevision: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const moveTodoInputSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<{
        blocking: "blocking";
        done: "done";
        in_progress: "in_progress";
        todo: "todo";
    }>;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const editTodoInputSchema: z.ZodObject<{
    itemId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        dataUrl: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            "image/gif": "image/gif";
            "image/jpeg": "image/jpeg";
            "image/png": "image/png";
            "image/webp": "image/webp";
        }>>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    base: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            dataUrl: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                "image/gif": "image/gif";
                "image/jpeg": "image/jpeg";
                "image/png": "image/png";
                "image/webp": "image/webp";
            }>>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const importItemInputSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        itemId: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        messageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        taskKey: z.ZodOptional<z.ZodString>;
        importedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>;
}, z.core.$strip>;
export declare const importItemsInputSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodEnum<{
            high: "high";
            low: "low";
            medium: "medium";
        }>>;
        category: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            itemId: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            messageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            taskKey: z.ZodOptional<z.ZodString>;
            importedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>;
    }, z.core.$strip>>;
    mode: z.ZodOptional<z.ZodEnum<{
        append: "append";
        upsert: "upsert";
    }>>;
    autoDelegate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const importItemResultSchema: z.ZodObject<{
    itemId: z.ZodString;
    deduped: z.ZodOptional<z.ZodBoolean>;
    updated: z.ZodOptional<z.ZodBoolean>;
    delegation: z.ZodOptional<z.ZodObject<{
        status: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const events: {
    cardGameDelegationRequested: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodObject<{
        projectId: z.ZodString;
        projectGeneration: z.ZodString;
        todoId: z.ZodString;
        todoObjectId: z.ZodString;
        requestId: z.ZodString;
        requestKey: z.ZodString;
        payload: z.ZodObject<{
            goal: z.ZodString;
            scope: z.ZodArray<z.ZodString>;
            cwd: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        requirementRevision: z.ZodNumber;
    }, z.core.$strict>>>;
    cardGameProductionRequested: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodObject<{
        projectId: z.ZodString;
        todoId: z.ZodString;
        brief: z.ZodString;
        businessKey: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        requestId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    changed: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodObject<{
        itemId: z.ZodString;
        title: z.ZodString;
        revision: z.ZodString;
    }, z.core.$strip>>>;
    delegationRequested: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodObject<{
        itemId: z.ZodString;
        title: z.ZodString;
        revision: z.ZodString;
        goal: z.ZodString;
        scope: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>>;
};
