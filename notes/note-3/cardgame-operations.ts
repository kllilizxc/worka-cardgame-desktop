import {note} from './model';
import {z,readExtension,requestExtension,type NoteActionContext,type NoteQueryContext} from '@dsh-workbench/runtime';
import {contentQueries,contentActions,type ContentQueryInput,type ContentQueryOutput} from './contract';
type Context=NoteActionContext<typeof note>|NoteQueryContext<typeof note>;
type PreviewQuery='formalPreview'|'previewReferenceTarget'|'pinnedReferences';
async function project(ctx:Context){const config=await ctx.config.read();if(!config.value.projectId)throw Error('请先关联 CardGame 项目');return config.value.projectId;}
function read<K extends PreviewQuery>(ctx:Context,op:K,input:ContentQueryInput<K>):Promise<ContentQueryOutput<K>>;
async function read(ctx:Context,op:PreviewQuery,input:ContentQueryInput<PreviewQuery>){
 const contract=contentQueries[op];
 const resourceInput=await contract.resource.input.parseAsync({...input,op,projectId:await project(ctx)});
 const snapshot=await readExtension(ctx.resources,contract.resource,resourceInput);
 if(snapshot.error||snapshot.data===undefined)throw Error(snapshot.error||'试玩内容暂时无法读取');return snapshot.data;
}
export const prepareFormalPreview=note.action({description:'核对本地正式内容后准备独立试玩快照。',visibility:'private',...contentActions.prepareFormalPreview},async(ctx,input)=>requestExtension(ctx.host.extensions,contentActions.prepareFormalPreview.method,{...input,projectId:await project(ctx)}));
export const pinPreviewReference=note.action({description:'固定已经核对的候选与提交，不发送消息。',visibility:'private',input:z.object({key:z.string(),commit:z.string(),revision:z.string()}),output:contentActions.pinReference.output},async(ctx,input)=>{
 const target=await read(ctx,'previewReferenceTarget',{key:input.key,commit:input.commit});
 if(target.revision!==input.revision)throw Error('候选身份已变化，请刷新后重新固定');
 return requestExtension(ctx.host.extensions,contentActions.pinReference.method,{kind:target.kind,id:target.id,revision:target.revision,...(target.anchor?{anchor:target.anchor}:{}),...(target.context?{context:target.context}:{}),projectId:target.projectId,...(target.projectGeneration?{projectGeneration:target.projectGeneration}:{})});
});
export const removePinnedReference=note.action({description:'移除指定固定引用，保留对象。',visibility:'private',...contentActions.removePinnedReference},async(ctx,input)=>requestExtension(ctx.host.extensions,contentActions.removePinnedReference.method,{...input,projectId:await project(ctx)}));
export const cardgameQueries={
 formalPreview:note.query({description:'只读当前正式快照及版本新鲜度。',visibility:'private',...contentQueries.formalPreview},async(ctx,input)=>read(ctx,'formalPreview',input)),
 previewReferenceTarget:note.query({description:'核对指定候选 key 与提交。',visibility:'private',...contentQueries.previewReferenceTarget},async(ctx,input)=>read(ctx,'previewReferenceTarget',input)),
 pinnedReferences:note.query({description:'读取项目固定引用。',visibility:'private',...contentQueries.pinnedReferences},async(ctx,input)=>read(ctx,'pinnedReferences',input)),
};
