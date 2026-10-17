import type { WorkaExtensionHost } from '@realiz3r/worka/host';
type NoteRecord = Awaited<ReturnType<WorkaExtensionHost['app']['note']>>['value'];
const quote = (value: string) => JSON.stringify(value);
async function readDetail(host: WorkaExtensionHost, noteId: string, projectId: string, op: string, id: string, extra: Record<string, any> = {}): Promise<Record<string, unknown> | undefined> {
 const value = await host.runtime.resources?.read({ name: 'extension.cardgame-content.query', input: {...extra, projectId, op, ...(op === 'production' ? { productionId: id } : {id})} }, { access: { noteId, version: (await host.app.note(noteId)).value.codeVersion ?? '', caller: {kind: 'system'} } });
 const data = value?.data;
 return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : undefined;
}

export async function cardgameSelectionLines(host: WorkaExtensionHost, note: NoteRecord): Promise<string[]> {
    const config = await host.app.core.readRecord<Record<string, unknown>>('states', `${note.id}:config`).catch(() => undefined)
    const projectId = config?.value?.projectId
    if (typeof projectId !== 'string' || !projectId.trim()) return []
    const state = await host.app.core.readRecord<Record<string, any>>('states', note.stateRef).catch(() => undefined)
    const mode = config?.value?.mode
    const kind = (config?.value?.catalogRef as {kind?: unknown} | undefined)?.kind
    const selection: Array<{op: string; id: string}> = []
    if (config?.value?.presentation === 'changes' && typeof state?.value?.changeSelection === 'string') selection.push({op: 'production', id: state.value.changeSelection})
    if (config?.value?.presentation === 'balance') selection.push({op: 'balanceOverview', id: 'current-definitions'})
    else if (mode === 'cards') for (const id of state?.value?.views?.cardsSelection ?? []) if (typeof id === 'string') selection.push({op: 'card', id})
    if (mode === 'assets' && typeof state?.value?.views?.assetsSelection === 'string') selection.push({op: 'asset', id: state.value.views.assetsSelection})
    if (config?.value?.presentation === 'story' && typeof state?.value?.views?.storySelection === 'string') selection.push({op: 'storyAnalysis', id: state.value.views.storySelection})
    else if (mode === 'knowledge' && typeof state?.value?.views?.knowledgeSelection?.path === 'string') selection.push({op: 'document', id: state.value.views.knowledgeSelection.path})
    if (kind === 'production' && typeof state?.value?.selectedId === 'string') selection.push({op: 'production', id: state.value.selectedId})
    const projectRoot = config?.value?.projectRoot
    const boundary = `这是已登记的正式项目${typeof projectRoot === 'string' ? `，目录 ${quote(projectRoot)}` : ''}；便笺工作目录即使看起来是临时目录也不是创作候选。不要用 Bash、Edit、Write 或 git commit 直接修改它。卡牌改动须调用卡牌库 createCardWorkflow，再通过制作便笺 cardWorkflow 的 saveCardDraft、assembleCardFaces、integrateCard 生成候选；该候选由服务自动登记原试玩便笺。`
    if (!selection.length) return [`CardGame 项目 ${quote(projectId)}；当前便笺尚无选中对象。${boundary}在试玩便笺验证后仅由功能进展确认采用。`]
    const lines = [`CardGame 项目 ${quote(projectId)}；${boundary}当前选中对象（每次发送消息按当前便笺状态重新读取）：`]
    for (const item of selection.slice(0, 3)) {
      const detail = await readDetail(host, note.id, projectId, item.op, item.id).catch(() => undefined)
      const revision = detail?.revision ?? (detail?.production as {revision?: unknown} | undefined)?.revision
      const candidates = (detail?.production as {gameCandidates?: Array<{id: string; commit: string; status: string}>} | undefined)?.gameCandidates
      lines.push(`- ${item.op} ${quote(item.id)}${revision !== undefined ? ` · revision ${quote(String(revision))}` : ' · revision 需重新查询'}${candidates?.length ? ` · 候选 ${candidates.slice(-3).map(candidate => `${candidate.id}@${candidate.commit.slice(0, 8)}(${candidate.status})`).join('、')}` : ''}`)
      if (item.op === 'storyAnalysis') {
        const selectedNode = state?.value?.views?.storyNodeSelection;
        const nodes = Array.isArray(detail?.nodes) ? detail.nodes as Array<{ id: string; sources?: Array<{ path: string; revision: string }> }> : [];
        if (selectedNode?.storyId === item.id && typeof selectedNode.nodeId === 'string') {
          const node = nodes.find(node => node.id === selectedNode.nodeId);
          lines.push(`  剧情节点 ${quote(selectedNode.nodeId)}${node ? '' : '（当前版本已不存在，修改前重新选择）'}`);
          for (const source of node?.sources ?? []) lines.push(`  同 ID 场景原文 ${quote(source.path)} · revision ${quote(source.revision)}；仅按节点 ID 关联，不代表当前运行版本由此原文编译。`);
        }
      }
      if (item.op === 'balanceOverview') {
        const selectedMetric = state?.value?.views?.balanceMetricSelection;
        const groups = Array.isArray(detail?.groups) ? detail.groups as Array<Record<string, unknown>> : [];
        const metric = selectedMetric && ['attack', 'health'].includes(selectedMetric.metric) ? selectedMetric.metric : undefined;
        const group = groups.find(group => group.kind === selectedMetric?.kind);
        if (metric && group) lines.push(`  定义统计 ${quote(String(selectedMetric.kind))} / ${metric}：${JSON.stringify(group[metric])}；不包含战斗效果，不是对局胜率。`);
        const comparison = state?.value?.views?.battleComparisonSelection;
        if (comparison) {
          const validRef = (value: any) => value && typeof value.experimentId === 'string' && typeof value.reportId === 'string';
          if (!validRef(comparison.before) || !validRef(comparison.after)) lines.push('  对局比较引用无效，请在数值区重新选择，不能据此推断结果。');
          else {
            const refs = { before: { experimentId: comparison.before.experimentId, reportId: comparison.before.reportId }, after: { experimentId: comparison.after.experimentId, reportId: comparison.after.reportId } };
            lines.push(`  对局报告引用 ${JSON.stringify(refs)}。`);
            const result = await readDetail(host, note.id, projectId, 'battleComparison', 'selected-comparison', refs).catch(() => undefined);
            if (!result) lines.push('  所选对局比较当前无法读取或设置不兼容；不可使用旧结果，请重新查询报告或选择。');
            else {
              lines.push(`  实验设置 ${JSON.stringify(result.settings)}；版本 ${JSON.stringify({ before: result.beforeVersion, after: result.afterVersion })}。`);
              lines.push(`  成对描述统计 ${JSON.stringify({ pairedCount: result.pairedCount, excludedSeeds: result.excludedSeeds, beforeVictoryRate: result.beforeVictoryRate, afterVictoryRate: result.afterVictoryRate })}。`);
              lines.push('  仅统计相同设置下两侧均完成的种子；失败和未完成不计作败局，不代表玩家胜率或单卡因果效果。样本充分性尚未评估，不可据此判定强弱或平衡。这些是固定历史快照，不自动等于当前项目或最新候选。');
            }
          }
        }
      }
    }
    lines.push('修改前查询对象的当前 revision；旧回执不能覆盖较新的要求。仅在功能进展中确认采用正式源码。')
    return lines
  }
