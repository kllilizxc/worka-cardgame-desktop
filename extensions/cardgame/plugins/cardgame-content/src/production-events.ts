import { createHash } from 'node:crypto';
import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';
import type { WorkflowService, ProductionRecord, ProductionRound } from './workflow';
import type { ContentService, AssetItem, AssetVersion, Page } from './types';

const object=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const required=(value:unknown,label:string)=>{if(typeof value!=='string'||!value)throw Error(`${label}缺失`);return value;};
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Domain delivery facts, not a second workflow store or cross-service transaction. */
export function createProductionEvents(workflow:WorkflowService,content:ContentService){
  async function detail(input:Record<string,unknown>){
    return (await workflow.query({...input,op:'production'}) as {production:ProductionRecord}).production;
  }
  function currentRound(production:ProductionRecord,input:Record<string,unknown>):ProductionRound {
    const round=production.rounds.at(-1);
    if(!round||(input.round!==undefined&&round.round!==input.round)||(input.sourceRequestId!==undefined&&round.requestId!==input.sourceRequestId)||round.requirementRevision!==production.requirementRevision)throw Error('制作轮次或需求已变化，请核对当前制作单');
    if(input.projectGeneration!==undefined&&round.projectGeneration!==input.projectGeneration&&!(round.projectGeneration===undefined&&input.allowLegacyReconciliation===true))throw Error('候选轮次属于旧项目绑定，请核对历史后明确新建一轮');
    return round;
  }
  async function sourceCandidates(round:ProductionRound,values:unknown){
    if(!Array.isArray(values)||!values.length||values.length>100)throw Error('候选需要 1–100 个本轮真实文件');
    const root=await realpath(required(round.requirement.outputDirectory,'轮次输出目录'));
    return Promise.all(values.map(async value=>{
      const candidate=object(value),path=required(candidate.sourcePath,'候选 sourcePath');
      if(candidate.data!==undefined||candidate.base64!==undefined)throw Error('生产候选只能使用本轮 sourcePath 文件，不能同时提供内联数据');
      if(!isAbsolute(path))throw Error('候选文件需要绝对路径');
      const actual=await realpath(path),inside=relative(root,actual);
      if(!inside||inside==='..'||inside.startsWith('..'+sep)||isAbsolute(inside))throw Error('候选文件不属于当前冻结轮次的输出目录');
      const info=await stat(actual);if(!info.isFile()||info.size>20_000_000)throw Error('候选文件必须是 20 MB 以内的普通文件');
      const bytes=await readFile(actual);if(bytes.length>20_000_000)throw Error('候选文件过大');
      const revision=createHash('sha256').update(bytes).digest('hex');
      if(candidate.revision!==undefined&&candidate.revision!==revision)throw Error('候选文件已变化，请重新核对');
      return {...candidate,sourcePath:actual,revision};
    }));
  }
  async function prepare(input:Record<string,unknown>){
    const projectId=required(input.projectId,'项目'),projectGeneration=required(input.projectGeneration,'项目代次');
    const scope={projectId,projectGeneration},productionId=required(input.productionId,'制作单');
    if(input.kind==='generation'){
      let request={...input};
      if(input.retry===true){const p=await detail(input),r=currentRound(p,input);request={...request,requestId:r.requestId,round:r.round};}
      const reserved=object(await workflow.command('reserveProduction',request));
      const production=reserved.production as ProductionRecord,round=reserved.round as ProductionRound;
      currentRound(production,{round:round.round});
      const requestId=required(reserved.requestId,'请求'),key=`generation:${projectGeneration}:${requestId}`;
      return {name:'cardgame.production.generationRequested',key,payload:{...scope,productionId,requestId,round:round.round},result:reserved};
    }
    const production=await detail(input);
    if(input.kind==='candidates'){
      const round=currentRound(production,input);
      const candidates=await sourceCandidates(round,input.candidates);
      const key=`asset-candidates:${projectGeneration}:${projectId}:${productionId}:${round.round}:${round.requestId}:${digest(candidates).slice(0,16)}`;
      return {name:'cardgame.production.candidatesRequested',key,payload:{...scope,productionId,round:round.round,sourceRequestId:round.requestId,requestId:key,candidates},result:{}};
    }
    if(input.kind==='adoption')throw Error('通用素材直接采用尚未开放。请查看或复制候选引用；卡牌与牌组请建立试玩候选，再在功能进展确认。');
    throw Error('未知生产事件');
  }
  async function receiveResult(input:Record<string,unknown>){
    const production=await detail(input),round=production.rounds.find(round=>round.requestId===input.requestId&&(input.round===undefined||round.round===input.round));
    const latest=production.rounds.at(-1);
    // Late evidence is retained without opening or registering its files.
    if(!round||round.requestId!==latest?.requestId||round.requirementRevision!==production.requirementRevision)return workflow.command('productionResult',input);
    const result=object(input.result??input),values=result.candidateRefs??result.candidates??result.assetCandidates;
    if(values!==undefined){const candidates=await sourceCandidates(round,values);return workflow.command('productionResult',{...input,result:{...result,candidateRefs:candidates}});}
    return workflow.command('productionResult',input);
  }
  async function recordCandidates(input:Record<string,unknown>){
    const production=await detail(input),round=currentRound(production,input);
    const sources=await sourceCandidates(round,input.sourceCandidates);
    if(!Array.isArray(input.candidates)||input.candidates.length!==sources.length)throw Error('候选回执数量不符');
    const candidates=await Promise.all(input.candidates.map(async(value,index)=>{
      const candidate=object(value),id=required(candidate.id,'候选身份');
      const asset=await content.query({projectId:production.projectId,op:'asset',id}) as AssetItem;
      const media=await content.resolveMedia({projectId:production.projectId,op:'media',id,variant:'original'});
      if(asset.status!=='candidate'||asset.revision!==sources[index]!.revision||media.revision!==sources[index]!.revision)throw Error('候选服务回执与本轮真实文件不符');
      return {...asset,id,revision:asset.revision};
    }));
    return workflow.command('recordCandidates',{...input,receipt:undefined,candidates},{assets:{registerCandidates:async()=>({status:'completed',result:candidates})}});
  }
  async function recordAdoption(input:Record<string,unknown>){
    const production=await detail(input),assetId=required(input.assetId,'资源'),versionId=required(input.versionId,'版本'),candidateId=required(input.candidateId,'候选');
    const asset=await content.query({projectId:production.projectId,op:'asset',id:assetId}) as AssetItem;
    if(asset.currentVersionId!==versionId)throw Error('资源服务尚未采用该版本');
    let cursor:string|undefined,version:AssetVersion|undefined;
    do {const page=await content.query({projectId:production.projectId,op:'versions',assetId,limit:100,...(cursor?{cursor}:{})}) as Page<AssetVersion>;version=page.items.find(item=>item.id===versionId);cursor=page.nextCursor;} while(!version&&cursor);
    if(!version||version.candidateId!==candidateId)throw Error('已采用版本不是该候选的真实回执');
    await content.resolveMedia({projectId:production.projectId,op:'media',id:assetId,versionId,variant:'original'});
    return workflow.command('recordAdoption',{...input,receipt:undefined},{assets:{adoptVersion:async()=>({status:'completed',result:{assetId,versionId}})}});
  }
  return {prepare,receiveResult,recordCandidates,recordAdoption};
}
