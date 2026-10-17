async function run(event: any, api: any) {
  const nodes = await api.describe({});
  const production = nodes.find((node: any) => node.noteId === event.noteId);
  const desks = nodes.filter((node: any) => node.capabilities.actions.includes('acceptRequirement') && node.capabilities.queries.includes('task'));
  if (!production?.capabilities.queries.includes('productionDispatch') || !production.capabilities.actions.includes('bindExecution') || desks.length !== 1)
    return { outcome: 'agent', summary: '制作或执行台能力不明确' };
  const request = event.payload;
  if (!request?.projectId || !request?.projectGeneration || !request?.productionId || !request?.requestId)
    return { outcome: 'agent', summary: '旧请求缺少项目代次或制作身份；请回到原制作单点击重试交办，保留历史' };
  const current = await api.query({ noteId: production.noteId, name: 'productionDispatch',
    input: { projectId: request.projectId, projectGeneration: request.projectGeneration, productionId: request.productionId, requestId: request.requestId, round: request.round }, codeVersion: production.codeVersion });
  if(current?.completed)return {outcome:'completed',summary:'原轮次已有结果或已采用，不重复派发',title:'无需重复交办'};
  const item=current?.production,round=current?.round,submit=current?.submit;
  if(!item||!round||!submit?.goal)return {outcome:'agent',summary:'冻结制作快照不可用，未交办'};
    const same=(a:any,b:any):boolean=>{
      if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;
      const keys=Object.keys(a).sort();return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&same(a[key],b[key]));
    };
  const desk = desks[0], source = { noteId: production.noteId, objectId: item.id };
  let delegationId = item.execution?.delegationId;
  if (delegationId) {
    const task = await api.query({ noteId: desk.noteId, name: 'task', input: { delegationId }, codeVersion: desk.codeVersion });
    if (!task || task.source?.noteId !== production.noteId || task.source?.itemId !== item.id || task.archived || task.status === 'paused')
      return { outcome: 'agent', summary: '原制作任务来源或状态需要人工核对，未创建新任务' };
    if(!current.legacyReconciliation&&item.execution?.requestId===request.requestId){
      if(!same(task.source.value,{...submit,projectGeneration:request.projectGeneration})||!task.updates?.some((update:any)=>update.id===request.requestId&&update.version===task.requirementVersion))return {outcome:'agent',summary:'已绑定任务与冻结交办不一致，未重放派发'};
      await api.bindingLink({kind:'production-execution',source,target:{noteId:desk.noteId,objectId:delegationId}});
      return {outcome:'completed',summary:'原交办已接收，仅修复缺失关联，不重复派发',title:'制作关联已恢复'};
    }

  }
  if(current.legacyReconciliation){
    // An upgrade is not permission to replay an unknown external effect.
    if(!delegationId&&desk.capabilities.queries.includes('requirements')){
      const tasks=await api.query({noteId:desk.noteId,name:'requirements',input:{},codeVersion:desk.codeVersion});
      const matches=tasks.filter((task:any)=>task.sourceRef?.noteId===production.noteId&&task.sourceRef?.objectId===item.id&&task.source?.requestId===request.requestId);
      if(matches.length===1)delegationId=matches[0].id;
    }
    if(!delegationId)return {outcome:'agent',summary:'旧交办结果未知，未重新执行。请在执行台核对原请求及归档任务，补回原任务绑定；确认未执行后再明确新建一轮。'};
    const task=await api.query({noteId:desk.noteId,name:'task',input:{delegationId},codeVersion:desk.codeVersion});
    const original=task?.source?.value;
    if(task?.source?.noteId!==production.noteId||task.source.itemId!==item.id||!same(original,submit)||!task.updates?.some((update:any)=>update.id===request.requestId&&update.version===task.requirementVersion))return {outcome:'agent',summary:'旧任务与冻结快照或原请求回执不一致，未补绑定或重新执行；请打开原执行任务核对。'};
    await api.action({noteId:production.noteId,name:'bindExecution',codeVersion:production.codeVersion,operationId:'reconcile-binding',input:{projectId:request.projectId,projectGeneration:request.projectGeneration,productionId:item.id,requestId:request.requestId,receipt:{status:'accepted',result:{delegationId,status:task.status,deskNoteId:desk.noteId}}}});
    await api.bindingLink({kind:'production-execution',source,target:{noteId:desk.noteId,objectId:delegationId}});
    return {outcome:'agent',summary:'已只读核对并补回原执行任务绑定，没有重新执行。若已有产物，请从原任务核对本轮真实输出后回填 receiveResult；否则继续跟进原任务。',title:'旧交办已核对'};
  }
  const result = await api.action({ noteId: desk.noteId, name: 'acceptRequirement', codeVersion: desk.codeVersion, operationId: 'dispatch',
    input: { source: { ...source, revision: String(round.dispatchRevision), value: { ...submit, projectGeneration: request.projectGeneration } }, updateId: request.requestId,
      goal: submit.goal, scope: submit.scope, ...(submit.cwd ? { cwd: submit.cwd } : {}),
      delivery: delegationId ? 'steer' : 'queue', ...(delegationId ? { delegationId } : {}) } });
  if (!result?.delegationId) return { outcome: 'agent', summary: '执行台回执缺少任务 ID，请核对原操作' };
  await api.action({ noteId: production.noteId, name: 'bindExecution', codeVersion: production.codeVersion, operationId: 'bind',
    input: { projectId: request.projectId, projectGeneration: request.projectGeneration, productionId: item.id, requestId: request.requestId,
      receipt: { status: 'accepted', result: { ...result, deskNoteId: desk.noteId } } } });
  await api.bindingLink({ kind: 'production-execution', source, target: { noteId: desk.noteId, objectId: result.delegationId } });
  return { outcome: 'completed', summary: `制作轮次 ${round.round} 已交给执行任务 ${result.delegationId}`, title: '制作已交办' };
}
