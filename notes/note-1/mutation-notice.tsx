import { useState } from 'react';

/** Status presentation only. The SDK owns every command and draft. */
type State = {
  status: 'idle' | 'pending' | 'success' | 'error' | 'unknown';
  error?: Error; readError?: Error;
  retry(): Promise<unknown>; reset(): Promise<boolean>;
  draft?: { ready: boolean; dirty: boolean; locked: boolean; retained: boolean };
};
export function MutationNotice({mutation, resetLabel = '继续编辑'}: {mutation: State; resetLabel?: string}) {
  const [discarding, setDiscarding] = useState(false);
  const {status, draft} = mutation;
  return <div aria-live="polite" style={{fontSize:12,color:'var(--wb-muted)',display:'grid',gap:8}}>
    {draft && !draft.ready && <p role="status">正在恢复输入…</p>}
    {draft?.ready && draft.dirty && !draft.retained && <p role="status">正在保留输入…</p>}
    {status === 'pending' && <p role="status">正在处理…</p>}
    {status === 'unknown' && <p role="alert">结果尚未确认，请核对原操作。</p>}
    {status === 'success' && <p role="status">操作已确认。</p>}
    {mutation.error && <p role="alert">{mutation.error.message}</p>}
    {mutation.readError && <p role="alert">操作已确认，读取最新内容失败：{mutation.readError.message}</p>}
    {(status === 'unknown' || mutation.readError || (draft && !draft.ready && mutation.error)) && <button type="button" onClick={()=>void mutation.retry()}>核对 / 重新读取</button>}
    {status === 'success' && <button type="button" disabled={!!mutation.readError} onClick={()=>void mutation.reset()}>{draft ? resetLabel : '清除提示'}</button>}
    {draft?.dirty && !draft.locked && (discarding ? <span>放弃这份未提交输入？ <button type="button" onClick={()=>{void mutation.reset().then(ok=>{if(ok)setDiscarding(false);});}}>确认放弃</button> <button type="button" onClick={()=>setDiscarding(false)}>保留</button></span> : <button type="button" onClick={()=>setDiscarding(true)}>放弃输入</button>)}
  </div>;
}
