import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {isAbsolute} from 'node:path';
import type {MergeProposalOperation} from './model';
const exec=promisify(execFile);
/** Only a recorded proposal may choose the repository and revisions. No shell evaluation. */
export async function proposalDiff(operation:MergeProposalOperation){
 if(operation.kind!=='git-merge'||!isAbsolute(operation.repository))throw Error('此提案请通过 PR 查看差异');
 const git=async(args:string[])=>(await exec('git',['-C',operation.repository,...args],{timeout:10000,maxBuffer:1024*1024,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}})).stdout.trim();
 const base=await git(['rev-parse','--verify','--end-of-options',operation.expectedBase+'^{commit}']);
 const head=await git(['rev-parse','--verify','--end-of-options',operation.head+'^{commit}']);
 return {base,head,diff:await git(['diff','--no-ext-diff','--no-textconv',base,head,'--'])};
}
