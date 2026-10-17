async function run(event:any,api:any){
  const nodes=await api.describe({});
  const desk=nodes.find((node:any)=>node.noteId===event.noteId);
  const previews=nodes.filter((node:any)=>node.capabilities.queries.includes('candidate')&&node.capabilities.actions.includes('recordFeedback'));
  if(!desk?.capabilities.queries.includes('previewFeedback')||previews.length!==1)
    return {outcome:'agent',summary:'原任务或预览反馈查询能力不明确，需要核对当前连线'};
  const taskId=event.payload?.delegationId;
  if(!taskId)return {outcome:'agent',summary:'任务进展事件缺少稳定任务 ID'};
  const preview=previews[0];
  const bindings=await api.bindingList({ref:{noteId:desk.noteId,objectId:taskId}});
  const candidateKeys=[...new Set(bindings.filter((binding:any)=>binding.kind==='preview'&&binding.source.noteId===desk.noteId
    &&binding.source.objectId===taskId&&binding.target.noteId===preview.noteId
    ||binding.kind==='preview-repair'&&binding.target.noteId===desk.noteId&&binding.target.objectId===taskId
    &&binding.source.noteId===preview.noteId).map((binding:any)=>binding.kind==='preview'?binding.target.objectId:binding.source.objectId))];
  let updated=0;
  for(const key of candidateKeys){
    const current=await api.query({noteId:preview.noteId,name:'candidate',input:{key},codeVersion:preview.codeVersion});
    for(const [surface,status] of Object.entries(current?.candidate?.status??{}) as any){
      const reportId=status?.failure?.reportId;
      if(status?.phase!=='failed'||!reportId||!status.pass)continue;
      const handling=await api.query({noteId:desk.noteId,name:'previewFeedback',input:{delegationId:taskId,reportId},codeVersion:desk.codeVersion});
      if(!handling?.received)continue;
      await api.action({noteId:preview.noteId,name:'recordFeedback',codeVersion:preview.codeVersion,operationId:`progress:${key}:${surface}:${reportId}`,
        input:{key,surface,runId:status.pass,reportId,handling:handling.handling,summary:handling.summary,
          delegationId:taskId,...(handling.sessionId?{sessionId:handling.sessionId}:{})}});
      updated++;
    }
  }
  return {outcome:'completed',summary:updated?`已同步 ${updated} 个预览检查轮次的原任务进展`:'该任务没有新的预览进展',
    title:updated?'预览修复进展已同步':'预览进展无变化'};
}
