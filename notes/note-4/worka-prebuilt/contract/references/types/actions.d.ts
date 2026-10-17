import { z, type NoteActionContext, type NoteQueryContext } from '@dsh-workbench/runtime';
import { stateSchema } from './note-model';
export { note } from './note-model';
export type ProductionState = z.infer<typeof stateSchema>;
export declare const cardWorkflow: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    operation: z.ZodEnum<{
        approveCardDrafts: "approveCardDrafts";
        assembleCardFaces: "assembleCardFaces";
        attachCardArt: "attachCardArt";
        confirmDeckDraft: "confirmDeckDraft";
        createCardBatch: "createCardBatch";
        integrateCard: "integrateCard";
        prepareDeckArt: "prepareDeckArt";
        requestCardArt: "requestCardArt";
        reuseCardArt: "reuseCardArt";
        saveCardDraft: "saveCardDraft";
        saveDeckPlan: "saveDeckPlan";
        setCardDrafts: "setCardDrafts";
        stageDeckCandidate: "stageDeckCandidate";
    }>;
    productionId: z.ZodOptional<z.ZodString>;
    cardId: z.ZodOptional<z.ZodString>;
    baseRevision: z.ZodOptional<z.ZodNumber>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const upsertRequest: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    brief: z.ZodString;
    targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
    batch: z.ZodOptional<z.ZodJSONSchema>;
    todoId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const updateProduction: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    baseRevision: z.ZodNumber;
    requestId: z.ZodOptional<z.ZodString>;
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const generate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
    newRound: z.ZodOptional<z.ZodBoolean>;
    round: z.ZodOptional<z.ZodNumber>;
    businessKey: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    status: z.ZodString;
    requestId: z.ZodString;
    eventId: z.ZodString;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const retry: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    status: z.ZodString;
    requestId: z.ZodString;
    eventId: z.ZodString;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const newRound: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    status: z.ZodString;
    requestId: z.ZodString;
    eventId: z.ZodString;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const bindExecution: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    requestId: z.ZodString;
    receipt: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const receiveResult: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    requestId: z.ZodString;
    round: z.ZodOptional<z.ZodNumber>;
    revision: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const registerCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    round: z.ZodOptional<z.ZodNumber>;
    candidates: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    status: z.ZodString;
    requestId: z.ZodString;
    eventId: z.ZodString;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const recordCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    round: z.ZodOptional<z.ZodNumber>;
    candidates: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    requestId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const adoptAsset: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    assetId: z.ZodOptional<z.ZodString>;
    versionId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    status: z.ZodString;
    requestId: z.ZodString;
    eventId: z.ZodString;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const recordAdoption: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    assetId: z.ZodString;
    versionId: z.ZodString;
    requestId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const bindTodo: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    todoId: z.ZodString;
    todoBaseRevision: z.ZodOptional<z.ZodNumber>;
    productionBaseRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const rejectCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    baseRevision: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const discussCardBatch: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    cardId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const linkCompanion: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    projectGeneration: z.ZodOptional<z.ZodString>;
    productionId: z.ZodString;
    baseRevision: z.ZodNumber;
    todoId: z.ZodString;
    sourceCardId: z.ZodString;
    sourceRevision: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        brief: z.ZodString;
        status: z.ZodString;
        revision: z.ZodNumber;
        requirementRevision: z.ZodOptional<z.ZodNumber>;
        targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
        batch: z.ZodOptional<z.ZodJSONSchema>;
        todoId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        roundCount: z.ZodOptional<z.ZodNumber>;
        currentRound: z.ZodOptional<z.ZodNumber>;
        candidateCount: z.ZodOptional<z.ZodNumber>;
        gameCandidateCount: z.ZodOptional<z.ZodNumber>;
        rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            requestId: z.ZodString;
            requirementRevision: z.ZodNumber;
            dispatchRevision: z.ZodNumber;
            status: z.ZodString;
            updatedAt: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                conclusion: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    key: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    versionId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNumber>;
                    height: z.ZodOptional<z.ZodNumber>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                    revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                    rejectedAt: z.ZodOptional<z.ZodString>;
                    rejectReason: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>;
        }, z.core.$loose>>>;
        candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            rejectedAt: z.ZodOptional<z.ZodString>;
            rejectReason: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            cardId: z.ZodString;
            fingerprint: z.ZodString;
            status: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                undone: "undone";
            }>;
            deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$loose>>>;
        adoption: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$loose>>;
        candidateRegistration: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
        }, z.core.$loose>>;
        workflowKind: z.ZodOptional<z.ZodString>;
        cardProgress: z.ZodOptional<z.ZodObject<{
            total: z.ZodNumber;
            done: z.ZodNumber;
        }, z.core.$strip>>;
        deckProgress: z.ZodOptional<z.ZodObject<{
            distinctCards: z.ZodNumber;
            totalCopies: z.ZodNumber;
            targetSize: z.ZodNumber;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    revision: z.ZodOptional<z.ZodNumber>;
    stale: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        fingerprint: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strip>>;
    reusedArt: z.ZodOptional<z.ZodBoolean>;
    automaticGeneration: z.ZodOptional<z.ZodBoolean>;
    handoff: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const queries: {
    productionDispatch: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        productionId: z.ZodString;
        requestId: z.ZodString;
        round: z.ZodNumber;
    }, z.core.$loose>, z.ZodRecord<z.ZodString, z.ZodJSONSchema>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    projectBinding: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
        configured: z.ZodBoolean;
        projectId: z.ZodString;
        projectRoot: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    productionContext: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        productionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        feature: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
        todo: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            revision: z.ZodNumber;
            status: z.ZodString;
            productionId: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>;
        source: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            kind: z.ZodString;
            revision: z.ZodString;
            json: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                kind: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                attack: z.ZodOptional<z.ZodNumber>;
                health: z.ZodOptional<z.ZodNumber>;
                effects: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    text: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>>;
                labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                cardFace: z.ZodOptional<z.ZodObject<{
                    artwork: z.ZodOptional<z.ZodJSONSchema>;
                }, z.core.$loose>>;
            }, z.core.$loose>;
        }, z.core.$loose>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    companionChoices: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodObject<{
        features: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
        units: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            kind: z.ZodString;
            revision: z.ZodString;
        }, z.core.$loose>>;
        todos: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            revision: z.ZodNumber;
            status: z.ZodString;
            productionId: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    featureChoices: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    sourceCard: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        kind: z.ZodString;
        revision: z.ZodString;
        json: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            kind: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            attack: z.ZodOptional<z.ZodNumber>;
            health: z.ZodOptional<z.ZodNumber>;
            effects: z.ZodOptional<z.ZodArray<z.ZodObject<{
                text: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
            labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            cardFace: z.ZodOptional<z.ZodObject<{
                artwork: z.ZodOptional<z.ZodJSONSchema>;
            }, z.core.$loose>>;
        }, z.core.$loose>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    cardBatch: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        productionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        production: z.ZodObject<{
            id: z.ZodString;
            projectId: z.ZodString;
            brief: z.ZodString;
            status: z.ZodString;
            revision: z.ZodNumber;
            requirementRevision: z.ZodOptional<z.ZodNumber>;
            targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
            batch: z.ZodOptional<z.ZodJSONSchema>;
            todoId: z.ZodOptional<z.ZodString>;
            featureId: z.ZodOptional<z.ZodString>;
            roundCount: z.ZodOptional<z.ZodNumber>;
            currentRound: z.ZodOptional<z.ZodNumber>;
            candidateCount: z.ZodOptional<z.ZodNumber>;
            gameCandidateCount: z.ZodOptional<z.ZodNumber>;
            rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
                round: z.ZodNumber;
                requestId: z.ZodString;
                requirementRevision: z.ZodNumber;
                dispatchRevision: z.ZodNumber;
                status: z.ZodString;
                updatedAt: z.ZodString;
                result: z.ZodOptional<z.ZodObject<{
                    status: z.ZodString;
                    conclusion: z.ZodOptional<z.ZodString>;
                    error: z.ZodOptional<z.ZodString>;
                    candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        key: z.ZodOptional<z.ZodString>;
                        assetId: z.ZodOptional<z.ZodString>;
                        version: z.ZodOptional<z.ZodString>;
                        versionId: z.ZodOptional<z.ZodString>;
                        sourcePath: z.ZodOptional<z.ZodString>;
                        path: z.ZodOptional<z.ZodString>;
                        mimeType: z.ZodOptional<z.ZodString>;
                        width: z.ZodOptional<z.ZodNumber>;
                        height: z.ZodOptional<z.ZodNumber>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                        rejectedAt: z.ZodOptional<z.ZodString>;
                        rejectReason: z.ZodOptional<z.ZodString>;
                    }, z.core.$loose>>>;
                }, z.core.$loose>>;
            }, z.core.$loose>>>;
            candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                key: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                version: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                sourcePath: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                rejectedAt: z.ZodOptional<z.ZodString>;
                rejectReason: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
            gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                cardId: z.ZodString;
                fingerprint: z.ZodString;
                status: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    undone: "undone";
                }>;
                deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$loose>>>;
            adoption: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                candidateId: z.ZodString;
            }, z.core.$loose>>;
            candidateRegistration: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
            }, z.core.$loose>>;
            workflowKind: z.ZodOptional<z.ZodString>;
            cardProgress: z.ZodOptional<z.ZodObject<{
                total: z.ZodNumber;
                done: z.ZodNumber;
            }, z.core.$strip>>;
            deckProgress: z.ZodOptional<z.ZodObject<{
                distinctCards: z.ZodNumber;
                totalCopies: z.ZodNumber;
                targetSize: z.ZodNumber;
                title: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$loose>;
        batch: z.ZodObject<{
            kind: z.ZodLiteral<"card-generation">;
            schemaVersion: z.ZodLiteral<1>;
            provider: z.ZodLiteral<"codex">;
            cards: z.ZodArray<z.ZodObject<{
                definition: z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodString;
                    kind: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    attack: z.ZodOptional<z.ZodNumber>;
                    health: z.ZodOptional<z.ZodNumber>;
                    effects: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        text: z.ZodOptional<z.ZodString>;
                    }, z.core.$loose>>>;
                    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    cardFace: z.ZodOptional<z.ZodObject<{
                        artwork: z.ZodOptional<z.ZodJSONSchema>;
                    }, z.core.$loose>>;
                }, z.core.$loose>;
                artBrief: z.ZodString;
                sourceRevision: z.ZodOptional<z.ZodString>;
                presentation: z.ZodObject<{
                    themeId: z.ZodEnum<{
                        jade: "jade";
                        scroll: "scroll";
                    }>;
                    zoom: z.ZodNumber;
                    focus: z.ZodNumber;
                }, z.core.$strip>;
                artRequest: z.ZodOptional<z.ZodObject<{
                    id: z.ZodString;
                    fingerprint: z.ZodString;
                    prompt: z.ZodString;
                }, z.core.$strip>>;
                artGeneration: z.ZodOptional<z.ZodObject<{
                    requestId: z.ZodString;
                    status: z.ZodEnum<{
                        failed: "failed";
                        ready: "ready";
                        running: "running";
                        unavailable: "unavailable";
                    }>;
                    startedAt: z.ZodString;
                    error: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>;
                art: z.ZodOptional<z.ZodObject<{
                    id: z.ZodString;
                    revision: z.ZodString;
                    fingerprint: z.ZodString;
                    provider: z.ZodEnum<{
                        codex: "codex";
                        existing: "existing";
                    }>;
                    sourceCardId: z.ZodOptional<z.ZodString>;
                }, z.core.$loose>>;
                assembly: z.ZodOptional<z.ZodObject<{
                    fingerprint: z.ZodString;
                    variants: z.ZodRecord<z.ZodString, z.ZodObject<{
                        previewId: z.ZodString;
                        runtimeId: z.ZodString;
                    }, z.core.$strip>>;
                }, z.core.$strip>>;
            }, z.core.$loose>>;
            deck: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                targetSize: z.ZodNumber;
                entries: z.ZodArray<z.ZodObject<{
                    cardId: z.ZodString;
                    count: z.ZodNumber;
                }, z.core.$strip>>;
                basisBrief: z.ZodString;
                approvedFingerprint: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>;
            draftOrigin: z.ZodOptional<z.ZodEnum<{
                agent: "agent";
                unknown: "unknown";
                user: "user";
            }>>;
            companion: z.ZodOptional<z.ZodObject<{
                cardId: z.ZodString;
                revision: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$loose>;
        stages: z.ZodRecord<z.ZodString, z.ZodString>;
        deckInspection: z.ZodOptional<z.ZodObject<{
            status: z.ZodString;
            next: z.ZodString;
            totalCopies: z.ZodNumber;
            distinctCards: z.ZodNumber;
            targetSize: z.ZodNumber;
            basisChanged: z.ZodBoolean;
            legal: z.ZodBoolean;
            confirmed: z.ZodBoolean;
            changedCardIds: z.ZodArray<z.ZodString>;
            candidateId: z.ZodOptional<z.ZodString>;
            staleCandidateId: z.ZodOptional<z.ZodString>;
            errors: z.ZodArray<z.ZodString>;
            warnings: z.ZodArray<z.ZodString>;
            checkScope: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    cardFaceThemes: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    productions: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        q: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        todoId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            projectId: z.ZodString;
            brief: z.ZodString;
            status: z.ZodString;
            revision: z.ZodNumber;
            requirementRevision: z.ZodOptional<z.ZodNumber>;
            targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
            batch: z.ZodOptional<z.ZodJSONSchema>;
            todoId: z.ZodOptional<z.ZodString>;
            featureId: z.ZodOptional<z.ZodString>;
            roundCount: z.ZodOptional<z.ZodNumber>;
            currentRound: z.ZodOptional<z.ZodNumber>;
            candidateCount: z.ZodOptional<z.ZodNumber>;
            gameCandidateCount: z.ZodOptional<z.ZodNumber>;
            rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
                round: z.ZodNumber;
                requestId: z.ZodString;
                requirementRevision: z.ZodNumber;
                dispatchRevision: z.ZodNumber;
                status: z.ZodString;
                updatedAt: z.ZodString;
                result: z.ZodOptional<z.ZodObject<{
                    status: z.ZodString;
                    conclusion: z.ZodOptional<z.ZodString>;
                    error: z.ZodOptional<z.ZodString>;
                    candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        key: z.ZodOptional<z.ZodString>;
                        assetId: z.ZodOptional<z.ZodString>;
                        version: z.ZodOptional<z.ZodString>;
                        versionId: z.ZodOptional<z.ZodString>;
                        sourcePath: z.ZodOptional<z.ZodString>;
                        path: z.ZodOptional<z.ZodString>;
                        mimeType: z.ZodOptional<z.ZodString>;
                        width: z.ZodOptional<z.ZodNumber>;
                        height: z.ZodOptional<z.ZodNumber>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                        rejectedAt: z.ZodOptional<z.ZodString>;
                        rejectReason: z.ZodOptional<z.ZodString>;
                    }, z.core.$loose>>>;
                }, z.core.$loose>>;
            }, z.core.$loose>>>;
            candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                key: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                version: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                sourcePath: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                rejectedAt: z.ZodOptional<z.ZodString>;
                rejectReason: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
            gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                cardId: z.ZodString;
                fingerprint: z.ZodString;
                status: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    undone: "undone";
                }>;
                deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$loose>>>;
            adoption: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                candidateId: z.ZodString;
            }, z.core.$loose>>;
            candidateRegistration: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
            }, z.core.$loose>>;
            workflowKind: z.ZodOptional<z.ZodString>;
            cardProgress: z.ZodOptional<z.ZodObject<{
                total: z.ZodNumber;
                done: z.ZodNumber;
            }, z.core.$strip>>;
            deckProgress: z.ZodOptional<z.ZodObject<{
                distinctCards: z.ZodNumber;
                totalCopies: z.ZodNumber;
                targetSize: z.ZodNumber;
                title: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$loose>>;
        nextCursor: z.ZodOptional<z.ZodString>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    production: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        productionId: z.ZodString;
        historyCursor: z.ZodOptional<z.ZodString>;
        historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
        production: z.ZodObject<{
            id: z.ZodString;
            projectId: z.ZodString;
            brief: z.ZodString;
            status: z.ZodString;
            revision: z.ZodNumber;
            requirementRevision: z.ZodOptional<z.ZodNumber>;
            targetAsset: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            pinnedRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodString]>>>;
            batch: z.ZodOptional<z.ZodJSONSchema>;
            todoId: z.ZodOptional<z.ZodString>;
            featureId: z.ZodOptional<z.ZodString>;
            roundCount: z.ZodOptional<z.ZodNumber>;
            currentRound: z.ZodOptional<z.ZodNumber>;
            candidateCount: z.ZodOptional<z.ZodNumber>;
            gameCandidateCount: z.ZodOptional<z.ZodNumber>;
            rounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
                round: z.ZodNumber;
                requestId: z.ZodString;
                requirementRevision: z.ZodNumber;
                dispatchRevision: z.ZodNumber;
                status: z.ZodString;
                updatedAt: z.ZodString;
                result: z.ZodOptional<z.ZodObject<{
                    status: z.ZodString;
                    conclusion: z.ZodOptional<z.ZodString>;
                    error: z.ZodOptional<z.ZodString>;
                    candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        key: z.ZodOptional<z.ZodString>;
                        assetId: z.ZodOptional<z.ZodString>;
                        version: z.ZodOptional<z.ZodString>;
                        versionId: z.ZodOptional<z.ZodString>;
                        sourcePath: z.ZodOptional<z.ZodString>;
                        path: z.ZodOptional<z.ZodString>;
                        mimeType: z.ZodOptional<z.ZodString>;
                        width: z.ZodOptional<z.ZodNumber>;
                        height: z.ZodOptional<z.ZodNumber>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                        rejectedAt: z.ZodOptional<z.ZodString>;
                        rejectReason: z.ZodOptional<z.ZodString>;
                    }, z.core.$loose>>>;
                }, z.core.$loose>>;
            }, z.core.$loose>>>;
            candidateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                key: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                version: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                sourcePath: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
                rejectedAt: z.ZodOptional<z.ZodString>;
                rejectReason: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
            gameCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                cardId: z.ZodString;
                fingerprint: z.ZodString;
                status: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    undone: "undone";
                }>;
                deckArtFingerprints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$loose>>>;
            adoption: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
                candidateId: z.ZodString;
            }, z.core.$loose>>;
            candidateRegistration: z.ZodOptional<z.ZodObject<{
                status: z.ZodString;
            }, z.core.$loose>>;
            workflowKind: z.ZodOptional<z.ZodString>;
            cardProgress: z.ZodOptional<z.ZodObject<{
                total: z.ZodNumber;
                done: z.ZodNumber;
            }, z.core.$strip>>;
            deckProgress: z.ZodOptional<z.ZodObject<{
                distinctCards: z.ZodNumber;
                totalCopies: z.ZodNumber;
                targetSize: z.ZodNumber;
                title: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$loose>;
        execution: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            updatedAt: z.ZodOptional<z.ZodString>;
            outcome: z.ZodOptional<z.ZodObject<{
                summary: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>;
            delivery: z.ZodOptional<z.ZodObject<{
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    media: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        src: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        revision: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$loose>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    workflowStatus: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodRecord<z.ZodString, z.ZodJSONSchema>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        selectedId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        cardgameRole: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
};
export declare const setViewState: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    patch: z.ZodObject<{
        query: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        selectedId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    expectedRevision: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const events: {
    generation: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    candidates: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    adoption: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
};
