import { z } from '@dsh-workbench/runtime';
export declare const note: import("@dsh-workbench/runtime").NoteModel<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    changeSelection: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    presentation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$loose>, {}>;
