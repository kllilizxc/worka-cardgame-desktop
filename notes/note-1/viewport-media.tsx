import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Keep the collection's layout, but only own media queries for visible tiles. */
export function ViewportMedia({ children }: { children: ReactNode }) {
  const element = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!element.current) return;
    if (typeof IntersectionObserver !== 'function') { setVisible(true); return; }
    let active = true;
    const observer = new IntersectionObserver(entries => {
      if (active) setVisible(entries.some(entry => entry.isIntersecting));
    });
    observer.observe(element.current);
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <span ref={element} style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', minWidth: 0, minHeight: 0,
    gridTemplateRows: 'minmax(0, 1fr)', gridTemplateColumns: 'minmax(0, 1fr)' }}>
    {visible ? children : <span className="cg-media-loading" aria-label="媒体加载中">…</span>}
  </span>;
}
