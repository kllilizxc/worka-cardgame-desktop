import {GridList, GridListItem, type Selection} from 'react-aria-components/GridList';
import {Virtualizer, GridLayout, ListLayout, Size} from 'react-aria-components/Virtualizer';
import type {ReactNode} from 'react';
import {Button} from '@heroui/react';
import type {PagedQueryResult} from '@dsh-workbench/react';

/** Business collections share styling; React Aria owns keys, navigation and measurement. */
export function ContentCollection<T extends {id: string}>({items, label, layout = 'stack', selectedIds = [], multiple = false, onSelect, onSelectionChange, textValue, renderItem, empty, className = '', itemClassName = '', rowSize = 72, tileSize = [160, 180]}: {
  items: T[];
  label: string;
  layout?: 'stack' | 'grid';
  selectedIds?: string[];
  multiple?: boolean;
  onSelect?(id: string): void;
  onSelectionChange?(ids: string[]): void;
  textValue(item: T): string;
  renderItem(item: T): ReactNode;
  empty?: ReactNode;
  className?: string;
  itemClassName?: string;
  rowSize?: number;
  tileSize?: [number, number];
}) {
  const select = (selection: Selection) => {
    const ids = selection === 'all' ? items.map(item => item.id) : Array.from(selection, String);
    if (multiple) onSelectionChange?.(ids);
    else if (ids[0]) onSelect?.(ids[0]);
  };
  const list = <GridList aria-label={label} items={items} layout={layout}
    selectionMode={multiple ? 'multiple' : 'none'}
    selectionBehavior="toggle"
    selectedKeys={multiple ? selectedIds : []}
    onSelectionChange={select} dependencies={[renderItem, selectedIds, onSelect]}
    renderEmptyState={() => empty ?? <p>没有匹配项</p>}
    className={`cg-collection ${className}`} style={{display: 'block', padding: 0, overflow: 'auto', minHeight: 0, flex: 1, width: '100%'}}>
    {item => <GridListItem id={item.id} textValue={textValue(item)}
      className={`cg-collection-item ${itemClassName}`} data-content-id={item.id}
      data-active={!multiple && selectedIds.includes(item.id) || undefined}
      onAction={!multiple ? () => onSelect?.(item.id) : undefined}>
      {renderItem(item)}
    </GridListItem>}
  </GridList>;
  return <>
    <style>{`.cg-collection-item{box-sizing:border-box;min-width:0;outline:none;cursor:pointer}.cg-collection-item[data-selected],.cg-collection-item[data-active]{background:var(--wb-accent-pale)}.cg-collection-item[data-focus-visible],.cg-collection-item[data-focus-visible-within]{outline:2px solid var(--wb-accent);outline-offset:-2px}.cg-collection[data-empty]{display:flex!important;align-items:center;justify-content:center}.cg-collection[data-empty]>div{width:100%}`}</style>
    {layout === 'grid'
      ? <Virtualizer layout={GridLayout} layoutOptions={{minItemSize: new Size(...tileSize), minSpace: new Size(10, 10), maxColumns: 4}} shouldObserveItemSize>{list}</Virtualizer>
      : <Virtualizer layout={ListLayout} layoutOptions={{estimatedRowSize: rowSize, gap: 8}} shouldObserveItemSize>{list}</Virtualizer>}
  </>;
}

export type CollectionPage = Pick<PagedQueryResult<unknown>, 'pageIndex' | 'hasPrevious' | 'hasNext' | 'previous' | 'next' | 'loading'>;
export function CollectionPagination({page, label}: {page: CollectionPage; label: string}) {
  return <nav aria-label={`${label}分页`} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8, flexShrink: 0, paddingBlock: 8}}>
    <Button variant="tertiary" size="sm" style={{minHeight: 44, minWidth: 44}} isDisabled={!page.hasPrevious || page.loading} onPress={page.previous}>上一页</Button>
    <span aria-live="polite" style={{fontSize: 12, color: 'var(--wb-muted)'}}>第 {page.pageIndex + 1} 页</span>
    <Button variant="tertiary" size="sm" style={{minHeight: 44, minWidth: 44}} isDisabled={!page.hasNext || page.loading} onPress={page.next}>下一页</Button>
  </nav>;
}
