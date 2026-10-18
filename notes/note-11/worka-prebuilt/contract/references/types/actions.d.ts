import { z } from '@dsh-workbench/runtime';
import { workflowReadContracts, type TodoSummary, type TodoRequirement, type TodoRead, type TodoImage as WorkflowTodoImage } from './contract';
import type { NoteActionContext, NoteQueryContext } from "@dsh-workbench/runtime";
export { note } from "./note-model";
export type TodoStatus = "todo" | "in_progress" | "done" | "blocked";
export type TodoPriority = "low" | "medium" | "high";
export type TodoImage = WorkflowTodoImage;
export type TodoItem = TodoSummary | TodoRequirement;
export type TodoPage = z.output<typeof workflowReadContracts.todos.output>;
export type { TodoRequirement, TodoSummary, TodoRead };
export interface TodoState {
    projectId?: string;
    projectRoot?: string;
    query?: string;
    cursor?: string;
    selectedId?: string;
}
declare const action_createTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        dataUrl: z.ZodString;
        type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"image/png">, z.ZodLiteral<"image/jpeg">, z.ZodLiteral<"image/webp">, z.ZodLiteral<"image/gif">]>>;
        name: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>>;
    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
    category: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"todo">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"done">, z.ZodLiteral<"blocked">]>>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_createTodo as createTodo };
declare const action_addTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        dataUrl: z.ZodString;
        type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"image/png">, z.ZodLiteral<"image/jpeg">, z.ZodLiteral<"image/webp">, z.ZodLiteral<"image/gif">]>>;
        name: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>>;
    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
    category: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"todo">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"done">, z.ZodLiteral<"blocked">]>>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_addTodo as addTodo };
declare const action_updateTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    baseRevision: z.ZodNumber;
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_updateTodo as updateTodo };
declare const action_editTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    itemId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        dataUrl: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<{
            "image/gif": "image/gif";
            "image/jpeg": "image/jpeg";
            "image/png": "image/png";
            "image/webp": "image/webp";
        }>>;
        name: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    baseFingerprint: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    projectId: z.ZodString;
    projectGeneration: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    revision: z.ZodNumber;
    requirementRevision: z.ZodNumber;
    requirementFingerprint: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_editTodo as editTodo };
declare const action_updateStatus: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    status: z.ZodUnion<readonly [z.ZodLiteral<"todo">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"done">, z.ZodLiteral<"blocked">]>;
    baseRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_updateStatus as updateStatus };
declare const action_toggleTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    baseRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_toggleTodo as toggleTodo };
declare const action_removeTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    baseRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_removeTodo as removeTodo };
declare const action_clearCompleted: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        baseRevision: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_clearCompleted as clearCompleted };
declare const action_generateSuggestions: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    addedCount: z.ZodNumber;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_generateSuggestions as generateSuggestions };
declare const action_feedback: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodString;
    itemId: z.ZodString;
    status: z.ZodUnion<readonly [z.ZodLiteral<"todo">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"done">, z.ZodLiteral<"blocked">]>;
    conclusion: z.ZodString;
    requirementRevision: z.ZodOptional<z.ZodNumber>;
    requestId: z.ZodOptional<z.ZodString>;
    execution: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_feedback as feedback };
declare const action_importTodos: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_importTodos as importTodos };
declare const action_delegateTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    itemId: z.ZodString;
    goal: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    businessKey: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_delegateTodo as delegateTodo };
declare const action_bindExecution: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodString;
    todoId: z.ZodString;
    requestId: z.ZodString;
    receipt: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_bindExecution as bindExecution };
declare const action_productionRequest: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    todoId: z.ZodString;
    brief: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
    batch: z.ZodOptional<z.ZodJSONSchema>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { action_productionRequest as productionRequest };
