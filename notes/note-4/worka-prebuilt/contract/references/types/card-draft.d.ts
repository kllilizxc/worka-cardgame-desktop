import { z } from '@dsh-workbench/runtime';
import { type PipelineCard } from './contracts';
export declare const cardFieldsSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    attack: z.ZodString;
    health: z.ZodString;
    artBrief: z.ZodString;
    boost: z.ZodString;
}, z.core.$strip>;
export type CardFields = z.output<typeof cardFieldsSchema>;
export declare function cardBoostEffect(card: PipelineCard): {
    [x: string]: unknown;
    text?: string | undefined;
    timing: "reaction";
    target: {
        [x: string]: unknown;
        scope: "singleAlly";
        requiredLabelsAllOf: string[];
    };
    actions: {
        [x: string]: unknown;
        type: "modifyAttack";
        value: number;
        duration: "turn";
    }[];
} | undefined;
export declare function cardEditorValue(card: PipelineCard): CardFields;
export declare function cardDefinition(card: PipelineCard, value: CardFields): {
    id: string;
    kind: string;
    attack?: number | undefined;
    health?: number | undefined;
    labels?: string[] | undefined;
    cardFace?: {
        [x: string]: unknown;
        artwork?: z.JSONType | undefined;
    } | undefined;
    description: string | undefined;
    effects: {
        timing: "reaction";
        target: {
            [x: string]: unknown;
            scope: "singleAlly";
            requiredLabelsAllOf: string[];
        };
        text: string | undefined;
        actions: {
            type: "modifyAttack";
            duration: "turn";
            value: number;
        }[];
    }[];
    name: string;
} | {
    id: string;
    kind: string;
    attack?: number | undefined;
    health?: number | undefined;
    effects?: {
        [x: string]: unknown;
        text?: string | undefined;
    }[] | undefined;
    labels?: string[] | undefined;
    cardFace?: {
        [x: string]: unknown;
        artwork?: z.JSONType | undefined;
    } | undefined;
    name: string;
    description: string;
};
