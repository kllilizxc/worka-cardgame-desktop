async function run(event: any, api: any) {
  const nodes = await api.describe({});
  const desk = nodes.find((node: any) => node.noteId === event.noteId);
  const previews = nodes.filter((node: any) => node.capabilities.actions.includes('receive') && node.capabilities.queries.includes('candidate'));
  if (!desk?.capabilities.queries.includes('task') || !desk.capabilities.actions.includes('recordPreviewDelivery') || previews.length !== 1)
    return {outcome:'agent',summary:'执行台或候选预览能力不明确，需要核对当前连线'};
  const payload = event.payload;
  if (!payload?.delegationId || payload.originNoteId !== desk.noteId || payload.key !== payload.delegationId || !payload.revision)
    return {outcome:'agent',summary:'候选事件缺少原任务或准确版本'};
  const task = await api.query({noteId:desk.noteId,name:'task',input:{delegationId:payload.delegationId},codeVersion:desk.codeVersion});
  if (!task?.candidate || task.candidate.revision !== payload.revision)
    return {outcome:'completed',summary:'候选已更新，旧启动请求无需投递',title:'已跳过旧候选'};
  const preview = previews[0];
  const received = await api.action({noteId:preview.noteId,name:'receive',codeVersion:preview.codeVersion,operationId:'receive',input:payload});
  if (!received?.accepted || received?.candidate?.key !== payload.key)
    return {outcome:'agent',summary:'预览已返回接收回执，但候选身份不一致；先核对原操作'};
  await api.bindingLink({kind:'preview',source:{noteId:desk.noteId,objectId:task.id},target:{noteId:preview.noteId,objectId:payload.key}});
  const receipt = await api.action({noteId:desk.noteId,name:'recordPreviewDelivery',codeVersion:desk.codeVersion,operationId:'receipt',
    input:{delegationId:task.id,revision:payload.revision,previewNoteId:preview.noteId,eventKey:event.key}});
  if (!receipt?.delivered)
    return {outcome:'completed',summary:'候选在投递期间已有更新，旧接收回执只保留为历史',title:'已跳过旧候选回执'};
  return {outcome:'completed',summary:`任务 ${task.id} 的候选已交给预览；检查结果仍需等待`,title:'候选已交给预览'};
}
