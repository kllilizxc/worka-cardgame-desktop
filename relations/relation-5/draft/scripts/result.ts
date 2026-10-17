async function run(event: any, api: any) {
  const nodes = await api.describe({});
  const desk = nodes.find((node: any) => node.noteId === event.noteId);
  const productions = nodes.filter((node: any) => node.capabilities.actions.includes('receiveResult'));
  if (!desk?.capabilities.queries.includes('task') || productions.length !== 1)
    return { outcome: 'agent', summary: '制作结果或执行台能力不明确' };
  const delegationId = event.payload?.delegationId;
  if (!delegationId) return { outcome: 'agent', summary: '任务事件缺少稳定 ID' };
  const task = await api.query({ noteId: desk.noteId, name: 'task', input: { delegationId }, codeVersion: desk.codeVersion });
  if (task?.source?.noteId !== productions[0].noteId)
    return { outcome: 'completed', summary: '该任务不是 CardGame 制作请求', title: '无需同步制作' };
  if (!['completed', 'done', 'failed', 'cancelled', 'needs-input'].includes(task.status))
    return { outcome: 'completed', summary: '制作任务仍在进行，等待实际结果', title: '等待执行结果' };
  const source=task.source.value,returned=task.execution?.result?.value?.productionResult;
  if(!source?.projectGeneration||!returned||returned.productionId!==source.productionId||returned.requestId!==source.requestId||returned.round!==source.round||returned.requirementRevision!==source.requirement?.requirementRevision||task.execution?.requirementVersion!==task.requirementVersion)
    return { outcome: 'agent', summary: '制作任务已到终态；需核对产物文件、原轮次和需求修订后写回制作结果' };
  if(returned.status!=='completed'||!Array.isArray(returned.candidates)||!returned.candidates.length||returned.candidates.some((item:any)=>typeof item?.sourcePath!=='string'))
    return {outcome:'agent',summary:'结果需要语义核对或缺少明确文件证据，未自动标记完成'};
  const result=await api.action({noteId:productions[0].noteId,name:'receiveResult',codeVersion:productions[0].codeVersion,operationId:'receive-production-result',
    input:{projectId:source.projectId,projectGeneration:source.projectGeneration,productionId:source.productionId,requestId:source.requestId,round:source.round,revision:source.requirement.requirementRevision,status:'completed',result:{conclusion:returned.conclusion??'',candidateRefs:returned.candidates}}});
  return {outcome:'completed',summary:result?.stale?'旧轮次结果已留存，不影响当前制作':'结构化制作结果已回填；候选仍需登记和用户确认',title:'制作结果已核对'};
}
