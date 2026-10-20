import {useNote, NoteIcon, QueryState} from '@dsh-workbench/react';
export default function Compact() {
  const {metadata,useQuery}=useNote<typeof import('./actions')>();
  const overview=useQuery('overview',{});
  return <section className="note-overview"><style>{`.note-overview{box-sizing:border-box;height:100dvh;padding:16px;background:var(--wb-paper);color:var(--wb-ink);font:13px/1.45 var(--wb-font-family,system-ui);display:flex;flex-direction:column;gap:12px;min-width:0}.note-overview header{display:flex;align-items:center;gap:8px}.note-overview h2{font-size:14px;margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.note-overview header span{margin-left:auto;color:var(--wb-muted);font-size:12px}.note-overview ul{list-style:none;padding:0;margin:0;display:grid;gap:7px}.note-overview li{display:flex;gap:8px;min-width:0}.note-overview li strong{flex:1;min-width:0;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.note-overview li span,.note-overview p{color:var(--wb-muted);font-size:12px;margin:0}.note-overview footer{margin-top:auto;color:var(--wb-muted);font-size:12px}`}</style>
    <header><NoteIcon icon={metadata.icon} size={16}/><h2>{metadata.name}</h2></header>
    <QueryState query={overview}>{value=><><p>{value.summary}</p><ul>{value.items.slice(0,4).map(item=><li key={item.id}><strong>{item.title}</strong><span>{item.status}</span></li>)}</ul></>}</QueryState>
    <footer>展开查看详情与操作</footer>
  </section>;
}
