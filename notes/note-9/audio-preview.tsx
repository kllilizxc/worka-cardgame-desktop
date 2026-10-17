import { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import {useNoteSurfaceVisible} from './surface';

/** Both compact and expanded players stop when the host hides their retained surface. */
export function AudioPreview({ src, autoPlay = false, onPlay, onPause, onEnded }: { src: string; autoPlay?: boolean; onPlay?: () => void; onPause?: () => void; onEnded?: () => void }) {
  const active = useNoteSurfaceVisible();
  const audio = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    const player = audio.current;
    setError('');
    setLoadFailed(false);
    const hide = () => { if (document.hidden) player?.pause(); };
    document.addEventListener('visibilitychange', hide);
    return () => { document.removeEventListener('visibilitychange', hide); player?.pause(); };
  }, [src]);
  useEffect(() => { if (!active || document.hidden) audio.current?.pause(); }, [active, src]);
  const activeRef = useRef(active); activeRef.current = active;
  useEffect(() => {
    let current = true;
    if (autoPlay && activeRef.current && !document.hidden) void audio.current?.play().catch(() => { if (current) setError('自动播放未开始，请使用播放控件试听。'); });
    return () => { current = false; };
  }, [autoPlay, src]);
  return <>{error && <p role="alert">{error}</p>}{loadFailed && <Button size="sm" variant="secondary" onPress={() => {
    audio.current?.pause();
    setError(''); setLoadFailed(false);
    audio.current?.load();
  }}>重新加载音频</Button>}<audio ref={audio} src={src} controls preload="metadata" aria-label="试听音频"
    onPlay={() => { if (!active || document.hidden) audio.current?.pause(); else onPlay?.(); }} onPause={onPause} onEnded={onEnded}
    onError={() => { setLoadFailed(true); setError('音频无法播放，请重新加载，或检查资源格式与版本。'); }} /></>;
}
