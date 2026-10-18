import {expect,test} from 'bun:test';
import {Database} from 'bun:sqlite';
import {mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createWorkflowService,createWorkflowQueryResource} from '../plugins/cardgame-content/src/workflow';
import {workflowReadContracts} from '../plugins/cardgame-content/src/contract';
import * as actions from '../../notes/note-11/actions';
import {bindQueryContext} from '@dsh-workbench/runtime/internal';
const worka=process.env.WORKA_BUILD_SOURCE_ROOT??process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_BUILD_SOURCE_ROOT to the framework providing the shared query protocol');
const {ResourceRegistry}=await import(join(worka,'src/resources/registry.ts'));
const {QueryDependencies}=await import(join(worka,'src/core/query-dependencies.ts'));
const bytes=(value:unknown)=>Buffer.byteLength(JSON.stringify(value));

// Real SQLite rows and the extension -> note query -> managed display path.
// Long, distinct labels reproduced the former >1MB workflowStatus response.
test('10k Todo categories page losslessly with global counts inside the real display wire budget',async()=>{
 const root=await mkdtemp(join(tmpdir(),'todo-category-pages-'));
 const service=createWorkflowService({dataRoot:root,projects:[{id:'p',root:'/synthetic'}],now:()=>1});
 const registry=new ResourceRegistry(new QueryDependencies());
 try{
  await service.query({op:'workflowStatus',projectId:'p'});
  const expected=new Map<string,number>(),db=new Database(join(root,'cardgame-workflow.sqlite'));
  try{
   const stmt=db.prepare('INSERT INTO todos VALUES(?,?,?,?,?,?,?,?,?)');
   db.transaction(()=>{for(let i=0;i<10000;i++){
    const category=i<9995?'分'.repeat(40)+String(i).padStart(5,'0'):['__proto__','constructor','ALL','__proto__','constructor'][i-9995]!;
    expected.set(category,(expected.get(category)??0)+1);
    const status=['todo','in_progress','done','blocked'][i%4]!,item={projectId:'p',id:String(i),title:'Category fixture',status,completed:status==='done',priority:'medium',category,requirementRevision:1,revision:1,createdAt:'1970-01-01T00:00:00.001Z',updatedAt:'1970-01-01T00:00:00.001Z'};
    stmt.run('p',item.id,item.title,item.status,item.priority,item.createdAt,item.updatedAt,1,JSON.stringify(item));
   }})();
  }finally{db.close();}
  registry.register('extension.cardgame-content.query',createWorkflowQueryResource(service));
  for(const name of ['categories','workflowStatus'] as const)registry.register(name,{version:'1',load:async(input:any,context:any)=>{
   const raw={note:{id:'todo',stateRef:'fixture'},store:{read:async()=>({value:{projectId:'p'},revision:'config'})},resources:{read:async(request:any)=>({key:'extension',epoch:'fixture',version:1,stale:false,data:await context.read(request)})}};
   return actions.queries[name](bindQueryContext(actions.note,raw as any),input);
  }});
  const scope={workspace:'test',access:'test',noteId:'todo',displayPage:'page',displayNoteId:'todo',displayContract:1 as const};
  const status:any=await registry.read({name:'workflowStatus',input:{projectId:'p'}},scope);
  expect(status.error).toBeUndefined();expect(status.data.counts).toEqual({todos:10000,todo:2500,inProgress:2500,done:2500,blocked:2500});expect(status.data.categories).toBeUndefined();expect(bytes(status)).toBeLessThan(4096);
  const observed=new Map<string,number>(),cursors=new Set<string>();let cursor:string|undefined,revision:string|undefined,maxPageBytes=0;
  do{
   const snapshot:any=await registry.read({name:'categories',input:{projectId:'p',limit:100,...(cursor?{cursor}:{})}},scope);
   expect(snapshot.error).toBeUndefined();const page=workflowReadContracts.categories.output.parse(snapshot.data);
   expect(page.total).toBe(expected.size);expect(page.items.length).toBeGreaterThan(0);expect(page.items.length).toBeLessThanOrEqual(100);
   revision??=page.revision;expect(page.revision).toBe(revision);maxPageBytes=Math.max(maxPageBytes,bytes(snapshot));
   for(const item of page.items){expect(observed.has(item.category)).toBe(false);observed.set(item.category,item.count);}
   cursor=page.next;if(cursor){expect(cursors.has(cursor)).toBe(false);cursors.add(cursor);}
  }while(cursor);
  expect(observed).toEqual(new Map([...expected].sort(([a],[b])=>a<b?-1:a>b?1:0)));expect([...observed.values()].reduce((sum,count)=>sum+count,0)).toBe(10000);
  expect(observed.get('__proto__')).toBe(2);expect(observed.get('constructor')).toBe(2);expect(observed.get('ALL')).toBe(1);expect(maxPageBytes).toBeLessThan(32_000);
 }finally{await registry.close();await service.close();await rm(root,{recursive:true,force:true});}
},30_000);

test('category count changes stale native cursors and category cursors cannot page Todos',async()=>{
 const root=await mkdtemp(join(tmpdir(),'todo-category-cursors-')),service=createWorkflowService({dataRoot:root,projects:[{id:'p',root:'/synthetic'}]});
 try{
  for(const [id,category] of [['a','constructor'],['b','__proto__'],['c','ALL']])await service.command('createTodo',{projectId:'p',id,title:id,category});
  const first=workflowReadContracts.categories.output.parse(await service.query({op:'categories',projectId:'p',limit:1}));
  expect(first.total).toBe(3);expect(first.next).toBeTruthy();
  await expect(service.query({op:'todos',projectId:'p',limit:1,cursor:first.next})).rejects.toMatchObject({code:'collection-stale'});
  await service.command('createTodo',{projectId:'p',id:'d',title:'d',category:'constructor'});
  await expect(service.query({op:'categories',projectId:'p',limit:1,cursor:first.next})).rejects.toMatchObject({code:'collection-stale'});
  const current=workflowReadContracts.categories.output.parse(await service.query({op:'categories',projectId:'p',limit:100}));
  expect(current.revision).not.toBe(first.revision);expect(current.items.find(item=>item.category==='constructor')?.count).toBe(2);
  const filtered:any=await service.query({op:'todos',projectId:'p',category:'constructor'});expect(filtered.total).toBe(2);
 }finally{await service.close();await rm(root,{recursive:true,force:true});}
});
