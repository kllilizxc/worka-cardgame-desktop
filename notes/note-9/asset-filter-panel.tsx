import {Button, TextField, Label, Input} from '@heroui/react';
import {useState} from 'react';
import type {AssetFilters} from './content-model';

const NUMBER_FIELDS = [['minWidth', '最小宽度'], ['maxWidth', '最大宽度'], ['minDurationMs', '最短时长（毫秒）'], ['maxDurationMs', '最长时长（毫秒）']] as const;
type NumberField = typeof NUMBER_FIELDS[number][0];

export function AssetFilterPanel({filter, saved, onApply, onSave}: {filter: AssetFilters; saved: AssetFilters[]; onApply(value: AssetFilters): void; onSave(value: AssetFilters): void}) {
  const [draft, setDraft] = useState(filter);
  const [numbers, setNumbers] = useState(() => Object.fromEntries(NUMBER_FIELDS.map(([key]) => [key, String(filter[key] ?? '')])) as Record<NumberField, string>);
  const [error, setError] = useState('');
  const invalid = (key: NumberField) => numbers[key].trim() !== '' && (!/^\d+$/.test(numbers[key].trim()) || !Number.isSafeInteger(Number(numbers[key])));
  const invalidMessage = NUMBER_FIELDS.some(([key]) => invalid(key)) ? '宽度和时长请输入大于或等于 0 的整数，留空表示不限。' : '';
  function value(): AssetFilters | undefined {
    if (NUMBER_FIELDS.some(([key]) => invalid(key))) { setError('宽度和时长请输入大于或等于 0 的整数，留空表示不限。'); return; }
    const parsed = {...draft};
    for (const [key] of NUMBER_FIELDS) parsed[key] = numbers[key].trim() === '' ? undefined : Number(numbers[key]);
    if ((parsed.minWidth ?? 0) > (parsed.maxWidth ?? Infinity) || (parsed.minDurationMs ?? 0) > (parsed.maxDurationMs ?? Infinity)) { setError('最小值不能大于最大值。'); return; }
    setError('');
    return parsed;
  }
  return <form className="cg-filter-panel" onSubmit={event => { event.preventDefault(); const parsed = value(); if (parsed) onApply(parsed); }}>
    <div className="cg-filter-heading"><strong>资源筛选</strong><span>保存查询，结果由后端更新</span></div>
    <div className="cg-filter-fields">
      <TextField aria-label="类型" value={draft.kind ?? ''} onChange={kind => setDraft({...draft, kind})}><Label>类型</Label><Input placeholder="sprite / audio" /></TextField>
      <TextField aria-label="格式" value={draft.format ?? ''} onChange={format => setDraft({...draft, format})}><Label>格式</Label><Input placeholder="png / wav" /></TextField>
      {NUMBER_FIELDS.map(([key, label]) => <TextField key={key} aria-label={label} value={numbers[key]} isInvalid={invalid(key)} onChange={text => { setNumbers({...numbers, [key]: text}); setError(''); }}><Label>{label}</Label><Input inputMode="numeric" aria-invalid={invalid(key) || undefined} /></TextField>)}
      <label>状态<select value={draft.status ?? ''} onChange={event => setDraft({...draft, status: event.target.value})}><option value="">全部状态</option><option value="ready">可用</option><option value="candidate">候选</option></select></label>
    </div>
    {(error || invalidMessage) && <p role="alert" className="cg-error">{error || invalidMessage}</p>}
    <div className="cg-filter-actions"><Button size="sm" variant="tertiary" onPress={() => { const parsed = value(); if (parsed) onSave(parsed); }}>保存筛选</Button><Button type="submit" size="sm" variant="primary">应用</Button>
      {saved.length > 0 && <select className="cg-select" aria-label="已保存筛选" value="" onChange={event => { const next = saved.find(item => item.name === event.target.value); if (next) onApply(next); }}><option value="">已保存筛选…</option>{saved.map(item => <option value={item.name} key={item.name}>{item.name}</option>)}</select>}
    </div>
  </form>;
}
