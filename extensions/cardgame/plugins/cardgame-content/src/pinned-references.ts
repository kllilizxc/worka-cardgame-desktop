import { createHash } from 'node:crypto';
import type { WorkaBackendApp } from '@realiz3r/worka/host';
import type { ContentReference } from './workflow';
import type { ProductionRecord } from './workflow';
import { projectGameChange } from './changes';

export const PINNED_REFERENCE_LIMIT = 8;
const operations = { card: 'card', asset: 'asset', document: 'document', production: 'production', candidate: 'production', story: 'storyAnalysis', balance: 'balanceOverview', deck: 'gameDeck', battleComparison: 'battleComparison' } as const;
type Kind = keyof typeof operations;
export interface PinnedReference extends ContentReference {
  key: string;
  projectId: string;
  kind: Kind;
  id: string;
  revision: string;
  title: string;
  anchor?: string;
  context?: Record<string, unknown>;
  binding?: Record<string, unknown>;
}
type CheckedReference = PinnedReference & { freshness: 'current' | 'stale' | 'unavailable'; currentRevision?: string };
type Core = Pick<WorkaBackendApp['core'], 'readRecord' | 'updateRecord' | 'subscribe'>;
type Resolve = (input: Record<string, unknown>) => Promise<unknown>;
const recordKey = (projectId: string) => `cardgame:pinned-references:${encodeURIComponent(projectId)}`;

function required(value: unknown, name: string, max = 1024): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw Error(`固定引用的 ${name} 无效`);
  return value;
}
function locator(projectId: string, input: Record<string, unknown>) {
  if (input.projectId !== undefined && input.projectId !== projectId) throw Error('不能固定另一项目的对象');
  const kind = required(input.kind, 'kind') as Kind;
  if (!Object.hasOwn(operations, kind)) throw Error('不支持这种固定引用');
  const id = required(kind === 'document' ? input.path ?? input.id : input.id, 'id');
  const anchor = input.anchor === undefined ? undefined : required(input.anchor, 'anchor');
  if (anchor && kind !== 'story') throw Error('只有剧情引用支持节点定位');
  let context: Record<string, unknown> | undefined;
  if (kind === 'balance') {
    if (id !== 'current-definitions') throw Error('定义统计身份无效');
    if (input.context !== undefined) {
      const metric = input.context as Record<string, unknown>;
      if (!metric || typeof metric.metric !== 'string' || !['attack', 'health'].includes(metric.metric)) throw Error('定义指标无效');
      context = { kind: required(metric.kind, '指标类别', 80), metric: metric.metric };
    }
  } else if (kind === 'candidate') {
    const candidate = input.context as Record<string, unknown> | undefined;
    const commit = required(candidate?.commit, 'commit', 40);
    if (!/^[a-f0-9]{40}$/.test(commit)) throw Error('候选提交无效');
    context = { productionId: required(candidate?.productionId, 'productionId'), commit };
  } else if (kind === 'battleComparison') {
    if (id !== 'paired-reports') throw Error('报告比较身份无效');
    const pair = input.context as Record<string, unknown> | undefined;
    const report = (value: unknown) => {
      const ref = value as Record<string, unknown> | undefined;
      return { experimentId: required(ref?.experimentId, 'experimentId', 64), reportId: required(ref?.reportId, 'reportId', 64) };
    };
    context = { before: report(pair?.before), after: report(pair?.after) };
  } else if (input.context !== undefined) throw Error('此类固定引用不支持额外上下文');
  const identity = { projectId, kind, id, ...(anchor ? { anchor } : {}), ...(context ? { context } : {}) };
  const key = createHash('sha256').update(JSON.stringify(identity)).digest('hex');
  return { ...identity, key, ...(kind === 'document' ? { path: id } : {}) };
}

