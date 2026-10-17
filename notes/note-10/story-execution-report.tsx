import { useState } from 'react';
import { Button, ScrollShadow } from '@heroui/react';
import { useNote } from "@dsh-workbench/react";


export function StoryExecutionReport({ id, revision, ready, onNodeSelect }: {
    id: string;
    revision: string;
    ready: boolean;
    onNodeSelect(id: string): Promise<void>;
}) {
    const actions = useNote<typeof import("./actions")>().actions;
    const result = useNote<typeof import("./actions")>().useQuery('storyExecutionReport', { id });
    const [starting, setStarting] = useState(false), [error, setError] = useState('');
    const report = result.data?.report;
    const running = starting || result.data?.status === 'running';
    const labels: Record<string, string> = { terminal: '到达终点', locked: '当前状态无可选分支', battle: '交给战斗', error: '执行错误' };
    async function run() {
        setStarting(true);
        setError('');
        try {
            await actions.analyzeStoryPaths({ id, expectedRevision: revision });
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
        }
        finally {
            setStarting(false);
            await result.refresh().catch(() => undefined);
        }
    }
    return <section className="cg-story-execution" aria-label="条件路径检查">
    <style>{`.cg-story-execution{display:flex;flex-direction:column;gap:10px;min-width:0}.cg-story-execution header{flex-wrap:wrap}.cg-story-execution pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}.cg-story-execution details{overflow-wrap:anywhere}.cg-story-execution li{margin:8px 0}.cg-story-execution [role=alert]{color:var(--wb-danger)}`}</style>
    <header><strong>条件路径检查</strong><Button size="sm" variant="secondary" isDisabled={!ready || running || result.stale} onPress={() => void run()}>{running ? '正在检查…' : report ? '重新检查' : '检查初始状态路径'}</Button></header>
    <p>使用游戏自身规则，从剧情初始状态逐条尝试可选分支。不会修改游戏或玩家存档。</p>
    {(error || result.error || result.data?.error) && <p role="alert">{error || result.error?.message || result.data?.error}</p>}
    {result.data?.status === 'interrupted' && <p role="alert">上次检查中断，未生成新报告。可重新检查。</p>}
    {!report && !running && !result.error && <p>尚无检查报告。</p>}
    {report && <>
      <p>{!result.data?.contentMatches ? '剧情或目录已变化，以下是旧版本报告。' : '报告正文与当前剧情、目录一致。'} 规则使用报告记录的执行快照；规则调整后请重新检查。</p>
      <p>探索 {report.exploredStates} 个状态 · 到达 {report.reachedNodeIds.length}/{report.totalNodes} 个节点 · {report.externalStops} 次战斗交接 · {report.errors} 个执行错误</p>
      <p>{report.bounded ? `达到检查上限（${report.stateLimit} 状态 / ${report.depthLimit} 步），报告仅覆盖已探索部分。` : report.errors ? '部分路径执行失败，报告仅覆盖成功探索的部分。' : '此初始状态下可探索的剧情分支已检查。'} 战斗后的路径尚未检查。</p>
      <small>剧情 {report.storyRevision.slice(0, 8)} · 规则 {report.runtimeRevision.slice(0, 8)} · {new Date(report.createdAt).toLocaleString()}</small>
      <details><summary>结果路径（{report.witnesses.length} 条示例）</summary><ScrollShadow style={{ maxHeight: 320 }}><ol>{report.witnesses.map((witness, index) => <li key={index}>
        <Button size="sm" variant="tertiary" isDisabled={!result.data?.contentMatches} onPress={() => { void onNodeSelect(witness.nodeId).catch(cause => setError(String(cause))); }}>{labels[witness.kind] || witness.kind} · {witness.nodeId}</Button>
        <p>{witness.path.length ? witness.path.join(' → ') : '剧情入口'}{witness.detail ? `：${witness.detail}` : ''}</p><details><summary>此路径状态</summary><pre>{JSON.stringify(witness.state, null, 2)}</pre></details>
      </li>)}</ol></ScrollShadow></details>
      <details><summary>受阻条件（{report.blockedExamples.length} 条示例）</summary><ScrollShadow style={{ maxHeight: 240 }}><ul>{report.blockedExamples.map((item, index) => <li key={`${item.choiceId}:${index}`}><Button size="sm" variant="tertiary" isDisabled={!result.data?.contentMatches} onPress={() => { void onNodeSelect(item.nodeId).catch(cause => setError(String(cause))); }}>定位受阻节点 · {item.nodeId}</Button><p>{item.choiceId}：{item.reason}</p><p>{item.path.length ? item.path.join(' → ') : '剧情入口状态'}</p></li>)}</ul></ScrollShadow></details>
      <details><summary>初始状态与检查范围</summary><ul>{report.limits.map(line => <li key={line}>{line}</li>)}</ul><ScrollShadow style={{ maxHeight: 240 }}><pre>{JSON.stringify(report.initialState, null, 2)}</pre></ScrollShadow></details>
    </>}
  </section>;
}
