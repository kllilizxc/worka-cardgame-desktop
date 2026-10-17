import { z } from '@dsh-workbench/runtime';

const linkSchema = z.object({repo:z.string(),branches:z.array(z.string())});
const recordSchema = z.looseObject({id:z.string(),title:z.string(),summary:z.string(),next:z.string(),body:z.string(),links:z.array(linkSchema)});
export const featureReceiptSchema = z.looseObject({id:z.string(),revision:z.string().nullable(),record:recordSchema.nullable(),registered:z.boolean().optional(),changed:z.boolean().optional()});
export const getFeatureSchema = featureReceiptSchema.extend({
  context:z.looseObject({plugin:z.string(),home:z.string(),guide:z.string(),cli:z.string()}),
  existingFeatures:z.array(z.object({id:z.string(),title:z.string(),summary:z.string().optional(),links:z.array(z.object({repo:z.string(),repository:z.string().optional(),branches:z.array(z.string())}))})),
});
const executionSchema = z.object({noteId:z.string().optional(),delegationId:z.string().optional()});
const errorSchema = z.object({file:z.string(),error:z.string()});
const featureBaseSchema = z.object({
  id:z.string(),title:z.string(),summary:z.string().optional(),next:z.string().optional(),archived:z.boolean(),
  totalPrs:z.number(),mergedPrs:z.number(),execution:executionSchema.optional(),
});
export const summarySchema = z.looseObject({
  serverUrl:z.string(),status:z.enum(['error','running','syncing']),totalCount:z.number(),activeCount:z.number(),archivedCount:z.number(),
  errors:z.array(errorSchema),features:z.array(featureBaseSchema.extend({links:z.array(z.object({repo:z.string(),repoName:z.string()}))})),
});
const badgeSchema = z.object({label:z.string(),tone:z.string(),stale:z.boolean().optional()});
export const externalLinkSchema = z.object({url:z.string(),label:z.string(),title:z.string(),tone:z.string().optional()});
export const prSchema = z.object({number:z.number(),url:z.string(),label:z.string(),state:z.string().optional(),title:z.string(),tone:z.string().optional()});
// Candidate-specific extension fields remain owned by the CardGame provider.
export const gameCandidateSchema = z.looseObject({
  id:z.string(),projectId:z.string(),productionId:z.string(),cardId:z.string().optional(),featureId:z.string(),
  kind:z.enum(['card','story','documents','deck']).optional(),targetId:z.string().optional(),
  candidateHash:z.string().optional(),targetBaseRevision:z.string().optional(),validationManifest:z.string().optional(),commit:z.string().optional(),
  status:z.enum(['candidate','adopted','undone']),previewVerified:z.boolean().optional(),
  adoptedAt:z.string().optional(),undoneAt:z.string().optional(),adoptionId:z.string().optional(),
});
export const viewSchema = z.object({
  serverUrl:z.string(),status:z.enum(['error','running','syncing']),totalCount:z.number(),activeCount:z.number(),archivedCount:z.number(),errors:z.array(errorSchema),
  features:z.array(featureBaseSchema.extend({body:z.string().optional(),createdAt:z.string().optional(),autoArchived:z.boolean(),gameCandidates:z.array(gameCandidateSchema),
    links:z.array(z.object({repo:z.string(),repoName:z.string(),repoNameShort:z.string(),url:z.string().optional(),trackingLabel:z.string().optional(),mappingIssue:z.string().optional(),
      branches:z.array(z.string()),allPrs:z.array(prSchema.extend({branch:z.string()})),
      envBranches:z.record(z.string(),z.object({branch:z.string(),merge:badgeSchema,ci:badgeSchema,deploy:badgeSchema,prs:z.array(prSchema),ciLinks:z.array(externalLinkSchema),deploymentLinks:z.array(externalLinkSchema)})),
    })),
  })),
});
export const gameCandidateInputSchema = z.object({projectId:z.string(),productionId:z.string(),candidateId:z.string(),featureId:z.string(),candidateHash:z.string(),targetBaseRevision:z.string(),validationManifest:z.string()});
export const gameAdoptionSchema = z.object({candidate:gameCandidateSchema,production:z.looseObject({id:z.string(),projectId:z.string(),revision:z.number()}).optional(),adoptionId:z.string().optional(),reused:z.boolean().optional()});
