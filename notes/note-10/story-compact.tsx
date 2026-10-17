import {useStoryView,type StorySelection} from './story-model';
import {StoryMap} from './story-map';
import {Button} from '@heroui/react';
export function StoryCompact(props:StorySelection){
  const {selected,selectedNode}=props;
  const {catalog,report,reportData,selectionError,select,selectNode}=useStoryView(props,3);
  return <section className="cg-story compact">
    <style>{`.cg-story.compact{height:100dvh;box-sizing:border-box;font-size:12px;display:flex;flex-direction:column;min-width:0;color:var(--wb-ink)}.cg-story header{display:flex;align-items:center;justify-content:space-between;gap:8px}.cg-story small,.cg-story p{color:var(--wb-muted);margin:0}.cg-story-error{color:var(--wb-danger)}`}</style>
    <header><strong>剧情</strong><small>{catalog.data?`${catalog.total} 个正式入口`:'游戏内容目录'}</small></header>
    {selectionError&&<p role="alert">{selectionError}</p>}
    {catalog.error&&<p role="alert" className="cg-story-error">{catalog.error.message}<Button size="sm" variant="tertiary" onPress={()=>void catalog.refresh()}>重试</Button></p>}
    {catalog.loading&&!catalog.data&&<p>正在读取剧情目录…</p>}
    {!catalog.loading&&catalog.total===0&&<p>游戏目录中还没有登记剧情。</p>}

      <style>{`.cg-story.compact{padding:12px;gap:6px}.cg-story-compact-map{flex:1;min-height:72px}.cg-story.compact .cg-story-entry-select{height:26px;max-width:none;border:0;padding:0;background:transparent}.cg-story-map{display:block;width:100%;height:100%;overflow:visible}.cg-story-map .cg-story-node{cursor:pointer}.cg-story-map .cg-story-node:focus-visible{outline:none}.cg-story-map .cg-story-node:focus-visible .cg-story-shape,.cg-story-map .cg-story-node:hover .cg-story-shape{stroke:var(--wb-accent);stroke-width:2}.cg-story-map text{fill:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px}.cg-story.compact>small{flex-shrink:0}`}</style>
      <select className="cg-story-entry-select" aria-label="选择剧情入口" value={selected || ''} onChange={event => void select(event.target.value)}>
        <option value="" disabled>选择剧情入口</option>
        {selected && !catalog.items.some(item => item.id === selected) && <option value={selected}>{reportData?.title || selected}</option>}
        {catalog.items.map(item => <option key={item.id} value={item.id}>{item.id === selected ? reportData?.title || item.id : item.id}</option>)}
      </select>
      {report.error && <p role="alert">{report.error.message}</p>}
      {report.loading && !reportData && selected && <p role="status">正在读取剧情…</p>}
      {reportData && <><div className="cg-story-compact-map"><StoryMap report={reportData} compact selectedNode={selectedNode} onSelect={selectNode}/></div><small>{reportData.nodes.length} 节点 · {reportData.edges.length} 分支 · {reportData.terminalIds.length} 终点{reportData.nodes.length > 6 ? ' · 图示前 6 节点' : ''}</small></>}

  </section>;
}
