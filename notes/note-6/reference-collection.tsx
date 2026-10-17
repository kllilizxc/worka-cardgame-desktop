import { useState, type ReactNode } from 'react';
import { Button, ScrollShadow } from '@heroui/react';
import { NoteDialog } from '@dsh-workbench/react';

export interface ReferenceCollectionItem { key: string; label: string; status: string; warning?: boolean }

/** Presentation only: the owner supplies identity validation, persistence and actions. */
export function ReferenceCollection({ items, limit, pending, busy, error, onRemove, onRefresh, children }: {
  items: ReferenceCollectionItem[]; limit: number; pending?: boolean; busy?: boolean; error?: string;
  onRemove(key: string): void; onRefresh(): void; children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return <section aria-label="跨区域固定引用" style={{ flexShrink: 0, minWidth: 0, color: 'var(--wb-ink)', fontSize: 12 }}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="sm" variant="tertiary" aria-expanded={expanded} onPress={() => setExpanded(!expanded)}>固定引用 {items.length}/{limit}</Button>
      {items.some(item => item.warning) && <span role="status" style={{ color: 'var(--wb-warning)' }}>引用需核对</span>}
    </div>
    <NoteDialog open={expanded} onOpenChange={setExpanded} label="固定引用" style={{ width: 520, maxWidth: 'calc(100% - 32px)', margin: 'auto', padding: 20, border: 0, borderRadius: 'var(--wb-radius)', background: 'var(--wb-paper)', color: 'var(--wb-ink)', boxShadow: 'var(--wb-shadow-popover)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}><strong>固定引用 {items.length}/{limit}</strong><Button size="sm" variant="tertiary" onPress={() => setExpanded(false)}>关闭</Button></div>
      <p style={{ color: 'var(--wb-muted)' }}>项目内共享，随下一条消息附加。</p>
      {pending && <p role="status">正在核对…</p>}
      {expanded && <ScrollShadow style={{ maxHeight: '55dvh', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {children}
      {!items.length && <span>尚无固定引用。固定不会发送消息或修改对象。</span>}
      {items.map(item => <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}><strong>{item.label}</strong><div style={{ color: item.warning ? 'var(--wb-warning)' : 'var(--wb-muted)', marginTop: 4 }}>{item.status}</div></div>
        <Button size="sm" variant="tertiary" isDisabled={busy} aria-label={`移除固定引用 ${item.label}`} onPress={() => onRemove(item.key)}>移除</Button>
      </div>)}
      <Button size="sm" variant="tertiary" isDisabled={busy} onPress={onRefresh}>重新核对引用</Button>
      </ScrollShadow>}
      {error && <p role="alert" style={{ margin: '8px 0 0', overflowWrap: 'anywhere' }}>{error}</p>}
    </NoteDialog>
    {error && !expanded && <p role="alert" style={{ margin: '8px 0 0', overflowWrap: 'anywhere' }}>{error}</p>}
  </section>;
}
