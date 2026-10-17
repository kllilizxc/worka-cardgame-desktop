import {defineNote,z} from '@dsh-workbench/runtime';
export const configSchema=z.looseObject({cardgameRole:z.string().optional(),notes:z.record(z.string(),z.string()).optional()});
export const stateSchema=z.object({query:z.string().optional(),selectedId:z.string().optional()});
export const note=defineNote({state:{schema:stateSchema,initial:{}},config:{schema:configSchema,defaults:{}},update:{dataVersion:'cardgame-production@2',compatibleFrom:['legacy','cardgame-production@1','cardgame-production@2']}});
