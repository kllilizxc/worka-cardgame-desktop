import { z, type NoteActionContext, type NoteQueryContext, type JsonValue } from '@dsh-workbench/runtime';
import { note, stateSchema } from './note-model';
import { actionInputs, queryInputs, queryOutputs, productionReceiptSchema, preparedEventSchema, eventReceiptSchema, record, isCardBatch } from './contracts';
export { note } from './note-model';
export type ProductionState = z.infer<typeof stateSchema>;
type ActionContext = NoteActionContext<typeof note>;
type ReadContext = Pick<NoteQueryContext<typeof note>, 'resources' | 'notes' | 'note'>;

async function command<S extends z.ZodType>(method: string, input: Record<string, unknown>, ctx: ActionContext, output: S): Promise<z.output<S>> {
  return output.parse(await ctx.host.extensions.request('cardgame-content', method, input));
}
async function readOp<S extends z.ZodType>(op: string, input: Record<string, unknown>, ctx: ReadContext, output: S): Promise<z.output<S>> {
  const snapshot = await ctx.resources.read({ name: 'extension.cardgame-content.query', input: { ...input, op } as JsonValue });
  if (snapshot.error && snapshot.data === undefined) throw new Error(snapshot.error);
  return output.parse(snapshot.data);
}
// The service owns scope and immutable round snapshots. Publishing remains a
// separate durable step: retrying the same prepared key repairs an ambiguous send.
async function publishProduction(kind: 'generation' | 'candidates' | 'adoption', input: Record<string, unknown>, ctx: ActionContext) {
  const prepared = await command('prepareProductionEvent', { ...input, kind }, ctx, preparedEventSchema);
  const event = await ctx.events.publish(prepared.name, prepared.payload, { key: prepared.key, exclusive: true });
  return { ...prepared.result, status: 'queued', requestId: typeof prepared.result.requestId==='string'?prepared.result.requestId:prepared.key, eventId: event.id, duplicate: event.duplicate };
}

export const cardWorkflow = note.action({ description: '卡牌专用工作流；保持人工确认、插画指纹和候选校验。', visibility: 'public', input: actionInputs.cardWorkflow, output: productionReceiptSchema }, (ctx, { operation, ...input }) => command(operation, input, ctx, productionReceiptSchema));
export const upsertRequest = note.action({ description: '按 Todo 身份幂等建立或更新制作单草稿，不启动生成。', visibility: 'public', receipt: 'queryable', input: actionInputs.upsertRequest, output: productionReceiptSchema }, (ctx,input) => command('upsertProduction',input,ctx,productionReceiptSchema));
export const updateProduction = note.action({ description: '按原修订保存需求，冲突时保留草稿。', visibility: 'public', input: actionInputs.updateProduction, output: productionReceiptSchema }, (ctx,input) => command('updateProduction',input,ctx,productionReceiptSchema));
export const generate = note.action({ description: '仅在用户明确点击生成后预留轮次并发布执行请求。', visibility: 'public', receipt: 'queryable', input: actionInputs.generate, output: eventReceiptSchema }, (ctx,input) => publishProduction('generation',input,ctx));
export const retry = note.action({ description: '恢复同一冻结轮次的交办，不另建任务。', visibility: 'public', input: actionInputs.retry, output: eventReceiptSchema }, (ctx,input) => publishProduction('generation',{...input,retry:true},ctx));
export const newRound = note.action({ description: '保留原执行任务，明确开始新一轮。', visibility: 'public', input: actionInputs.newRound, output: eventReceiptSchema }, (ctx,input) => publishProduction('generation',{...input,newRound:true},ctx));
export const bindExecution = note.action({ description: '把执行台回执绑定到原轮次，迟到回执不回退当前状态。', visibility: 'public', receipt: 'queryable', input: actionInputs.bindExecution, output: productionReceiptSchema }, (ctx,input) => command('bindProduction',input,ctx,productionReceiptSchema));
export const receiveResult = note.action({ description: '按请求、轮次和修订接收结果；过期结果只记历史。', visibility: 'public', receipt: 'queryable', input: actionInputs.receiveResult, output: productionReceiptSchema }, async (ctx,input) => {
  const received = await command('productionResult',input,ctx,productionReceiptSchema);
  if (received.stale) return received;
  const round = received.production.rounds?.find(round => round.requestId === input.requestId && (input.round === undefined || round.round === input.round));
  if (round?.result?.status === 'completed' && round.result.candidateRefs?.length) {
    try {
      const assetRegistration = await publishProduction('candidates', { ...input, round: round.round, candidates: round.result.candidateRefs, sourceRequestId: input.requestId }, ctx);
      return { ...received, assetRegistration };
    } catch (cause) {
      // The result is already durable. Expose the separate retryable delivery step.
      return { ...received, assetRegistration: { status:'failed',error:cause instanceof Error?cause.message:String(cause) } };
    }
  }
  return received;
});
export const registerCandidates = note.action({ description: '登记当前轮次真实文件，回填资源服务的候选身份。', visibility:'public',receipt:'queryable',input:actionInputs.registerCandidates,output:eventReceiptSchema }, (ctx,input)=>publishProduction('candidates',input,ctx));
export const recordCandidates = note.action({description:'记录资源服务已验证的当前轮次候选回执。',visibility:'public',receipt:'queryable',input:actionInputs.recordCandidates,output:productionReceiptSchema},(ctx,input)=>command('recordCandidates',input,ctx,productionReceiptSchema));
export const adoptAsset = note.action({description:'旧接口兼容：通用素材直接采用未开放；请查看/复制候选，卡牌与牌组走试玩候选及功能进展确认。',visibility:'public',receipt:'queryable',input:actionInputs.adoptAsset,output:eventReceiptSchema},(ctx,input)=>publishProduction('adoption',input,ctx));
export const recordAdoption = note.action({description:'记录资源服务已采用的确切版本回执。',visibility:'public',receipt:'queryable',input:actionInputs.recordAdoption,output:productionReceiptSchema},(ctx,input)=>command('recordAdoption',input,ctx,productionReceiptSchema));
export const bindTodo = note.action({description:'持久绑定来源待办与制作单。',visibility:'public',input:actionInputs.bindTodo,output:productionReceiptSchema},(ctx,input)=>command('bindTodo',input,ctx,productionReceiptSchema));
export const rejectCandidate = note.action({description:'否决候选并建立高优先级返工待办。',visibility:'public',input:actionInputs.rejectCandidate,output:productionReceiptSchema},(ctx,input)=>command('rejectCandidate',input,ctx,productionReceiptSchema));

