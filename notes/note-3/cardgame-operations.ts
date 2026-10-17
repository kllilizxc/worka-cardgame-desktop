import {note} from './model';
import {z} from '@dsh-workbench/runtime';
async function project(ctx:any){const config=await ctx.config.read();if(!config.value.projectId)throw Error('请先关联 CardGame 项目');return config.value.projectId;}
async function read(ctx:any,op:string,input:Record<string,unknown>={}){
 const snapshot=await ctx.resources.read({name:'extension.cardgame-content.query',input:{...input,op,projectId:await project(ctx)}});
 if(snapshot.error||snapshot.data===undefined)throw Error(snapshot.error||'试玩内容暂时无法读取');return JSON.parse(JSON.stringify(snapshot.data));
}
export const prepareFormalPreview=note.action({description:'核对本地正式内容后准备独立试玩快照。',visibility:'private',input:z.object({fresh:z.boolean().optional()}),output:z.json()},async(ctx,input)=>ctx.host.extensions.request('cardgame-content','prepareFormalPreview',{...input,projectId:await project(ctx)}));
export const pinPreviewReference=note.action({description:'固定已经核对的候选与提交，不发送消息。',visibility:'private',input:z.object({key:z.string(),commit:z.string(),revision:z.string()}),output:z.json()},async(ctx,input)=>{
 const target=await read(ctx,'previewReferenceTarget',{key:input.key,commit:input.commit});
 if(target.revision!==input.revision)throw Error('候选身份已变化，请刷新后重新固定');
 return ctx.host.extensions.request('cardgame-content','pinReference',{...target,projectId:await project(ctx)});
});
export const removePinnedReference=note.action({description:'移除指定固定引用，保留对象。',visibility:'private',input:z.object({key:z.string()}),output:z.json()},async(ctx,input)=>ctx.host.extensions.request('cardgame-content','removePinnedReference',{...input,projectId:await project(ctx)}));
export const cardgameQueries={
 formalPreview:note.query({description:'只读当前正式快照及版本新鲜度。',visibility:'private',input:z.object({}).nullable(),output:z.json()},async(ctx)=>read(ctx,'formalPreview')),
 previewReferenceTarget:note.query({description:'核对指定候选 key 与提交。',visibility:'private',input:z.object({key:z.string(),commit:z.string()}),output:z.json()},async(ctx,input)=>read(ctx,'previewReferenceTarget',input)),
 pinnedReferences:note.query({description:'读取项目固定引用。',visibility:'private',input:z.object({}).nullable(),output:z.json()},async(ctx)=>read(ctx,'pinnedReferences')),
};
