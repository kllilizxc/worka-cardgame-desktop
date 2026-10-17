import {useBattleReports} from './battle-summary';
import { useState } from 'react';
import { Button, ScrollShadow } from '@heroui/react';
import { useNote } from "@dsh-workbench/react";
type CandidateRef=NonNullable<import('zod').input<typeof import('./contract').contentActions.prepareBattleExperiment.input>['candidate']>;
type Source=NonNullable<NonNullable<import('./contract').ContentQueryOutput<'battleExperiments'>['experiment']>['source']>;
const sourceLabel = (source?: Source) => !source ? '来源未记录的历史实验' : source.kind === 'registered-project' ? '项目工作区快照' : `候选 ${source.candidateId} · 提交 ${source.commit.slice(0, 8)}`;

type ReportRef=NonNullable<import('./contract').ContentQueryInput<'battleComparison'>>['before'];

const sameReport = (a: ReportRef | undefined, b: ReportRef) => a?.experimentId === b.experimentId && a?.reportId === b.reportId;
const rate = (value: number | null) => value === null ? '无有效样本' : `${(value * 100).toFixed(1)}%`;
type ComparisonSelection=NonNullable<import('./contract').ContentQueryInput<'battleComparison'>>;
function BattleComparison({ before, after, onSelect }: ComparisonSelection & {
    onSelect?: (selection: ComparisonSelection | null) => Promise<void>;
}) {
    const resource = useNote<typeof import("./actions")>().useQuery('battleComparison', { before, after });
    const data = resource.data;
    const [selecting, setSelecting] = useState(false), [selectionError, setSelectionError] = useState('');
    if (resource.error)
        return <p role="alert">比较未完成：{resource.error.message}</p>;
    if (!data || resource.loading || resource.stale)
        return <p>正在核对两份报告…</p>;
    const outcome: Record<string, string> = { victory: '胜', defeat: '负', draw: '平' };
    return <div aria-label="成对比较结果">
    <p>基准 {data.beforeVersion.content.slice(0, 8)} → 对照 {data.afterVersion.content.slice(0, 8)} · {data.pairedCount} 个共同完成的种子</p>
    <p>同种子描述性胜率：{rate(data.beforeVictoryRate)} → {rate(data.afterVictoryRate)}</p>
    <p>{data.interpretation} 样本充分性尚未评估，不能据此判定强弱或平衡。</p>
    {onSelect && <Button size="sm" variant="secondary" isDisabled={selecting} onPress={() => { setSelecting(true); setSelectionError(''); void onSelect({ before, after }).catch(error => setSelectionError(error instanceof Error ? error.message : String(error))).finally(() => setSelecting(false)); }}>在原生对话中引用这组比较</Button>}
    {selectionError && <p role="alert">{selectionError}</p>}
    {!!data.excludedSeeds.length && <p>未纳入比较的种子：{data.excludedSeeds.join(', ')}（至少一侧未完成或失败）</p>}
    <details><summary>逐种子结果与规则版本</summary><p>规则 {data.beforeVersion.runtime} → {data.afterVersion.runtime}</p>{data.pairs.map(pair => <p key={pair.seed}>种子 {pair.seed}：{outcome[pair.before]} → {outcome[pair.after]}</p>)}</details>
  </div>;
}
function CandidateSources({ disabled, prepare }: {
    disabled: boolean;
    prepare(candidate: CandidateRef): void;
}) {
    const resource = useNote<typeof import("./actions")>().useQuery('battleSources', {});
    return <details><summary>选择候选版本进行实验</summary>
    <p>从候选的确切提交准备独立快照，不采用到正式项目。历史候选也可能与当前需求不同，请核对制作单和版本。</p>
    {resource.error ? <p role="alert">{resource.error.message}</p> : !resource.data ? <p>正在读取候选…</p> : !resource.data.items.length ? <p>当前项目尚无候选。</p> : <ScrollShadow style={{ maxHeight: 260 }}><div>{resource.data.items.map(item => <article key={`${item.productionId}:${item.candidateId}`}>
      <strong>{item.targetId} · {item.kind}</strong><small>制作单 {item.productionId} · 候选 {item.candidateId} · 提交 {item.commit.slice(0, 8)} · {item.status}</small>
      <Button size="sm" variant="secondary" isDisabled={disabled || resource.stale} onPress={() => prepare({ productionId: item.productionId, candidateId: item.candidateId, candidateHash: item.candidateHash })}>准备此候选</Button>
    </article>)}</div></ScrollShadow>}
  </details>;
}
export function BattleExperiments({ selection, onSelect }: {
    selection?: ComparisonSelection | null;
    onSelect?: (selection: ComparisonSelection | null) => Promise<void>;
}) {
    const actions = useNote<typeof import("./actions")>().actions;
    const resource = useBattleReports();
    const [before, setBefore] = useState<ReportRef>(), [after, setAfter] = useState<ReportRef>();
    const [busy, setBusy] = useState(false), [error, setError] = useState('');
    const data = resource.data, running = data?.status === 'running', preparing = busy || data?.status === 'preparing';
    async function invoke(operation: 'resume' | 'fresh' | 'stop', candidate?: CandidateRef) {
        setBusy(true);
        setError('');
        try {
            if (operation === 'stop')
                await actions.stopBattleExperiment({});
            else
                await actions.prepareBattleExperiment({ fresh: operation === 'fresh', ...(candidate ? { candidate } : {}) });
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
        }
        finally {
            setBusy(false);
            await resource.refresh().catch(() => undefined);
        }
    }
    return <section className="cg-battle-experiments" aria-label="自动对局">
    <style>{`.cg-battle-experiments{display:flex;flex-direction:column;gap:12px;min-width:0}.cg-battle-experiments .controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.cg-battle-experiments article{display:flex;flex-direction:column;gap:6px;padding:12px 0;overflow-wrap:anywhere}.cg-battle-experiments a{color:var(--wb-accent);text-decoration:underline}.cg-battle-experiments [role=alert]{color:var(--wb-danger)}`}</style>
    <strong>自动对局</strong>
    {selection && <div><p>原生对话引用：基准 {selection.before.reportId.slice(0, 8)} · 对照 {selection.after.reportId.slice(0, 8)}。下次发送消息时重新读取这些报告。</p><Button size="sm" variant="tertiary" onPress={() => { void onSelect?.(null).catch(error => setError(error instanceof Error ? error.message : String(error))); }}>清除对话引用</Button></div>}
    <details><summary>实验范围</summary><p>固定游戏版本、牌组、遭遇、策略和种子后运行。实验结果仅描述所选自动策略，不代表玩家胜率。</p></details>
    {(error || resource.error || data?.experiment?.error) && <p role="alert">{error || resource.error?.message || data?.experiment?.error}</p>}
    {resource.error && data?.reports.length ? <p>以下保留上次读取的历史报告；本次刷新失败，当前项目状态尚未核实。</p> : null}
    {data?.status === 'interrupted' && <p>实验进程已中断。已保存报告仍可读取，可继续原固定版本。</p>}
    <div className="controls">
      <Button size="sm" variant="secondary" isDisabled={preparing || running || resource.stale} onPress={() => void invoke('fresh')}>{preparing ? '正在准备…' : '准备当前版本'}</Button>
      {data?.experiment && !running && <Button size="sm" variant="tertiary" isDisabled={preparing || resource.stale} onPress={() => void invoke('resume')}>继续固定版本</Button>}
      {running && data?.experiment?.url && <><a href={data.experiment.url} target="_blank" rel="noreferrer">打开对局执行页 ↗</a><Button size="sm" variant="tertiary" isDisabled={preparing} onPress={() => void invoke('stop')}>停止实验进程</Button></>}
      <Button size="sm" variant="tertiary" isDisabled={busy} onPress={() => void resource.refresh().catch(() => undefined)}>刷新报告</Button>
    </div>
    <CandidateSources disabled={preparing || running || resource.stale} prepare={candidate => void invoke('fresh', candidate)}/>
    {data?.experiment && <details><summary>固定版本详情</summary><small>{sourceLabel(data.experiment.source)} · 版本 {data.experiment.contentRevision.slice(0, 8)} · {new Date(data.experiment.createdAt).toLocaleString()}。项目修改不会进入这份快照。</small></details>}
    {!data ? (!resource.error && <p>正在读取对局报告…</p>) : !data.reports.length ? (!resource.error && <p>尚无自动对局报告。准备版本后，在执行页选择牌组、遭遇和运行规模。</p>) : <ScrollShadow style={{ maxHeight: 400 }}><div>{data.reports.map(({ experimentId, reportId, source, report, projectCheck }) => <article key={`${experimentId}:${reportId}`}>
      <details><summary><strong>{report.settings.deckId} × {report.settings.encounterId}</strong> · {rate(report.summary.victoryRate)} · {report.summary.valid} 局完成{projectCheck?.status === 'different-project' ? ' · 与当前项目不同' : projectCheck?.status !== 'matches-project' ? ' · 版本待核对' : ''}</summary>
      <p>{report.summary.valid} 局完成 · {report.summary.victories} 胜 / {report.summary.defeats} 负 / {report.summary.draws} 平 · {report.summary.incomplete} 局未完成 · {report.summary.failed} 局失败{report.summary.cancelled ? ' · 已取消' : ''}</p>
      <p>描述性胜率：{report.summary.victoryRate === null ? '无有效样本' : `${(report.summary.victoryRate * 100).toFixed(1)}%`}（仅限 {report.summary.valid} 局完成样本；未完成与失败不计入）</p>
      <p>样本充分性尚未评估；胜率只描述以上完成样本。</p>
      <small>{sourceLabel(source)} · 历史快照 {report.contentRevision.slice(0, 8)} · 规则 {report.runtimeRevision.slice(0, 8)} · {new Date(report.createdAt).toLocaleString()}</small>
      <p>{projectCheck?.status === 'matches-project' ? '核对时项目文件一致' : projectCheck?.status === 'different-project' ? source?.kind === 'candidate' ? '候选内容与当前项目不同' : '报告已过期：当前项目文件已变化' : '尚无法核对当前项目'}{projectCheck ? ` · ${new Date(projectCheck.checkedAt).toLocaleString()}` : ''}。仅核对项目内容、源码和依赖声明；未核对外部引擎与执行器。刷新报告可重新核对。</p>
      {projectCheck?.error && <p role="alert">核对失败：{projectCheck.error}</p>}
      <div className="controls">
        <Button size="sm" variant="tertiary" aria-pressed={sameReport(before, { experimentId, reportId })} isDisabled={resource.stale} onPress={() => setBefore({ experimentId, reportId })}>{sameReport(before, { experimentId, reportId }) ? '已选为基准' : '设为比较基准'}</Button>
        <Button size="sm" variant="tertiary" aria-pressed={sameReport(after, { experimentId, reportId })} isDisabled={resource.stale || sameReport(before, { experimentId, reportId })} onPress={() => setAfter({ experimentId, reportId })}>{sameReport(after, { experimentId, reportId }) ? '已选为对照' : '设为对照报告'}</Button>
      </div>
      <details><summary>实验设置</summary><p>策略 {report.settings.policyVersion} · 种子 {report.settings.seeds.join(', ')} · 已执行 {report.summary.executed}/{report.summary.requested} 局</p><p>先手：{report.settings.opening === 'player-first' ? '玩家先行动（非对称遭遇）' : '未记录'} · 每局预算：{report.settings.turnLimit ?? '未记录'} 回合 / {report.settings.actionLimit ?? '未记录'} 动作</p></details></details>
    </article>)}</div></ScrollShadow>}
    {(before || after) && <section aria-label="报告比较" style={{ overflowWrap: 'anywhere' }}>
      <strong>报告比较</strong>
      <p>基准：{before ? before.reportId.slice(0, 8) : '未选择'} · 对照：{after ? after.reportId.slice(0, 8) : '未选择'}。仅比较相同牌组、遭遇、策略、种子和预算。</p>
      <Button size="sm" variant="tertiary" onPress={() => { setBefore(undefined); setAfter(undefined); }}>清除比较选择</Button>
      {before && after && !sameReport(before, after) && <BattleComparison key={`${before.experimentId}:${before.reportId}:${after.experimentId}:${after.reportId}`} before={before} after={after} onSelect={onSelect}/>}
      {before && after && sameReport(before, after) && <p>请选择另一份对照报告。</p>}
    </section>}
  </section>;
}
