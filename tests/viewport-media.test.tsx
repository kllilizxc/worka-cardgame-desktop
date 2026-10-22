import { expect, test } from 'bun:test';
import { useEffect } from 'react';
import { join } from 'node:path';
const worka = process.env.WORKA_SOURCE_ROOT;
if (worka) {
  const { mount, flush } = await import(join(worka, 'tests/web/dom-test-helpers.tsx'));
  const { ViewportMedia } = await import('../notes/note-1/viewport-media');
  test('a 100 item gallery mounts media owners only in view and releases them when scrolling away', async () => {
    const saved = globalThis.IntersectionObserver;
    const observers: Array<{ callback: IntersectionObserverCallback; target?: Element; disconnected: boolean }> = [];
    globalThis.IntersectionObserver = class {
      record: typeof observers[number];
      constructor(callback: IntersectionObserverCallback) { this.record = { callback, disconnected: false }; observers.push(this.record); }
      observe(target: Element) { this.record.target = target; }
      disconnect() { this.record.disconnected = true; }
    } as unknown as typeof IntersectionObserver;
    let owners = 0;
    function Media() { useEffect(() => { owners++; return () => { owners--; }; }, []); return <img alt="preview" />; }
    const view = await mount(<>{Array.from({ length: 100 }, (_, i) => <ViewportMedia key={i}><Media /></ViewportMedia>)}</>);
    const show = (index: number, visible: boolean) => observers[index]!.callback([{ target: observers[index]!.target!, isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver);
    try {
      expect(owners).toBe(0);
      await flush(() => { for (let i = 0; i < 16; i++) show(i, true); });
      expect(owners).toBe(16);
      await flush(() => { for (let i = 0; i < 16; i++) show(i, false); for (let i = 16; i < 32; i++) show(i, true); });
      expect(owners).toBe(16);
      expect(view.container.querySelectorAll('img')).toHaveLength(16);
    } finally { await view.unmount(); globalThis.IntersectionObserver = saved; }
    expect(owners).toBe(0);
    expect(observers.every(observer => observer.disconnected)).toBe(true);
    await flush(() => show(0, true));
    expect(owners).toBe(0);
  });
} else test.skip('viewport media lifecycle requires WORKA_SOURCE_ROOT', () => {});
