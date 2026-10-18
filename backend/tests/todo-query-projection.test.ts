import {expect,test} from 'bun:test';
import {mkdir,mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createWorkflowService} from '../plugins/cardgame-content/src/workflow';

test('native and JSON fallback preserve identical Unicode summaries and literal full-field search',async()=>{
 const roots=await Promise.all([mkdtemp(join(tmpdir(),'todo-native-')),mkdtemp(join(tmpdir(),'todo-json-'))]);
 await mkdir(join(roots[1]!,'cardgame-workflow.sqlite'));
 const services=roots.map(dataRoot=>createWorkflowService({dataRoot,projects:[{id:'p',root:'/synthetic'}],now:()=>1}));
 try {
  for(const service of services){
   await service.command('createTodo',{projectId:'p',id:'emoji',title:'😀'.repeat(170),description:'x'.repeat(300)+' Needle',category:'constructor'});
   await service.command('createTodo',{projectId:'p',id:'newline',title:'Alpha',description:'Beta',category:'__proto__'});
  }
  for(const input of [{},{q:'needle'},{q:'a\nb'},{q:'%'},{category:'__proto__'}]){
   const pages=await Promise.all(services.map(service=>service.query({op:'todos',projectId:'p',...input})));
   expect(pages[0]).toEqual(pages[1]);
  }
  const page:any=await services[0]!.query({op:'todos',projectId:'p'}),emoji=page.items.find((item:any)=>item.id==='emoji');
  expect(Array.from(emoji.title)).toHaveLength(160);expect(emoji.titleTruncated).toBe(true);
 }finally{await Promise.all(services.map(service=>service.close()));await Promise.all(roots.map(root=>rm(root,{recursive:true,force:true})));}
});

test('native text paging reads only admitted candidates and rejects a revision race after cursor hashing',async()=>{
 // Instrument SQLite in a child process so this observation cannot affect another test database.
 const root=await mkdtemp(join(tmpdir(),'todo-lazy-observation-'));
 try {
  const entry=join(root,'observe.ts'),workflow=fileURLToPath(new URL('../plugins/cardgame-content/src/workflow.ts',import.meta.url));
  await writeFile(entry,`
import {Database} from 'bun:sqlite';
import {createWorkflowService} from ${JSON.stringify(workflow)};
const service=createWorkflowService({dataRoot:':memory:',projects:[{id:'p',root:'/synthetic'}],now:()=>1});
try{
 const description='x'.repeat(256*1024);
 for(let i=0;i<128;i++)await service.command('createTodo',{projectId:'p',id:String(i).padStart(4,'0'),title:'Synthetic '+i,description});
 const original=Database.prototype.prepare;let textRows=0,indexRows=0,allTextBytes=0;
 Database.prototype.prepare=function(sql,...args){const statement=original.call(this,sql,...args);
  if(sql.includes('FROM todos WHERE')&&sql.includes('SELECT id,revision,')){const all=statement.all.bind(statement);statement.all=(...values)=>{const rows=all(...values);indexRows+=rows.length;return rows;};}
  if(sql.includes('FROM todos WHERE')&&sql.includes('AS description')){const get=statement.get.bind(statement),all=statement.all.bind(statement);statement.get=(...values)=>{const row=get(...values);if(row)textRows++;return row;};statement.all=(...values)=>{const rows=all(...values);allTextBytes+=rows.reduce((bytes,row)=>bytes+Buffer.byteLength(row.description??''),0);return rows;};}
  return statement;};
 const page=await service.query({op:'todos',projectId:'p',view:'text',limit:1});
 Database.prototype.prepare=original;
 const digest=crypto.subtle.digest.bind(crypto.subtle);let raced=false;
 crypto.subtle.digest=async(...args)=>{const value=await digest(...args);if(!raced){raced=true;await service.command('updateTodo',{projectId:'p',id:'0127',baseRevision:1,patch:{title:'Changed after index capture'}});}return value;};
 let code;try{await service.query({op:'todos',projectId:'p',view:'text',limit:1});}catch(error){code=error.code;}finally{crypto.subtle.digest=digest;}
 console.log(JSON.stringify({textRows,indexRows,allTextBytes,total:page.total,items:page.items.length,fullText:page.items[0].description.length,raceCode:code}));
}finally{await service.close();}
`);
  const result=Bun.spawnSync([process.execPath,entry],{cwd:root,stdout:'pipe',stderr:'pipe'});
  expect(result.exitCode).toBe(0);if(result.exitCode!==0)throw Error(result.stderr.toString());
  const observed=JSON.parse(result.stdout.toString().trim().split('\n').at(-1)!);
  expect(observed).toEqual({textRows:1,indexRows:128,allTextBytes:0,total:128,items:1,fullText:256*1024,raceCode:'collection-stale'});
 }finally{await rm(root,{recursive:true,force:true});}
});
