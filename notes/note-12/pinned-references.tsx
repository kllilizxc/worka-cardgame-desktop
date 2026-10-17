import { useState } from 'react';
import { Button } from '@heroui/react';
import { ReferenceCollection } from './reference-collection';
import { useNote } from "@dsh-workbench/react";
import type { CardGameConfig, LibraryState } from './content-model';
type Selection = {
    kind: string;
    id: string;
    anchor?: string;
    op: string;
    context?: {
        kind: string;
        metric: 'attack' | 'health';
    } | {
        before: {
            experimentId: string;
            reportId: string;
        };
        after: {
            experimentId: string;
            reportId: string;
        };
    };
};

function selections(config: CardGameConfig, state: LibraryState): Selection[] {
    const views = state.views;
    if (config.presentation === 'story')
        return views?.storySelection ? [{ kind: 'story', op: 'storyAnalysis', id: views.storySelection, ...(views.storyNodeSelection?.storyId === views.storySelection ? { anchor: views.storyNodeSelection.nodeId } : {}) }] : [];
    if (config.presentation === 'balance')
        return [
            { kind: 'balance', op: 'balanceOverview', id: 'current-definitions', ...(views?.balanceMetricSelection ? { context: views.balanceMetricSelection } : {}) },
            ...(views?.battleComparisonSelection ? [{ kind: 'battleComparison', op: 'battleComparison', id: 'paired-reports', context: views.battleComparisonSelection }] : []),
        ];
    if (config.mode === 'cards')
        return (views?.cardsSelection ?? []).map(id => ({ kind: 'card', op: 'card', id }));
    if (config.mode === 'assets')
        return views?.assetsSelection ? [{ kind: 'asset', op: 'asset', id: views.assetsSelection }] : [];
    return views?.knowledgeSelection?.path ? [{ kind: 'document', op: 'document', id: views.knowledgeSelection.path }] : [];
}
export function PinnedReferences({ config, state }: {
    config: CardGameConfig;
    state: LibraryState;
}) {
    const resource = useNote<typeof import("./actions")>().useQuery('pinnedReferences', {});
    const actions = useNote<typeof import("./actions")>().actions;
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const items = resource.data?.items ?? [];
    async function perform(work: () => Promise<unknown>) {
        setBusy(true);
        setError('');
        try {
            await work();
            await resource.refresh();
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
        }
        finally {
            setBusy(false);
        }
    }
    return <ReferenceCollection items={items.map(item => ({ key: item.key,
            label: `${item.title}${item.anchor ? ` / ${item.anchor}` : ''}`,
            status: `${item.revision.slice(0, 12)} · ${item.freshness === 'current' ? (item.kind === 'battleComparison' ? '历史报告一致，不代表当前项目' : '版本一致') : item.freshness === 'stale' ? '版本已变化，需移除后重新固定' : '无法读取或定位'}`,
            warning: item.freshness !== 'current',
        }))} limit={resource.data?.limit ?? 8} pending={resource.loading || resource.stale} busy={busy} error={error || resource.error?.message} onRemove={key => void perform(() => actions.removePinnedReference({ key }))} onRefresh={() => void perform(() => resource.refresh())}>
    {selections(config, state).length ? selections(config, state).slice(0, 8).map(selection => <PinSelection key={JSON.stringify(selection)} selection={selection} disabled={busy || resource.loading || resource.stale || !!resource.error} perform={perform}/>) : <span>先选择一个对象，再固定到对话上下文。</span>}
    {selections(config, state).length > 8 && <span>当前选择超过 8 项，请缩小选择范围。</span>}
  </ReferenceCollection>;
}
function PinSelection({ selection, disabled, perform }: {
    selection: Selection;
    disabled: boolean;
    perform: (work: () => Promise<unknown>) => Promise<void>;
}) {
    const detail = useNote<typeof import("./actions")>().useQuery('pinnedReferenceTarget', { kind: selection.kind, id: selection.id, ...(selection.anchor ? { anchor: selection.anchor } : {}), ...(selection.context ? { context: selection.context } : {}) });
    const actions = useNote<typeof import("./actions")>().actions;
    const label = detail.data?.title ?? (selection.kind === 'balance' ? '正式定义统计' : selection.id);
    return <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
    <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{label}{selection.anchor ? ` / ${selection.anchor}` : ''}{detail.error ? ' · 无法读取' : ''}</span>
    <Button size="sm" variant="secondary" isDisabled={disabled || detail.loading || detail.stale || !!detail.error || detail.data?.revision === undefined} onPress={() => void perform(() => actions.pinReference({ kind: selection.kind, id: selection.id, ...(selection.anchor ? { anchor: selection.anchor } : {}), ...(selection.context ? { context: selection.context } : {}), revision: String(detail.data!.revision) }))}>固定此对象</Button>
  </div>;
}
