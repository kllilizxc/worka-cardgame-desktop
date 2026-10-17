import {useNote} from '@dsh-workbench/react';
import {useState} from 'react';
export const balanceLabels:Record<string,string>={unit:'生灵',artifact:'法器',talisman:'符箓',field:'场地',pill:'丹药',skill:'技能'};
export interface BalanceSelection {
  selectedMetric?:{kind:string;metric:'attack'|'health'};
  onSelectMetric(kind:string,metric:'attack'|'health'):Promise<void>;
}
export function useBalanceView(onSelectMetric:BalanceSelection['onSelectMetric']){
    const [error, setError] = useState('');
    async function select(kind: string, metric: 'attack' | 'health') {
        setError('');
        try {
            await onSelectMetric(kind, metric);
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
        }
    }
    const report = useNote<typeof import("./actions")>().useQuery('balanceOverview', {});
    const decks = useNote<typeof import("./actions")>().useQuery('gameCatalog', { kind: 'deck', limit: 1 });
    const encounters = useNote<typeof import("./actions")>().useQuery('gameCatalog', { kind: 'encounter', limit: 1 });
    const measuredGroup = report.data?.groups.find(group => group.attack || group.health);
    return {error,select,report,decks,encounters,measuredGroup};
}
