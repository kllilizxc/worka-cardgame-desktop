import { useState, type ImgHTMLAttributes } from 'react';
import { Button } from '@heroui/react';

type Props = ImgHTMLAttributes<HTMLImageElement> & { retry?: boolean };

/** A changed resource starts fresh; failed thumbnails never nest buttons in their tile. */
export function ImagePreview(props: Props) {
  return <ImageAttempt key={props.src} {...props} />;
}

function ImageAttempt({ retry = false, onError, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role="status" style={{ color: 'var(--wb-muted)', overflowWrap: 'anywhere' }}>
    图片加载失败
    {retry && <Button size="sm" variant="tertiary" onPress={() => setFailed(false)}>重试图片</Button>}
  </span>;
  return <img {...props} onError={event => { setFailed(true); onError?.(event); }} />;
}
