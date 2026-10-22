import type {z} from '@dsh-workbench/runtime';
import {gameCandidateInputSchema,type gameCandidateSchema} from './schemas';
export type GameCandidate=z.infer<typeof gameCandidateSchema>;
export const candidateInput = (candidate:GameCandidate) => gameCandidateInputSchema.safeParse({...candidate,candidateId:candidate.id});
export const candidateError = (candidate:GameCandidate) => {
  const input=candidateInput(candidate);
  return !input.success?input.error.message:candidate.status==='adopted'&&!candidate.adoptionId?'缺少采用记录，无法撤销':'';
};
