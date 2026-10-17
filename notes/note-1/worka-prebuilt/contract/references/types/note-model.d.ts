import { z } from '@dsh-workbench/runtime';
export declare const configSchema: z.ZodObject<{
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
}, z.core.$loose>;
export declare const stateSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const note: import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
}, z.core.$loose>, {}>;
