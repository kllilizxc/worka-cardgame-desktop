import { useState } from 'react';
import { Button, ScrollShadow, SearchField } from '@heroui/react';
import {useResource} from './surface';
import { StoryExecutionReport } from './story-execution-report';

interface StoryReport {
  id: string; title: string; path: string; revision: string; entry: string;
  nodes: Array<{ id: string; title: string; summary: string; type: string; chapter: string; sourceCount?: number; sources?: Array<{ id: string; path: string; title: string; revision: string }> }>;
  edges: Array<{ id: string; from: string; to: string; text: string; conditional: boolean; enabledWhen?: unknown; visibleWhen?: unknown; effects?: unknown[] }>;
  selectedNode?: { id: string; detail: string; onEnter: unknown[] };
  findings: Array<{ kind: string; id: string; detail: string }>;
  terminalIds: string[]; reachableCount: number; conditionalCount: number;
}

export function StoryWorkspace({ compact, selected, selectedNode, onNodeSelect, onSelect, onSource }: { compact: boolean; selected?: string; selectedNode?: string; onNodeSelect: (id: string) => Promise<void>; onSelect: (id: string) => Promise<void>; onSource: (source: { id: string; path: string; revision: string }) => Promise<void> }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState<string>();
  const nodeId = selectedNode;
  const [nodeQuery, setNodeQuery] = useState('');
  const [selectionError, setSelectionError] = useState('');
  async function select(id: string) {
    setSelectionError('');
    try { await onSelect(id); } catch (error) { setSelectionError(error instanceof Error ? error.message : String(error)); }
  }
  async function selectNode(id: string) {
    setSelectionError('');
    try { await onNodeSelect(id); } catch (error) { setSelectionError(error instanceof Error ? error.message : String(error)); }
  }
  const catalog = useResource<{ items: Array<{ id: string; path: string }>; total: number; nextCursor?: string }>('gameCatalog', { kind: 'story', q: query, ...(cursor ? { cursor } : {}), limit: compact ? 3 : 20 });
  const report = useResource<StoryReport>('storyAnalysis', { id: selected || '' }, { enabled: Boolean(selected) });
  const body = useResource<Pick<StoryReport, 'selectedNode' | 'revision'>>('storyAnalysis', { id: selected || '', nodeId: nodeId || '', ...(report.data?.revision ? { expectedRevision: report.data.revision } : {}) }, { enabled: Boolean(selected && nodeId && report.data?.revision) && !compact });
  const node = report.data?.nodes.find(item => item.id === nodeId);
  const incoming = report.data?.edges.filter(edge => edge.to === nodeId) || [];
  const outgoing = report.data?.edges.filter(edge => edge.from === nodeId) || [];
  const candidates = report.data?.nodes.filter(item => `${item.id} ${item.title} ${item.chapter}`.includes(nodeQuery)) || [];
  return <section className={`cg-story ${compact ? 'compact' : ''}`}>
    <style>{`.cg-story{padding:16px;color:var(--wb-ink);display:flex;flex-direction:column;gap:12px;min-width:0}.cg-story.compact{height:100dvh;box-sizing:border-box;font-size:12px;gap:8px}.cg-story header{display:flex;align-items:center;justify-content:space-between;gap:8px}.cg-story small,.cg-story p{color:var(--wb-muted)}.cg-story p{margin:0}.cg-story-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.cg-story-entry-select{width:100%;max-width:420px;height:38px;box-sizing:border-box;padding:0 10px;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small,8px);background:var(--wb-paper);color:var(--wb-ink);font:inherit}.cg-story-list{display:flex;flex-direction:column;gap:8px;min-width:0}.cg-story-list button{justify-content:flex-start;white-space:normal;height:auto;text-align:left;overflow-wrap:anywhere;padding:8px}.cg-story main{display:flex;flex-direction:column;gap:16px;min-width:0}.cg-story-nodes{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.cg-story-nodes button{width:100%;border-radius:var(--wb-radius-small,8px);height:auto;white-space:normal;text-align:left;display:flex;flex-direction:column;align-items:flex-start;padding:12px;overflow-wrap:anywhere}.cg-story-detail button{white-space:normal;height:auto;justify-content:flex-start;text-align:left;width:100%}.cg-story-neighborhood{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.cg-story-neighborhood>div{display:flex;flex-direction:column;gap:8px;min-width:0}.cg-story-neighborhood button{min-height:44px;padding:8px 12px}.cg-story-neighborhood pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}.cg-story-detail{display:flex;flex-direction:column;gap:10px;padding:16px;background:var(--wb-surface);border-radius:12px;overflow-wrap:anywhere}.cg-story-error{color:var(--wb-danger)}@media(max-width:680px){.cg-story-layout,.cg-story-neighborhood{grid-template-columns:minmax(0,1fr)}.cg-story-nodes{grid-template-columns:minmax(0,1fr)}}`}</style>
    <header><strong>剧情</strong><small>{catalog.data ? `${catalog.data.total} 个正式入口` : '游戏内容目录'}</small></header>
    {selectionError && <p role="alert">{selectionError}</p>}
    {catalog.error && <p role="alert" className="cg-story-error">{catalog.error.message}<Button size="sm" variant="tertiary" onPress={() => void catalog.revalidate()}>重试</Button></p>}
    {catalog.loading && !catalog.data && <p>正在读取剧情目录…</p>}
    {!catalog.loading && catalog.data?.total === 0 && <p>游戏目录中还没有登记剧情。</p>}
    {!compact && <SearchField aria-label="搜索剧情入口" value={query} onChange={value => { setQuery(value); setCursor(undefined); }} fullWidth><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="剧情 ID 或路径" /><SearchField.ClearButton aria-label="清空搜索" /></SearchField.Group></SearchField>}
    {compact && <>
      <style>{`.cg-story.compact{padding:12px;gap:6px}.cg-story-compact-map{flex:1;min-height:72px}.cg-story.compact .cg-story-entry-select{height:26px;max-width:none;border:0;padding:0;background:transparent}.cg-story-map{display:block;width:100%;height:100%;overflow:visible}.cg-story-map .cg-story-node{cursor:pointer}.cg-story-map .cg-story-node:focus-visible{outline:none}.cg-story-map .cg-story-node:focus-visible .cg-story-shape,.cg-story-map .cg-story-node:hover .cg-story-shape{stroke:var(--wb-accent);stroke-width:2}.cg-story-map text{fill:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px}.cg-story.compact>small{flex-shrink:0}`}</style>
      <select className="cg-story-entry-select" aria-label="选择剧情入口" value={selected || ''} onChange={event => void select(event.target.value)}>
        <option value="" disabled>选择剧情入口</option>
        {selected && !catalog.data?.items.some(item => item.id === selected) && <option value={selected}>{report.data?.title || selected}</option>}
        {catalog.data?.items.map(item => <option key={item.id} value={item.id}>{item.id === selected ? report.data?.title || item.id : item.id}</option>)}
      </select>
      {report.error && <p role="alert">{report.error.message}</p>}
      {report.loading && !report.data && selected && <p role="status">正在读取剧情…</p>}
      {report.data && <><div className="cg-story-compact-map"><StoryMap report={report.data} compact selectedNode={nodeId} onSelect={selectNode} /></div><small>{report.data.nodes.length} 节点 · {report.data.edges.length} 分支 · {report.data.terminalIds.length} 终点{report.data.nodes.length > 6 ? ' · 图示前 6 节点' : ''}</small></>}
    </>}
    {!compact && <div className="cg-story-layout">
      <div className="cg-story-list"><select className="cg-story-entry-select" aria-label="选择剧情入口" value={selected || ''} onChange={event => void select(event.target.value)}>
        <option value="" disabled>选择剧情入口</option>
        {selected && !catalog.data?.items.some(item => item.id === selected) && <option value={selected}>{selected}</option>}
        {catalog.data?.items.map(item => <option key={item.id} value={item.id}>{item.id}</option>)}
      </select>
        {!compact && <div>{cursor && <Button size="sm" variant="tertiary" onPress={() => setCursor(undefined)}>首页</Button>}{catalog.data?.nextCursor && <Button size="sm" variant="tertiary" onPress={() => setCursor(catalog.data?.nextCursor)}>下一页</Button>}</div>}
      </div>
      {!compact && <main>
        {!selected && <p>选择一个入口，查看正式版本的节点、分支与结构问题。</p>}
        {report.error && <p role="alert" className="cg-story-error">{report.error.message}<Button size="sm" variant="tertiary" onPress={() => void report.revalidate()}>重新读取</Button></p>}
        {report.loading && !report.data && selected && <p>正在读取剧情…</p>}
        {report.data && <>
          <header><strong>{report.data.title}</strong>{report.stale && <small>正在更新</small>}</header>
          <p>{report.data.nodes.length} 节点 · {report.data.edges.length} 分支 · {report.data.terminalIds.length} 终点 · {report.data.conditionalCount} 条条件分支</p>
          <ScrollShadow style={{ height: 240 }}><StoryMap report={report.data} selectedNode={nodeId} onSelect={selectNode} /></ScrollShadow>
          <details><summary>结构与条件检查{report.data.findings.length ? ` · ${report.data.findings.length} 项问题` : ''}</summary><small>版本 {report.data.revision.slice(0, 8)}</small><p>结构可达 {report.data.reachableCount} 个节点。结构统计不考虑玩家条件；终点不自动视为错误。</p>
          <StoryExecutionReport key={selected} id={selected!} revision={report.data.revision} ready={!report.stale && !report.error} onNodeSelect={onNodeSelect} /></details>
          {report.data.findings.length > 0 && <details><summary>{report.data.findings.length} 项结构问题</summary><ScrollShadow style={{ maxHeight: 240 }}>{report.data.findings.map((finding, index) => <p key={index}>{finding.id}：{finding.detail}</p>)}</ScrollShadow></details>}
          {node && <section className="cg-story-detail"><strong>{node.title}</strong><small>{node.id}</small><p>{node.summary || '此节点没有摘要。'}</p>
            {body.error && <p role="alert">正文读取失败：{body.error.message}<Button size="sm" variant="tertiary" onPress={() => void body.revalidate().catch(() => undefined)}>重试正文</Button></p>}
            {body.loading && !body.data && <p>正在读取节点正文…</p>}
            {body.data?.revision === report.data.revision && body.data?.selectedNode?.id === node.id && <div aria-label="游戏节点原文"><strong>游戏节点原文</strong><p style={{ whiteSpace: 'pre-wrap' }}>{body.data?.selectedNode.detail || '此节点没有正文。'}</p>{body.data?.selectedNode.onEnter.length > 0 && <details><summary>进入节点时的结果</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(body.data?.selectedNode.onEnter, null, 2)}</pre></details>}</div>}
            <div className="cg-story-list" aria-label="关联场景原文">
              {(node.sources ?? []).map(source => <Button key={source.id} size="sm" variant="secondary" onPress={() => { setSelectionError(''); void onSource(source).catch(error => setSelectionError(error instanceof Error ? error.message : String(error))); }}>查看原文：{source.title} · {source.path}</Button>)}
              {!node.sources?.length ? <small>未找到同 ID 的 Markdown 场景原文；当前展示来自游戏 JSON。</small> : <small>按节点 ID 关联当前原文；原文版本与运行版本可能不同，请在制作候选前核对。{(node.sourceCount ?? 0) > 1 ? ` 找到 ${node.sourceCount} 份同 ID 原文，请确认来源。` : ''}{(node.sourceCount ?? 0) > 5 ? ' 此处展示前 5 份。' : ''}</small>}
            </div>
            <div className="cg-story-neighborhood" aria-label="当前节点的前后分支">
              <StoryBranches key={`${selected}:${node.id}:incoming`} direction="incoming" edges={incoming} nodes={report.data.nodes} onSelect={selectNode} />
              <div><small>当前位置</small><strong>{node.title}</strong>{report.data.terminalIds.includes(node.id) && <small>终点 · 无后续分支</small>}</div>
              <StoryBranches key={`${selected}:${node.id}:outgoing`} direction="outgoing" edges={outgoing} nodes={report.data.nodes} onSelect={selectNode} />
            </div>
          </section>}
          <SearchField aria-label="搜索剧情节点" value={nodeQuery} onChange={setNodeQuery} fullWidth><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="节点名称、章节或 ID" /><SearchField.ClearButton aria-label="清空搜索" /></SearchField.Group></SearchField>
          <ScrollShadow style={{ maxHeight: 420 }}><div className="cg-story-nodes">{candidates.slice(0, 100).map(item => <Button key={item.id} variant={nodeId === item.id ? 'secondary' : 'tertiary'} onPress={() => void selectNode(item.id)}><strong>{item.title}</strong><small>{item.id === report.data?.entry ? '入口 · ' : ''}{item.chapter || item.type}</small></Button>)}</div></ScrollShadow>
          {candidates.length > 100 && <small>展示前 100 个匹配节点，请缩小搜索范围。</small>}
        </>}
      </main>}
    </div>}
  </section>;
}

