import { Button, ScrollShadow, SearchField } from '@heroui/react';
import {useResource} from './surface';
import { useState } from 'react';

type Deck = { id: string; name: string; description: string; path: string; total: number; cards: Array<{ id: string; name?: string; count: number; missing: boolean }> };
export function DeckWorkspace({ projectId, onBack, onCard }: { projectId: string; onBack(): void; onCard(id: string): void }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const list = useResource<{ items: Array<{ id: string; path: string }>; total: number; nextCursor?: string }>('gameCatalog', { projectId, kind: 'deck', q: query, ...(cursor ? { cursor } : {}), limit: 30 });
  const detail = useResource<Deck>('gameDeck', { projectId, id: selected ?? '' }, { enabled: Boolean(selected) });
  const deck = detail.data;
  return <section className="cg-decks">
    <style>{`.cg-library:has(.cg-decks)>.cg-topbar{display:none}.cg-decks{display:flex;flex-direction:column;gap:16px;height:100dvh;padding:16px;box-sizing:border-box;color:var(--wb-ink);background:var(--wb-paper);min-width:0}.cg-decks header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.cg-decks h2,.cg-decks p{margin:0}.cg-decks small{color:var(--wb-muted);overflow-wrap:anywhere}.cg-deck-list{flex:1;width:100%;max-width:760px;display:flex;flex-direction:column;gap:10px;min-height:0}.cg-deck-list button{width:100%;white-space:normal;height:auto;min-height:44px;justify-content:space-between;text-align:left;gap:16px;flex-shrink:0}.cg-deck-list button span{min-width:0;overflow-wrap:anywhere}.cg-deck-list button small{display:block}.cg-decks [role=alert]{color:var(--wb-danger)}`}</style>
    <header><Button variant="tertiary" onPress={selected ? () => setSelected(undefined) : onBack}>← {selected ? '返回卡组' : '返回卡牌库'}</Button><h2>{selected ? deck?.name || selected : '卡组'}</h2></header>
    {!selected ? <>
      <SearchField aria-label="搜索卡组" value={search} onChange={setSearch} onSubmit={() => { setQuery(search); setCursor(undefined); }}>
        <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索卡组 ID 或路径" /><SearchField.ClearButton onPress={() => { setSearch(''); setQuery(''); setCursor(undefined); }} /></SearchField.Group>
      </SearchField>
      {list.error ? <p role="alert">{list.error.message}</p> : list.loading ? <p>正在读取卡组…</p> : <small>{list.data?.total ?? 0} 个已登记卡组</small>}
      <ScrollShadow className="cg-deck-list">{list.data?.items.map(item => <Button key={item.id} variant="secondary" onPress={() => setSelected(item.id)}><span>{item.id}<small>{item.path}</small></span><span aria-hidden>→</span></Button>)}</ScrollShadow>
      {!list.loading && !list.error && list.data?.total === 0 && <p>没有匹配的卡组。</p>}
      <header>{cursor && <Button variant="tertiary" onPress={() => setCursor(undefined)}>第一页</Button>}{list.data?.nextCursor && <Button variant="secondary" onPress={() => setCursor(list.data?.nextCursor)}>下一页</Button>}</header>
    </> : <>
      {detail.error ? <p role="alert">{detail.error.message}</p> : detail.loading ? <p>正在读取卡组构成…</p> : deck && <>
        <p>{deck.description}</p><small>{deck.total} 张 · {deck.cards.length} 项 · {deck.path}</small>
        <ScrollShadow className="cg-deck-list">{deck.cards.map((card, index) => <Button key={`${card.id}:${index}`} variant="secondary" isDisabled={card.missing} onPress={() => onCard(card.id)}><span>{card.name || card.id}<small>{card.id}{card.missing ? ' · 卡牌定义缺失' : ''}</small></span><span>× {card.count}</span></Button>)}</ScrollShadow>
        {!deck.cards.length && <p>此卡组尚未包含卡牌。</p>}
      </>}
    </>}
  </section>;
}
