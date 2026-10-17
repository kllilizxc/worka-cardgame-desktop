import { z } from '@dsh-workbench/runtime';
import type { Production } from './contracts';

export function requirementFields(production?: Production) {
  return {
    brief: production?.brief ?? '',
    targetAsset: production?.targetAsset ? JSON.stringify(production.targetAsset) : '',
    pinnedRefs: (production?.pinnedRefs ?? []).map(ref => typeof ref === 'string' ? ref : JSON.stringify(ref)).join('\n'),
    batch: production?.batch === undefined ? '' : JSON.stringify(production.batch),
  };
}
export type RequirementFields = ReturnType<typeof requirementFields>;
export function requirementPatch(value: RequirementFields) {
  if (!value.brief.trim()) throw new Error('需求不能为空');
  const parse = (text: string, label: string) => {
    if (!text.trim()) return undefined;
    try { return z.json().parse(JSON.parse(text)); } catch { throw new Error(`${label} JSON 无效`); }
  };
  const target = parse(value.targetAsset, '目标资源');
  if (target !== undefined && (!target || typeof target !== 'object' || Array.isArray(target))) throw new Error('目标资源需要 JSON 对象');
  const batch = parse(value.batch, '批次');
  const pinnedRefs = value.pinnedRefs.split('\n').map(text => text.trim()).filter(Boolean).map(text => {
    if (!text.startsWith('{')) return text;
    const ref = parse(text, '固定参考');
    if (!ref || typeof ref !== 'object' || Array.isArray(ref)) throw new Error('固定参考需要 JSON 对象或文本');
    return ref;
  });
  // Undefined fields retain the original transport behavior: no deletion is implied.
  return { brief: value.brief.trim(), ...(target === undefined ? {} : {targetAsset:target}), ...(batch === undefined ? {} : {batch}), pinnedRefs };
}
