import {Button} from '@heroui/react';
import {useBalanceView,balanceLabels as labels,type BalanceSelection} from './balance-model';
import {BattleExperimentSummary} from './battle-summary';
export function BalanceCompact({selectedMetric,onSelectMetric,openCards}:BalanceSelection&{openCards():void}){
  const {error,select,report,decks,encounters,measuredGroup}=useBalanceView(onSelectMetric);
  return <section className="cg-balance compact">
    <style>{`.cg-balance{padding:16px;display:flex;flex-direction:column;gap:16px;color:var(--wb-ink);min-width:0}.cg-balance.compact{height:100dvh;box-sizing:border-box;font-size:12px;gap:10px}.cg-balance header{display:flex;justify-content:space-between;align-items:center;gap:8px}.cg-balance small,.cg-balance p{color:var(--wb-muted);margin:0}.cg-balance-counts{display:flex;gap:20px;flex-wrap:wrap}.cg-balance-counts span{display:flex;flex-direction:column;gap:4px}.cg-balance-counts strong{font-size:24px;color:var(--wb-ink)}.cg-balance table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}.cg-balance th,.cg-balance td{padding:12px;white-space:nowrap}.cg-balance tbody tr:nth-child(odd){background:var(--wb-surface)}.cg-balance-empty{padding:16px;background:var(--wb-surface);border-radius:12px;display:flex;flex-direction:column;gap:8px}`}</style>
    <header><strong>数值</strong><small>正式卡牌定义</small><Button size="sm" variant="tertiary" onPress={openCards}>卡牌数值 ↗</Button></header>
    {error && <p role="alert">{error}</p>}
    {report.error && <p role="alert">{report.error.message}<Button size="sm" variant="tertiary" onPress={() => void report.refresh()}>重试</Button></p>}
    {report.loading && !report.data && <p>正在读取数值…</p>}
    {report.data && <div className="cg-balance-counts"><span><strong>{report.data.cardCount}</strong>卡牌</span><span><strong>{decks.data?.total ?? '—'}</strong>牌组</span><span><strong>{encounters.data?.total ?? '—'}</strong>遭遇</span></div>}

      <style>{`.cg-balance.compact{padding:12px;gap:8px}.cg-balance.compact header button{height:24px;min-height:24px;font-size:11px;padding:0 8px}.cg-balance.compact .cg-balance-counts{gap:24px}.cg-balance.compact .cg-balance-counts strong{font-size:20px}.cg-balance-means{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.cg-balance-means button{height:44px;min-height:44px;display:flex;justify-content:space-between;gap:10px;text-align:left;white-space:normal;font-size:12px}.cg-balance-means button strong{font-size:18px}.cg-balance-means button span{color:var(--wb-muted)}`}</style>
      {measuredGroup && <div className="cg-balance-means">{(['attack', 'health'] as const).filter(key => measuredGroup[key]).map(key => <Button key={key} size="sm" variant={selectedMetric?.kind === measuredGroup.kind && selectedMetric.metric === key ? 'secondary' : 'tertiary'} aria-pressed={selectedMetric?.kind === measuredGroup.kind && selectedMetric.metric === key} onPress={() => void select(measuredGroup.kind, key)}><span>{labels[measuredGroup.kind] || measuredGroup.kind}{key === 'attack' ? '攻击' : '生命'}均值</span><strong>{measuredGroup[key]!.mean.toFixed(1)}</strong></Button>)}</div>}
      <BattleExperimentSummary/>

  </section>;
}
