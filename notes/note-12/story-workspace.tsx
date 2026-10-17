import {CollectionPagination} from './content-collection';
import { useState } from 'react';
import { Button, ScrollShadow, SearchField } from '@heroui/react';
import { useNote } from "@dsh-workbench/react";
import { StoryExecutionReport } from './story-execution-report';
import {useStoryView,type StoryReport} from "./story-model";
import {StoryMap} from "./story-map";
export function StoryWorkspace({ selected, selectedNode, onNodeSelect, onSelect, onSource }: {
    selected?: string;
    selectedNode?: string;
    onNodeSelect: (id: string) => Promise<void>;
    onSelect: (id: string) => Promise<void>;
    onSource: (source: {
        id: string;
        path: string;
        revision: string;
    }) => Promise<void>;
}) {
    const [query, setQuery] = useState('');
    const nodeId = selectedNode;
    const [nodeQuery, setNodeQuery] = useState('');
    const {catalog,report,reportData,selectionError,setSelectionError,select,selectNode}=useStoryView({selected,onSelect,onNodeSelect},20,query);
    const body = useNote<typeof import("./actions")>().useQuery('storyAnalysis', { id: selected || '', nodeId: nodeId || '', ...(reportData?.revision ? { expectedRevision: reportData.revision } : {}) }, { enabled: Boolean(selected && nodeId && reportData?.revision) });
    const bodyData=body.data&&'selectedNode' in body.data?body.data:undefined;
    const node = reportData?.nodes.find(item => item.id === nodeId);
    const incoming = reportData?.edges.filter(edge => edge.to === nodeId) || [];
    const outgoing = reportData?.edges.filter(edge => edge.from === nodeId) || [];
    const candidates = reportData?.nodes.filter(item => `${item.id} ${item.title} ${item.chapter}`.includes(nodeQuery)) || [];
    return <section className="cg-story">
    <style>{`.cg-story{padding:16px;color:var(--wb-ink);display:flex;flex-direction:column;gap:12px;min-width:0}.cg-story.compact{height:100dvh;box-sizing:border-box;font-size:12px;gap:8px}.cg-story header{display:flex;align-items:center;justify-content:space-between;gap:8px}.cg-story small,.cg-story p{color:var(--wb-muted)}.cg-story p{margin:0}.cg-story-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.cg-story-entry-select{width:100%;max-width:420px;height:38px;box-sizing:border-box;padding:0 10px;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small,8px);background:var(--wb-paper);color:var(--wb-ink);font:inherit}.cg-story-list{display:flex;flex-direction:column;gap:8px;min-width:0}.cg-story-list button{justify-content:flex-start;white-space:normal;height:auto;text-align:left;overflow-wrap:anywhere;padding:8px}.cg-story main{display:flex;flex-direction:column;gap:16px;min-width:0}.cg-story-nodes{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.cg-story-nodes button{width:100%;border-radius:var(--wb-radius-small,8px);height:auto;white-space:normal;text-align:left;display:flex;flex-direction:column;align-items:flex-start;padding:12px;overflow-wrap:anywhere}.cg-story-detail button{white-space:normal;height:auto;justify-content:flex-start;text-align:left;width:100%}.cg-story-neighborhood{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.cg-story-neighborhood>div{display:flex;flex-direction:column;gap:8px;min-width:0}.cg-story-neighborhood button{min-height:44px;padding:8px 12px}.cg-story-neighborhood pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}.cg-story-detail{display:flex;flex-direction:column;gap:10px;padding:16px;background:var(--wb-surface);border-radius:12px;overflow-wrap:anywhere}.cg-story-error{color:var(--wb-danger)}@media(max-width:680px){.cg-story-layout,.cg-story-neighborhood{grid-template-columns:minmax(0,1fr)}.cg-story-nodes{grid-template-columns:minmax(0,1fr)}}`}</style>
    <header><strong>剧情</strong><small>{catalog.data ? `${catalog.total} 个正式入口` : '游戏内容目录'}</small></header>
    {selectionError && <p role="alert">{selectionError}</p>}
    {catalog.error && <p role="alert" className="cg-story-error">{catalog.error.message}<Button size="sm" variant="tertiary" onPress={() => void catalog.refresh()}>重试</Button></p>}
    {catalog.loading && !catalog.data && <p>正在读取剧情目录…</p>}
    {!catalog.loading && catalog.total === 0 && <p>游戏目录中还没有登记剧情。</p>}
    {<SearchField aria-label="搜索剧情入口" value={query} onChange={value => { setQuery(value); }} fullWidth><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="剧情 ID 或路径"/><SearchField.ClearButton aria-label="清空搜索"/></SearchField.Group></SearchField>}
    {<div className="cg-story-layout">
      <div className="cg-story-list"><select className="cg-story-entry-select" aria-label="选择剧情入口" value={selected || ''} onChange={event => void select(event.target.value)}>
        <option value="" disabled>选择剧情入口</option>
        {selected && !catalog.items.some(item => item.id === selected) && <option value={selected}>{selected}</option>}
        {catalog.items.map(item => <option key={item.id} value={item.id}>{item.id}</option>)}
      </select>
        {<CollectionPagination page={catalog} label="剧情入口" />}
      </div>
      {<main>
        {!selected && <p>选择一个入口，查看正式版本的节点、分支与结构问题。</p>}
        {report.error && <p role="alert" className="cg-story-error">{report.error.message}<Button size="sm" variant="tertiary" onPress={() => void report.refresh()}>重新读取</Button></p>}
        {report.loading && !reportData && selected && <p>正在读取剧情…</p>}
        {reportData && <>
          <header><strong>{reportData.title}</strong>{report.stale && <small>正在更新</small>}</header>
          <p>{reportData.nodes.length} 节点 · {reportData.edges.length} 分支 · {reportData.terminalIds.length} 终点 · {reportData.conditionalCount} 条条件分支</p>
          <ScrollShadow style={{ height: 240 }}><StoryMap report={reportData} selectedNode={nodeId} onSelect={selectNode}/></ScrollShadow>
          <details><summary>结构与条件检查{reportData.findings.length ? ` · ${reportData.findings.length} 项问题` : ''}</summary><small>版本 {reportData.revision.slice(0, 8)}</small><p>结构可达 {reportData.reachableCount} 个节点。结构统计不考虑玩家条件；终点不自动视为错误。</p>
          <StoryExecutionReport key={selected} id={selected!} revision={reportData.revision} ready={!report.stale && !report.error} onNodeSelect={onNodeSelect}/></details>
          {reportData.findings.length > 0 && <details><summary>{reportData.findings.length} 项结构问题</summary><ScrollShadow style={{ maxHeight: 240 }}>{reportData.findings.map((finding, index) => <p key={index}>{finding.id}：{finding.detail}</p>)}</ScrollShadow></details>}
          {node && <section className="cg-story-detail"><strong>{node.title}</strong><small>{node.id}</small><p>{node.summary || '此节点没有摘要。'}</p>
            {body.error && <p role="alert">正文读取失败：{body.error.message}<Button size="sm" variant="tertiary" onPress={() => void body.refresh().catch(() => undefined)}>重试正文</Button></p>}
            {body.loading && !bodyData && <p>正在读取节点正文…</p>}
            {bodyData?.revision === reportData.revision && bodyData?.selectedNode?.id === node.id && <div aria-label="游戏节点原文"><strong>游戏节点原文</strong><p style={{ whiteSpace: 'pre-wrap' }}>{bodyData?.selectedNode.detail || '此节点没有正文。'}</p>{bodyData?.selectedNode.onEnter.length > 0 && <details><summary>进入节点时的结果</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(bodyData?.selectedNode.onEnter, null, 2)}</pre></details>}</div>}
            <div className="cg-story-list" aria-label="关联场景原文">
              {(node.sources ?? []).map(source => <Button key={source.id} size="sm" variant="secondary" onPress={() => { setSelectionError(''); void onSource(source).catch(error => setSelectionError(error instanceof Error ? error.message : String(error))); }}>查看原文：{source.title} · {source.path}</Button>)}
              {!node.sources?.length ? <small>未找到同 ID 的 Markdown 场景原文；当前展示来自游戏 JSON。</small> : <small>按节点 ID 关联当前原文；原文版本与运行版本可能不同，请在制作候选前核对。{(node.sourceCount ?? 0) > 1 ? ` 找到 ${node.sourceCount} 份同 ID 原文，请确认来源。` : ''}{(node.sourceCount ?? 0) > 5 ? ' 此处展示前 5 份。' : ''}</small>}
            </div>
            <div className="cg-story-neighborhood" aria-label="当前节点的前后分支">
              <StoryBranches key={`${selected}:${node.id}:incoming`} direction="incoming" edges={incoming} nodes={reportData.nodes} onSelect={selectNode}/>
              <div><small>当前位置</small><strong>{node.title}</strong>{reportData.terminalIds.includes(node.id) && <small>终点 · 无后续分支</small>}</div>
              <StoryBranches key={`${selected}:${node.id}:outgoing`} direction="outgoing" edges={outgoing} nodes={reportData.nodes} onSelect={selectNode}/>
            </div>
          </section>}
          <SearchField aria-label="搜索剧情节点" value={nodeQuery} onChange={setNodeQuery} fullWidth><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="节点名称、章节或 ID"/><SearchField.ClearButton aria-label="清空搜索"/></SearchField.Group></SearchField>
          <ScrollShadow style={{ maxHeight: 420 }}><div className="cg-story-nodes">{candidates.slice(0, 100).map(item => <Button key={item.id} variant={nodeId === item.id ? 'secondary' : 'tertiary'} onPress={() => void selectNode(item.id)}><strong>{item.title}</strong><small>{item.id === reportData?.entry ? '入口 · ' : ''}{item.chapter || item.type}</small></Button>)}</div></ScrollShadow>
          {candidates.length > 100 && <small>展示前 100 个匹配节点，请缩小搜索范围。</small>}
        </>}
      </main>}
    </div>}
  </section>;
}
function StoryBranches({ direction, edges, nodes, onSelect }: {
    direction: 'incoming' | 'outgoing';
    edges: StoryReport['edges'];
    nodes: StoryReport['nodes'];
    onSelect(id: string): Promise<void>;
}) {
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
