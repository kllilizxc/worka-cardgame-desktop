import { z } from '@dsh-workbench/runtime';
export declare const configSchema: z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>;
export declare const stateSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const note: import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    selectedId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    cardgameRole: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>;
