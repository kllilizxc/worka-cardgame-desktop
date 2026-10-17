export { pinChangeReference, removePinnedReference, discussChange } from './cardgame-operations';
import { z } from '@dsh-workbench/runtime';
export { note } from './model';
export declare const events: {
    archived: Readonly<import("@dsh-workbench/runtime").NoteEvent<z.ZodObject<{
        featureId: z.ZodString;
        title: z.ZodString;
        revision: z.ZodString;
    }, z.core.$strip>>>;
};
export declare const queries: {
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
    resolveExecutionTarget: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        featureId: z.ZodString;
        repository: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    projectChoices: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
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
    summary: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
        serverUrl: z.ZodString;
        status: z.ZodEnum<{
            error: "error";
            running: "running";
            syncing: "syncing";
        }>;
        totalCount: z.ZodNumber;
        activeCount: z.ZodNumber;
        archivedCount: z.ZodNumber;
        errors: z.ZodArray<z.ZodObject<{
            file: z.ZodString;
            error: z.ZodString;
        }, z.core.$strip>>;
        features: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            summary: z.ZodOptional<z.ZodString>;
            next: z.ZodOptional<z.ZodString>;
            archived: z.ZodBoolean;
            totalPrs: z.ZodNumber;
            mergedPrs: z.ZodNumber;
            execution: z.ZodOptional<z.ZodObject<{
                noteId: z.ZodOptional<z.ZodString>;
                delegationId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            links: z.ZodArray<z.ZodObject<{
                repo: z.ZodString;
                repoName: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$loose>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    diagnostics: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
        syncing: z.ZodBoolean;
        runtimeError: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        nextSyncAt: z.ZodNumber;
        ci: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
    view: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
        serverUrl: z.ZodString;
        status: z.ZodEnum<{
            error: "error";
            running: "running";
            syncing: "syncing";
        }>;
        totalCount: z.ZodNumber;
        activeCount: z.ZodNumber;
        archivedCount: z.ZodNumber;
        errors: z.ZodArray<z.ZodObject<{
            file: z.ZodString;
            error: z.ZodString;
        }, z.core.$strip>>;
        features: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            summary: z.ZodOptional<z.ZodString>;
            next: z.ZodOptional<z.ZodString>;
            archived: z.ZodBoolean;
            totalPrs: z.ZodNumber;
            mergedPrs: z.ZodNumber;
            execution: z.ZodOptional<z.ZodObject<{
                noteId: z.ZodOptional<z.ZodString>;
                delegationId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            body: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodOptional<z.ZodString>;
            autoArchived: z.ZodBoolean;
            gameCandidates: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                productionId: z.ZodString;
                cardId: z.ZodOptional<z.ZodString>;
                featureId: z.ZodString;
                kind: z.ZodOptional<z.ZodEnum<{
                    card: "card";
                    deck: "deck";
                    documents: "documents";
                    story: "story";
                }>>;
                targetId: z.ZodOptional<z.ZodString>;
                candidateHash: z.ZodOptional<z.ZodString>;
                targetBaseRevision: z.ZodOptional<z.ZodString>;
                validationManifest: z.ZodOptional<z.ZodString>;
                commit: z.ZodOptional<z.ZodString>;
                status: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    undone: "undone";
                }>;
                previewVerified: z.ZodOptional<z.ZodBoolean>;
                adoptedAt: z.ZodOptional<z.ZodString>;
                undoneAt: z.ZodOptional<z.ZodString>;
                adoptionId: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>;
            links: z.ZodArray<z.ZodObject<{
                repo: z.ZodString;
                repoName: z.ZodString;
                repoNameShort: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                trackingLabel: z.ZodOptional<z.ZodString>;
                mappingIssue: z.ZodOptional<z.ZodString>;
                branches: z.ZodArray<z.ZodString>;
                allPrs: z.ZodArray<z.ZodObject<{
                    number: z.ZodNumber;
                    url: z.ZodString;
                    label: z.ZodString;
                    state: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    tone: z.ZodOptional<z.ZodString>;
                    branch: z.ZodString;
                }, z.core.$strip>>;
                envBranches: z.ZodRecord<z.ZodString, z.ZodObject<{
                    branch: z.ZodString;
                    merge: z.ZodObject<{
                        label: z.ZodString;
                        tone: z.ZodString;
                        stale: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strip>;
                    ci: z.ZodObject<{
                        label: z.ZodString;
                        tone: z.ZodString;
                        stale: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strip>;
                    deploy: z.ZodObject<{
                        label: z.ZodString;
                        tone: z.ZodString;
                        stale: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strip>;
                    prs: z.ZodArray<z.ZodObject<{
                        number: z.ZodNumber;
                        url: z.ZodString;
                        label: z.ZodString;
                        state: z.ZodOptional<z.ZodString>;
                        title: z.ZodString;
                        tone: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    ciLinks: z.ZodArray<z.ZodObject<{
                        url: z.ZodString;
                        label: z.ZodString;
                        title: z.ZodString;
                        tone: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    deploymentLinks: z.ZodArray<z.ZodObject<{
                        url: z.ZodString;
                        label: z.ZodString;
                        title: z.ZodString;
                        tone: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
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
    getFeature: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        revision: z.ZodNullable<z.ZodString>;
        record: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            summary: z.ZodString;
            next: z.ZodString;
            body: z.ZodString;
            links: z.ZodArray<z.ZodObject<{
                repo: z.ZodString;
                branches: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$loose>>;
        registered: z.ZodOptional<z.ZodBoolean>;
        changed: z.ZodOptional<z.ZodBoolean>;
        context: z.ZodObject<{
            plugin: z.ZodString;
            home: z.ZodString;
            guide: z.ZodString;
            cli: z.ZodString;
        }, z.core.$loose>;
        existingFeatures: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            summary: z.ZodOptional<z.ZodString>;
            links: z.ZodArray<z.ZodObject<{
                repo: z.ZodString;
                repository: z.ZodOptional<z.ZodString>;
                branches: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$loose>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        presentation: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$loose>, {}>>>;
};
/** Change the feature archive flag in the authoritative tracker. */
export declare const setArchiveStatus: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    archived: z.ZodBoolean;
}, z.core.$strip>, z.ZodObject<{
    accepted: z.ZodBoolean;
    eventId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
/** The file commit emits a resource event; no duplicate state mirror is written. */
/** Update the authoritative feature using its current baseRevision. */
export declare const recordFeature: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    baseRevision: z.ZodNullable<z.ZodString>;
    patch: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        next: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        links: z.ZodOptional<z.ZodArray<z.ZodObject<{
            repo: z.ZodString;
            branches: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    revision: z.ZodNullable<z.ZodString>;
    record: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        summary: z.ZodString;
        next: z.ZodString;
        body: z.ZodString;
        links: z.ZodArray<z.ZodObject<{
            repo: z.ZodString;
            branches: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>>;
    registered: z.ZodOptional<z.ZodBoolean>;
    changed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const confirmGameCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    featureId: z.ZodString;
    candidateHash: z.ZodString;
    targetBaseRevision: z.ZodString;
    validationManifest: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    candidate: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        productionId: z.ZodString;
        cardId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodString;
        kind: z.ZodOptional<z.ZodEnum<{
            card: "card";
            deck: "deck";
            documents: "documents";
            story: "story";
        }>>;
        targetId: z.ZodOptional<z.ZodString>;
        candidateHash: z.ZodOptional<z.ZodString>;
        targetBaseRevision: z.ZodOptional<z.ZodString>;
        validationManifest: z.ZodOptional<z.ZodString>;
        commit: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            undone: "undone";
        }>;
        previewVerified: z.ZodOptional<z.ZodBoolean>;
        adoptedAt: z.ZodOptional<z.ZodString>;
        undoneAt: z.ZodOptional<z.ZodString>;
        adoptionId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    production: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$loose>>;
    adoptionId: z.ZodOptional<z.ZodString>;
    reused: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const undoGameCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    projectId: z.ZodString;
    productionId: z.ZodString;
    candidateId: z.ZodString;
    featureId: z.ZodString;
    candidateHash: z.ZodString;
    targetBaseRevision: z.ZodString;
    validationManifest: z.ZodString;
    adoptionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    candidate: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        productionId: z.ZodString;
        cardId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodString;
        kind: z.ZodOptional<z.ZodEnum<{
            card: "card";
            deck: "deck";
            documents: "documents";
            story: "story";
        }>>;
        targetId: z.ZodOptional<z.ZodString>;
        candidateHash: z.ZodOptional<z.ZodString>;
        targetBaseRevision: z.ZodOptional<z.ZodString>;
        validationManifest: z.ZodOptional<z.ZodString>;
        commit: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            undone: "undone";
        }>;
        previewVerified: z.ZodOptional<z.ZodBoolean>;
        adoptedAt: z.ZodOptional<z.ZodString>;
        undoneAt: z.ZodOptional<z.ZodString>;
        adoptionId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    production: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$loose>>;
    adoptionId: z.ZodOptional<z.ZodString>;
    reused: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
/** The host keeps monitoring alive without retaining an idle note worker. */
export declare const background: import("@dsh-workbench/runtime").BoundBackground;
export declare const refresh: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
    accepted: z.ZodBoolean;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const receiveDeliveryFailure: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
export declare const setViewState: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    expectedRevision: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>, import("@dsh-workbench/runtime").NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>>>;
