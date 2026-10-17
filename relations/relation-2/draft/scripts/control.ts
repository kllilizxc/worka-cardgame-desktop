async function run(event:any,api:any){
  const nodes=await api.describe({});
  const desk=nodes.find((node:any)=>node.noteId===event.noteId);
  const previews=nodes.filter((node:any)=>node.capabilities.queries.includes('candidate')&&node.capabilities.actions.includes('receive'));
  if(!desk?.capabilities.queries.includes('task')||previews.length!==1)
    return {outcome:'agent',summary:'预览控制的节点能力不明确，需要核对当前连线'};
  const input=event.payload;
  if(input?.originNoteId!==desk.noteId||input.key!==input.delegationId||!['stop','restart'].includes(input.operation)||!input.revision)
    return {outcome:'agent',summary:'预览控制缺少原任务、候选版本或有效操作'};
  const task=await api.query({noteId:desk.noteId,name:'task',input:{delegationId:input.delegationId},codeVersion:desk.codeVersion});
  if(!task?.candidate||task.candidate.revision!==input.revision)
    return {outcome:'completed',summary:'原任务候选已更新，旧控制请求无需执行',title:'已跳过旧预览控制'};
  const preview=previews[0];
  const current=await api.query({noteId:preview.noteId,name:'candidate',input:{key:input.key},codeVersion:preview.codeVersion});
  if(!current?.candidate||current.candidate.delegationId!==task.id||current.candidate.originNoteId!==desk.noteId)
    return {outcome:'agent',summary:'预览候选与原任务不一致，需要核对绑定'};
  await api.action({noteId:preview.noteId,name:'receive',codeVersion:preview.codeVersion,operationId:'control',
    input:{operation:input.operation,key:input.key,originNoteId:desk.noteId,delegationId:task.id}});
  return {outcome:'completed',summary:`任务 ${task.id} 的预览已收到${input.operation==='stop'?'停止':'重启'}请求；等待预览实际状态`,title:input.operation==='stop'?'预览停止已请求':'预览重启已请求'};
}
