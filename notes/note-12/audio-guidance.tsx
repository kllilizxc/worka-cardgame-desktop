import {useState} from 'react';
import {Button} from '@heroui/react';
import {useNote,useMutation} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';
export function AudioGuidance({empty=false}:{empty?:boolean}){
 const {actions,host}=useNote<typeof import('./actions')>();
 const prepare=useMutation(actions.discussAudio);
 const [error,setError]=useState('');
 return <div style={{padding:empty?0:'4px 14px',fontSize:12,color:'var(--wb-muted)'}}>
  {empty&&<p>尚无音频资源。</p>}<details><summary>声音制作</summary><p>声音生成尚未接通，可讨论需求或试听已有资源。</p>
  <Button size="sm" variant="secondary" isDisabled={prepare.status==='pending'||prepare.status==='unknown'} onPress={()=>void prepare.mutate({})}>准备音频讨论</Button>
  {prepare.status==='success'&&prepare.data!==undefined&&<Button size="sm" onPress={()=>void host.openSession(prepare.data!.sessionId).catch(cause=>setError(String(cause)))}>打开音频讨论</Button>}
  <MutationNotice mutation={prepare}/>{error&&<p role="alert">{error}</p>}</details>
 </div>;
}
