import {useState} from 'react';
import {Button} from '@heroui/react';
import {useNote,useLocale} from '@dsh-workbench/react';
import type {LazyCollectionField} from '@dsh-workbench/runtime';
import type {CandidateSpec} from './model';
import type {CandidateSummary,FeedbackSummary} from './view-model';
import {ui} from './messages';

function isReference(value:unknown):value is LazyCollectionField {
  return typeof value==='object'&&value!==null&&'kind' in value&&value.kind==='collection-field';
}
function FieldValue({value}:{value:unknown}) {
  if(value===undefined)return <p role="status">{ui('详细字段不存在')}</p>;
  if(value===null||value===''||Array.isArray(value)&&value.length===0)return <p role="status">{ui('详细字段为空')}</p>;
  return <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',maxHeight:220,overflow:'auto',fontSize:12}}>{typeof value==='string'?value:JSON.stringify(value,null,2)}</pre>;
}
/** Mounted only by an explicit report-open action; refs are passed unchanged. */
function ReportField({reference}:{reference:LazyCollectionField}) {
  const {useQuery}=useNote<typeof import('./actions')>();
  const name=reference.collection==='outbox'?'outbox.field':reference.collection==='archivedCandidates'?'archivedCandidates.field':'candidates.field';
  const result=useQuery(name,{key:reference.key,field:reference.field,revision:reference.revision});
  return <section><strong>{reference.field}</strong>
    {result.loading?<p role="status">{ui('正在读取详细字段…')}</p>:result.error?<p role="alert">{result.error.message}<Button size="sm" onPress={()=>void result.refresh().catch(()=>undefined)}>{ui('重试')}</Button></p>:<FieldValue value={result.data}/>}
  </section>;
}
export function FeedbackReport({item}:{item:FeedbackSummary}) {
  const [open,setOpen]=useState(false);
  return <section><Button size="sm" aria-expanded={open} onPress={()=>setOpen(value=>!value)}>{item.subject||item.id}</Button>{open&&(isReference(item.diagnostics)?<ReportField reference={item.diagnostics}/>:<FieldValue value={item.diagnostics}/>)}</section>;
}
export function CandidateReport({candidate,surface}:{candidate:CandidateSpec|CandidateSummary;surface?:string}) {
  useLocale();
  const status=surface?candidate.status?.[surface]:undefined;
  const values=[status?.failure?.log,status?.verified?.checks,status?.steps].filter(value=>value!==undefined);
  return <section aria-label={ui('查看检查与诊断')} style={{maxHeight:280,overflow:'auto',padding:12,background:'var(--wb-surface)',borderRadius:'var(--wb-radius-small)'}}>
    {values.length?values.map((value,index)=>isReference(value)?<ReportField key={value.field+':'+value.revision} reference={value}/>:<FieldValue key={index} value={value}/>):<p role="status">{ui('没有详细报告')}</p>}
  </section>;
}
