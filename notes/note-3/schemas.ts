import { z } from '@dsh-workbench/runtime';

export const candidateInputSchema = z.object({
  key:z.string(), title:z.string().optional(), originNoteId:z.string().optional(), delegationId:z.string().optional(),
  featureId:z.string().optional(), adapter:z.string().optional(),
  repos:z.record(z.string(),z.object({repo:z.string(),commit:z.string()})).optional(),
  options:z.record(z.string(),z.unknown()).optional(), cwd:z.string().optional(), revision:z.string().optional(),
  argv:z.array(z.string()).optional(), url:z.string().optional(), readinessPath:z.string().optional(),
  embed:z.boolean().optional(), start:z.boolean().optional(), surface:z.string().optional(),
});
const surfaceStatusSchema = z.looseObject({
  phase:z.enum(['stopped','queued','preparing','starting','verifying','ready','failed','stopping']),
  url:z.string().optional(), pass:z.string(), since:z.number(), updatedAt:z.number(), message:z.string().optional(),
  steps:z.array(z.object({id:z.string(),label:z.string(),state:z.enum(['pending','running','completed','failed','skipped']),detail:z.string().optional()})).optional(),
  verified:z.object({ok:z.boolean(),at:z.number(),checks:z.array(z.object({name:z.string(),ok:z.boolean(),detail:z.string().optional(),fix:z.string().optional(),owner:z.enum(['user','project']).optional()}))}).optional(),
  failure:z.object({message:z.string(),owner:z.enum(['framework','project','user']),step:z.string().optional(),log:z.string().optional(),attempts:z.number(),
    handling:z.enum(['retrying','awaiting-approval','agent','agent-done','waiting-user','exhausted']),handlingNote:z.string().optional(),retryAt:z.number().optional(),
    reportId:z.string().optional(),session:z.string().optional(),delegationId:z.string().optional(),at:z.number()}).optional(),
  source:z.string().optional(), logDir:z.string().optional(),
});
export const candidateSchema = candidateInputSchema.omit({start:true,surface:true}).loose().extend({
  receivedAt:z.number(), desired:z.record(z.string(),z.enum(['running','stopped'])).optional(),
  surfaces:z.array(z.object({name:z.string(),title:z.string().optional(),url:z.string()})).optional(),
  status:z.record(z.string(),surfaceStatusSchema).optional(),
  repair:z.object({rounds:z.number(),source:z.string(),delegationId:z.string().optional(),lastFailure:z.string().optional()}).optional(),
});
export const feedbackSchema = z.looseObject({
  deliveryBlocked:z.string().optional(),deliveryAttempt:z.number().optional(),id:z.string(),delegationId:z.string().optional(),standalone:z.boolean().optional(),
  autoRepair:z.boolean().optional(),kind:z.literal('delivery-feedback'),status:z.enum(['passed','failed','unchecked']),subject:z.string(),summary:z.string(),
  candidateKey:z.string(),revision:z.string(),commits:z.array(z.string()).optional(),surface:z.string(),runId:z.string(),diagnostics:z.string(),
  repairable:z.string().optional(),title:z.string().optional(),project:z.string().optional(),
});
export const dataSchema = z.looseObject({
  title:z.string(),candidates:z.array(candidateSchema),archivedCandidates:z.array(candidateSchema).optional(),attached:z.array(z.string()),
  outbox:z.array(feedbackSchema).optional(),feedbackError:z.string().nullable().optional(),
});
export const renameInputSchema = z.object({key:z.string().optional(),originNoteId:z.string().optional(),delegationId:z.string().optional(),title:z.string()});
export const receiveInputSchema = z.union([
  renameInputSchema.extend({operation:z.literal('rename')}),
  z.object({operation:z.enum(['stop','restart']),key:z.string(),originNoteId:z.string(),delegationId:z.string()}),
  candidateInputSchema.extend({operation:z.never().optional()}),
]);
