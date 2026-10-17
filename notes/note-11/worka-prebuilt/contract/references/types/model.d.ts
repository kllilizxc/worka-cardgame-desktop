import { z } from '@dsh-workbench/runtime';
export declare const todoStatusSchema: z.ZodEnum<{
    blocking: "blocking";
    done: "done";
    in_progress: "in_progress";
    todo: "todo";
}>;
export declare const todoPrioritySchema: z.ZodEnum<{
    high: "high";
    low: "low";
    medium: "medium";
}>;
export declare const todoImageSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const todoItemSourceSchema: z.ZodObject<{
    kind: z.ZodString;
    itemId: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    messageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    taskKey: z.ZodOptional<z.ZodString>;
    importedAt: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const todoItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        blocking: "blocking";
        done: "done";
        in_progress: "in_progress";
        todo: "todo";
    }>;
    createdAt: z.ZodString;
    completed: z.ZodOptional<z.ZodBoolean>;
    priority: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
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
    sourceAutoUpdatedAt: z.ZodOptional<z.ZodString>;
    autoDeliveryPending: z.ZodOptional<z.ZodString>;
    conclusion: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    delivery: z.ZodOptional<z.ZodString>;
    next: z.ZodOptional<z.ZodString>;
    deliveryIntent: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        fingerprint: z.ZodString;
        payload: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodString>;
        requirementVersion: z.ZodOptional<z.ZodNumber>;
        updateStatus: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    delegation: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        deskNoteId: z.ZodString;
        stateRef: z.ZodString;
    }, z.core.$strip>>;
    delegatedAt: z.ZodOptional<z.ZodString>;
    delegatedRunStatus: z.ZodOptional<z.ZodEnum<{
        accepted: "accepted";
        completed: "completed";
        queued: "queued";
        started: "started";
    }>>;
}, z.core.$loose>;
export declare const storedTodoItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    completed: z.ZodOptional<z.ZodBoolean>;
    priority: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
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
    sourceAutoUpdatedAt: z.ZodOptional<z.ZodString>;
    autoDeliveryPending: z.ZodOptional<z.ZodString>;
    conclusion: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    delivery: z.ZodOptional<z.ZodString>;
    next: z.ZodOptional<z.ZodString>;
    deliveryIntent: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        fingerprint: z.ZodString;
        payload: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodString>;
        requirementVersion: z.ZodOptional<z.ZodNumber>;
        updateStatus: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    delegation: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        deskNoteId: z.ZodString;
        stateRef: z.ZodString;
    }, z.core.$strip>>;
    delegatedAt: z.ZodOptional<z.ZodString>;
    delegatedRunStatus: z.ZodOptional<z.ZodEnum<{
        accepted: "accepted";
        completed: "completed";
        queued: "queued";
        started: "started";
    }>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        blocking: "blocking";
        done: "done";
        in_progress: "in_progress";
        todo: "todo";
    }>, z.ZodLiteral<"blocked">]>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const todoDataSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        completed: z.ZodOptional<z.ZodBoolean>;
        priority: z.ZodOptional<z.ZodEnum<{
            high: "high";
            low: "low";
            medium: "medium";
        }>>;
        category: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodOptional<z.ZodString>;
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
        sourceAutoUpdatedAt: z.ZodOptional<z.ZodString>;
        autoDeliveryPending: z.ZodOptional<z.ZodString>;
        conclusion: z.ZodOptional<z.ZodString>;
        taskId: z.ZodOptional<z.ZodString>;
        delivery: z.ZodOptional<z.ZodString>;
        next: z.ZodOptional<z.ZodString>;
        deliveryIntent: z.ZodOptional<z.ZodObject<{
            requestId: z.ZodString;
            fingerprint: z.ZodString;
            payload: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodString>;
            requirementVersion: z.ZodOptional<z.ZodNumber>;
            updateStatus: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        delegation: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            deskNoteId: z.ZodString;
            stateRef: z.ZodString;
        }, z.core.$strip>>;
        delegatedAt: z.ZodOptional<z.ZodString>;
        delegatedRunStatus: z.ZodOptional<z.ZodEnum<{
            accepted: "accepted";
            completed: "completed";
            queued: "queued";
            started: "started";
        }>>;
        status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            blocking: "blocking";
            done: "done";
            in_progress: "in_progress";
            todo: "todo";
        }>, z.ZodLiteral<"blocked">]>>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
    summary: z.ZodOptional<z.ZodString>;
    executionDesk: z.ZodOptional<z.ZodObject<{
        noteId: z.ZodOptional<z.ZodString>;
        stateRef: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const todoSnapshotSchema: z.ZodObject<{
    value: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            completed: z.ZodOptional<z.ZodBoolean>;
            priority: z.ZodOptional<z.ZodEnum<{
                high: "high";
                low: "low";
                medium: "medium";
            }>>;
            category: z.ZodOptional<z.ZodString>;
            dueDate: z.ZodOptional<z.ZodString>;
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
            sourceAutoUpdatedAt: z.ZodOptional<z.ZodString>;
            autoDeliveryPending: z.ZodOptional<z.ZodString>;
            conclusion: z.ZodOptional<z.ZodString>;
            taskId: z.ZodOptional<z.ZodString>;
            delivery: z.ZodOptional<z.ZodString>;
            next: z.ZodOptional<z.ZodString>;
            deliveryIntent: z.ZodOptional<z.ZodObject<{
                requestId: z.ZodString;
                fingerprint: z.ZodString;
                payload: z.ZodOptional<z.ZodUnknown>;
                status: z.ZodOptional<z.ZodString>;
                requirementVersion: z.ZodOptional<z.ZodNumber>;
                updateStatus: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            delegation: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                deskNoteId: z.ZodString;
                stateRef: z.ZodString;
            }, z.core.$strip>>;
            delegatedAt: z.ZodOptional<z.ZodString>;
            delegatedRunStatus: z.ZodOptional<z.ZodEnum<{
                accepted: "accepted";
                completed: "completed";
                queued: "queued";
                started: "started";
            }>>;
            status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                blocking: "blocking";
                done: "done";
                in_progress: "in_progress";
                todo: "todo";
            }>, z.ZodLiteral<"blocked">]>>;
            createdAt: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>;
        filter: z.ZodOptional<z.ZodEnum<{
            active: "active";
            all: "all";
            completed: "completed";
        }>>;
        summary: z.ZodOptional<z.ZodString>;
        executionDesk: z.ZodOptional<z.ZodObject<{
            noteId: z.ZodOptional<z.ZodString>;
            stateRef: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    origin: z.ZodOptional<z.ZodObject<{
        chain: z.ZodArray<z.ZodString>;
        deliveryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const revisionOutputSchema: z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>;
export declare const todoConfigSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>;
export type TodoStatus = z.infer<typeof todoStatusSchema>;
export type TodoPriority = z.infer<typeof todoPrioritySchema>;
export type TodoImage = z.infer<typeof todoImageSchema>;
export type TodoItemSource = z.infer<typeof todoItemSourceSchema>;
export type TodoItem = z.infer<typeof storedTodoItemSchema>;
export type TodoData = z.infer<typeof todoDataSchema>;
export declare function normalizeStatus(item: {
    status?: string;
    completed?: boolean;
}): TodoStatus;
export declare const note: import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        completed: z.ZodOptional<z.ZodBoolean>;
        priority: z.ZodOptional<z.ZodEnum<{
            high: "high";
            low: "low";
            medium: "medium";
        }>>;
        category: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodOptional<z.ZodString>;
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
        sourceAutoUpdatedAt: z.ZodOptional<z.ZodString>;
        autoDeliveryPending: z.ZodOptional<z.ZodString>;
        conclusion: z.ZodOptional<z.ZodString>;
        taskId: z.ZodOptional<z.ZodString>;
        delivery: z.ZodOptional<z.ZodString>;
        next: z.ZodOptional<z.ZodString>;
        deliveryIntent: z.ZodOptional<z.ZodObject<{
            requestId: z.ZodString;
            fingerprint: z.ZodString;
            payload: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodString>;
            requirementVersion: z.ZodOptional<z.ZodNumber>;
            updateStatus: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        delegation: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            deskNoteId: z.ZodString;
            stateRef: z.ZodString;
        }, z.core.$strip>>;
        delegatedAt: z.ZodOptional<z.ZodString>;
        delegatedRunStatus: z.ZodOptional<z.ZodEnum<{
            accepted: "accepted";
            completed: "completed";
            queued: "queued";
            started: "started";
        }>>;
        status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            blocking: "blocking";
            done: "done";
            in_progress: "in_progress";
            todo: "todo";
        }>, z.ZodLiteral<"blocked">]>>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
    summary: z.ZodOptional<z.ZodString>;
    executionDesk: z.ZodOptional<z.ZodObject<{
        noteId: z.ZodOptional<z.ZodString>;
        stateRef: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>;
