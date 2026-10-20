import { z } from '@dsh-workbench/runtime';
import type { Production } from './contracts';
export declare function requirementFields(production?: Production): {
    brief: string;
    targetAsset: string;
    pinnedRefs: string;
    batch: string;
};
export type RequirementFields = ReturnType<typeof requirementFields>;
export declare function requirementPatch(value: RequirementFields): {
    brief: string;
    targetAsset?: {
        [key: string]: z.JSONType;
    } | undefined;
    batch?: z.JSONType | undefined;
    pinnedRefs: (string | {
        [key: string]: z.JSONType;
    })[];
};
