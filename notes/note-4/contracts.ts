import {CARD_OPERATIONS} from './card-operations';
import {CARD_FACE_THEMES} from './card-face';
import { z } from '@dsh-workbench/runtime';

// Public production contracts. Types are inferred here, never restated by the view.
const json = z.json();
export const record = z.record(z.string(), json);
const id = z.string().min(1);
// Old callers may still supply provenance. The binding service validates it;
// ordinary note UI never selects its own project.
export const scope = { projectId: id.optional(), projectGeneration: id.optional() };
export const productionInput = z.looseObject({ ...scope, productionId: id });
export const cardOperations = z.enum(CARD_OPERATIONS);
export type CardOperation = z.infer<typeof cardOperations>;
export const actionInputs = {
  cardWorkflow: z.looseObject({ ...scope, operation: cardOperations, productionId: id.optional(), cardId: id.optional(), baseRevision: z.number().optional(), requestId: id.optional() }),
  discussCardBatch: productionInput.extend({ cardId: id.optional() }),
  upsertRequest: z.looseObject({ ...scope, productionId: id.optional(), id: id.optional(), brief: z.string(), targetAsset: record.optional(), pinnedRefs: z.array(z.union([record, z.string()])).optional(), batch: json.optional(), todoId: id.optional() }),
  updateProduction: productionInput.extend({ baseRevision: z.number(), requestId: id.optional(), patch: record }),
  generate: productionInput.extend({ requestId: id.optional(), newRound: z.boolean().optional(), round: z.number().optional(), businessKey: id.optional(), scope: z.array(z.string()).optional(), cwd: z.string().optional() }),
  bindExecution: productionInput.extend({ requestId: id, receipt: record }),
  retry: productionInput,
  newRound: productionInput.extend({ scope: z.array(z.string()).optional(), cwd: z.string().optional() }),
  receiveResult: productionInput.extend({ requestId: id, round: z.number().optional(), revision: z.number().optional(), status: z.string().optional(), result: record.optional() }),
  registerCandidates: productionInput.extend({ round: z.number().optional(), candidates: z.array(record), requestId: id.optional() }),
  recordCandidates: productionInput.extend({ round: z.number().optional(), candidates: z.array(record), requestId: id }),
  adoptAsset: productionInput.extend({ candidateId: id, assetId: id.optional(), versionId: id.optional(), requestId: id.optional() }),
  recordAdoption: productionInput.extend({ candidateId: id, assetId: id, versionId: id, requestId: id }),
  bindTodo: productionInput.extend({ todoId: id, todoBaseRevision: z.number().optional(), productionBaseRevision: z.number().optional() }),
  rejectCandidate: productionInput.extend({ candidateId: id, baseRevision: z.number(), reason: z.string().optional(), requestId: id.optional() }),
  linkCompanion: productionInput.extend({ baseRevision: z.number(), todoId: id, sourceCardId: id, sourceRevision: id }),
};
export type ActionInput<K extends keyof typeof actionInputs> = z.infer<(typeof actionInputs)[K]>;
export const queryInputs = {
  projectBinding: z.object({}),
  productionContext: productionInput,
  companionChoices: z.looseObject(scope),
  sourceCard: z.looseObject({ ...scope, id }),
  featureChoices: z.object({}),
  cardBatch: productionInput,
  cardFaceThemes: z.looseObject(scope),
  productions: z.looseObject({ ...scope, cursor: z.string().optional(), limit: z.number().optional(), q: z.string().optional(), status: z.string().optional(), todoId: id.optional() }),
  production: productionInput.extend({ historyCursor: z.string().optional(), historyLimit: z.number().optional() }),
  media: z.looseObject({ ...scope, path: z.string().optional(), id: id.optional(), variant: z.string().optional() }),
  workflowStatus: z.looseObject(scope),
};
export const candidateSchema = z.looseObject({ id: id.optional(), key: id.optional(), assetId: id.optional(), version: z.string().optional(), versionId: id.optional(), sourcePath: z.string().optional(), path: z.string().optional(), mimeType: z.string().optional(), width: z.number().optional(), height: z.number().optional(), durationMs: z.number().optional(), revision: z.union([z.string(),z.number()]).optional(), rejectedAt: z.string().optional(), rejectReason: z.string().optional() });
export const roundSchema = z.looseObject({ round: z.number(), requestId: id, requirementRevision: z.number(), dispatchRevision: z.number(), status: z.string(), updatedAt: z.string(), result: z.looseObject({ status: z.string(), conclusion: z.string().optional(), error: z.string().optional(), candidateRefs: z.array(candidateSchema).optional() }).optional() });
export const gameCandidateSchema = z.looseObject({ id, cardId: z.string(), fingerprint: z.string(), status: z.enum(['candidate', 'adopted', 'undone']), deckArtFingerprints: z.record(z.string(),z.string()).optional() });
export const productionSchema = z.looseObject({
  id, projectId: id, brief: z.string(), status: z.string(), revision: z.number(), requirementRevision: z.number().optional(),
  targetAsset: record.optional(), pinnedRefs: z.array(z.union([record,z.string()])).optional(), batch: json.optional(),
  todoId: id.optional(), featureId: id.optional(), roundCount: z.number().optional(), currentRound: z.number().optional(), candidateCount: z.number().optional(), gameCandidateCount: z.number().optional(),
  rounds: z.array(roundSchema).optional(), candidateRefs: z.array(candidateSchema).optional(), gameCandidates: z.array(gameCandidateSchema).optional(),
  adoption: z.looseObject({status:z.string(),candidateId:id}).optional(),
  candidateRegistration: z.looseObject({status:z.string()}).optional(),
  workflowKind: z.string().optional(), cardProgress: z.object({total:z.number(),done:z.number()}).optional(),
  deckProgress:z.object({distinctCards:z.number(),totalCopies:z.number(),targetSize:z.number(),title:z.string()}).optional(),
});
export type Production = z.infer<typeof productionSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
// The game owns all effect variants. Only the one editable boost is narrowed.
export const effectSchema=z.looseObject({text:z.string().optional()});
export const editableBoostSchema=effectSchema.extend({timing:z.literal('reaction'),target:z.looseObject({scope:z.literal('singleAlly'),requiredLabelsAllOf:z.array(z.string()).length(1)}),actions:z.array(z.looseObject({type:z.literal('modifyAttack'),value:z.number(),duration:z.literal('turn')})).length(1)});
export const definitionSchema = z.looseObject({id,name:z.string(),kind:z.string(),description:z.string().optional(),attack:z.number().optional(),health:z.number().optional(),effects:z.array(effectSchema).optional(),labels:z.array(z.string()).optional(),cardFace:z.looseObject({artwork:json.optional()}).optional()});
export const pipelineCardSchema = z.looseObject({ definition:definitionSchema,artBrief:z.string(),sourceRevision:z.string().optional(), presentation:z.object({themeId:z.enum(CARD_FACE_THEMES.map(theme=>theme.id)),zoom:z.number(),focus:z.number()}), artRequest:z.object({id,fingerprint:z.string(),prompt:z.string()}).optional(), artGeneration:z.looseObject({requestId:id,status:z.enum(['running','ready','failed','unavailable']),startedAt:z.string(),error:z.string().optional()}).optional(), art:z.looseObject({id,revision:z.string(),fingerprint:z.string(),provider:z.enum(['codex','existing']),sourceCardId:id.optional()}).optional(),assembly:z.object({fingerprint:z.string(),variants:z.record(z.string(),z.object({previewId:id,runtimeId:id}))}).optional() });
export const deckPlanSchema = z.looseObject({id,title:z.string(),targetSize:z.number(),entries:z.array(z.object({cardId:id,count:z.number()})),basisBrief:z.string(),approvedFingerprint:z.string().optional()});
export const batchSchema = z.looseObject({kind:z.literal('card-generation'),schemaVersion:z.literal(1),provider:z.literal('codex'),cards:z.array(pipelineCardSchema),deck:deckPlanSchema.optional(),draftOrigin:z.enum(['agent','user','unknown']).optional(),companion:z.object({cardId:id,revision:z.string()}).optional()});
export type CardBatch = z.infer<typeof batchSchema>;
export type PipelineCard = z.infer<typeof pipelineCardSchema>;
export const deckInspectionSchema = z.looseObject({status:z.string(),next:z.string(),totalCopies:z.number(),distinctCards:z.number(),targetSize:z.number(),basisChanged:z.boolean(),legal:z.boolean(),confirmed:z.boolean(),changedCardIds:z.array(z.string()),candidateId:id.optional(),staleCandidateId:id.optional(),errors:z.array(z.string()),warnings:z.array(z.string()),checkScope:z.string()});
export const cardBatchSchema = z.object({ production:productionSchema,batch:batchSchema,stages:z.record(z.string(),z.string()),deckInspection:deckInspectionSchema.optional() });
export type CardBatchDetail = z.infer<typeof cardBatchSchema>;
export const featureSchema = z.object({id,title:z.string()});
export const todoSchema = z.looseObject({id,title:z.string(),revision:z.number(),status:z.string(),productionId:id.optional()});
export const sourceCardSchema = z.looseObject({id,name:z.string(),kind:z.string(),revision:z.string(),json:definitionSchema});
export const productionDetailSchema = z.looseObject({projectGeneration:id.optional(),production:productionSchema,execution:z.looseObject({id:id.optional(),status:z.string().optional(),updatedAt:z.string().optional(),outcome:z.looseObject({summary:z.string().optional()}).optional(),delivery:z.looseObject({status:z.string().optional()}).optional()}).optional()});
export const productionReceiptSchema = z.looseObject({production:productionSchema,revision:z.number().optional(),stale:z.boolean().optional(),request:z.object({id,fingerprint:z.string(),prompt:z.string()}).optional(),reusedArt:z.boolean().optional(),automaticGeneration:z.boolean().optional(),handoff:z.string().optional()});
export const preparedEventSchema = z.object({ name:z.enum(['cardgame.production.generationRequested','cardgame.production.candidatesRequested','cardgame.production.adoptionRequested']), key:id,payload:record,result:record });
export const eventReceiptSchema = z.looseObject({status:z.string(),requestId:id,eventId:id,duplicate:z.boolean().optional()});
export const queryOutputs = {
  projectBinding:z.looseObject({configured:z.boolean(),projectId:id,projectRoot:z.string().optional(),projectGeneration:z.string().optional()}),
  productionContext:z.object({feature:featureSchema.optional(),todo:todoSchema.optional(),source:sourceCardSchema.optional()}),
  companionChoices:z.object({features:z.array(featureSchema),units:z.array(sourceCardSchema.omit({json:true})),todos:z.array(todoSchema)}),
  sourceCard:sourceCardSchema,
  featureChoices:z.object({items:z.array(featureSchema)}),
  cardBatch:cardBatchSchema,
  cardFaceThemes:z.looseObject({items:z.array(z.object({id,name:z.string(),description:z.string(),version:z.number()}))}),
  productions:z.looseObject({items:z.array(productionSchema),nextCursor:z.string().optional(),next:z.string().optional(),revision:z.string().optional(),total:z.number().optional()}),
  production:productionDetailSchema,
  media:z.looseObject({url:z.string().optional(),src:z.string().optional(),data:z.string().optional(),mimeType:z.string().optional(),width:z.number().optional(),height:z.number().optional(),durationMs:z.number().optional(),revision:z.union([z.string(),z.number()]).optional()}),
  workflowStatus:record,
};
export function isCardBatch(value: unknown): value is CardBatch {
  return Boolean(value && typeof value === 'object' && 'kind' in value && value.kind === 'card-generation');
}