/** One project collection; CoreStore serializes additions/removals with its existing durable queue. */
export function createPinnedReferenceService(core: Core, resolve: Resolve) {
  async function inspect(ref: ReturnType<typeof locator>) {
    const raw = await resolve({ projectId: ref.projectId, op: operations[ref.kind], ...(ref.kind === 'battleComparison' ? ref.context : {}), ...(ref.kind === 'candidate' ? { productionId: ref.context?.productionId } : ref.kind === 'production' ? { productionId: ref.id } : { id: ref.id }) });
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('对象暂时无法读取');
    const detail = raw as Record<string, any>;
    if (ref.kind === 'candidate') {
      const production = detail.production as ProductionRecord | undefined;
      const candidate = production?.gameCandidates?.find(candidate => candidate.id === ref.id);
      if (!production || production.id !== ref.context?.productionId || production.projectId !== ref.projectId
        || !candidate || candidate.projectId !== ref.projectId || candidate.productionId !== production.id
        || candidate.commit !== ref.context?.commit || !/^[a-f0-9]{64}$/.test(candidate.candidateHash)) throw Error('候选身份已变化或无法读取');
      const origin = production.gameCandidateOrigins?.[candidate.id];
      const binding = { productionId: production.id, candidateId: candidate.id, candidateHash: candidate.candidateHash, commit: candidate.commit,
        productionRevision: production.revision, requirementRevision: origin?.requirementRevision ?? null, round: origin?.round ?? null,
        currentRequirementRevision: production.requirementRevision, currentRound: production.rounds.at(-1)?.round ?? 0,
        current: projectGameChange(production).candidates.find(item => item.id === candidate.id)?.current ?? false, status: candidate.status };
      return { revision: createHash('sha256').update(JSON.stringify(binding)).digest('hex'), title: `候选 ${candidate.targetId ?? candidate.cardId} · ${candidate.commit.slice(0, 8)}`, binding };
    }
    if (ref.kind === 'battleComparison') {
      if (!detail.beforeVersion || !detail.afterVersion || !detail.settings) throw Error('比较报告身份不完整');
      return { revision: createHash('sha256').update(JSON.stringify(detail)).digest('hex'), title: `对局报告比较 · ${String((ref.context?.before as any)?.reportId).slice(0, 8)} → ${String((ref.context?.after as any)?.reportId).slice(0, 8)}` };
    }
    const object = ref.kind === 'production' ? detail.production : detail;
    if (!object || !['string', 'number'].includes(typeof object.revision)) throw Error('对象没有可核对的修订');
    if (ref.anchor && (!Array.isArray(detail.nodes) || !detail.nodes.some((node: any) => node.id === ref.anchor))) throw Error('剧情节点已不存在');
    if (ref.kind === 'balance' && ref.context && (!Array.isArray(detail.groups) || !detail.groups.some((group: any) => group.kind === ref.context?.kind && group[String(ref.context?.metric)] !== undefined))) throw Error('定义指标已不存在');
    const title = ref.kind === 'balance' ? `正式定义统计${ref.context ? ` · ${ref.context.kind} / ${ref.context.metric}` : ''}` : String(object.title ?? object.name ?? (ref.kind === 'production' ? object.brief : undefined) ?? ref.id).slice(0, 200);
    return { revision: String(object.revision), title };
  }
  async function stored(projectId: string) {
    const row = await core.readRecord<{ items: PinnedReference[] }>('states', recordKey(projectId));
    return row?.value.items ?? [];
  }
  return {
    async describe(projectId: string, input: Record<string, unknown>) { const ref = locator(projectId, input); return { ...ref, ...await inspect(ref) }; },
    async pin(projectId: string, input: Record<string, unknown>) {
      const ref = locator(projectId, input);
      const expected = required(input.revision, 'revision');
      // Resolve inside the same record transaction so concurrent pins cannot exceed the cap.
      const row = await core.updateRecord<{ items: PinnedReference[] }>('states', recordKey(projectId), async value => {
        const items = value?.items ?? [];
        const current = await inspect(ref);
        if (current.revision !== expected) throw Error('对象版本已变化，请刷新后重新固定');
        const existing = items.find(item => item.key === ref.key);
        if (existing) {
          if (existing.revision !== expected) throw Error('已固定旧版本，请先移除再固定当前版本');
          return { items };
        }
        if (items.length >= PINNED_REFERENCE_LIMIT) throw Error(`最多固定 ${PINNED_REFERENCE_LIMIT} 项，请先移除一项`);
        return { items: [...items, { ...ref, ...current }] };
      });
      return { items: row.value.items, limit: PINNED_REFERENCE_LIMIT };
    },
    async remove(projectId: string, key: unknown) {
      const target = required(key, 'key', 64);
      await core.updateRecord<{ items: PinnedReference[] }>('states', recordKey(projectId), value => ({ items: (value?.items ?? []).filter(item => item.key !== target) }));
      return { removed: true };
    },
    async query(projectId: string): Promise<{ items: CheckedReference[]; limit: number }> {
      const items = await Promise.all((await stored(projectId)).map(async (ref): Promise<CheckedReference> => {
        try {
          const current = await inspect(ref);
          return { ...ref, currentRevision: current.revision, freshness: current.revision === ref.revision ? 'current' : 'stale' };
        } catch { return { ...ref, freshness: 'unavailable' }; }
      }));
      return { items, limit: PINNED_REFERENCE_LIMIT };
    },
    subscribe(projectId: string, invalidate: () => void) { return core.subscribe('states', recordKey(projectId), invalidate); },
  };
}

export function pinnedReferenceLines(items: CheckedReference[]): string[] {
  if (!items.length) return [];
  return ['本项目跨区域固定引用（仅附加上下文，不代表已授权改动；每次发送重新核对）：', ...items.map(item => {
    const ref = { projectId: item.projectId, kind: item.kind, id: item.id, ...(item.path ? { path: item.path } : {}), ...(item.anchor ? { anchor: item.anchor } : {}), revision: item.revision, ...(item.context ? { context: item.context } : {}), ...(item.binding ? { binding: item.binding } : {}) };
    return `- ${JSON.stringify(ref)}${item.kind === 'battleComparison' ? ' · 历史报告比较，仅同设置下双方完成种子的描述统计，不代表当前项目、玩家胜率或单卡因果效果；样本充分性未评估' : item.kind === 'balance' ? ' · 正式定义统计，不是对局测量' : ''} · ${item.freshness === 'current' ? '版本一致；读取内容后再使用' : item.freshness === 'stale' ? `版本已变化，当前 revision ${JSON.stringify(item.currentRevision)}；不可把固定的旧修订当成当前内容` : '当前无法读取或定位；不可沿用旧内容推断'}。`;
  })];
}
