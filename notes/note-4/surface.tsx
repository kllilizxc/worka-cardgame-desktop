import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNote } from '@dsh-workbench/react';

type Api = ReturnType<typeof useNote<typeof import('./actions')>>;
const Scope = createContext<{ generation:string; projectId:string } | undefined>(undefined);

/** Pin this mounted editor to the service-issued binding, including all drafts.
 * Rebinding never silently blesses old edits with the new project's identity. */
export function ProductionScope({children}:{children:ReactNode}) {
  const api=useNote<typeof import('./actions')>();
  const binding=api.useQuery('projectBinding',{});
  const [opened,setOpened]=useState<{generation:string;projectId:string}>();
  const current=binding.data;
  if(!opened&&current?.configured&&current.projectGeneration) {
    setOpened({generation:current.projectGeneration,projectId:current.projectId});
  }
  if(!opened) return <section role="status">{binding.error?.message??(binding.loading?'正在读取项目绑定…':'请从内容库的“项目目录”连接此桌面。')}</section>;
  const changed=Boolean(current?.projectGeneration&&current.projectGeneration!==opened.generation);
  return <Scope.Provider value={opened}>{changed&&<p role="alert">项目目录已切换，原草稿仍保留，保存会被拒绝。宿主会保留原项目的输入。<button type="button" onClick={()=>setOpened(undefined)}>读取当前项目</button></p>}{binding.error&&<p role="alert">{binding.error.message}</p>}{children}</Scope.Provider>;
}

/** The only CardGame UI scope adapter; business methods retain useNote's types. */
export function useProductionNote() {
  const api=useNote<typeof import('./actions')>();
  const scope=useContext(Scope);
  if(!scope)throw new Error('制作界面需要项目绑定');
  const actions=api.actions;
  const useQuery:Api['useQuery']=(name,input,options)=>api.useQuery(name,{...input,projectGeneration:scope.generation},{...options});
  const usePagedQuery:Api['usePagedQuery']=(name,input,options)=>api.usePagedQuery(name,{...input,projectGeneration:scope.generation},options);
  return {metadata:api.metadata,mode:api.mode,focus:api.focus,focusRequestId:api.focusRequestId,layout:api.layout,
    config:api.config,host:api.host,files:api.files,actions,useQuery,usePagedQuery,
    projectId:scope.projectId,scopeGeneration:scope.generation};
}
