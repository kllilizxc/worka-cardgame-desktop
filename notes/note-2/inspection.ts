import type {Delegation} from './model';
import type { z } from '@dsh-workbench/runtime';
import type { inspectionOriginSchema, workTypeSchema } from './schemas';
export type InspectionOrigin=z.infer<typeof inspectionOriginSchema>;
export type WorkType=z.infer<typeof workTypeSchema>;
export function inspectionPresentation(d:Delegation){
 const proposals=(d.proposals??[]).filter(p=>p.operations.length&&p.evidence.length&&!['applied','rejected'].includes(p.status||''));
 const type=({'investigation':'排查','code-repair':'代码修复','data-permission':'数据或权限处置建议'})[d.workType||'investigation'];
 const needsReview=!!d.origin&&proposals.length>0;
 const next=needsReview?'需要你审阅修复方案':d.status==='failed'?'执行异常：查看失败步骤，自动调查已停止':d.outcome?.blockers?.length?'等待证据：'+d.outcome.blockers.join('；'):['running','dispatching'].includes(d.status)?'正在核查，暂无需操作':d.nextAction||'调查已结束，请查看结论与下一步';
 return {type,needsReview,next,proposals};
}