function StoryMap({ report, compact = false, selectedNode, onSelect }: { report: StoryReport; compact?: boolean; selectedNode?: string; onSelect(id: string): Promise<void> }) {
  const nodes = report.nodes.slice(0, compact ? 6 : 100);
  const ids = new Set(nodes.map(node => node.id));
  const depths = new Map<string, number>();
  const queue = ids.has(report.entry) ? [report.entry] : nodes.length ? [nodes[0].id] : [];
  if (queue.length) depths.set(queue[0], 0);
  for (let index = 0; index < queue.length; index++) {
    for (const edge of report.edges.filter(edge => edge.from === queue[index] && ids.has(edge.to))) {
      if (!depths.has(edge.to)) { depths.set(edge.to, Math.min((depths.get(queue[index]) ?? 0) + 1, compact ? 3 : 10)); queue.push(edge.to); }
    }
  }
  const lastDepth = Math.max(0, ...depths.values()) + 1;
  const rows = new Map<number, number>();
  const positions = new Map(nodes.map(node => {
    const depth = depths.get(node.id) ?? lastDepth, row = rows.get(depth) ?? 0;
    rows.set(depth, row + 1);
    return [node.id, { x: 82 + depth * 164, y: 26 + row * 48 }] as const;
  }));
  const width = Math.max(164, ...Array.from(positions.values()).map(point => point.x + 82));
  const height = Math.max(52, ...Array.from(positions.values()).map(point => point.y + 26));
  return <svg className="cg-story-map" role="group" aria-label="剧情分支图" viewBox={`0 0 ${width} ${height}`} style={compact ? undefined : { display: 'block', width: Math.max(560, width), height: Math.max(160, height), maxWidth: 'none' }}>
    <style>{`.cg-story-map text{fill:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px}.cg-story-node{cursor:pointer}.cg-story-node:focus-visible{outline:none}.cg-story-node:focus-visible .cg-story-shape,.cg-story-node:hover .cg-story-shape{stroke:var(--wb-accent);stroke-width:2}`}</style>
    {report.edges.filter(edge => positions.has(edge.from) && positions.has(edge.to)).map(edge => {
      const from = positions.get(edge.from)!, to = positions.get(edge.to)!;
      return <g key={edge.id}><title>{edge.text}{edge.conditional ? ' · 有条件' : ''}</title><path d={`M ${from.x + 66} ${from.y} C ${from.x + 100} ${from.y}, ${to.x - 100} ${to.y}, ${to.x - 66} ${to.y}`} fill="none" stroke={edge.conditional ? 'var(--wb-warning)' : 'var(--wb-muted-light)'} strokeWidth="1.5" /><path d={`M ${to.x - 72} ${to.y - 3} L ${to.x - 66} ${to.y} L ${to.x - 72} ${to.y + 3}`} fill="none" stroke={edge.conditional ? 'var(--wb-warning)' : 'var(--wb-muted-light)'} strokeWidth="1.5" /></g>;
    })}
    {nodes.map(node => {
      const point = positions.get(node.id)!;
      const terminal = report.terminalIds.includes(node.id);
      return <g key={node.id} className="cg-story-node" role="button" tabIndex={0} aria-label={`查看节点 ${node.title}`} aria-pressed={selectedNode === node.id} transform={`translate(${point.x},${point.y})`} onClick={() => void onSelect(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); void onSelect(node.id); } }}>
        <title>{node.title}{terminal ? ' · 终点' : node.id === report.entry ? ' · 入口' : ''}</title>
        <rect className="cg-story-shape" x="-66" y="-17" width="132" height="34" rx={terminal ? 17 : 6} fill={selectedNode === node.id ? 'var(--wb-accent-pale)' : terminal ? 'var(--wb-success-pale)' : 'var(--wb-surface-deep)'} stroke={selectedNode === node.id ? 'var(--wb-accent)' : 'transparent'} />
        <text textAnchor="middle" dominantBaseline="central">{node.title.length > 8 ? `${node.title.slice(0, 7)}…` : node.title}</text>
      </g>;
    })}
  </svg>;
}

