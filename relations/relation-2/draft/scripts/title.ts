async function run(event:any,api:any){
  const nodes=await api.describe({});
  const desk=nodes.find((node:any)=>node.noteId===event.noteId);
  const previews=nodes.filter((node:any)=>node.capabilities.actions.includes('rename'));
  if(!desk?.capabilities.queries.includes('task')||previews.length!==1)
    return {outcome:'agent',summary:'预览名称同步的节点能力不明确，需要核对当前连线'};
  const input=event.payload;
  if(input?.originNoteId!==desk.noteId||!input.delegationId||!input.title?.trim()||!input.rawTitle?.trim())
    return {outcome:'agent',summary:'预览名称同步缺少原任务或名称'};
  const task=await api.query({noteId:desk.noteId,name:'task',input:{delegationId:input.delegationId},codeVersion:desk.codeVersion});
  if(!task||task.title!==input.rawTitle)
    return {outcome:'completed',summary:'原任务名称已更新，旧名称无需同步',title:'已跳过旧名称'};
  const preview=previews[0];
  const result=await api.action({noteId:preview.noteId,name:'rename',codeVersion:preview.codeVersion,operationId:'rename',
    input:{originNoteId:desk.noteId,delegationId:task.id,title:input.title}});
  return {outcome:'completed',summary:result?.renamed?`任务 ${task.id} 的预览名称已同步`:'当前没有该任务的预览候选',title:result?.renamed?'预览名称已同步':'预览暂无候选'};
}
