import { defineNote, z, type NoteCollectionQueries } from '@dsh-workbench/runtime';
import { candidateInputSchema, candidateSchema, dataSchema, feedbackSchema } from './schemas';
import { candidateSnapshot, rowState } from './projection';
export { validateCandidateIdentity, previewRows, rowState } from './projection';
export type { PreviewRow } from './projection';

/** The schema is the only source for persisted candidates and provider-owned status. */
export type CandidateInput = z.infer<typeof candidateInputSchema>;
export type CandidateSpec = z.infer<typeof candidateSchema>;
export type SurfaceStatus = NonNullable<CandidateSpec['status']>[string];
export type SurfacePhase = SurfaceStatus['phase'];
export type SurfaceStep = NonNullable<SurfaceStatus['steps']>[number];
export type SurfaceFailure = NonNullable<SurfaceStatus['failure']>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type Data = z.infer<typeof dataSchema>;

const configSchema = z.looseObject({
  feedbackInTodo: z.boolean().optional(), projectId: z.string().optional(),
  notes: z.looseObject({ todo: z.string().optional(), execution: z.string().optional() }).optional(),
});

export const note = defineNote({
  state: { schema: dataSchema, initial: { title: '候选预览', candidates: [], attached: [] } },
  config: { schema: configSchema, defaults: {} },
  collections: {
    candidates: { key: 'key', lazy: ['status.*.failure.log', 'status.*.verified.checks', 'status.*.steps'] },
    archivedCandidates: { key: 'key', lazy: ['status.*.failure.log', 'status.*.verified.checks', 'status.*.steps'] },
    outbox: { key: 'id', lazy: ['diagnostics'] },
  },
  update: {
    dataVersion: 'candidate-preview@1',
    compatibleFrom: ['legacy', 'candidate-preview@1'],
    checks: [{
      name: '关键能力与稳定身份',
      async run(ctx):Promise<boolean> {
        const state = await ctx.state.read();
        for (const candidate of state.value.candidates) {
          if (candidateSnapshot(state, candidate.key)?.candidate.key !== candidate.key) return false;
        }
        const candidate: CandidateSpec = { key: 'check', receivedAt: 0 };
        const row = { candidate, surface: '', name: 'check', desired: 'running' as const };
        const ready: SurfaceStatus = { phase: 'ready', pass: 'check', since: 0, updatedAt: 0 };
        return rowState(row) === 'starting'
          && rowState({ ...row, status: ready }) === 'unchecked'
          && rowState({ ...row, status: { ...ready, verified: { ok: true, checks: [], at: 0 } } }) === 'ready'
          && rowState({ ...row, status: { ...ready, verified: { ok: false, checks: [], at: 0 } } }) === 'verificationFailed'
          && rowState({ ...row, status: { ...ready, phase: 'verifying' } }) === 'checking';
      },
    }],
  },
});

// Presentation uses the SDK's lazy summary shapes; persisted state stays complete.
type CollectionQueries=NoteCollectionQueries<typeof note>;
export type CandidateSummary=Awaited<ReturnType<CollectionQueries['candidates.page']>>['items'][number];
export type FeedbackSummary=Awaited<ReturnType<CollectionQueries['outbox.page']>>['items'][number];
export type CandidateDisplay=CandidateSpec|CandidateSummary;
export type SurfaceDisplay=NonNullable<CandidateDisplay['status']>[string];
export type DisplayData=Pick<Data,'title'|'attached'|'feedbackError'>&{
  candidates:CandidateDisplay[];archivedCandidates?:CandidateDisplay[];outbox?:Array<Feedback|FeedbackSummary>;
};
