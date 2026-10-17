import {note} from './model';
import {z} from '@dsh-workbench/runtime';
async function project(ctx:any){const config=await ctx.config.read();if(!config.value.projectId)throw Error('请先关联 CardGame 项目');return config.value.projectId;}
async function read(ctx:any,op:string,input:Record<string,unknown>={}) {
 const snapshot=await ctx.resources.read({name:'extension.cardgame-content.query',input:{...input,op,projectId:await project(ctx)}});
 if(snapshot.error||snapshot.data===undefined)throw Error(snapshot.error||'内容暂时无法读取');return JSON.parse(JSON.stringify(snapshot.data));
}
export const pinChangeReference=note.action({description:'固定已核对版本的改动或候选，不发送消息。',visibility:'private',input:z.object({productionId:z.string(),revision:z.number(),candidateId:z.string().optional(),commit:z.string().optional()}),output:z.json()},async(ctx,input)=>{
 const ref=input.candidateId?{kind:'candidate',id:input.candidateId,context:{productionId:input.productionId,commit:input.commit??''}}:{kind:'production',id:input.productionId};
 const target=await read(ctx,'pinnedReferenceTarget',ref);
 if(String(input.candidateId?target.binding?.productionRevision:target.revision)!==String(input.revision))throw Error('改动已更新，请刷新后重新固定');
 return ctx.host.extensions.request('cardgame-content','pinReference',{...ref,projectId:await project(ctx),revision:target.revision});
});
export const removePinnedReference=note.action({description:'移除指定固定引用，保留对象。',visibility:'private',input:z.object({key:z.string()}),output:z.json()},async(ctx,input)=>ctx.host.extensions.request('cardgame-content','removePinnedReference',{...input,projectId:await project(ctx)}));
export const discussChange=note.action({description:'保留所选改动并准备本便笺原生会话，等待用户输入。',visibility:'private',input:z.object({productionId:z.string().optional()}),output:z.json()},async(ctx,input)=>{
 await project(ctx);const id=input.productionId?.trim();if(id)await read(ctx,'production',{productionId:id});
 await ctx.state.update(draft=>{draft.changeSelection=id??null;});
 if(!ctx.host.agent.prepare)throw Error('宿主不支持准备原生会话');
 return ctx.host.agent.prepare({noteId:ctx.note.id});
});
export const cardgameQueries={
 changes:note.query({description:'分页读取真实项目改动。',visibility:'private',input:z.object({cursor:z.string().optional(),query:z.string().optional(),limit:z.number().optional(),filter:z.string().optional()}).nullable(),output:z.json()},async(ctx,input)=>read(ctx,'featureChanges',{limit:input?.limit??30,...(input?.cursor?{cursor:input.cursor}:{}),...(input?.query?{q:input.query}:{}),...(input?.filter?{filter:input.filter}:{})})),
 candidateDiff:note.query({description:'读取指定候选差异。',visibility:'private',input:z.object({productionId:z.string(),candidateId:z.string()}),output:z.json()},async(ctx,input)=>read(ctx,'gameCandidateDiff',input)),
 pinnedReferences:note.query({description:'读取已核对身份的项目固定引用。',visibility:'private',input:z.object({}).nullable(),output:z.json()},async(ctx)=>read(ctx,'pinnedReferences')),
};
