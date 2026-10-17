import {useNote} from '@dsh-workbench/react';
import {useState} from 'react';
export type StoryReport=Extract<import('./contract').ContentQueryOutput<'storyAnalysis'>,{nodes:unknown}>;
export interface StorySelection {
  selected?:string;
  selectedNode?:string;
  onSelect(id:string):Promise<void>;
  onNodeSelect(id:string):Promise<void>;
}
/** Both surfaces read the same authority and write the existing selected IDs. */
export function useStoryView({selected,onSelect,onNodeSelect}:StorySelection,limit:number,query=''){
  const noteApi=useNote<typeof import('./actions')>();
  const catalog=noteApi.usePagedQuery('gameCatalog',{kind:'story',q:query,limit});
  const report=noteApi.useQuery('storyAnalysis',{id:selected||''},{enabled:Boolean(selected)});
  const reportData=report.data&&'nodes' in report.data?report.data:undefined;
  const [selectionError,setSelectionError]=useState('');
  async function select(id:string){setSelectionError('');try{await onSelect(id);}catch(error){setSelectionError(error instanceof Error?error.message:String(error));}}
  async function selectNode(id:string){setSelectionError('');try{await onNodeSelect(id);}catch(error){setSelectionError(error instanceof Error?error.message:String(error));}}
  return {catalog,report,reportData,selectionError,setSelectionError,select,selectNode};
}