export const discussCardBatch = note.action({description:'在原生便笺会话继续设计卡牌，停在用户确认。',visibility:'public',input:actionInputs.discussCardBatch,output:z.object({sessionId:z.string()}).loose()},async(ctx,input)=>{
  const detail=await readOp('cardBatch',input,ctx,queryOutputs.cardBatch);
  if(!ctx.host.agent.prepare)throw new Error('宿主没有提供原生会话');
  const session=await ctx.host.agent.prepare({noteId:ctx.note.id});
  const prompt=[`用户要继续卡牌工作流：${detail.production.brief}。productionId=${input.productionId}，baseRevision=${detail.production.revision}。`,
    input.cardId?`当前选中卡牌：${input.cardId}。先读取 cardBatch，再按用户要求微调。`:'结合项目现有 units.json、效果类型和世界观生成卡组草稿，调用 cardWorkflow(operation=setCardDrafts) 保存，不要只在对话输出。',
    ...(detail.batch.deck?[`独立牌组：${detail.batch.deck.title}，目标 ${detail.batch.deck.targetSize} 张总量。用 setCardDrafts 同时保存 cards 与 deckPlan，保留 id=${detail.batch.deck.id}，entries=[{cardId,count}] 总量等于 targetSize。不要写正式默认牌组，不调用生图，停在用户确认整套草案。单卡用 saveCardDraft，数量用 saveDeckPlan，保留其他素材。`]:[]),
    '沿用原有执行效果结构。已确认卡牌逐张修改；不能覆盖人工确认。停在人工微调步骤。',
    '插画由 Codex 内置 imagegen 承接；不可用时保存 requestCardArt 交接，不得假装已生成或改用收费接口。'].join('\n');
  await ctx.host.agent.run({noteId:ctx.note.id,sessionId:session.sessionId,prompt});return session;
});
export const linkCompanion=note.action({description:'补全制作单的配套来源和待办关联。',visibility:'public',input:actionInputs.linkCompanion,output:productionReceiptSchema},(ctx,input)=>command('linkCardCompanion',input,ctx,productionReceiptSchema));

