import {isCommandOutcomeError,type z} from '@dsh-workbench/runtime';
import type {ActionOutcome} from '@dsh-workbench/react';
import {gameCandidateInputSchema,type viewSchema,type gameCandidateSchema,type gameAdoptionSchema} from './schemas';
type TrackerState=z.infer<typeof viewSchema>;
export type GameCandidate=z.infer<typeof gameCandidateSchema>;
type CandidateInput=z.infer<typeof gameCandidateInputSchema>;
type CandidateReceipt=z.infer<typeof gameAdoptionSchema>;
type ArchiveInput={id:string;archived:boolean};
type ArchiveReceipt=Awaited<ReturnType<typeof import('./actions').setArchiveStatus>>;
export const candidateKey = (input:Pick<CandidateInput,'projectId'|'productionId'|'candidateId'>) => JSON.stringify([input.projectId,input.productionId,input.candidateId]);
export const candidateInput = (candidate:GameCandidate) => gameCandidateInputSchema.safeParse({...candidate,candidateId:candidate.id});
export const candidateError = (candidate:GameCandidate) => {
  const input=candidateInput(candidate);
  return !input.success?input.error.message:candidate.status==='adopted'&&!candidate.adoptionId?'缺少采用记录，无法撤销':'';
};
const candidateMatches = (candidate:GameCandidate|undefined,input:CandidateInput,status:'adopted'|'undone',adoptionId?:string) =>
  candidate?.id===input.candidateId && (['projectId','productionId','featureId','candidateHash','targetBaseRevision','validationManifest'] as const).every(key=>candidate[key]===input[key]) &&
  candidate.status===status && Boolean(candidate.adoptionId) && (!adoptionId || candidate.adoptionId===adoptionId);
export const candidateReceiptMatches = (receipt:CandidateReceipt,input:CandidateInput,status:'adopted'|'undone',adoptionId?:string) =>
  candidateMatches(receipt?.candidate,input,status,adoptionId) && (!receipt.adoptionId || receipt.adoptionId===receipt.candidate.adoptionId);
export const candidateViewMatches = (view:TrackerState,input:CandidateInput,receipt:CandidateReceipt|undefined,status:'adopted'|'undone',adoptionId?:string) =>
  view.features.some(feature=>feature.gameCandidates.some(candidate=>candidateMatches(candidate,input,status,
    adoptionId || (receipt && candidateReceiptMatches(receipt,input,status) ? receipt.candidate.adoptionId : undefined))));
const errorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);
const verificationDetail = (error: unknown) => error === undefined ? '操作回执无法核对' : isCommandOutcomeError(error)
  ? `执行 ${error.executionId}：${error.message}` : errorMessage(error);
export const archiveNotice = (outcome:ActionOutcome<ArchiveInput,ArchiveReceipt>,title:string) => {
  if(outcome.dismissed || outcome.pending)return '';
  const receipt=outcome.result,operation=outcome.input.archived?'归档':'恢复';
  const event=receipt?.receiptVerified && receipt.event.status==='failed' ? `；关联归档事件发布失败：${receipt.event.error.message}`
    : receipt?.receiptVerified && receipt.event.status==='unconfirmed' ? `；关联归档事件结果待核实：${verificationDetail(receipt.event.error)}` : '';
  if(outcome.needsVerification)return (outcome.receiptConfirmed
    ? `「${title}」已保存，页面回读待刷新：${errorMessage(outcome.readError||'回读尚未确认目标状态')}`
    : `「${title}」的${operation}结果待核实，不会自动重试：${receipt?.event.status==='not-published'?receipt.event.reason:verificationDetail(outcome.error)}`)+event;
  if(!outcome.stateConfirmed && !outcome.receiptConfirmed)return `「${title}」${operation}未完成：${verificationDetail(outcome.error)}`;
  if(event)return `「${title}」已保存归档`+event;
  if(outcome.receiptConfirmed && !outcome.currentMatches)return `「${title}」已保存，当前记录已变化`;
  if(outcome.stateConfirmed && outcome.receiptConfirmed && outcome.readError)return '已核对功能状态，页面已更新';
  return outcome.stateConfirmed && !outcome.receiptConfirmed
    ? `「${title}」的${operation}状态已核对；操作回执不可用` : '';
};
export const candidateNotice = (outcome:ActionOutcome<CandidateInput,CandidateReceipt>,operation:string) => {
  if(outcome.dismissed || outcome.pending)return '';
  if(outcome.needsVerification)return outcome.receiptConfirmed
    ? `${operation}已完成，页面回读待刷新：${errorMessage(outcome.readError||'回读尚未确认目标状态')}`
    : `${operation}结果待核实，不会自动重试：${verificationDetail(outcome.error)}`;
  if(!outcome.stateConfirmed && !outcome.receiptConfirmed)return `${operation}未完成：${verificationDetail(outcome.error)}`;
  if(outcome.receiptConfirmed && !outcome.currentMatches)return `${operation}已完成，当前记录已变化`;
  return outcome.stateConfirmed && outcome.receiptConfirmed && outcome.readError ? '已核对候选状态，页面已更新'
    : outcome.stateConfirmed && !outcome.receiptConfirmed ? '候选状态已核对；操作回执不可用' : '';
};
