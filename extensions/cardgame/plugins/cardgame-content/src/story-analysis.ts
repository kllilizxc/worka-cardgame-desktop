/** Structural inspection only: conditional edges are possible, not proven playable. */
export function analyzeStory(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('剧情必须是 JSON 对象');
  const story = value as Record<string, any>;
  if (!Array.isArray(story.nodes) || !Array.isArray(story.choices)) throw new Error('剧情缺少 nodes 或 choices');
  const findings: Array<{ kind: string; id: string; detail: string }> = [];
  const seen = new Set<string>();
  const nodes = story.nodes.map((node: any, index: number) => {
    if (!node || typeof node.id !== 'string' || !node.id) throw new Error(`节点 ${index + 1} 缺少 ID`);
    if (seen.has(node.id)) findings.push({ kind: 'duplicate', id: node.id, detail: '节点 ID 重复' });
    seen.add(node.id);
    return { id: node.id, title: String(node.title || node.id), type: String(node.type || 'story'), summary: String(node.summary || ''), chapter: String(node.chapter || '') };
  });
  const choiceIds = new Set<string>();
  const edges = story.choices.map((choice: any, index: number) => {
    if (!choice || typeof choice.id !== 'string' || typeof choice.from !== 'string' || typeof choice.to !== 'string') throw new Error(`选项 ${index + 1} 缺少 ID、起点或终点`);
    if (choiceIds.has(choice.id)) findings.push({ kind: 'duplicate', id: choice.id, detail: '选项 ID 重复' });
    choiceIds.add(choice.id);
    if (!seen.has(choice.from) || !seen.has(choice.to)) findings.push({ kind: 'broken', id: choice.id, detail: `分支目标缺失：${choice.from} → ${choice.to}` });
    return { id: choice.id, from: choice.from, to: choice.to, text: String(choice.text || choice.id), conditional: Boolean(choice.enabledWhen || choice.visibleWhen),
      ...(choice.enabledWhen ? { enabledWhen: choice.enabledWhen } : {}), ...(choice.visibleWhen ? { visibleWhen: choice.visibleWhen } : {}),
      ...(Array.isArray(choice.effects) && choice.effects.length ? { effects: choice.effects } : {}),
    };
  });
  const entry = typeof story.entryNodeId === 'string' ? story.entryNodeId : '';
  if (!seen.has(entry)) findings.push({ kind: 'entry', id: entry, detail: '入口节点不存在' });
  const outgoing = new Map<string, typeof edges>();
  for (const edge of edges) {
    const list = outgoing.get(edge.from);
    if (list) list.push(edge); else outgoing.set(edge.from, [edge]);
  }
  const reachable = new Set<string>();
  const queue = seen.has(entry) ? [entry] : [];
  for (let index = 0; index < queue.length; index++) {
    const id = queue[index]!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const edge of outgoing.get(id) || []) if (seen.has(edge.to) && !reachable.has(edge.to)) queue.push(edge.to);
  }
  for (const node of nodes) {
    if (!reachable.has(node.id)) findings.push({ kind: 'unreachable', id: node.id, detail: '从入口没有结构路径' });
  }
  return {
    title: String(story.title || story.storyId || '剧情'), entry, nodes, edges, findings,
    terminalIds: nodes.filter((node: { id: string }) => !(outgoing.get(node.id)?.length)).map((node: { id: string }) => node.id),
    reachableCount: reachable.size,
    conditionalCount: edges.filter((edge: { conditional: boolean }) => edge.conditional).length,
    reachability: 'structural' as const,
  };
}