async function featureChoices(ctx:ReadContext){
  const owner=await ctx.notes.read(ctx.note.id),notes=await ctx.notes.lookup({desktopId:owner.desktopId});
  const trackers=notes.filter(note=>!note.archived&&note.actions?.includes('setArchiveStatus')&&note.actions?.includes('confirmGameCandidate'));
  if(trackers.length!==1)throw new Error(trackers.length?'本桌面有多个功能进展便笺，请先确定使用哪一个':'本桌面没有可用的功能进展便笺');
  const snapshot=await ctx.resources.read<{features?:Array<{id:string;title:string;archived?:boolean}>}>({name:'extension.official-feature-tracker.state',input:{targetNoteId:trackers[0]!.id}});
  if(snapshot.error&&snapshot.data===undefined)throw new Error(snapshot.error);
  return {items:(snapshot.data?.features??[]).filter(item=>!item.archived).map(({id,title})=>({id,title}))};
}
export const queries={
  productionDispatch:note.query({description:'读取已有轮次的冻结交办快照，用于同请求重试和旧回执核对。',input:actionInputs.bindExecution.omit({receipt:true}).extend({round:z.number()}),output:record},(ctx,input)=>readOp('productionDispatch',input,ctx,record)),
  projectBinding:note.query({description:'读取宿主持久项目绑定状态与代次。',input:queryInputs.projectBinding,output:queryOutputs.projectBinding},(ctx,input)=>readOp('projectBinding',input,ctx,queryOutputs.projectBinding)),
  productionContext:note.query({description:'读取制作单关联的功能、待办与配套来源。',input:queryInputs.productionContext,output:queryOutputs.productionContext},async(ctx,input)=>{
    const [detail,choices]=await Promise.all([readOp('production',input,ctx,queryOutputs.production),featureChoices(ctx)]);
    const p=detail.production;
    const [todo,source]=await Promise.all([p.todoId?readOp('todo',{...input,id:p.todoId,view:'summary'},ctx,z.object({item:queryOutputs.companionChoices.shape.todos.element})):undefined,isCardBatch(p.batch)&&p.batch.companion?readOp('card',{...input,id:p.batch.companion.cardId},ctx,queryOutputs.sourceCard):undefined]);
    return {feature:choices.items.find(item=>item.id===p.featureId),todo:todo?.item,source};
  }),
  companionChoices:note.query({description:'读取可关联的功能、单位和未绑定待办。',input:queryInputs.companionChoices,output:queryOutputs.companionChoices},async(ctx,input)=>{
    const [features,units,todos]=await Promise.all([featureChoices(ctx),readOp('cards',{...input,kind:'unit',limit:200},ctx,z.object({items:queryOutputs.companionChoices.shape.units})),readOp('todos',{...input,limit:100},ctx,z.object({items:queryOutputs.companionChoices.shape.todos}))]);
    return {features:features.items,units:units.items.filter(item=>item.kind==='unit'),todos:todos.items.filter(item=>!item.productionId&&item.status!=='done')};
  }),
  featureChoices:note.query({description:'读取当前桌面的可选功能项。',input:queryInputs.featureChoices,output:queryOutputs.featureChoices},ctx=>featureChoices(ctx)),
  sourceCard:note.query({description:'读取用于配套或插画复用的真实来源卡牌。',input:queryInputs.sourceCard,output:queryOutputs.sourceCard},(ctx,input)=>readOp('card',input,ctx,queryOutputs.sourceCard)),
  cardBatch:note.query({description:'读取卡牌批次、逐卡阶段及牌组验收报告。',input:queryInputs.cardBatch,output:queryOutputs.cardBatch},(ctx,input)=>readOp('cardBatch',input,ctx,queryOutputs.cardBatch)),
  cardFaceThemes:note.query({description:'读取卡面主题及当前生图能力。',input:queryInputs.cardFaceThemes,output:queryOutputs.cardFaceThemes},(ctx,input)=>readOp('cardFaceThemes',input,ctx,queryOutputs.cardFaceThemes)),
  productions:note.query({description:'分页读取制作单。',input:queryInputs.productions,output:queryOutputs.productions},async(ctx,input)=>{const page=await readOp('productions',input,ctx,queryOutputs.productions);return {...page,...(page.nextCursor?{next:page.nextCursor}:{})};}),
  production:note.query({description:'读取原需求、轮次及回执。',input:queryInputs.production,output:queryOutputs.production},(ctx,input)=>readOp('production',{...input,id:input.productionId},ctx,queryOutputs.production)),
  media:note.query({description:'解析已登记资源的只读媒体预览。',input:queryInputs.media,output:queryOutputs.media},(ctx,input)=>readOp('media',input,ctx,queryOutputs.media)),
  workflowStatus:note.query({description:'读取制作与待办工作流概要。',input:queryInputs.workflowStatus,output:queryOutputs.workflowStatus},(ctx,input)=>readOp('workflowStatus',input,ctx,queryOutputs.workflowStatus)),
};
export const setViewState=note.action({description:'保存本便笺界面选择。',visibility:'private',requiresConfig:false,input:z.object({patch:stateSchema.partial(),expectedRevision:z.string()}),output:z.object({revision:z.string()})},async(ctx,input)=>{const saved=await ctx.state.update(draft=>{Object.assign(draft,input.patch);},{expectedRevision:input.expectedRevision});return {revision:saved.revision};});
export const events={
  generation:note.event({name:'cardgame.production.generationRequested',description:'准确轮次已持久化，等待执行台接收。',objectRef:'/productionId',revision:'/round',visibility:'public',payload:record}),
  candidates:note.event({name:'cardgame.production.candidatesRequested',description:'登记候选文件并回填实际版本。',objectRef:'/productionId',visibility:'public',payload:record}),
  adoption:note.event({name:'cardgame.production.adoptionRequested',description:'仅用于核对旧版采用请求，不自动采用资源。',objectRef:'/candidateId',visibility:'public',payload:record}),
};
