async function run(event: any, api: any) {
  const nodes = await api.describe({});
  const production = nodes.find((node: any) => node.noteId === event.noteId);
  if (!production?.capabilities.queries.includes('production'))
    return { outcome: 'agent', summary: '无法读取原制作单；旧通用素材采用请求未执行，请回原制作单核对候选。' };
  const request = event.payload;
  if (!request?.projectId || !request?.projectGeneration || !request?.productionId || !request?.candidateId || !request?.requestId)
    return { outcome: 'agent', summary: '采用请求缺少制作单、候选或请求 ID' };
  const current = await api.query({ noteId: production.noteId, name: 'production',
    input: { projectId: request.projectId, projectGeneration: request.projectGeneration, productionId: request.productionId }, codeVersion: production.codeVersion });
  const item = current?.production;
  const candidate = item?.candidateRefs?.find((value: any) => (value.id || value.key || value.assetId) === request.candidateId);
  if (!candidate || candidate.rejectedAt || item.projectId !== request.projectId)
    return { outcome: 'agent', summary: '候选不属于当前制作单或已被否决，未采用资源' };
  return { outcome: 'agent', summary: '这是旧版通用素材采用请求，未执行采用。候选仍可查看或复制引用；卡牌与牌组请回原制作单建立试玩候选，再由用户在功能进展确认。若历史已有副作用，先核对资源实际版本与原回执，不得把本提示记录为采用完成。' };
}
