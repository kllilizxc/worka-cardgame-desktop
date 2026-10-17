import { defineNote, z, type NoteActionContext } from '@dsh-workbench/runtime';
import { shelve } from './archive';
import {normalizeState,executionStatusRepairs,taskProgress,taskResult} from './projection';
export {taskProgress, taskResult, emptyState, asRefId, cloneJson, sourceIdentity, sourceFromConnection, resultSnapshot, activeElapsedMs, terminalStatus, outcomeToDelegationStatus, recordedExecutionStatus, executionStatusRepairs, candidateFromProposal, normalizeCandidate, workSources, requirementProgress, normalizeState} from './projection';
import { candidateSchema, candidateInputSchema, inspectionOriginSchema, workTypeSchema, submitInputSchema, checkpointInputSchema, evidenceSchema, proposalSchema, operationSchema, prepareInputSchema } from './schemas';
import type {InspectionOrigin,WorkType} from './inspection';
import type {
  AgentResult,
  AgentRunRef,
  AgentRunRequest,
  JsonValue,
  StoreRef,
} from "@dsh-workbench/runtime";

export const delegationStatusSchema = z.enum(['dispatching', 'running', 'review', 'needs-input', 'blocked', 'paused', 'completed', 'failed', 'cancelled', 'unknown']);
export const goalOutcomeStatusSchema = z.enum(['incomplete', 'completed', 'blocked', 'needs-input', 'failed', 'cancelled', 'unknown']);
export const delegationSourceSchema = z.object({
  key: z.string(), id: z.string(), version: z.string(), instruction: z.string().optional(),
  deliveryId: z.string().optional(), noteId: z.string().optional(),
  stateRef: z.union([z.string(), z.object({id:z.string()})]).optional(),
  path: z.string().optional(), itemId: z.string().optional(), itemPath: z.string().optional(),
  revision: z.string(), value: z.json(), shelved: z.literal(true).optional(),
});
export type DelegationSource = z.infer<typeof delegationSourceSchema>;
export type DelegationStatus = z.infer<typeof delegationStatusSchema>;
export type GoalOutcomeStatus = z.infer<typeof goalOutcomeStatusSchema>;
export type CheckpointStatus = GoalOutcomeStatus | 'continue';
export type Evidence = z.infer<typeof evidenceSchema>;
export type MergeProposalOperation = z.infer<typeof operationSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type CandidateLaunch = z.infer<typeof candidateSchema>;
export const previewDeliverySchema = z.object({
  key: z.string(), status: z.enum(['pending','delivered','failed']), eventKey: z.string().optional(),
  noteId: z.string().optional(), requestedAt: z.number(), checkedAt: z.number().optional(), error: z.string().optional(),
});
export type PreviewDelivery = z.infer<typeof previewDeliverySchema>;

/** A launch spec as declared by the owner; cwd/revision may come from the proposal. */
export type CandidateLaunchInput = z.infer<typeof candidateInputSchema>;

