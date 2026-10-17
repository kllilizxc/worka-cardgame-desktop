import { Button, ScrollShadow } from '@heroui/react';
import type { LibraryState } from './content-model';
import { BattleExperiments } from './battle-experiments';
type Metric=import('./contract').ContentQueryOutput<'balanceOverview'>['groups'][number]['attack'];

import {useBalanceView,balanceLabels as labels} from './balance-model';
const metric = (value: Metric) => value ? `${value.mean.toFixed(1)}（${value.min}–${value.max}；${value.sample} 张）` : '未定义';
export function BalanceWorkspace({ selectedMetric, onSelectMetric, battleSelection, onSelectBattle }: {
    battleSelection?: NonNullable<LibraryState['views']>['battleComparisonSelection'];
    onSelectBattle: (selection: NonNullable<LibraryState['views']>['battleComparisonSelection']) => Promise<void>;
    selectedMetric?: {
        kind: string;
        metric: 'attack' | 'health';
    };
    onSelectMetric: (kind: string, metric: 'attack' | 'health') => Promise<void>;
}) {
    const {error,select,report,decks,encounters}=useBalanceView(onSelectMetric);
    return <section className="cg-balance">
    <style>{`.cg-balance{padding:16px;display:flex;flex-direction:column;gap:16px;color:var(--wb-ink);min-width:0}.cg-balance.compact{height:100dvh;box-sizing:border-box;font-size:12px;gap:10px}.cg-balance header{display:flex;justify-content:space-between;align-items:center;gap:8px}.cg-balance small,.cg-balance p{color:var(--wb-muted);margin:0}.cg-balance-counts{display:flex;gap:20px;flex-wrap:wrap}.cg-balance-counts span{display:flex;flex-direction:column;gap:4px}.cg-balance-counts strong{font-size:24px;color:var(--wb-ink)}.cg-balance table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}.cg-balance th,.cg-balance td{padding:12px;white-space:nowrap}.cg-balance tbody tr:nth-child(odd){background:var(--wb-surface)}.cg-balance-empty{padding:16px;background:var(--wb-surface);border-radius:12px;display:flex;flex-direction:column;gap:8px}`}</style>
    <header><strong>数值</strong><small>正式卡牌定义</small></header>
    {error && <p role="alert">{error}</p>}
    {report.error && <p role="alert">{report.error.message}<Button size="sm" variant="tertiary" onPress={() => void report.refresh()}>重试</Button></p>}
    {report.loading && !report.data && <p>正在读取数值…</p>}
    {report.data && <div className="cg-balance-counts"><span><strong>{report.data.cardCount}</strong>卡牌</span><span><strong>{decks.data?.total ?? '—'}</strong>牌组</span><span><strong>{encounters.data?.total ?? '—'}</strong>遭遇</span></div>}
    <>
      {(decks.error || encounters.error) && <p role="alert">游戏目录读取失败：{decks.error?.message || encounters.error?.message}</p>}
      {report.data && <><details><summary>定义统计范围{report.stale ? ' · 正在更新' : ''}</summary><p>版本 {report.data.revision.slice(0, 12)}。平均值只统计填写了该字段的卡牌；不含战斗中的增益和效果。</p></details>
      <ScrollShadow orientation="horizontal"><table><thead><tr><th>类型</th><th>数量</th><th>攻击均值（范围；样本）</th><th>生命均值（范围；样本）</th></tr></thead><tbody>{report.data.groups.map(group => <tr key={group.kind}><td>{labels[group.kind] || group.kind}</td><td>{group.count}</td>{(['attack', 'health'] as const).map(key => <td key={key}><Button size="sm" variant={selectedMetric?.kind === group.kind && selectedMetric.metric === key ? 'secondary' : 'tertiary'} aria-pressed={selectedMetric?.kind === group.kind && selectedMetric.metric === key} aria-label={`选择${labels[group.kind] || group.kind}的${key === 'attack' ? '攻击' : '生命'}统计`} isDisabled={!group[key]} onPress={() => void select(group.kind, key)}>{metric(group[key])}</Button></td>)}</tr>)}</tbody></table></ScrollShadow></>}
      <BattleExperiments selection={battleSelection} onSelect={onSelectBattle}/>
    </>
  </section>;
}
