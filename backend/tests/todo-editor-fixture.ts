import {afterEach} from 'bun:test';
import {mkdir,mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createProjectBindingManager,desktopProjectId,validateProjectRoot} from '../project-binding';
import {createWorkflowService,createWorkflowExtension} from '../plugins/cardgame-content/src/workflow';
import {editTodo} from '../../notes/note-11/actions';
import {z} from '@dsh-workbench/runtime';

const temporary:string[]=[],managers:ReturnType<typeof createProjectBindingManager>[]=[];
afterEach(async()=>{await Promise.allSettled(managers.splice(0).map(manager=>manager.close()));for(const root of temporary.splice(0))await rm(root,{recursive:true,force:true});});
async function gameRoot(){const root=await mkdtemp(join(tmpdir(),'todo-generation-game-'));temporary.push(root);await mkdir(join(root,'public/data/cards'),{recursive:true});await writeFile(join(root,'package.json'),JSON.stringify({name:'synthetic-cardgame'}));await writeFile(join(root,'public/data/cards/units.json'),JSON.stringify({units:[]}));return root;}
const resourceContext=()=>({scope:{workspace:'test',access:'test',noteId:'a-todo'},signal:new AbortController().signal,read:async()=>null}) as any;
const user={kind:'user' as const,noteId:'a-cards'};
export const configure=(manager:ReturnType<typeof createProjectBindingManager>,root:string)=>manager.invoke('configureProject',{root},user);
export const read=(manager:ReturnType<typeof createProjectBindingManager>,input:Record<string,unknown>)=>manager.resources!.query!.load(z.json().parse(input),resourceContext()) as Promise<any>;

/** Production note action, project-binding guard, and durable workflow; only host storage/transport are isolated. */
export async function fixture(){
  const dataRoot=await mkdtemp(join(tmpdir(),'todo-generation-records-'));temporary.push(dataRoot);
  const records=new Map<string,any>(),configs=new Map<string,any>(),notes=new Map<string,any>();let serial=0;
  const row=(value:any)=>({value:structuredClone(value),revision:String(++serial)});
  for(const role of ['cards','preview','todo']){const id=`a-${role}`;notes.set(id,{id,desktopId:'a',stateRef:id+':state',archived:false,draft:false});configs.set(id+':config',row({cardgameRole:role}));}
  const host:any={dataRoot,app:{records:()=>({read:async(key:string)=>structuredClone(records.get(key)),write:async(key:string,value:any,options:any)=>{if((records.get(key)?.revision??null)!==options.expectedRevision)throw Error('binding CAS conflict');const saved=row(value);records.set(key,saved);return structuredClone(saved);}}),note:async(id:string)=>row(notes.get(id)),core:{readRecord:async(_table:string,key:string)=>structuredClone(configs.get(key)),listNotes:async()=>[...notes.values()].map(row),updateRecord:async(_table:string,key:string,update:any)=>{const saved=row(await update(structuredClone(configs.get(key)?.value)));configs.set(key,saved);return structuredClone(saved);}}}};
  const operations:any[]=[];
  const manager=createProjectBindingManager({host,media:{register:()=>()=>{},issue:()=>''} as any,packageRoot:'/synthetic-package',bunPath:'/synthetic-bun',isNoteController:(caller,noteId)=>caller.kind==='user'||caller.kind==='agent'&&caller.controlNoteId===noteId,validateRoot:validateProjectRoot,
    createProvider:async(childHost,_proxy,_packageRoot,_bunPath,projects)=>{
      const workflow=createWorkflowService({dataRoot:childHost.dataRoot,projects});const extension=createWorkflowExtension(workflow);
      return {...extension,resources:{query:{version:'1',load:async(input)=>z.json().parse(await extension.resources.query.load(z.record(z.string(),z.json()).parse(input)))}},invoke:async(method,input)=>{operations.push({method,input:structuredClone(input),root:projects[0]!.root});return z.json().parse(await extension.invoke(method,input));}};
    }});
  managers.push(manager);
  const a=await gameRoot(),b=await gameRoot(),projectId=desktopProjectId('a'),caller={kind:'action',noteId:'a-todo'} as any;
  const seed=()=>manager.invoke('createTodo',{projectId,id:'todo-one',title:'Original requirement',description:'Original details',images:[]},caller);
  await configure(manager,a);const bindingA=await read(manager,{op:'projectBinding'});await seed();
  const input={projectId,projectGeneration:bindingA.projectGeneration,itemId:'todo-one',title:'Old-directory draft',description:'Original details',images:[],baseFingerprint:(await read(manager,{op:'todo',projectId,id:'todo-one'})).requirementFingerprint};
  const rebindB=async()=>{await configure(manager,b);const bindingB=await read(manager,{op:'projectBinding'});await seed();return bindingB;};
  const actionContext=(afterRead?:(request:any,snapshot:any)=>Promise<void>)=>({note:{id:'a-todo',stateRef:'fixture'},store:{read:async()=>({value:{projectId},revision:'fixture-state'})},resources:{read:async(request:any)=>{const data=await manager.resources!.query!.load(request.input,resourceContext());await afterRead?.(request,data);return {key:'todo',epoch:'real-manager',version:1,data,stale:false};}},extensions:{request:async(_provider:string,method:string,value:any)=>manager.invoke(method,value,caller)}} as any);
  return {manager,dataRoot,a,b,bindingA,input,rebindB,actionContext,operations,detail:()=>read(manager,{op:'todo',projectId,id:'todo-one'})};
}

