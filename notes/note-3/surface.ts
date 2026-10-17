import {useNote} from '@dsh-workbench/react';
import {useCallback,useMemo,useRef} from 'react';
export {useNoteDraft,NoteDialog,NoteIcon,NoteGuidance,withNotePrerequisites,useBackgroundHold} from '@dsh-workbench/react';
export type WidgetProps<Data extends object=Record<string,any>>={metadata:any;data:Readonly<Data>;updateData:(patch:Partial<Data>)=>Promise<{revision:string}>;mode:'compact'|'expanded';focus?:string;layout:Readonly<{width:number;maxHeight:number}>;runtime:any};
export function useActions<T=any>():any{return useNote<typeof import('./actions')>().actions;}
export function useNoteConfig<T=any>():T{return useNote<typeof import('./actions')>().config as T;}
export function useWorkbench(){return useNote<typeof import('./actions')>().host;}
export function useRuntime(){const n=useNote<typeof import('./actions')>();return useMemo(()=>({note:{id:n.metadata.id},resources:n.host.resources,resolvePreviewUrl:n.host.resolvePreviewUrl}),[n.metadata.id,n.host.resources,n.host.resolvePreviewUrl]);}
export function useResource<T=any>(name:string,input:any={},options?:{enabled?:boolean;client?:any}){
 const n=useNote<typeof import('./actions')>(); const result=(n.useQuery as any)(name,input,{enabled:options?.enabled});return {...result,revalidate:result.refresh};
}
export function useViewProps<T extends object=Record<string,any>>():WidgetProps<T>{
 const n=useNote<typeof import('./actions')>();
 const current=useRef(n);current.current=n;
 const updateData=useCallback((patch:any)=>(current.current.actions as any).setViewState({patch,expectedRevision:current.current.stateRevision}),[]);
 const runtime=useMemo(()=>({note:{id:n.metadata.id},resources:n.host.resources,resolvePreviewUrl:n.host.resolvePreviewUrl}),[n.metadata.id,n.host.resources,n.host.resolvePreviewUrl]);
 return {metadata:n.metadata,data:{title:n.metadata.name,candidates:[]} as unknown as T,mode:n.mode,focus:n.focus,layout:n.layout,runtime,updateData};
}
export function useNoteSurfaceVisible(){return useNote<typeof import('./actions')>().mode==='expanded';}
