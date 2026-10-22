/** Read-only visual fixture adapter. Production lifecycle is exercised separately
 * by the host UI tests; this adapter feeds identical data to both source versions. */
import {useState} from 'react';
export * from '@visual/actual-sdk';
let current:any;
const cache=new Map<string,any>();
const noop=()=>{};
const promise=async()=>{};
export function configure(value:any){current=value;cache.clear();}
function result(name:string,input:any={},options?:{enabled?:boolean}){
 const key=JSON.stringify([name,input,options?.enabled!==false]);
 if(cache.has(key))return cache.get(key);
 let data;
 if(options?.enabled!==false){
  current.reads.push({name,input});
  data=current.read(name,input);
 }
 const value={data,value:data,items:data?.items??[],total:data?.total,loading:false,stale:false,error:undefined,revision:data?.revision??'fixture',pageIndex:0,hasNext:false,hasPrevious:false,
  next:promise,previous:promise,reset:noop,refresh:promise,revalidate:promise,
  draftSource:(select:any)=>({value:select(data)?.value,revision:'fixture',loading:false,refresh:promise}),
 };
 cache.set(key,value);return value;
}
const actions=new Proxy({}, {get:(_target,name)=>async()=>{current.writes.push(String(name));throw Error('Visual fixture must not execute business writes');}});
const host=new Proxy({resources:{},resolvePreviewUrl:async(url:string)=>url},{get:(target,name)=>name in target?(target as any)[name]:promise});
export function useNote<T=unknown>():any{return {metadata:current.metadata,config:current.config,state:current.state,stateRevision:'fixture',mode:'compact',layout:current.layout,actions,host,files:{},useQuery:result,usePagedQuery:result};}
export function useViewState<T>(key:string,initial:T){return useState(initial);}
export function useNoteDraft(options:any){const [value,set]=useState(options.value??options.source?.value??{});return {value,set,dirty:false,saving:false,ready:true,save:promise,reset:noop,discard:noop};}
export function useAction(){return {pending:false,status:'idle',error:undefined,outcomes:[],for:()=>undefined,dismiss:noop,run:promise,reset:noop,retry:promise};}
export function useBackgroundHold(){}
export function withNotePrerequisites<T>(component:T):T{return component;}

// Closed legacy dialogs have no visible compact content. Reject a fixture that
// tries to open one instead of silently replacing its visual presentation.
export function NoteDialog(props:any){if(props.open||props.isOpen)throw Error('Compact fixture opened a dialog');return null;}