export const nativeResultSchema = z.object({
  status: z.string(), interrupted: z.boolean().optional(), text: z.string().optional(),
  textShelved: z.literal(true).optional(), value: z.json().optional(), error: z.string().optional(), checkedAt: z.number(),
});
export type NativeResult = z.infer<typeof nativeResultSchema>;
export const delegationExecutionSchema = z.object({
  requirementVersion:z.number().optional(), requestId:z.string(), runId:z.string().optional(), status:z.string(),
  result:nativeResultSchema.optional(), error:z.string().optional(), stopRequested:z.boolean().optional(),
  verification:z.boolean().optional(), repairFeedbackId:z.string().optional(), completionCheck:z.boolean().optional(),
  trigger:z.object({reason:z.string(),source:z.string().optional()}).optional(),
});
export type DelegationExecution = z.infer<typeof delegationExecutionSchema>;
export const delegationSchema = z.object({
  origin: inspectionOriginSchema.optional(), workType:workTypeSchema.optional(), nextAction:z.string().optional(),
  requirementVersion:z.number().optional(),
  requirementHistory:z.array(z.object({version:z.number(),goal:z.string(),scope:z.array(z.string()),source:delegationSourceSchema,shelved:z.literal(true).optional()})).optional(),
  updates:z.array(z.object({id:z.string(),fingerprint:z.string(),version:z.number(),receivedAt:z.number()})).optional(),
  id:z.string(),sourceIdentity:z.string(),businessKey:z.string().optional(),source:delegationSourceSchema,goal:z.string(),title:z.string().optional(),
  scope:z.array(z.string()),status:delegationStatusSchema,
  statusCorrection:z.object({runId:z.string(),previousStatus:delegationStatusSchema,previousUpdatedAt:z.number(),correctedAt:z.number()}).optional(),
  owner:z.object({sessionId:z.string(),noteId:z.string(),cwd:z.string().optional()}).optional(),execution:delegationExecutionSchema.optional(),
  pendingContinuation:z.boolean().optional(),verificationStarted:z.boolean().optional(),continueRequested:z.boolean().optional(),pendingRequestId:z.string().optional(),
  feedback:z.array(z.object({id:z.string(),connectionId:z.string(),subject:z.string().optional(),status:z.string(),summary:z.string(),diagnostics:z.string().optional(),instruction:z.string().optional(),shelved:z.literal(true).optional(),receivedAt:z.number(),pending:z.boolean(),manual:z.boolean().optional(),auto:z.boolean().optional(),candidateKey:z.string().optional(),revision:z.string().optional(),commits:z.array(z.string()).optional(),surface:z.string().optional(),runId:z.string().optional(),repairRequestId:z.string().optional()})).optional(),
  continuationSeq:z.number(),activeMs:z.number(),activeSince:z.number().optional(),approvalWaitMs:z.number(),approvalWaitSince:z.number().optional(),longWaitNotified:z.boolean(),
  evidence:z.array(evidenceSchema),proposals:z.array(proposalSchema),proposal:proposalSchema.optional(),candidate:candidateSchema.optional(),preview:previewDeliverySchema.optional(),
  archived:z.boolean().optional(),archivedAt:z.number().optional(),resultReadAt:z.number().optional(),dispatchAttempts:z.number().optional(),nextDispatchAt:z.number().optional(),lastDispatchError:z.string().optional(),
  outcome:z.object({requirementVersion:z.number().optional(),status:goalOutcomeStatusSchema,remainingWork:z.array(z.string()).optional(),blockers:z.array(z.string()).optional(),summary:z.string(),evidence:z.array(evidenceSchema).optional(),proposals:z.array(proposalSchema),replySuggestion:z.string().optional(),recordedAt:z.number(),requestId:z.string().optional()}).optional(),
  createdAt:z.number(),updatedAt:z.number(),
});
export type Delegation = z.infer<typeof delegationSchema>;
export const executionDeskStateSchema = z.object({
  version:z.literal(1),title:z.string().optional(),description:z.string().optional(),delegations:z.record(z.string(),delegationSchema),
});
export type ExecutionDeskState = z.infer<typeof executionDeskStateSchema>;
export const executionConfigSchema = z.looseObject({projectId:z.string().optional(),notes:z.looseObject({todo:z.string().optional(),execution:z.string().optional()}).optional()});

export const note = defineNote({
  state:{schema:executionDeskStateSchema,initial:{version:1,delegations:{},title:'执行台'}},
  config:{schema:executionConfigSchema,defaults:{}},
  update:{
    dataVersion:'execution-note@2',compatibleFrom:['execution-note@2'],
    async migrate(ctx) {
      const state = normalizeState((await ctx.state.read()).value);
      await Promise.all(shelve(state.delegations,ctx.db).map(write=>write()));
      const at=Date.now();
      for(const repair of executionStatusRepairs(state)) {
        const task=state.delegations[repair.delegationId]!;
        task.statusCorrection={runId:repair.runId,previousStatus:repair.previousStatus,previousUpdatedAt:repair.previousUpdatedAt,correctedAt:at};
        task.status=repair.status;task.updatedAt=at;
      }
      await ctx.state.set(state);
    },
    checks:[{name:'关键能力与稳定身份',async run(ctx) {
      const row=await ctx.state.read();
      const parsed=executionDeskStateSchema.safeParse(row.value);
      if(!parsed.success)return false;
      for(const [id,task] of Object.entries(parsed.data.delegations)) {
        const result=taskResult(task,row.revision),progress=taskProgress(task,row.revision);
        if(task.id!==id||result.delegationId!==task.id||result.title!==task.goal||progress.delegationId!==task.id)return false;
      }
      return true;
    }}],
  },
});

/** Private source for an explicitly created Desk task. */
export type DirectTaskSource = {
  id: string; key: string; version: string; instruction: string; deliveryId: string;
  source: { noteId: string; stateRef?: string; path: string; revision: string; value: JsonValue };
  chain: string[];
};

export type PrepareInput = z.infer<typeof prepareInputSchema>;

export type ExecutionContext = NoteActionContext<typeof note>;
export type ExecutionAgent = ExecutionContext['host']['agent'];

export type SubmitInput = z.infer<typeof submitInputSchema>;

export type CheckpointInput = z.infer<typeof checkpointInputSchema>;
