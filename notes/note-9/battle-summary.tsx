import {useNote} from '@dsh-workbench/react';
export function useBattleReports(){return useNote<typeof import('./actions')>().useQuery('battleExperiments',{});}
export function BattleExperimentSummary(){const resource=useBattleReports();const data=resource.data;return <p>{resource.error?`对局报告读取失败${data?.reports.length?` · 保留 ${data.reports.length} 份历史报告`:''}`:!data?'正在读取对局报告…':data.reports.length?`${data.reports.length} 份历史对局报告`:'尚无自动对局报告'}</p>;}
