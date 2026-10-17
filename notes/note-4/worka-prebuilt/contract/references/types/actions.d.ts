import { z } from '@dsh-workbench/runtime';
import type { NoteActionContext } from "@dsh-workbench/runtime";
export { note } from "./note-model";
export interface ProductionState {
    projectId?: string;
    selectedId?: string;
    query?: string;
}
export interface ProductionInput {
    projectId: string;
    productionId?: string;
    id?: string;
    brief: string;
    targetAsset?: Record<string, unknown>;
    pinnedRefs?: Array<Record<string, unknown> | string>;
    batch?: unknown;
    todoId?: string;
}
declare const action_cardWorkflow: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    operation: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_cardWorkflow as cardWorkflow };
declare const action_discussCardBatch: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    cardId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_discussCardBatch as discussCardBatch };
declare const action_upsertRequest: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    brief: z.ZodString;
    targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
    batch: z.ZodOptional<z.ZodJSONSchema>;
    todoId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_upsertRequest as upsertRequest };
declare const action_updateProduction: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    baseRevision: z.ZodNumber;
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_updateProduction as updateProduction };
declare const action_generate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
    newRound: z.ZodOptional<z.ZodBoolean>;
    round: z.ZodOptional<z.ZodNumber>;
    businessKey: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_generate as generate };
declare const action_bindExecution: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    requestId: z.ZodString;
    receipt: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_bindExecution as bindExecution };
declare const action_retry: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_retry as retry };
declare const action_newRound: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_newRound as newRound };
declare const action_receiveResult: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_receiveResult as receiveResult };
declare const action_registerCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    round: z.ZodOptional<z.ZodNumber>;
    candidates: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_registerCandidates as registerCandidates };
declare const action_recordCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    round: z.ZodOptional<z.ZodNumber>;
    candidates: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    requestId: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_recordCandidates as recordCandidates };
declare const action_adoptAsset: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    assetId: z.ZodOptional<z.ZodString>;
    versionId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_adoptAsset as adoptAsset };
declare const action_recordAdoption: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    assetId: z.ZodString;
    versionId: z.ZodString;
    requestId: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_recordAdoption as recordAdoption };
declare const action_bindTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    todoId: z.ZodString;
    productionId: z.ZodString;
    todoBaseRevision: z.ZodOptional<z.ZodNumber>;
    productionBaseRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_bindTodo as bindTodo };
declare const action_rejectCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    baseRevision: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_rejectCandidate as rejectCandidate };
declare const action_linkCompanion: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    baseRevision: z.ZodNumber;
    todoId: z.ZodString;
    sourceCardId: z.ZodString;
    sourceRevision: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export { action_linkCompanion as linkCompanion };
export declare const queries: any;
export declare const setViewState: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    expectedRevision: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodString;
    projectRoot: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        assets: "assets";
        cards: "cards";
        knowledge: "knowledge";
    }>>;
    presentation: z.ZodOptional<z.ZodEnum<{
        balance: "balance";
        changes: "changes";
        story: "story";
    }>>;
    assetScope: z.ZodOptional<z.ZodEnum<{
        art: "art";
        audio: "audio";
    }>>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        title: z.ZodString;
        root: z.ZodOptional<z.ZodString>;
        linkBase: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$loose>, {}>>>;
export declare const events: {
    event0: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodJSONSchema>>;
    event1: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodJSONSchema>>;
    event2: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodJSONSchema>>;
};
