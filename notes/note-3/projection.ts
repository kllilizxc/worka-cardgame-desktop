import type { CandidateInput, CandidateSpec, SurfaceStatus, Data } from './model';
import type { Snapshot } from '@dsh-workbench/runtime';

/** A task owns one candidate; extra surfaces share that candidate's identity. */
const STANDALONE_KEY=/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
/**
 * Candidates may be registered standalone (any note or conversation) or synced from a delegation.
 * Standalone keys are self-chosen; delegation-sourced keys stay anchored to that delegation so
 * results route back to the original task. Provenance is optional metadata, never a requirement.
 */
export function validateCandidateIdentity(input: Partial<Pick<CandidateInput, 'key' | 'delegationId' | 'originNoteId'>>) {
  const key=input?.key?.trim()??'';
  const delegationId=input?.delegationId?.trim()??'';
  const originNoteId=input?.originNoteId?.trim()??'';
  if(!key)throw new Error('候选需要稳定 key');
  if(Boolean(delegationId)!==Boolean(originNoteId))throw new Error('候选来源需要同时提供 delegationId 和 originNoteId；独立登记的候选只带 key');
  if(!delegationId){
    // ':' separates a candidate from its adapter surfaces and '#' marks delegation siblings.
    if(!STANDALONE_KEY.test(key))throw new Error('独立候选的 key 只能使用字母、数字、点、下划线和短横线，长度 1-64；请用一个稳定且唯一的标识');
    return;
  }
  const suffix=key.startsWith(`${delegationId}#`)?key.slice(delegationId.length+1):'';
  const ordinal=Number(suffix);
  const validSibling=Number.isSafeInteger(ordinal)&&ordinal>=2&&String(ordinal)===suffix;
  if(key!==delegationId&&!validSibling)throw new Error('候选 key 必须等于 delegationId，或使用 delegationId#2、#3 等后续编号；更新或重试请复用原候选');
}

/** One row per surface, exactly as the host reported it. */
export type PreviewRow = { candidate: CandidateSpec; surface: string; name: string; url?: string; status?: SurfaceStatus; desired: NonNullable<CandidateSpec['desired']>[string] };

export function previewRows(data:Pick<Data,'candidates'>):PreviewRow[]{
  return (data.candidates??[]).flatMap(candidate=>{
    const names=candidate.surfaces?.length?candidate.surfaces.map(s=>s.name):Object.keys({...candidate.desired,...candidate.status}).length?Object.keys({...candidate.desired,...candidate.status}):[''];
    return names.map(surface=>{
      const known=candidate.surfaces?.find(s=>s.name===surface);
      const status=candidate.status?.[surface];
      return {candidate,surface,name:known?.title||surface||candidate.title||candidate.key,url:status?.url??known?.url,status,desired:candidate.desired?.[surface]??'stopped'};
    });
  });
}

/** Stable display state derived only from host status. */
export function rowState(row:PreviewRow):'stopped'|'starting'|'checking'|'ready'|'unchecked'|'verificationFailed'|'failed'|'stopping'|'repairing'|'waiting'{
  const s=row.status;
  if(!s)return row.desired==='running'?'starting':'stopped';
  if(s.phase==='failed'){
    // A failed project check leaves the page running and viewable while it is repaired.
    if(s.failure?.step==='verify')return 'verificationFailed';
    if(s.failure?.handling==='retrying'||s.failure?.handling==='agent')return 'repairing';
    if(s.failure?.handling==='waiting-user')return 'waiting';
    return 'failed';
  }
  if(s.phase==='ready')return s.verified===undefined?'unchecked':s.verified.ok?'ready':'verificationFailed';
  if(s.phase==='verifying')return 'checking';
  if(s.phase==='stopping')return 'stopping';
  if(s.phase==='stopped')return 'stopped';
  return 'starting';
}

/** Shared stable-identity projection used by the public query and update checks. */
export function candidateSnapshot(state: Snapshot<Data>, key: string) {
  const candidate = state.value.candidates.find(value => value.key === key);
  return candidate ? { candidate, revision: state.revision } : null;
}