export declare const queries: {
    todos: import("@dsh-workbench/runtime").NoteOperation<z.ZodUnion<readonly [z.ZodOptional<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        q: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            blocked: "blocked";
            done: "done";
            in_progress: "in_progress";
            todo: "todo";
        }>>;
    }, z.core.$strict>>>, z.ZodOptional<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        view: z.ZodLiteral<"text">;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        q: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            blocked: "blocked";
            done: "done";
            in_progress: "in_progress";
            todo: "todo";
        }>>;
    }, z.core.$strict>>>]>, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            projectId: z.ZodString;
            projectGeneration: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            status: z.ZodEnum<{
                blocked: "blocked";
                done: "done";
                in_progress: "in_progress";
                todo: "todo";
            }>;
            completed: z.ZodOptional<z.ZodBoolean>;
            priority: z.ZodEnum<{
                high: "high";
                low: "low";
                medium: "medium";
            }>;
            category: z.ZodOptional<z.ZodString>;
            dueDate: z.ZodOptional<z.ZodString>;
            taskId: z.ZodOptional<z.ZodString>;
            delegationId: z.ZodOptional<z.ZodString>;
            productionId: z.ZodOptional<z.ZodString>;
            revision: z.ZodNumber;
            requirementRevision: z.ZodNumber;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            title: z.ZodString;
            titleTruncated: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            descriptionTruncated: z.ZodOptional<z.ZodBoolean>;
            conclusion: z.ZodOptional<z.ZodString>;
            conclusionTruncated: z.ZodOptional<z.ZodBoolean>;
            imageCount: z.ZodNumber;
            imageNames: z.ZodArray<z.ZodString>;
            hasDelivery: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            projectId: z.ZodString;
            projectGeneration: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            status: z.ZodEnum<{
                blocked: "blocked";
                done: "done";
                in_progress: "in_progress";
                todo: "todo";
            }>;
            completed: z.ZodOptional<z.ZodBoolean>;
            priority: z.ZodEnum<{
                high: "high";
                low: "low";
                medium: "medium";
            }>;
            category: z.ZodOptional<z.ZodString>;
            dueDate: z.ZodOptional<z.ZodString>;
            taskId: z.ZodOptional<z.ZodString>;
            delegationId: z.ZodOptional<z.ZodString>;
            productionId: z.ZodOptional<z.ZodString>;
            revision: z.ZodNumber;
            requirementRevision: z.ZodNumber;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>]>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
        projectId: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        filter: z.ZodOptional<z.ZodEnum<{
            active: "active";
            all: "all";
            completed: "completed";
        }>>;
    }, z.core.$loose>, {}>>>;
    todo: import("@dsh-workbench/runtime").NoteOperation<z.ZodUnion<readonly [z.ZodOptional<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
    }, z.core.$strict>>>, z.ZodOptional<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        view: z.ZodLiteral<"history">;
        historyCursor: z.ZodOptional<z.ZodString>;
        historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>]>, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        item: z.ZodObject<{
            projectId: z.ZodString;
            projectGeneration: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            status: z.ZodEnum<{
                blocked: "blocked";
                done: "done";
                in_progress: "in_progress";
                todo: "todo";
            }>;
            completed: z.ZodOptional<z.ZodBoolean>;
            priority: z.ZodEnum<{
                high: "high";
                low: "low";
                medium: "medium";
            }>;
            category: z.ZodOptional<z.ZodString>;
            dueDate: z.ZodOptional<z.ZodString>;
            taskId: z.ZodOptional<z.ZodString>;
            delegationId: z.ZodOptional<z.ZodString>;
            productionId: z.ZodOptional<z.ZodString>;
            revision: z.ZodNumber;
            requirementRevision: z.ZodNumber;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                dataUrl: z.ZodString;
                type: z.ZodOptional<z.ZodEnum<{
                    "image/gif": "image/gif";
                    "image/jpeg": "image/jpeg";
                    "image/png": "image/png";
                    "image/webp": "image/webp";
                }>>;
                name: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            conclusion: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        requirementFingerprint: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        history: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            projectId: z.ZodString;
            itemId: z.ZodString;
            kind: z.ZodLiteral<"todo">;
            event: z.ZodString;
            revision: z.ZodNumber;
            payload: z.ZodJSONSchema;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodOptional<z.ZodString>;
        historyLimit: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>]>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
        projectId: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        filter: z.ZodOptional<z.ZodEnum<{
            active: "active";
            all: "all";
            completed: "completed";
        }>>;
    }, z.core.$loose>, {}>>>;
    categories: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            category: z.ZodString;
            count: z.ZodNumber;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
        projectId: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        filter: z.ZodOptional<z.ZodEnum<{
            active: "active";
            all: "all";
            completed: "completed";
        }>>;
    }, z.core.$loose>, {}>>>;
    workflowStatus: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        counts: z.ZodObject<{
            todos: z.ZodNumber;
            todo: z.ZodNumber;
            inProgress: z.ZodNumber;
            done: z.ZodNumber;
            blocked: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
        projectId: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        filter: z.ZodOptional<z.ZodEnum<{
            active: "active";
            all: "all";
            completed: "completed";
        }>>;
    }, z.core.$loose>, {}>>>;
};
export { action_feedback as todoFeedback };
declare const cardGameLinkAction: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    kind: z.ZodEnum<{
        asset: "asset";
        card: "card";
        knowledge: "knowledge";
        preview: "preview";
        production: "production";
        todo: "todo";
    }>;
    id: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    anchor: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    intent: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodString, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
    projectId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    filter: z.ZodOptional<z.ZodEnum<{
        active: "active";
        all: "all";
        completed: "completed";
    }>>;
}, z.core.$loose>, {}>>>;
export { cardGameLinkAction as cardGameLink };
export { events, background, upsertExternalItem, requestDelegation, recordProgress, importItems, moveTodo, addTodo as addLocalTodo, editTodo as editLocalTodo, updateStatus as updateLocalTodoStatus, toggleTodo as toggleLocalTodo, removeTodo as removeLocalTodo, clearCompleted as clearLocalCompleted, generateSuggestions as generateLocalSuggestions, feedback as feedbackLocalTodo } from './local-todo-operations';
export { action_addTodo as addCardGameTodo, action_createTodo as createCardGameTodo, action_updateTodo as updateCardGameTodo, action_updateStatus as updateCardGameTodoStatus, action_toggleTodo as toggleCardGameTodo, action_removeTodo as removeCardGameTodo, action_clearCompleted as clearCardGameCompleted, action_generateSuggestions as generateCardGameSuggestions, action_delegateTodo as delegateCardGameTodo, action_editTodo as editCardGameTodo, action_feedback as feedbackCardGame, action_feedback as todoFeedbackCardGame };
