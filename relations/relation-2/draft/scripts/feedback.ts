async function run(event: any, api: any) {
  const nodes = await api.describe({});
  const preview = nodes.find((node: any) => node.noteId === event.noteId);
  const desks = nodes.filter((node: any) => node.capabilities.actions.includes('acceptPreviewFeedback') && node.capabilities.queries.includes('task'));
  if (!preview?.capabilities.queries.includes('candidate') || !preview.capabilities.actions.includes('recordFeedback') || desks.length !== 1)
    return {outcome:'agent',summary:'预览反馈或执行台能力不明确，需要核对当前连线'};
  const report = event.payload, desk = desks[0];
  if (!report?.id || !report.candidateKey || !report.surface && report.surface !== '' || !report.runId || !['passed','failed','unchecked'].includes(report.status))
    return {outcome:'agent',summary:'预览反馈缺少候选、检查轮次或结果'};
  const current = await api.query({noteId:preview.noteId,name:'candidate',input:{key:report.candidateKey},codeVersion:preview.codeVersion});
  const candidate = current?.candidate, surface = candidate?.status?.[report.surface];
  if (!candidate || surface?.pass !== report.runId || report.status === 'failed' && surface.phase !== 'failed')
    return {outcome:'completed',summary:'候选检查轮次已更新，旧反馈无需投递',title:'已跳过旧反馈'};
  if (candidate.delegationId && (candidate.originNoteId !== desk.noteId || report.delegationId !== candidate.delegationId))
    return {outcome:'agent',summary:'候选与原任务的身份不一致，需要核对来源'};
  let delegationId = candidate.delegationId;
  if (!delegationId) {
    if (report.status !== 'failed' || report.autoRepair !== true)
      return {outcome:'completed',summary:'独立候选没有用户授权的修复请求，保留预览记录',title:'等待修复授权'};
    const source = {noteId:preview.noteId,objectId:candidate.key};
    const existing = await api.bindingList({ref:source});
    const bound = [...new Set(existing.filter((item:any) => item.kind === 'preview-repair' && item.source.noteId === source.noteId
      && item.source.objectId === source.objectId && item.target.noteId === desk.noteId).map((item:any) => item.target.objectId))];
    if (bound.length > 1) return {outcome:'agent',summary:'独立候选对应多个修复任务，需要核对原任务'};
    delegationId = bound[0];
    if (!delegationId) {
      const goal = `修复候选预览「${candidate.title || candidate.key}」：${report.summary}`;
      const result = await api.action({noteId:desk.noteId,name:'acceptRequirement',codeVersion:desk.codeVersion,operationId:'create-repair',
        input:{source:{...source,revision:current.revision,value:candidate},updateId:report.id,goal,
          scope:['仅修复本候选的已核实失败','修复项目或配置后结束本轮；预览会重新检查'],delivery:'queue'}});
      delegationId = result?.delegationId;
      if (!delegationId) return {outcome:'agent',summary:'执行台已接收修复请求，但缺少任务 ID；先核对回执'};
      await api.bindingLink({kind:'preview-repair',source,target:{noteId:desk.noteId,objectId:delegationId}});
    }
  }
  const task = await api.query({noteId:desk.noteId,name:'task',input:{delegationId},codeVersion:desk.codeVersion});
  if (!task || candidate.delegationId && task.id !== candidate.delegationId)
    return {outcome:'agent',summary:'预览对应的原任务不存在，需要核对绑定'};
  if (!candidate.delegationId && (task.source?.noteId !== preview.noteId || task.source?.itemId !== candidate.key))
    return {outcome:'agent',summary:'独立候选的修复任务来源已变化，需要核对精确绑定'};
  const handled = await api.action({noteId:desk.noteId,name:'acceptPreviewFeedback',codeVersion:desk.codeVersion,operationId:'feedback',
    input:{id:report.id,delegationId,sourceNoteId:preview.noteId,originNoteId:desk.noteId,status:report.status,
      summary:report.summary,candidateKey:candidate.key,revision:report.revision,surface:report.surface,runId:report.runId,
      ...(report.diagnostics?{diagnostics:report.diagnostics}:{}),...(report.repairable?{repairable:report.repairable}:{}),
      ...(report.autoRepair===true?{autoRepair:true}:{}),...(report.commits?{commits:report.commits}:{})}});
  if (report.status === 'failed' && surface.failure) {
    await api.action({noteId:preview.noteId,name:'recordFeedback',codeVersion:preview.codeVersion,operationId:'record-result',
      input:{key:candidate.key,surface:report.surface,runId:report.runId,reportId:report.id,
        handling:handled.handling,summary:handled.summary,delegationId,sessionId:handled.sessionId}});
  }
  const title = report.status === 'failed' ? '预览失败已交回原任务' : '预览结果已交回原任务';
  return {outcome:'completed',summary:`候选 ${candidate.title || candidate.key} 的${report.status === 'failed'?'失败':'检查'}结果已交给任务 ${delegationId}；${handled.handling}`,title};
}
