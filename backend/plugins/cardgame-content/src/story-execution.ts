/** Traversal policy only. Conditions and effects belong to the game's runtime adapter. */
export interface StoryExecutionAdapter {
  initialState: Record<string, any>;
  inspect(state: Record<string, any>, selected: string[]): { currentNodeId: string; choices: Array<{ id: string; visible: boolean; selectable: boolean; disabledReason?: string }> };
  transition(state: Record<string, any>, selected: string[], choiceId: string): { status: string; reason?: string; nextStoryState?: Record<string, any>; nextSelectedChoiceIds?: string[]; battleLaunch?: unknown };
}
const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
export function exploreStoryPaths(adapter: StoryExecutionAdapter, options: { stateLimit?: number; depthLimit?: number } = {}) {
  const stateLimit = options.stateLimit ?? 256, depthLimit = options.depthLimit ?? 32;
  if (!Number.isSafeInteger(stateLimit) || stateLimit < 1 || stateLimit > 2000 || !Number.isSafeInteger(depthLimit) || depthLimit < 1 || depthLimit > 100) throw Error('Invalid story traversal limits');
  const queue = [{ state: structuredClone(adapter.initialState), selected: [] as string[], path: [] as string[] }];
  // Reserve states when enqueuing: converging branches must not consume the
  // budget repeatedly before their shared destination has been inspected.
  const scheduled = new Set([stable({ state: queue[0]!.state, selected: queue[0]!.selected })]);
  const reached = new Set<string>(), traversed = new Set<string>();
  const witnesses: Array<{ kind: 'terminal' | 'locked' | 'battle' | 'error'; nodeId: string; path: string[]; detail?: string; state: Record<string, any> }> = [];
  const blocked = new Map<string, { choiceId: string; nodeId: string; reason: string; path: string[] }>();
  let exploredStates = 0, depthCutoffs = 0, stateCutoffs = 0, externalStops = 0, errors = 0;
  const witness = (value: typeof witnesses[number]) => { if (witnesses.length < 40) witnesses.push(value); };
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const current = queue[cursor]!;
    exploredStates++;
    let nodeId = String(current.state.currentNodeId ?? '');
    try {
      const view = adapter.inspect(current.state, current.selected);
      nodeId = view.currentNodeId; reached.add(nodeId);
      const available = view.choices.filter(choice => choice.visible && choice.selectable);
      for (const choice of view.choices.filter(choice => !choice.visible || !choice.selectable)) if (blocked.size < 100 && !blocked.has(choice.id)) blocked.set(choice.id, {
        choiceId: choice.id, nodeId, reason: choice.disabledReason || (choice.visible ? '当前状态不可选择' : '当前状态不可见'), path: current.path,
      });
      if (!available.length) {
        witness({ kind: view.choices.length ? 'locked' : 'terminal', nodeId, path: current.path, state: current.state });
        continue;
      }
      if (current.path.length >= depthLimit) { depthCutoffs++; continue; }
      for (const choice of available) {
        try {
          const next = adapter.transition(current.state, current.selected, choice.id);
          if (next.status !== 'selected' || !next.nextStoryState) throw Error(next.reason || 'Runtime did not return a selected transition');
          traversed.add(choice.id);
          const path = [...current.path, choice.id];
          if (next.battleLaunch) { externalStops++; witness({ kind: 'battle', nodeId, path, detail: '交给战斗运行时；未假设战斗结果', state: next.nextStoryState }); continue; }
          const nextRow = { state: next.nextStoryState, selected: next.nextSelectedChoiceIds ?? [...current.selected, choice.id], path };
          const nextKey = stable({ state: nextRow.state, selected: nextRow.selected });
          if (scheduled.has(nextKey)) continue;
          if (queue.length >= stateLimit) { stateCutoffs++; continue; }
          scheduled.add(nextKey);
          queue.push(nextRow);
        } catch (error) { errors++; witness({ kind: 'error', nodeId, path: [...current.path, choice.id], detail: error instanceof Error ? error.message : String(error), state: current.state }); }
      }
    } catch (error) { errors++; witness({ kind: 'error', nodeId, path: current.path, detail: error instanceof Error ? error.message : String(error), state: current.state }); }
  }
  return { scope: 'initial-state-path-exploration' as const, stateLimit, depthLimit, initialState: adapter.initialState, exploredStates,
    reachedNodeIds: [...reached].sort(), traversedChoiceIds: [...traversed].sort(),
    depthCutoffs, stateCutoffs, externalStops, errors, bounded: Boolean(depthCutoffs || stateCutoffs),
    witnesses, blockedExamples: [...blocked.values()],
    limits: ['仅检查报告中的初始状态；不读取玩家存档、跨剧情共享事实或背包。', '战斗交接处停止，不推断胜败。', '未访问节点不能据此判定为所有玩家状态下不可达。', '最多展示 40 条结果路径和 100 条受阻示例。'],
  };
}
