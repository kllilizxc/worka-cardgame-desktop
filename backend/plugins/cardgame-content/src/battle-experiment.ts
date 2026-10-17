export type BattleOutcome = 'victory' | 'defeat' | 'draw' | 'incomplete';
export interface BattleTrial {
  outcome: BattleOutcome;
  turns: number;
  actions: number;
  reason?: string;
  playedCardIds: string[];
  finalStateHash: string;
}
export interface BattleExperimentSettings {
  deckId: string;
  encounterId: string;
  policyVersion: string;
  seeds: number[];
  turnLimit: number;
  actionLimit: number;
  /** The current game uses an asymmetric player-first encounter. */
  opening: 'player-first';
}
export interface BattleExperimentAdapter {
  /** Digests cover the exact loaded inputs, not just a Git commit that may have local edits. */
  contentRevision: string;
  runtimeRevision: string;
  adapterVersion: string;
  deckCardIds: readonly string[];
  run(input: Omit<BattleExperimentSettings, 'seeds'> & { seed: number; signal?: AbortSignal }): Promise<BattleTrial>;
}
export interface BattleExperimentReport {
  schemaVersion: 1;
  createdAt: string;
  settings: BattleExperimentSettings;
  settingsHash: string;
  contentRevision: string;
  runtimeRevision: string;
  adapterVersion: string;
  deckCardIds: string[];
  trials: Array<{ seed: number; result?: BattleTrial; error?: string; cancelled?: true }>;
  summary: { requested: number; executed: number; valid: number; decisive: number; victories: number; defeats: number; draws: number; incomplete: number; failed: number; cancelled: boolean; victoryRate: number | null };
}
const digest = async (value: unknown) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value))))].map(byte => byte.toString(16).padStart(2, '0')).join('');
export function validateBattleSettings(input: BattleExperimentSettings): BattleExperimentSettings {
  if (!input.deckId?.trim() || !input.encounterId?.trim() || !input.policyVersion?.trim()) throw Error('需要牌组、遭遇和策略版本');
  if (input.opening !== 'player-first') throw Error('当前游戏只支持玩家先行动的非对称遭遇');
  if (!Array.isArray(input.seeds) || input.seeds.length < 1 || input.seeds.length > 200 || input.seeds.some(seed => !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) || new Set(input.seeds).size !== input.seeds.length) throw Error('需要 1–200 个不同的无符号 32 位种子');
  if (!Number.isInteger(input.turnLimit) || input.turnLimit < 1 || input.turnLimit > 200 || !Number.isInteger(input.actionLimit) || input.actionLimit < 1 || input.actionLimit > 10_000) throw Error('对局预算超出范围');
  return { deckId: input.deckId, encounterId: input.encounterId, policyVersion: input.policyVersion, opening: input.opening, seeds: [...input.seeds], turnLimit: input.turnLimit, actionLimit: input.actionLimit };
}
function validateTrial(trial: BattleTrial, settings: BattleExperimentSettings) {
  if (!['victory', 'defeat', 'draw', 'incomplete'].includes(trial.outcome)
    || !Number.isInteger(trial.turns) || trial.turns < 0 || trial.turns > settings.turnLimit
    || !Number.isInteger(trial.actions) || trial.actions < 0 || trial.actions > settings.actionLimit
    || !Array.isArray(trial.playedCardIds) || trial.playedCardIds.some(id => typeof id !== 'string' || !id)
    || !/^[a-f0-9]{64}$/.test(trial.finalStateHash)
    || trial.outcome === 'incomplete' && !trial.reason?.trim()) throw Error('执行器返回了无效对局结果');
}
/** Executes sequentially so adapters can isolate the game's global random/runtime configuration. */
export async function runBattleExperiment(adapter: BattleExperimentAdapter, input: BattleExperimentSettings, signal?: AbortSignal): Promise<BattleExperimentReport> {
  const settings = validateBattleSettings(input);
  if (![adapter.contentRevision, adapter.runtimeRevision].every(value => /^[a-f0-9]{64}$/.test(value)) || !adapter.adapterVersion) throw Error('执行器缺少内容或规则快照');
  const report: BattleExperimentReport = {
    schemaVersion: 1, createdAt: new Date().toISOString(), settings, settingsHash: await digest(settings),
    contentRevision: adapter.contentRevision, runtimeRevision: adapter.runtimeRevision, adapterVersion: adapter.adapterVersion, deckCardIds: [...adapter.deckCardIds], trials: [],
    summary: { requested: settings.seeds.length, executed: 0, valid: 0, decisive: 0, victories: 0, defeats: 0, draws: 0, incomplete: 0, failed: 0, cancelled: false, victoryRate: null },
  };
  for (const seed of settings.seeds) {
    if (signal?.aborted) { report.summary.cancelled = true; break; }
    const { seeds: _, ...trialSettings } = settings;
    try {
      const result = await adapter.run({ ...trialSettings, seed, ...(signal ? { signal } : {}) });
      validateTrial(result, settings);
      report.trials.push({ seed, result: structuredClone(result) });
      if (result.outcome === 'incomplete') report.summary.incomplete++;
      else {
        report.summary.valid++;
        if (result.outcome === 'draw') report.summary.draws++;
        else { report.summary.decisive++; result.outcome === 'victory' ? report.summary.victories++ : report.summary.defeats++; }
      }
    } catch (error) {
      report.trials.push({ seed, error: error instanceof Error ? error.message : String(error), ...(signal?.aborted ? { cancelled: true as const } : {}) });
      if (signal?.aborted) report.summary.incomplete++; else report.summary.failed++;
    }
    report.summary.executed++;
    if (signal?.aborted) { report.summary.cancelled = true; break; }
  }
  // Draws remain valid completed games; failed and budget-limited games are not losses.
  report.summary.victoryRate = report.summary.valid ? report.summary.victories / report.summary.valid : null;
  return report;
}
/** Paired comparison only: missing/failed trials are reported, never silently paired with another seed. */
export async function compareBattleExperiments(before: BattleExperimentReport, after: BattleExperimentReport) {
  if (await digest(validateBattleSettings(before.settings)) !== before.settingsHash || await digest(validateBattleSettings(after.settings)) !== after.settingsHash) throw Error('报告实验设置指纹不一致');
  if (before.settingsHash !== after.settingsHash || before.adapterVersion !== after.adapterVersion) throw Error('仅能比较相同种子、牌组、遭遇、策略、先手和预算的报告');
  const left = new Map(before.trials.map(trial => [trial.seed, trial])), right = new Map(after.trials.map(trial => [trial.seed, trial]));
  if (left.size !== before.trials.length || right.size !== after.trials.length) throw Error('报告含重复种子');
  if ([...left.keys(), ...right.keys()].some(seed => !before.settings.seeds.includes(seed))) throw Error('报告含实验设置之外的种子');
  const pairs: Array<{ seed: number; before: BattleOutcome; after: BattleOutcome }> = [];
  const excluded: number[] = [];
  for (const seed of before.settings.seeds) {
    const a = left.get(seed)?.result, b = right.get(seed)?.result;
    if (!a || !b || a.outcome === 'incomplete' || b.outcome === 'incomplete') { excluded.push(seed); continue; }
    validateTrial(a, before.settings); validateTrial(b, after.settings);
    pairs.push({ seed, before: a.outcome, after: b.outcome });
  }
  const rate = (side: 'before' | 'after') => pairs.length ? pairs.filter(pair => pair[side] === 'victory').length / pairs.length : null;
  return { pairs, excludedSeeds: excluded, pairedCount: pairs.length, beforeVictoryRate: rate('before'), afterVictoryRate: rate('after'),
    beforeVersion: { content: before.contentRevision, runtime: before.runtimeRevision }, afterVersion: { content: after.contentRevision, runtime: after.runtimeRevision },
    interpretation: '同一自动策略与设置下的成对描述统计；不代表玩家胜率或单张卡牌的因果效果。' };
}
