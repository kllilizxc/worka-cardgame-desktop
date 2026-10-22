import type { CSSProperties } from 'react';
import { ImagePreview } from './image-preview';
import { AudioGuidance } from './audio-guidance';
import { Button, ScrollShadow } from '@heroui/react';
import { NoteIcon } from '@dsh-workbench/react';
import { useNote } from "@dsh-workbench/react";
import { mediaSource, type AssetItem, type CardItem, type MediaData } from './content-model';
export function CompactGallery({ kind, metadata, open }: {
    kind: 'cards' | 'art' | 'audio';
    metadata: ReturnType<typeof useNote<typeof import("./actions")>>["metadata"];
    open(id: string): void;
}) {
    const resource = useNote<typeof import("./actions")>().useQuery(kind === 'cards' ? 'cards' : 'assets', { limit: kind === 'cards' ? 100 : kind === 'art' ? 6 : 3 });
    const items=resource.data?.items??[];
    const total=resource.data?.total;
    const featured=kind==='cards'?[...items.filter(item=>item.type==='card'&&item.facePreview),...items.filter(item=>item.type!=='card'||!item.facePreview)].slice(0,5):items;
    const title = kind === 'cards' ? '卡牌' : kind === 'art' ? '美术' : '音频';
    return <section className={`cg-gallery-summary cg-gallery-${kind}`}>
    <style>{styles}{fanStyles}</style>
    <header><NoteIcon icon={metadata.icon} size={18}/><strong>{title}</strong><span>{typeof total === 'number' ? `${total} 项` : '尚未读取'}</span></header>
    {resource.error ? <p role="alert">{resource.error.message}</p> : resource.loading ? <p role="status">正在读取{title}…</p> : !items.length ? kind === 'audio' ? <AudioGuidance empty/> : <p>尚无{title}，可通过原生对话提出制作需求。</p> : null}
    {kind === 'audio' ? <ScrollShadow className="cg-audio-content"><div className="cg-audio-summary">{items.map(item => <div key={item.id}>
      <Button size="sm" variant="tertiary" className="cg-audio-title" onPress={() => open(item.id)}>{item.name || item.title || item.id}</Button>
      <span>{item.type==='asset'&&typeof item.durationMs === 'number' ? `${(item.durationMs / 1000).toFixed(1)}秒` : '时长待读取'}</span>
      <Button size="sm" variant="tertiary" onPress={() => open(item.id)} aria-label={`试听 ${item.name || item.id}`}>试听</Button>
    </div>)}</div></ScrollShadow> : <div className={kind === 'cards' ? 'cg-card-fan' : 'cg-summary-gallery'}>{featured.map((item, index) => <Button variant="tertiary" key={item.id} className="cg-summary-tile" onPress={() => open(item.id)} aria-label={`查看 ${item.name || item.title || item.id}`} style={kind === 'cards' ? { '--fan-angle': `${(index - (featured.length - 1) / 2) * 10}deg`, '--fan-offset': `${(index - (featured.length - 1) / 2) * 22}%`, zIndex: index + 1 } as CSSProperties : undefined}>
      <GalleryImage item={item} card={kind === 'cards'}/><span>{item.name || item.title || item.id}</span>
    </Button>)}</div>}
    {kind === 'cards' && <footer className="cg-gallery-footer">{total ?? items.length} 张卡牌<span>选择卡面查看详情</span></footer>}
  </section>;
}
function GalleryImage({ item, card }: {
    item: AssetItem | CardItem;
    card: boolean;
}) {
    const path=item.type==='card'?item.facePreview:undefined;
    const visual=card?!!path:item.type==='asset'&&item.mimeType.startsWith('image/');
    const resource = useNote<typeof import("./actions")>().useQuery('media', card ? { path: `public${path}`, variant: 'thumbnail' } : { id: item.id, variant: 'thumbnail' }, { enabled: visual });
    const url = mediaSource(resource.data);
    return <span className="cg-summary-image" title={item.name || item.title || item.id}>{visual && url ? <ImagePreview src={url} alt="" loading="eager"/> : <span>{!visual ? card ? '待制作卡面' : item.kind || '素材' : resource.error ? '预览不可用' : '读取中…'}</span>}</span>;
}
const fanStyles = `.cg-card-fan{position:relative;flex:1;min-height:0;container-type:size}.cg-card-fan .cg-summary-tile{position:absolute;left:50%;top:46%;width:min(33cqw,calc(90cqh * 750 / 1081));height:auto!important;aspect-ratio:750/1081;transform:translate(-50%,-50%) translateX(var(--fan-offset)) rotate(var(--fan-angle));transform-origin:50% 115%;background:transparent;transition:transform .2s}.cg-card-fan .cg-summary-tile:hover,.cg-card-fan .cg-summary-tile:focus-visible{transform:translate(-50%,-56%) translateX(var(--fan-offset)) rotate(var(--fan-angle));z-index:10!important}.cg-card-fan .cg-summary-tile>span:last-child{display:none}.cg-card-fan .cg-summary-image{height:100%;flex:none}.cg-card-fan .cg-summary-image img{width:100%;height:100%;max-height:none;object-fit:contain}.cg-gallery-footer{display:flex;justify-content:space-between;gap:10px;color:var(--wb-muted);font-size:11px}.cg-gallery-art .cg-summary-gallery{grid-template-rows:repeat(2,minmax(0,1fr))}.cg-gallery-art .cg-summary-tile>span:last-child{display:none}.cg-gallery-art .cg-summary-image img{width:100%;height:100%;object-fit:cover;border-radius:6px}`;
const styles = `.cg-gallery-summary{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:10px;padding:14px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:12px;min-width:0}.cg-gallery-summary header{display:flex;align-items:center;gap:8px;flex-shrink:0}.cg-gallery-summary header strong{font-size:14px;flex:1}.cg-gallery-summary header>span,.cg-gallery-summary p{color:var(--wb-muted)}.cg-gallery-summary p{margin:0;overflow-wrap:anywhere}.cg-gallery-summary [role=alert]{color:var(--wb-danger)}.cg-summary-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;flex:1;min-height:0}.cg-summary-tile{display:flex;flex-direction:column;gap:5px;padding:0!important;height:100%!important;min-width:0;width:100%;max-width:100%;box-sizing:border-box;border-radius:var(--wb-radius-small,8px);white-space:normal}.cg-summary-tile>span:last-child{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;font-size:12px}.cg-summary-image{display:grid;place-items:center;flex:1;min-height:0;width:100%;color:var(--wb-muted);font-size:11px}.cg-summary-image img{max-width:100%;height:100%;max-height:124px;object-fit:contain}.cg-audio-content{display:flex;flex-direction:column;gap:10px;flex:1;min-height:0;min-width:0}.cg-audio-content>*{flex-shrink:0}.cg-audio-summary{display:grid;gap:4px}.cg-audio-summary>div{display:flex;align-items:center;gap:4px;min-width:0}.cg-audio-title{flex:1;min-width:0;justify-content:flex-start;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:0}.cg-audio-summary>div>span{color:var(--wb-muted);font-size:11px;white-space:nowrap}.cg-gallery-summary audio{width:100%;height:30px;flex-shrink:0}`;
