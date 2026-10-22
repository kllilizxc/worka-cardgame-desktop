import {useState} from 'react';
import {Button} from '@heroui/react';
import {useMutation,useNote} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';
export function CreateCardWorkflow({projectId,itemIds,featureId,disabled=false}:{projectId:string;itemIds:string[];featureId:string;disabled?:boolean}) {
  const {actions,useQuery,host}=useNote<typeof import('./actions')>();
  const binding=useQuery('status',{}, {enabled:!!projectId&&!!itemIds.length});
  const input={itemIds,featureId,projectGeneration:binding.data?.projectGeneration};
  const key=JSON.stringify([projectId,input.projectGeneration,featureId,[...itemIds].sort()]);
  const creation=useMutation(actions.createCardWorkflow,{key});
  const [error,setError]=useState('');
  const unavailable=disabled||!featureId||!itemIds.length||!input.projectGeneration||binding.loading||binding.stale||!!binding.error;
  const busy=creation.status==='pending'||creation.status==='unknown';
  return <>
    <Button size="sm" variant="secondary" isDisabled={unavailable||busy||creation.status==='success'} onPress={()=>void creation.mutate(input)}>制作卡面</Button>
    {creation.status==='success'&&creation.data!==undefined&&<Button size="sm" variant="secondary" onPress={()=>{const result=creation.data!;void host.openNote(result.noteId,result.itemId).catch(cause=>setError(String(cause)));}}>打开已创建制作单</Button>}
    <MutationNotice mutation={creation}/>{error&&<p role="alert">{error}</p>}{binding.error&&<p role="alert">{binding.error.message}</p>}
  </>;
}
