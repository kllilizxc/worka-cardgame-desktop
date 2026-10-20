import {expect,test} from 'bun:test';
import {editTodo} from '../../notes/note-11/actions';
import {fixture,configure} from './todo-editor-fixture';

test('an A draft cannot edit matching B Todo after same-project directory rebind',async()=>{
  const f=await fixture(),bindingB=await f.rebindB();
  expect(bindingB.projectId).toBe(f.bindingA.projectId);expect(bindingB.projectGeneration).not.toBe(f.bindingA.projectGeneration);
  await expect(editTodo(f.actionContext(),f.input)).rejects.toThrow('旧编辑或回执');
  expect(f.operations.filter(value=>value.method==='updateTodo')).toHaveLength(0);
  expect((await f.detail()).item).toMatchObject({title:'Original requirement',revision:1});
  await configure(f.manager,f.a);expect((await f.detail()).item).toMatchObject({title:'Original requirement',revision:1});
});

test('a rebind between the A read and update cannot write matching B Todo',async()=>{
  const f=await fixture();let reads=0;
  const context=f.actionContext(async(request,snapshot)=>{expect(request.input.projectGeneration).toBe(f.bindingA.projectGeneration);expect(snapshot.projectGeneration).toBe(f.bindingA.projectGeneration);reads++;await f.rebindB();});
  await expect(editTodo(context,f.input)).rejects.toThrow('旧编辑或回执');expect(reads).toBe(1);
  expect(f.operations.filter(value=>value.method==='updateTodo')).toHaveLength(0);
  expect((await f.detail()).item).toMatchObject({title:'Original requirement',revision:1});
  await configure(f.manager,f.a);expect((await f.detail()).item).toMatchObject({title:'Original requirement',revision:1});
});

test('the current directory generation saves with its original field CAS and bound receipt',async()=>{
  const f=await fixture(),saved:any=await editTodo(f.actionContext(),f.input);
  expect(saved.projectGeneration).toBe(f.bindingA.projectGeneration);expect(saved).toMatchObject({id:'todo-one',revision:2});expect(saved.item).toBeUndefined();
  expect(f.operations.find(value=>value.method==='updateTodo')).toMatchObject({root:f.a,input:{projectGeneration:f.bindingA.projectGeneration,baseRevision:1,id:'todo-one'}});
  const current=await f.detail();expect(current.item.title).toBe('Old-directory draft');expect(current.projectGeneration).toBe(f.bindingA.projectGeneration);
});

test('suggestion inference cannot carry A source intent into matching B after rebind',async()=>{
 const f=await fixture(),context=f.actionContext();
 context.agent={infer:async()=>{await f.rebindB();return {id:'isolated-inference'};},result:async()=>({status:'completed',text:JSON.stringify([{title:'A-specific suggestion',category:'Synthetic',priority:'high',status:'todo'}])})};
 const {generateSuggestions}=await import('../../notes/note-11/actions');
 await expect(generateSuggestions(context,{projectId:f.input.projectId})).rejects.toThrow('旧编辑或回执');
 expect(f.operations.filter(operation=>operation.method==='createTodo'&&operation.input.title==='A-specific suggestion')).toHaveLength(0);
 expect((await f.detail()).item.title).toBe('Original requirement');
});

test('production request does not publish an old Todo intent into a replacement directory',async()=>{
 const f=await fixture();await f.rebindB();let published=0;
 const {productionRequest}=await import('../../notes/note-11/actions');
 const ctx={...f.actionContext(),events:{publish:async()=>{published++;return {id:'synthetic-event'};}}};
 await expect(productionRequest(ctx,{projectId:f.input.projectId,projectGeneration:f.bindingA.projectGeneration,todoId:'todo-one'})).rejects.toThrow('旧编辑或回执');
 expect(published).toBe(0);expect((await f.detail()).item.title).toBe('Original requirement');
});
