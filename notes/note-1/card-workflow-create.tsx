import {useEffect,useInsertionEffect,useRef} from 'react';
import {Button} from '@heroui/react';
import {useAction,useNote} from '@dsh-workbench/react';

/** Creation owns one host receipt; opening its target is an independent UI action. */
export function CreateCardWorkflow({projectId,itemIds,featureId,disabled=false}:{projectId:string;itemIds:string[];featureId:string;disabled?:boolean}) {
  const {actions,useQuery,host}=useNote<typeof import('./actions')>();
  const binding=useQuery('status',{}, {enabled:!!projectId&&!!itemIds.length});
  type Input=Parameters<typeof actions.createCardWorkflow>[0];
  const input:Input={itemIds,featureId,projectGeneration:binding.data?.projectGeneration};
  const key=(value:Input)=>JSON.stringify([projectId,value.projectGeneration,value.featureId,[...value.itemIds].sort()]);
  const creation=useAction({action:actions.createCardWorkflow,key});
  const navigation=useAction();
  const targetKey=key(input),outcome=creation.for(targetKey);
  // Navigation belongs to this displayed selection, not to the accepted command.
  // Changing its business key or deleting the component retires only this owner.
  const owner=useRef<symbol|undefined>(undefined),displayed=useRef(false);
  useInsertionEffect(()=>{const token=Symbol();owner.current=token;return()=>{if(owner.current===token)owner.current=undefined;};},[targetKey]);
  useEffect(()=>{displayed.current=true;return()=>{displayed.current=false;};},[]);
  const saved=outcome?.receiptConfirmed;
  const unknown=outcome?.needsVerification&&!outcome.pending;
  const rejected=!!outcome?.error&&!outcome.needsVerification&&!outcome.pending;
  const failure=outcome?.readError??outcome?.error;
  const unavailable=disabled||!featureId||!itemIds.length||!input.projectGeneration||binding.loading||binding.stale||!!binding.error;
  async function open() {
    const token=owner.current;
    const result=await creation.run(input);
    const requestId=creation.for(targetKey)?.requestId;
    if(!token||owner.current!==token||!displayed.current)return;
    if(result)await navigation.run(async()=>{
      try {await host.openNote(result.noteId,result.itemId);if(owner.current===token&&creation.for(targetKey)?.requestId===requestId)creation.dismiss(targetKey);}
      catch(cause){throw new Error(`制作单已创建，打开失败：${cause instanceof Error?cause.message:String(cause)}`);}
    });
  }
  const startAnother=()=>{creation.dismiss(targetKey);navigation.clearError();void open();};
  return <>
    <Button size="sm" variant="secondary" isDisabled={unavailable||outcome?.pending||navigation.pending} onPress={rejected?startAnother:()=>void open()}>{outcome?.pending?'正在处理…':saved?'打开已创建制作单':unknown?'核对创建结果':rejected?'重试创建':'制作卡面'}</Button>
    {saved&&<Button size="sm" variant="tertiary" isDisabled={unavailable||navigation.pending} onPress={startAnother}>新建另一制作单</Button>}
    {unknown&&<span className="cg-error" role="alert">创建结果尚未确认，请先核对制作单；不会重复创建。{failure?.message}</span>}
    {rejected&&<span className="cg-error" role="alert">创建未执行：{failure?.message}</span>}
    {navigation.error&&<span className="cg-error" role="alert">{navigation.error.message}</span>}
    {binding.error&&<span className="cg-error" role="alert">{binding.error.message}</span>}
  </>;
}
