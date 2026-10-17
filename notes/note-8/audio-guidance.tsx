import { useState } from 'react';
import { Button } from '@heroui/react';
import {useActions,useWorkbench} from './surface';

export function AudioGuidance({ empty = false }: { empty?: boolean }) {
  const actions = useActions<typeof import('./actions')>();
  const workbench = useWorkbench();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <div style={{ padding: empty ? 0 : '4px 14px', fontSize: 12, color: 'var(--wb-muted)', flexShrink: 0 }}>
    {empty && <p style={{ margin: '0 0 8px' }}>尚无音频资源。</p>}
    <details><summary style={{ cursor: 'pointer', padding: '8px 0' }}>声音制作</summary><p>声音生成尚未接通，可讨论需求或试听已有资源。</p>
    <Button size="sm" variant="secondary" isDisabled={busy} onPress={() => {
      setBusy(true); setError('');
      void actions.discussAudio({}).then(session => workbench.openSession(session.sessionId))
        .catch(cause => setError(cause instanceof Error ? cause.message : String(cause)))
        .finally(() => setBusy(false));
    }}>{busy ? '正在打开…' : '讨论音频需求'}</Button>
    </details>
    {error && <p role="alert" style={{ overflowWrap: 'anywhere' }}>{error}</p>}
  </div>;
}