function StoryBranches({ direction, edges, nodes, onSelect }: { direction: 'incoming' | 'outgoing'; edges: StoryReport['edges']; nodes: StoryReport['nodes']; onSelect(id: string): Promise<void> }) {
  const [visible, setVisible] = useState(8);
  const incoming = direction === 'incoming', label = incoming ? '前置分支' : '后续分支';
  return <div aria-label={label}><small>{incoming ? '前置节点' : label} · {edges.length} 条</small>
    {edges.slice(0, visible).map(edge => {
      const targetId = incoming ? edge.from : edge.to, target = nodes.find(node => node.id === targetId);
      return <div key={edge.id}><Button variant="tertiary" isDisabled={!target} onPress={() => void onSelect(targetId)}>{incoming ? target?.title || targetId : edge.text}{!incoming && edge.conditional ? ' · 有条件' : ''} →</Button>
        {!incoming && (edge.conditional || edge.effects?.length) && <details><summary>条件与结果</summary><pre>{JSON.stringify({ enabledWhen: edge.enabledWhen, visibleWhen: edge.visibleWhen, effects: edge.effects }, null, 2)}</pre></details>}
      </div>;
    })}
    {!edges.length && <p>无{label}</p>}
    {edges.length > visible && <Button size="sm" variant="secondary" onPress={() => setVisible(count => count + 8)}>查看更多{label}（剩余 {edges.length - visible} 条）</Button>}
  </div>;
}
