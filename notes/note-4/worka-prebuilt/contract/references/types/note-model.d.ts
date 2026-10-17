import { z } from '@dsh-workbench/runtime';
export declare const configSchema: z.ZodObject<{
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
}, z.core.$loose>;
export declare const stateSchema: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    showCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
export declare const note: import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
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
}, z.core.$loose>, {}>;
