import { z } from '@dsh-workbench/runtime';

// Opaque source snapshots and project options belong to their owning notes.
// The surrounding execution protocol is explicit and serializable.
export const emptyInputSchema = z.object({});
export const delegationInputSchema = z.object({ delegationId: z.string() });
export const workTypeSchema = z.enum(['investigation', 'code-repair', 'data-permission']);
export const inspectionOriginSchema = z.object({ kind: z.literal('inspection'), label: z.string(), noteId: z.string(), problemId: z.string(), evidenceVersion: z.string() });
export const evidenceSchema = z.object({ id: z.string().optional(), kind: z.enum(['text', 'file', 'commit', 'url', 'record']), summary: z.string(), ref: z.string().optional() });
const mergeBase = { repository: z.string(), targetRef: z.string(), expectedBase: z.string(), head: z.string() };
export const operationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('git-merge'), ...mergeBase, worktree: z.string().optional() }),
  z.object({ kind: z.literal('pr-merge'), ...mergeBase, url: z.string() }),
]);
export const proposalSchema = z.object({ id: z.string(), summary: z.string(), operations: z.array(operationSchema), evidence: z.array(z.string()), status: z.enum(['draft', 'pending-approval', 'approved', 'rejected', 'applied', 'unknown']).optional() });
export const candidateSchema = z.object({
  cwd: z.string(), revision: z.string(), argv: z.array(z.string()), url: z.string(),
  readinessPath: z.string().optional(), adapter: z.string().optional(),
  repos: z.record(z.string(), z.object({ repo: z.string(), commit: z.string() })).optional(),
  options: z.record(z.string(), z.json()).optional(), featureId: z.string().optional(), start: z.boolean().optional(), embed: z.boolean().optional(),
});
export const candidateInputSchema = candidateSchema.partial({ cwd: true, revision: true, argv: true, url: true });
export const previewDeliverySchema = z.object({ key: z.string(), status: z.enum(['pending', 'delivered', 'failed']), eventKey: z.string().optional(), noteId: z.string().optional(), requestedAt: z.number(), checkedAt: z.number().optional(), error: z.string().optional() });
export const submitInputSchema = z.object({
  origin: inspectionOriginSchema.optional(), workType: workTypeSchema.optional(), nextAction: z.string().optional(), resumePaused: z.boolean().optional(),
  delegationId: z.string().optional(), updateId: z.string().optional(), delivery: z.enum(['queue', 'steer']).optional(), requirement: z.unknown().optional(),
  contextOnly: z.boolean().optional(), key: z.string().optional(), itemId: z.string().optional(), goal: z.string().optional(), scope: z.array(z.string()).optional(), cwd: z.string().optional(), businessKey: z.string().optional(),
});
export const checkpointInputSchema = z.object({
  repairTitle: z.string().optional(), workType: workTypeSchema.optional(), nextAction: z.string().optional(), requirementVersion: z.number().optional(),
  delegationId: z.string(), status: z.enum(['incomplete', 'completed', 'blocked', 'needs-input', 'failed', 'cancelled', 'unknown', 'continue']).optional(),
  remainingWork: z.array(z.string()).optional(), blockers: z.array(z.string()).optional(), replySuggestion: z.string().optional(), summary: z.string(),
  evidence: z.array(evidenceSchema).optional(), proposals: z.array(proposalSchema).optional(), proposal: proposalSchema.optional(), candidate: candidateInputSchema.optional(),
});
export const publicDelegationSchema = z.object({
  delegationId: z.string(), sourceKey: z.string(), requirementVersion: z.number(), handledVersion: z.number().optional(), updateStatus: z.string(), status: z.string(),
  sessionId: z.string().optional(), runId: z.string().optional(), requestId: z.string().optional(), outcome: z.string().optional(),
  pendingContinuation: z.boolean().optional(), verification: z.boolean().optional(), verificationStarted: z.boolean().optional(), continueRequested: z.boolean().optional(), archived: z.boolean().optional(),
});
export const executionResultSchema = publicDelegationSchema.extend({ recovery: z.string().optional() });
export const checkpointResultSchema = executionResultSchema.extend({ summary: z.string().optional(), evidence: z.array(evidenceSchema).optional(), proposals: z.array(proposalSchema).optional(), candidate: candidateSchema.optional(), preview: previewDeliverySchema.optional() });
export const manualResultSchema = z.union([
  z.object({ count: z.number(), contextOnly: z.literal(true) }),
  z.object({ count: z.number(), delegations: z.array(executionResultSchema), desk: z.object({ noteId: z.string(), stateRef: z.string().optional() }).optional(), ...executionResultSchema.partial().shape }),
]);
export const requirementInputSchema = z.object({
  source: z.object({ noteId: z.string(), objectId: z.string(), revision: z.string(), value: z.unknown() }),
  previousSourceRef: z.object({ noteId: z.string(), objectId: z.string() }).optional(), updateId: z.string(), delegationId: z.string().optional(),
  goal: z.string(), scope: z.array(z.string()).optional(), cwd: z.string().optional(), delivery: z.enum(['queue', 'steer']).optional(),
});
export const previewFeedbackInputSchema = z.object({
  id: z.string(), delegationId: z.string(), sourceNoteId: z.string(), originNoteId: z.string(), status: z.enum(['passed', 'failed', 'unchecked']),
  summary: z.string(), candidateKey: z.string(), revision: z.string(), surface: z.string(), runId: z.string(), diagnostics: z.string().optional(),
  repairable: z.string().optional(), autoRepair: z.boolean().optional(), commits: z.array(z.string()).optional(),
});
export const previewFeedbackResultSchema = z.object({ received: z.boolean(), handling: z.string(), summary: z.string().optional(), delegationId: z.string(), sessionId: z.string().optional(), duplicate: z.boolean().optional() });
export const requirementSchema = z.object({ id: z.string(), goal: z.string(), scope: z.array(z.string()), sourceRef: z.object({ noteId: z.string(), objectId: z.string() }), source: z.unknown(), history: z.array(z.object({ goal: z.string(), scope: z.array(z.string()), source: z.unknown().optional() })) });

export const prepareInputSchema = z.object({ noteId: z.string().optional(), sessionId: z.string().optional(), cwd: z.string().optional(), delegationId: z.string().optional(), delegationStateRef: z.string().optional() });
