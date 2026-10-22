import { z } from '@dsh-workbench/runtime';
import type { NoteActionContext, NoteQueryContext } from "@dsh-workbench/runtime";
export { note } from "./model";
export type { AssetData, AssetFilters, AssetItem, BacklinkItem, CardData, CardItem, CardGameConfig, CardGameNotes, ContentKind, ContentList, ContentRef, DirectoryItem, DocumentData, DocumentMeta, DocumentItem, GraphData, LibraryItem, LibraryMode, LibraryState, MediaData, MovePreviewData, RecentChangeItem, RecentChangesData, ReferenceResource, StatusData, VersionItem, } from "./content-model";
declare const action_pinReference: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    kind: z.ZodString;
    id: z.ZodString;
    anchor: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    revision: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        projectId: z.ZodString;
        kind: z.ZodString;
        id: z.ZodString;
        revision: z.ZodString;
        title: z.ZodString;
        anchor: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        freshness: z.ZodOptional<z.ZodEnum<{
            current: "current";
            stale: "stale";
            unavailable: "unavailable";
        }>>;
        currentRevision: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    limit: z.ZodNumber;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strict>, z.ZodObject<{
    removed: z.ZodLiteral<true>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_discussAudio: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    title: z.ZodString;
    path: z.ZodString;
    root: z.ZodOptional<z.ZodString>;
    linkBase: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    snapshotId: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_stopBattleExperiment: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strict>, z.ZodObject<{
    stopped: z.ZodLiteral<true>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strict>, z.ZodObject<{
    status: z.ZodEnum<{
        failed: "failed";
        idle: "idle";
        interrupted: "interrupted";
        running: "running";
        succeeded: "succeeded";
    }>;
    startedAt: z.ZodOptional<z.ZodString>;
    finishedAt: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    report: z.ZodOptional<z.ZodObject<{
        storyId: z.ZodString;
        storyRevision: z.ZodString;
        runtimeRevision: z.ZodString;
        createdAt: z.ZodString;
        exploredStates: z.ZodNumber;
        totalNodes: z.ZodNumber;
        reachedNodeIds: z.ZodArray<z.ZodString>;
        unvisitedNodeIds: z.ZodArray<z.ZodString>;
        stateLimit: z.ZodNumber;
        depthLimit: z.ZodNumber;
        bounded: z.ZodBoolean;
        depthCutoffs: z.ZodNumber;
        stateCutoffs: z.ZodNumber;
        externalStops: z.ZodNumber;
        errors: z.ZodNumber;
        witnesses: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            nodeId: z.ZodString;
            path: z.ZodArray<z.ZodString>;
            detail: z.ZodOptional<z.ZodString>;
            state: z.ZodJSONSchema;
        }, z.core.$strip>>;
        blockedExamples: z.ZodArray<z.ZodObject<{
            choiceId: z.ZodString;
            nodeId: z.ZodString;
            reason: z.ZodString;
            path: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
        limits: z.ZodArray<z.ZodString>;
        initialState: z.ZodJSONSchema;
    }, z.core.$strip>>;
    currentStoryRevision: z.ZodOptional<z.ZodString>;
    contentMatches: z.ZodOptional<z.ZodBoolean>;
    runtimeFreshness: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_saveDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    expectedRevision: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"document">;
    size: z.ZodNumber;
    links: z.ZodArray<z.ZodObject<{
        targetPath: z.ZodString;
        targetKind: z.ZodEnum<{
            asset: "asset";
            card: "card";
            document: "document";
            external: "external";
            unknown: "unknown";
        }>;
        targetId: z.ZodOptional<z.ZodString>;
        anchor: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        line: z.ZodNumber;
        rawTarget: z.ZodString;
    }, z.core.$strip>>;
    updatedAt: z.ZodOptional<z.ZodString>;
    snippet: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_moveDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    toPath: z.ZodString;
    expectedRevision: z.ZodOptional<z.ZodString>;
    expectedRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    updateLinks: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodLiteral<"document">;
        size: z.ZodNumber;
        links: z.ZodArray<z.ZodObject<{
            targetPath: z.ZodString;
            targetKind: z.ZodEnum<{
                asset: "asset";
                card: "card";
                document: "document";
                external: "external";
                unknown: "unknown";
            }>;
            targetId: z.ZodOptional<z.ZodString>;
            anchor: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            line: z.ZodNumber;
            rawTarget: z.ZodString;
        }, z.core.$strip>>;
        updatedAt: z.ZodOptional<z.ZodString>;
        snippet: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    toPath: z.ZodString;
    affected: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        changed: z.ZodBoolean;
        changedLinks: z.ZodNumber;
    }, z.core.$strip>>;
    conflicts: z.ZodArray<z.ZodString>;
    canApply: z.ZodBoolean;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_updateCard: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    card: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    patch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    expectedRevision: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"card">;
    name: z.ZodString;
    kind: z.ZodString;
    attack: z.ZodOptional<z.ZodNumber>;
    health: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    rarity: z.ZodOptional<z.ZodString>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    facePreview: z.ZodOptional<z.ZodString>;
    json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_updateAsset: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expectedMetadataRevision: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"asset">;
    kind: z.ZodEnum<{
        audio: "audio";
        image: "image";
        other: "other";
        spritesheet: "spritesheet";
    }>;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadataRevision: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentVersionId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        assetId: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        source: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            project: "project";
        }>;
        candidateId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        createdAt: z.ZodString;
        adopted: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_registerCandidates: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    candidates: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        fileName: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        base64: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    }, z.core.$strip>>;
    autoAdopt: z.ZodOptional<z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    }, z.core.$strip>>;
}, z.core.$strict>, z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    metadata: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    status: z.ZodOptional<z.ZodString>;
    assetId: z.ZodOptional<z.ZodString>;
    versionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_adoptVersion: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    candidateId: z.ZodOptional<z.ZodString>;
    versionId: z.ZodOptional<z.ZodString>;
    assetId: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"asset">;
    kind: z.ZodEnum<{
        audio: "audio";
        image: "image";
        other: "other";
        spritesheet: "spritesheet";
    }>;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadataRevision: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentVersionId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        assetId: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        source: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            project: "project";
        }>;
        candidateId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        createdAt: z.ZodString;
        adopted: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_compileStory: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    entry: z.ZodString;
    storyId: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    storyId: z.ZodString;
    outputPath: z.ZodString;
    catalogUpdated: z.ZodBoolean;
    nodeCount: z.ZodNumber;
    choiceCount: z.ZodNumber;
    diagnostics: z.ZodArray<z.ZodObject<{
        severity: z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>;
        path: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        detail: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_stageStoryCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    featureId: z.ZodString;
    storyId: z.ZodString;
    entryPath: z.ZodString;
    brief: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    referenceDocuments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        candidateId: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>>>;
    npcs: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    items: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    shops: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    recipes: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    quests: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    copyEdits: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
    launch: z.ZodOptional<z.ZodObject<{
        hubPath: z.ZodString;
        locationId: z.ZodString;
        actionId: z.ZodString;
        label: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strict>, z.ZodObject<{
    candidate: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        productionId: z.ZodString;
        candidateHash: z.ZodString;
        commit: z.ZodString;
        status: z.ZodString;
    }, z.core.$strip>;
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$strip>;
    reused: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
declare const action_stageDocumentsCandidate: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    featureId: z.ZodString;
    brief: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strict>, z.ZodObject<{
    candidate: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        productionId: z.ZodString;
        candidateHash: z.ZodString;
        commit: z.ZodString;
        status: z.ZodString;
    }, z.core.$strip>;
    production: z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$strip>;
    reused: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    reverted: z.ZodBoolean;
    versionId: z.ZodOptional<z.ZodString>;
    todoId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
    projectGeneration: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    noteId: z.ZodString;
    itemId: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"card">;
    name: z.ZodString;
    kind: z.ZodString;
    attack: z.ZodOptional<z.ZodNumber>;
    health: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    rarity: z.ZodOptional<z.ZodString>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    facePreview: z.ZodOptional<z.ZodString>;
    json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
    preferences: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    overview: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
        summary: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            status: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    cardEditInput: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        text: z.ZodString;
        featureId: z.ZodString;
        itemId: z.ZodString;
        projectId: z.ZodString;
        projectGeneration: z.ZodString;
        revision: z.ZodString;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    pinnedReferenceTarget: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        kind: z.ZodString;
        id: z.ZodString;
        anchor: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        key: z.ZodString;
        projectId: z.ZodString;
        kind: z.ZodString;
        id: z.ZodString;
        revision: z.ZodString;
        title: z.ZodString;
        anchor: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        freshness: z.ZodOptional<z.ZodEnum<{
            current: "current";
            stale: "stale";
            unavailable: "unavailable";
        }>>;
        currentRevision: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    pinnedReferences: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            projectId: z.ZodString;
            kind: z.ZodString;
            id: z.ZodString;
            revision: z.ZodString;
            title: z.ZodString;
            anchor: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            freshness: z.ZodOptional<z.ZodEnum<{
                current: "current";
                stale: "stale";
                unavailable: "unavailable";
            }>>;
            currentRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        limit: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    battleExperiments: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        status: z.ZodString;
        experiment: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            snapshotId: z.ZodString;
            contentRevision: z.ZodString;
            sourceRevision: z.ZodString;
            runtimeRevision: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                kind: z.ZodLiteral<"registered-project">;
            }, z.core.$strip>, z.ZodObject<{
                productionId: z.ZodString;
                candidateId: z.ZodString;
                candidateHash: z.ZodString;
                kind: z.ZodLiteral<"candidate">;
                commit: z.ZodString;
            }, z.core.$strip>]>>;
            createdAt: z.ZodString;
            error: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        reports: z.ZodArray<z.ZodObject<{
            experimentId: z.ZodString;
            reportId: z.ZodString;
            source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                kind: z.ZodLiteral<"registered-project">;
            }, z.core.$strip>, z.ZodObject<{
                productionId: z.ZodString;
                candidateId: z.ZodString;
                candidateHash: z.ZodString;
                kind: z.ZodLiteral<"candidate">;
                commit: z.ZodString;
            }, z.core.$strip>]>>;
            report: z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                createdAt: z.ZodString;
                settings: z.ZodObject<{
                    deckId: z.ZodString;
                    encounterId: z.ZodString;
                    policyVersion: z.ZodString;
                    seeds: z.ZodArray<z.ZodNumber>;
                    turnLimit: z.ZodNumber;
                    actionLimit: z.ZodNumber;
                    opening: z.ZodLiteral<"player-first">;
                }, z.core.$strip>;
                settingsHash: z.ZodString;
                contentRevision: z.ZodString;
                runtimeRevision: z.ZodString;
                adapterVersion: z.ZodString;
                deckCardIds: z.ZodArray<z.ZodString>;
                trials: z.ZodArray<z.ZodObject<{
                    seed: z.ZodNumber;
                    result: z.ZodOptional<z.ZodObject<{
                        outcome: z.ZodEnum<{
                            defeat: "defeat";
                            draw: "draw";
                            incomplete: "incomplete";
                            victory: "victory";
                        }>;
                        turns: z.ZodNumber;
                        actions: z.ZodNumber;
                        reason: z.ZodOptional<z.ZodString>;
                        playedCardIds: z.ZodArray<z.ZodString>;
                        finalStateHash: z.ZodString;
                    }, z.core.$strip>>;
                    error: z.ZodOptional<z.ZodString>;
                    cancelled: z.ZodOptional<z.ZodLiteral<true>>;
                }, z.core.$strip>>;
                summary: z.ZodObject<{
                    requested: z.ZodNumber;
                    executed: z.ZodNumber;
                    valid: z.ZodNumber;
                    decisive: z.ZodNumber;
                    victories: z.ZodNumber;
                    defeats: z.ZodNumber;
                    draws: z.ZodNumber;
                    incomplete: z.ZodNumber;
                    failed: z.ZodNumber;
                    cancelled: z.ZodBoolean;
                    victoryRate: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strip>;
            }, z.core.$strip>;
            projectCheck: z.ZodObject<{
                status: z.ZodString;
                checkedAt: z.ZodString;
                scope: z.ZodString;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        reportScope: z.ZodLiteral<"historical-snapshot">;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    battleSources: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            productionId: z.ZodString;
            candidateId: z.ZodString;
            candidateHash: z.ZodString;
            commit: z.ZodString;
            kind: z.ZodString;
            targetId: z.ZodString;
            status: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    battleComparison: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        before: z.ZodObject<{
            experimentId: z.ZodString;
            reportId: z.ZodString;
        }, z.core.$strip>;
        after: z.ZodObject<{
            experimentId: z.ZodString;
            reportId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        before: z.ZodObject<{
            experimentId: z.ZodString;
            reportId: z.ZodString;
        }, z.core.$strip>;
        after: z.ZodObject<{
            experimentId: z.ZodString;
            reportId: z.ZodString;
        }, z.core.$strip>;
        settings: z.ZodObject<{
            deckId: z.ZodString;
            encounterId: z.ZodString;
            policyVersion: z.ZodString;
            seeds: z.ZodArray<z.ZodNumber>;
            turnLimit: z.ZodNumber;
            actionLimit: z.ZodNumber;
            opening: z.ZodLiteral<"player-first">;
        }, z.core.$strip>;
        pairs: z.ZodArray<z.ZodObject<{
            seed: z.ZodNumber;
            before: z.ZodEnum<{
                defeat: "defeat";
                draw: "draw";
                incomplete: "incomplete";
                victory: "victory";
            }>;
            after: z.ZodEnum<{
                defeat: "defeat";
                draw: "draw";
                incomplete: "incomplete";
                victory: "victory";
            }>;
        }, z.core.$strip>>;
        excludedSeeds: z.ZodArray<z.ZodNumber>;
        pairedCount: z.ZodNumber;
        beforeVictoryRate: z.ZodNullable<z.ZodNumber>;
        afterVictoryRate: z.ZodNullable<z.ZodNumber>;
        beforeVersion: z.ZodObject<{
            content: z.ZodString;
            runtime: z.ZodString;
        }, z.core.$strip>;
        afterVersion: z.ZodObject<{
            content: z.ZodString;
            runtime: z.ZodString;
        }, z.core.$strip>;
        interpretation: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    storyExecutionReport: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        status: z.ZodEnum<{
            failed: "failed";
            idle: "idle";
            interrupted: "interrupted";
            running: "running";
            succeeded: "succeeded";
        }>;
        startedAt: z.ZodOptional<z.ZodString>;
        finishedAt: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        report: z.ZodOptional<z.ZodObject<{
            storyId: z.ZodString;
            storyRevision: z.ZodString;
            runtimeRevision: z.ZodString;
            createdAt: z.ZodString;
            exploredStates: z.ZodNumber;
            totalNodes: z.ZodNumber;
            reachedNodeIds: z.ZodArray<z.ZodString>;
            unvisitedNodeIds: z.ZodArray<z.ZodString>;
            stateLimit: z.ZodNumber;
            depthLimit: z.ZodNumber;
            bounded: z.ZodBoolean;
            depthCutoffs: z.ZodNumber;
            stateCutoffs: z.ZodNumber;
            externalStops: z.ZodNumber;
            errors: z.ZodNumber;
            witnesses: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                nodeId: z.ZodString;
                path: z.ZodArray<z.ZodString>;
                detail: z.ZodOptional<z.ZodString>;
                state: z.ZodJSONSchema;
            }, z.core.$strip>>;
            blockedExamples: z.ZodArray<z.ZodObject<{
                choiceId: z.ZodString;
                nodeId: z.ZodString;
                reason: z.ZodString;
                path: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>;
            limits: z.ZodArray<z.ZodString>;
            initialState: z.ZodJSONSchema;
        }, z.core.$strip>>;
        currentStoryRevision: z.ZodOptional<z.ZodString>;
        contentMatches: z.ZodOptional<z.ZodBoolean>;
        runtimeFreshness: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    candidateDiff: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        productionId: z.ZodString;
        candidateId: z.ZodString;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        candidateId: z.ZodString;
        candidateHash: z.ZodString;
        commit: z.ZodString;
        status: z.ZodString;
        targetBaseRevision: z.ZodString;
        currentBaseRevision: z.ZodString;
        baseCurrent: z.ZodBoolean;
        comparison: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            changed: z.ZodBoolean;
            binary: z.ZodBoolean;
            truncated: z.ZodBoolean;
            beforeRevision: z.ZodNullable<z.ZodString>;
            afterRevision: z.ZodNullable<z.ZodString>;
            beforeBytes: z.ZodNumber;
            afterBytes: z.ZodNumber;
            before: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            after: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    balanceOverview: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        revision: z.ZodString;
        cardCount: z.ZodNumber;
        groups: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            count: z.ZodNumber;
            attack: z.ZodNullable<z.ZodObject<{
                sample: z.ZodNumber;
                min: z.ZodNumber;
                max: z.ZodNumber;
                mean: z.ZodNumber;
            }, z.core.$strip>>;
            health: z.ZodNullable<z.ZodObject<{
                sample: z.ZodNumber;
                min: z.ZodNumber;
                max: z.ZodNumber;
                mean: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        measurement: z.ZodLiteral<"definitions">;
        battleReport: z.ZodNull;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    gameDeck: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        cards: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            count: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            missing: z.ZodBoolean;
        }, z.core.$strip>>;
        total: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    gameCatalog: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        kind: z.ZodEnum<{
            deck: "deck";
            encounter: "encounter";
            story: "story";
        }>;
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            kind: z.ZodString;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    storyAnalysis: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        nodeId: z.ZodOptional<z.ZodString>;
        expectedRevision: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        selectedNode: z.ZodObject<{
            id: z.ZodString;
            detail: z.ZodString;
            onEnter: z.ZodArray<z.ZodJSONSchema>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        catalogRevision: z.ZodString;
        title: z.ZodString;
        entry: z.ZodString;
        nodes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            type: z.ZodString;
            summary: z.ZodString;
            chapter: z.ZodString;
            sourceMatch: z.ZodLiteral<"node-id">;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                title: z.ZodString;
                revision: z.ZodString;
            }, z.core.$strip>>;
            sourceCount: z.ZodNumber;
        }, z.core.$strip>>;
        edges: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            from: z.ZodString;
            to: z.ZodString;
            text: z.ZodString;
            conditional: z.ZodBoolean;
            enabledWhen: z.ZodOptional<z.ZodJSONSchema>;
            visibleWhen: z.ZodOptional<z.ZodJSONSchema>;
            effects: z.ZodOptional<z.ZodArray<z.ZodJSONSchema>>;
        }, z.core.$strip>>;
        findings: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            id: z.ZodString;
            detail: z.ZodString;
        }, z.core.$strip>>;
        terminalIds: z.ZodArray<z.ZodString>;
        reachableCount: z.ZodNumber;
        conditionalCount: z.ZodNumber;
        reachability: z.ZodLiteral<"structural">;
    }, z.core.$strip>]>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    featureChoices: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>>, z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    status: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        projectId: z.ZodString;
        phase: z.ZodEnum<{
            closed: "closed";
            error: "error";
            indexing: "indexing";
            pending: "pending";
            ready: "ready";
        }>;
        indexedAt: z.ZodOptional<z.ZodString>;
        documents: z.ZodNumber;
        directories: z.ZodNumber;
        cards: z.ZodNumber;
        assets: z.ZodNumber;
        errors: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    documents: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"document">;
            size: z.ZodNumber;
            links: z.ZodArray<z.ZodObject<{
                targetPath: z.ZodString;
                targetKind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    external: "external";
                    unknown: "unknown";
                }>;
                targetId: z.ZodOptional<z.ZodString>;
                anchor: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                line: z.ZodNumber;
                rawTarget: z.ZodString;
            }, z.core.$strip>>;
            updatedAt: z.ZodOptional<z.ZodString>;
            snippet: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    directories: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"directory">;
            path: z.ZodString;
            hasChildren: z.ZodOptional<z.ZodBoolean>;
            parentPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    document: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodLiteral<"document">;
        size: z.ZodNumber;
        links: z.ZodArray<z.ZodObject<{
            targetPath: z.ZodString;
            targetKind: z.ZodEnum<{
                asset: "asset";
                card: "card";
                document: "document";
                external: "external";
                unknown: "unknown";
            }>;
            targetId: z.ZodOptional<z.ZodString>;
            anchor: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            line: z.ZodNumber;
            rawTarget: z.ZodString;
        }, z.core.$strip>>;
        updatedAt: z.ZodOptional<z.ZodString>;
        snippet: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    documentMeta: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodString;
        revision: z.ZodString;
        size: z.ZodNumber;
        isScene: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    referenceDocument: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        resourcePath: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>, z.ZodObject<{
        content: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    backlinks: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            sourceId: z.ZodString;
            sourcePath: z.ZodString;
            targetPath: z.ZodString;
            line: z.ZodNumber;
            snippet: z.ZodOptional<z.ZodString>;
            anchor: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    graph: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
        depth: z.ZodOptional<z.ZodNumber>;
        maxNodes: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        nodes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodEnum<{
                asset: "asset";
                document: "document";
            }>;
            depth: z.ZodNumber;
        }, z.core.$strip>>;
        edges: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            targetId: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            targetPath: z.ZodString;
            kind: z.ZodEnum<{
                asset: "asset";
                card: "card";
                document: "document";
                external: "external";
                unknown: "unknown";
            }>;
            anchor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        truncated: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    movePreview: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
        toPath: z.ZodOptional<z.ZodString>;
        targetPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        source: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"document">;
            size: z.ZodNumber;
            links: z.ZodArray<z.ZodObject<{
                targetPath: z.ZodString;
                targetKind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    external: "external";
                    unknown: "unknown";
                }>;
                targetId: z.ZodOptional<z.ZodString>;
                anchor: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                line: z.ZodNumber;
                rawTarget: z.ZodString;
            }, z.core.$strip>>;
            updatedAt: z.ZodOptional<z.ZodString>;
            snippet: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        toPath: z.ZodString;
        affected: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            changed: z.ZodBoolean;
            changedLinks: z.ZodNumber;
        }, z.core.$strip>>;
        conflicts: z.ZodArray<z.ZodString>;
        canApply: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    cards: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"card">;
            name: z.ZodString;
            kind: z.ZodString;
            attack: z.ZodOptional<z.ZodNumber>;
            health: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            facePreview: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    card: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodLiteral<"card">;
        name: z.ZodString;
        kind: z.ZodString;
        attack: z.ZodOptional<z.ZodNumber>;
        health: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        facePreview: z.ZodOptional<z.ZodString>;
        json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    assets: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"asset">;
            kind: z.ZodEnum<{
                audio: "audio";
                image: "image";
                other: "other";
                spritesheet: "spritesheet";
            }>;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadataRevision: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            currentVersionId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                assetId: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                source: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    project: "project";
                }>;
                candidateId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                createdAt: z.ZodString;
                adopted: z.ZodBoolean;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    asset: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodLiteral<"asset">;
        kind: z.ZodEnum<{
            audio: "audio";
            image: "image";
            other: "other";
            spritesheet: "spritesheet";
        }>;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadataRevision: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        currentVersionId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            assetId: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            source: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                project: "project";
            }>;
            candidateId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            createdAt: z.ZodString;
            adopted: z.ZodBoolean;
        }, z.core.$strip>>>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    versions: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        parentPath: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        assetScope: z.ZodOptional<z.ZodEnum<{
            art: "art";
            audio: "audio";
        }>>;
        format: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        rarity: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            assetId: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            source: z.ZodEnum<{
                adopted: "adopted";
                candidate: "candidate";
                project: "project";
            }>;
            candidateId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            createdAt: z.ZodString;
            adopted: z.ZodBoolean;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    inspection: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        kinds: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            "asset-missing-metadata": "asset-missing-metadata";
            "broken-link": "broken-link";
            "card-missing-art": "card-missing-art";
            "orphan-asset": "orphan-asset";
            "scene-dead-end": "scene-dead-end";
        }>>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        findings: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            severity: z.ZodEnum<{
                high: "high";
                info: "info";
                warning: "warning";
            }>;
            ref: z.ZodObject<{
                type: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                }>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            detail: z.ZodString;
        }, z.core.$strip>>;
        counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
        nextCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    recentChanges: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        since: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                asset: "asset";
                card: "card";
                document: "document";
                version: "version";
            }>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            change: z.ZodEnum<{
                created: "created";
                updated: "updated";
            }>;
            at: z.ZodString;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    storyBuilds: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            storyId: z.ZodString;
            entryPath: z.ZodString;
            outputPath: z.ZodString;
            sourcePaths: z.ZodArray<z.ZodString>;
            errorCount: z.ZodNumber;
            warningCount: z.ZodNumber;
            nodeCount: z.ZodNumber;
            choiceCount: z.ZodNumber;
            builtAt: z.ZodString;
        }, z.core.$strip>>;
        next: z.ZodOptional<z.ZodString>;
        revision: z.ZodString;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    storyScenePage: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
        expectedRevision: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        nodeId: z.ZodString;
        title: z.ZodString;
        chapter: z.ZodString;
        summary: z.ZodString;
        dialogueCount: z.ZodNumber;
        offset: z.ZodNumber;
        nextOffset: z.ZodOptional<z.ZodNumber>;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            speakerId: z.ZodString;
            speakerName: z.ZodString;
            text: z.ZodString;
            emotion: z.ZodOptional<z.ZodString>;
            line: z.ZodNumber;
        }, z.core.$strip>>;
        diagnostics: z.ZodArray<z.ZodObject<{
            severity: z.ZodEnum<{
                error: "error";
                warning: "warning";
            }>;
            path: z.ZodString;
            line: z.ZodOptional<z.ZodNumber>;
            detail: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    media: import("@dsh-workbench/runtime").NoteOperation<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        assetId: z.ZodOptional<z.ZodString>;
        freshKind: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodEnum<{
            original: "original";
            thumbnail: "thumbnail";
            waveform: "waveform";
        }>>;
        from: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        versionId: z.ZodOptional<z.ZodString>;
        variant: z.ZodEnum<{
            original: "original";
            thumbnail: "thumbnail";
            waveform: "waveform";
        }>;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        revision: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        absolutePath: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    }, z.core.$strip>, z.ZodObject<{
        projectGeneration: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>, NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    patch: z.ZodOptional<z.ZodObject<{
        query: z.ZodOptional<z.ZodOptional<z.ZodString>>;
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
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    bookmark: z.ZodOptional<z.ZodObject<{
        key: z.ZodString;
        saved: z.ZodBoolean;
    }, z.core.$strip>>;
    filter: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        kind: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodString>;
        minWidth: z.ZodOptional<z.ZodNumber>;
        maxWidth: z.ZodOptional<z.ZodNumber>;
        minDurationMs: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    revision: z.ZodString;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
    desktopId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    configured: z.ZodLiteral<true>;
    projectId: z.ZodString;
    projectRoot: z.ZodString;
    notes: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
