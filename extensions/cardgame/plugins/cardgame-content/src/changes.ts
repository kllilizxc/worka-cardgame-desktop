import type { ProductionRecord, GameCandidateRecord } from './workflow';

export type GameChangeStage = 'draft' | 'running' | 'cancelled' | 'paused' | 'interrupted' | 'needs-input' | 'failed' | 'stale' | 'generated' | 'checking' | 'review' | 'adopted' | 'undone';
export const gameChangeFilters = {
  draft: ['draft'], running: ['running'], candidate: ['generated', 'checking', 'review'],
  attention: ['cancelled', 'paused', 'interrupted', 'needs-input', 'failed', 'stale'],
  adopted: ['adopted'], undone: ['undone'],
} satisfies Record<string, GameChangeStage[]>;
export interface GameChangeSummary {
  id: string;
  projectId: string;
  productionId: string;
  featureId?: string;
  todoId?: string;
  title: string;
  revision: number;
  requirementRevision: number;
  round: number;
  stage: GameChangeStage;
  detail?: string;
  updatedAt: string;
  candidates: Array<{
    id: string;
    kind: NonNullable<GameCandidateRecord['kind']>;
    targetId: string;
    commit: string;
    status: GameCandidateRecord['status'];
    current: boolean;
    previewVerified: boolean;
  }>;
}

/** A read projection over durable records. It never advances work or manufactures checks. */
export function projectGameChange(production: ProductionRecord, verified: ReadonlySet<string> = new Set()): GameChangeSummary {
  const latest = new Map<string, string>();
  for (const candidate of production.gameCandidates ?? []) latest.set(`${candidate.kind ?? 'card'}:${candidate.targetId ?? candidate.cardId}`, candidate.id);
  const candidates = (production.gameCandidates ?? []).map(candidate => ({
    id: candidate.id, kind: candidate.kind ?? 'card' as const, targetId: candidate.targetId ?? candidate.cardId,
    commit: candidate.commit, status: candidate.status,
    current: production.gameCandidateOrigins?.[candidate.id]?.requirementRevision === production.requirementRevision
      && (production.gameCandidateOrigins?.[candidate.id]?.round ?? 0) === (production.rounds.at(-1)?.round ?? 0)
      && latest.get(`${candidate.kind ?? 'card'}:${candidate.targetId ?? candidate.cardId}`) === candidate.id,
    previewVerified: verified.has(candidate.id),
  }));
  const round = production.rounds.at(-1);
  const currentRound = round?.requirementRevision === production.requirementRevision ? round : undefined;
  const status = currentRound?.status ?? (round ? 'stale' : production.status);
  const current = candidates.filter(candidate => candidate.current);
  let stage: GameChangeStage;
  // Current execution facts take precedence over old candidate success.
  if (['reserved', 'queued', 'running', 'pending'].includes(status)) stage = 'running';
  else if (status === 'cancelled' || status === 'paused' || status === 'interrupted') stage = status;
  else if (status === 'failed') stage = 'failed';
  else if (status === 'needs-input') stage = 'needs-input';
  else if (current.some(candidate => candidate.status === 'candidate')) {
    stage = current.some(candidate => candidate.status === 'candidate' && candidate.previewVerified) ? 'review' : 'checking';
  } else if (current.length && current.every(candidate => candidate.status === 'undone')) stage = 'undone';
  else if (current.some(candidate => candidate.status === 'adopted')) stage = 'adopted';
  else if (candidates.length || status === 'stale') stage = 'stale';
  else if (status === 'completed' || status === 'adopted') stage = 'generated';
  else stage = 'draft';
  return {
    id: production.id, projectId: production.projectId, productionId: production.id,
    ...(production.featureId ? { featureId: production.featureId } : {}),
    ...(production.todoId ? { todoId: production.todoId } : {}),
    title: production.brief, revision: production.revision, requirementRevision: production.requirementRevision,
    round: round?.round ?? 0, stage,
    ...(currentRound?.result?.error || currentRound?.result?.conclusion ? { detail: currentRound.result.error || currentRound.result.conclusion } : {}),
    updatedAt: production.updatedAt, candidates,
  };
}
