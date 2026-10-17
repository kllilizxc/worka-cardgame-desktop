import { z } from '@dsh-workbench/runtime';
import type { NoteActionContext, NoteQueryContext } from "@dsh-workbench/runtime";
export { note } from "./note-model";
export type { AssetData, AssetFilters, AssetItem, BacklinkItem, CardData, CardItem, CardGameConfig, CardGameNotes, ContentKind, ContentList, ContentRef, DirectoryItem, DocumentData, DocumentMeta, DocumentItem, GraphData, LibraryItem, LibraryMode, LibraryState, MediaData, MovePreviewData, RecentChangeItem, RecentChangesData, ReferenceResource, StatusData, VersionItem, } from "./content-model";
declare const action_pinReference: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    kind: z.ZodString;
    id: z.ZodString;
    anchor: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    revision: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_pinReference as pinReference };
declare const action_removePinnedReference: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    key: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_removePinnedReference as removePinnedReference };
declare const action_discussAudio: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_discussAudio as discussAudio };
declare const action_discussSelection: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    itemIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_discussSelection as discussSelection };
declare const action_addResource: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_addResource as addResource };
declare const action_prepareBattleExperiment: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    fresh: z.ZodOptional<z.ZodBoolean>;
    candidate: z.ZodOptional<z.ZodObject<{
        productionId: z.ZodString;
        candidateId: z.ZodString;
        candidateHash: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_prepareBattleExperiment as prepareBattleExperiment };
declare const action_stopBattleExperiment: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_stopBattleExperiment as stopBattleExperiment };
declare const action_analyzeStoryPaths: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    expectedRevision: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_analyzeStoryPaths as analyzeStoryPaths };
declare const action_saveDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_saveDocument as saveDocument };
declare const action_moveDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_moveDocument as moveDocument };
declare const action_updateCard: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_updateCard as updateCard };
declare const action_updateAsset: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_updateAsset as updateAsset };
declare const action_registerCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
declare const action_adoptVersion: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_adoptVersion as adoptVersion };
declare const action_compileStory: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_compileStory as compileStory };
declare const action_stageStoryCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_stageStoryCandidate as stageStoryCandidate };
declare const action_stageDocumentsCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_stageDocumentsCandidate as stageDocumentsCandidate };
declare const action_rejectAssetVersion: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    assetId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_rejectAssetVersion as rejectAssetVersion };
declare const action_createCardWorkflow: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    itemIds: z.ZodArray<z.ZodString>;
    featureId: z.ZodString;
    draft: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    expectedRevision: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_createCardWorkflow as createCardWorkflow };
declare const action_switchCardTheme: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    themeId: z.ZodString;
    expectedRevision: z.ZodString;
}, z.core.$loose>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
export { action_switchCardTheme as switchCardTheme };
export declare const queries: {
    pinnedReferenceTarget: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    pinnedReferences: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    battleExperiments: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    battleSources: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    battleComparison: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    storyExecutionReport: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    candidateDiff: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    balanceOverview: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    gameDeck: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    gameCatalog: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    storyAnalysis: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    featureChoices: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    status: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    documents: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    directories: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    document: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    documentMeta: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    referenceDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    backlinks: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    graph: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    movePreview: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    cards: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    card: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    assets: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    asset: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    versions: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    inspection: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    recentChanges: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    storyBuilds: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    storyScenePage: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
    media: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodJSONSchema>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>, z.ZodJSONSchema, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        views: z.ZodOptional<z.ZodObject<{
            storySelection: z.ZodOptional<z.ZodString>;
            storyNodeSelection: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                nodeId: z.ZodString;
            }, z.core.$strip>>;
            balanceMetricSelection: z.ZodOptional<z.ZodObject<{
                kind: z.ZodString;
                metric: z.ZodEnum<{
                    attack: "attack";
                    health: "health";
                }>;
            }, z.core.$strip>>;
            battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            knowledge: z.ZodOptional<z.ZodEnum<{
                reader: "reader";
                source: "source";
            }>>;
            knowledgeSelection: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodString;
            }, z.core.$strip>>;
            cards: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                table: "table";
            }>>;
            cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
            assets: z.ZodOptional<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            assetsSelection: z.ZodOptional<z.ZodString>;
            assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
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
};
export declare const setViewState: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    patch: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    expectedRevision: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
/** Explicit owner selection binds this desktop; imported config never grants filesystem access. */
export declare const configureProject: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    root: z.ZodString;
}, z.core.$strip>, z.ZodJSONSchema, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    views: z.ZodOptional<z.ZodObject<{
        storySelection: z.ZodOptional<z.ZodString>;
        storyNodeSelection: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            nodeId: z.ZodString;
        }, z.core.$strip>>;
        balanceMetricSelection: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            metric: z.ZodEnum<{
                attack: "attack";
                health: "health";
            }>;
        }, z.core.$strip>>;
        battleComparisonSelection: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        knowledge: z.ZodOptional<z.ZodEnum<{
            reader: "reader";
            source: "source";
        }>>;
        knowledgeSelection: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodString;
        }, z.core.$strip>>;
        cards: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            table: "table";
        }>>;
        cardsSelection: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assets: z.ZodOptional<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        assetsSelection: z.ZodOptional<z.ZodString>;
        assetsFilters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
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
