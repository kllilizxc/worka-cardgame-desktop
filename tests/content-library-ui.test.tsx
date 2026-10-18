import {expect, test} from 'bun:test';
import {useState} from 'react';
import {join} from 'node:path';
const worka = process.env.WORKA_SOURCE_ROOT;
if (worka) {
  const {mount, flush, button} = await import(join(worka, 'tests/web/dom-test-helpers.tsx'));
  const {ContentCollection} = await import('../notes/note-1/content-collection');
  const {AssetFilterPanel} = await import('../notes/note-1/asset-filter-panel');
  // happy-dom has no layout engine. Geometry supplies only the browser dimensions;
  // React Aria's real Virtualizer and keyboard/selection implementation stay intact.
  Object.defineProperties(HTMLElement.prototype, {
    clientWidth: {configurable: true, get() {return 600;}},
    clientHeight: {configurable: true, get() {return this.getAttribute('role') === 'row' ? 72 : 360;}},
    offsetWidth: {configurable: true, get() {return 600;}},
    offsetHeight: {configurable: true, get() {return this.getAttribute('role') === 'row' ? 72 : 360;}},
  });
  const key = (element: Element, value: string) => {
    element.dispatchEvent(new KeyboardEvent('keydown', {key: value, bubbles: true, cancelable: true}));
    element.dispatchEvent(new KeyboardEvent('keyup', {key: value, bubbles: true, cancelable: true}));
  };
  async function input(element: HTMLInputElement, value: string) {
    await flush(() => {Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(element, value); element.dispatchEvent(new Event('input', {bubbles: true}));});
  }
  test('real GridList owns stable single selection and arrow keys across insertion and deletion', async () => {
    let replace: (items: Array<{id: string; title: string}>) => void = () => {}, selected: string[] = [];
    const all = Array.from({length: 1000}, (_, i) => ({id: `row-${i}`, title: `Entry ${i}`}));
    function Probe() {
      const [items, update] = useState(all), [ids, setIds] = useState<string[]>([]); replace = update; selected = ids;
      return <ContentCollection items={items} label="集合" selectedIds={ids} onSelect={id => setIds([id])} textValue={item => item.title} renderItem={item => <span>{item.title}</span>} />;
    }
    const view = await mount(<Probe />);
    try {
      const rows = () => Array.from(view.container.querySelectorAll<HTMLElement>('[data-content-id]'));
      expect(rows().length).toBeGreaterThan(0); expect(rows().length).toBeLessThan(100);
      await flush(() => {rows()[0].focus(); key(rows()[0], 'Enter');}); expect(selected).toEqual(['row-0']);
      await flush(() => key(document.activeElement!, 'ArrowDown')); expect(selected).toEqual(['row-0']);
      await flush(() => key(document.activeElement!, 'Enter')); expect(selected).toEqual(['row-1']);
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-1');
      await flush(() => replace([{id: 'new', title: 'new'}, ...all]));
      expect(view.container.querySelector('[data-content-id="row-1"]')?.getAttribute('data-active')).toBe('true');
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-1');
      await flush(() => replace(all.filter(item => item.id !== 'row-1')));
      expect(document.activeElement).not.toBe(document.body);
      expect(rows().map(row => row.getAttribute('data-content-id'))).not.toContain('row-1');
    } finally {await view.unmount();}
  });

  test('GridList Home/End, typeahead and filtered updates stay in the virtualized collection', async () => {
    let replace = (items: Array<{id: string; title: string}>) => {};
    const all = Array.from({length: 1000}, (_, i) => ({id: `row-${i}`, title: i === 13 ? 'Zebra' : `Entry ${i}`}));
    function Probe() {const [items, update] = useState(all); replace = update; return <ContentCollection items={items} label="键盘集合" onSelect={() => {}} textValue={item => item.title} renderItem={item => <span>{item.title}</span>} />;}
    const view = await mount(<Probe />);
    try {
      await flush(() => view.container.querySelector<HTMLElement>('[data-content-id="row-0"]')!.focus());
      await flush(() => key(document.activeElement!, 'End'));
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-999');
      await flush(() => replace(all.slice(0, -1)));
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-998');
      await flush(() => key(document.activeElement!, 'Home'));
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-0');
      await flush(() => key(document.activeElement!, 'Z'));
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-13');
      await flush(() => replace([{id: 'row-13', title: 'Updated Zebra'}]));
      expect(view.container.textContent).toContain('Updated Zebra');
      expect(document.activeElement?.getAttribute('data-content-id')).toBe('row-13');
      expect(view.container.querySelectorAll('[data-content-id]').length).toBe(1);
    } finally {await view.unmount();}
  });
  test('resource child button is separately keyboard reachable and does not trigger row action', async () => {
    const selections: string[] = [], plays: string[] = [];
    const {Button} = await import('@heroui/react');
    const view = await mount(<ContentCollection items={[{id: 'audio', title: 'Audio'}]} label="音频" onSelect={id => selections.push(id)} textValue={item => item.title} renderItem={item => <><span>{item.title}</span><Button onPress={() => plays.push(item.id)}>试听</Button></>} />);
    try {
      await flush(() => {button(view.container, '试听').focus(); key(button(view.container, '试听'), 'Enter');});
      expect(plays).toEqual(['audio']); expect(selections).toEqual([]);
      expect(view.container.querySelector('[role="grid"]')).not.toBeNull();
      expect(button(view.container, '试听').closest('[role="row"]')).not.toBeNull();
      expect(button(view.container, '试听').closest('[role="button"]')).toBeNull();
    } finally {await view.unmount();}
  });
  test('filter preserves invalid text, reports it, and never submits undefined for invalid numbers', async () => {
    const applied: any[] = [], saved: any[] = [];
    const view = await mount(<AssetFilterPanel filter={{name: 'test'}} saved={[]} onApply={value => applied.push(value)} onSave={value => saved.push(value)} />);
    try {
      const fields = Array.from(view.container.querySelectorAll<HTMLInputElement>('input'));
      const minimum = fields[2], maximum = fields[3];
      await input(minimum, 'abc'); await flush(() => button(view.container, '应用').click());
      await flush(() => button(view.container, '保存筛选').click());
      expect(minimum.value).toBe('abc'); expect(minimum.getAttribute('aria-invalid')).toBe('true'); expect(applied).toEqual([]);
      expect(view.container.querySelector('[role="alert"]')?.textContent).toContain('整数');
      await flush(() => button(view.container, '保存筛选').click()); expect(saved).toEqual([]);
      await input(minimum, '12'); await input(maximum, '3'); await flush(() => button(view.container, '应用').click());
      expect(applied).toEqual([]); expect(view.container.textContent).toContain('最小值不能大于最大值');
      await input(minimum, '0'); await flush(() => button(view.container, '应用').click());
      expect(applied[0]).toMatchObject({minWidth: 0, maxWidth: 3});
    } finally {await view.unmount();}
  });

  const {RuntimeProvider, NoteViewContext} = await import('@dsh-workbench/react/internal');
  const {default: View} = await import('../notes/note-1/view');
  const {setViewState}=await import('../notes/note-1/actions');
  const {encodeContentRef} = await import('../notes/note-1/content-model');
  function fixture(mode: 'cards' | 'assets' | 'knowledge', initialId?: string, pageSize = 100, configPatch: Record<string,unknown> = {}) {
    let version = 0, stateRevision=1, saveFailure:Error|undefined, saveGate:Promise<void>|undefined, contentRevision = 1, state: any = {}, displayMode: 'compact' | 'expanded' = 'expanded', focusRequestId = 1, tick = () => {};
    let focus = initialId ? locator(initialId) : undefined;
    const subscriptions = new Set<any>(), calls: any[] = [], reads: any[] = [];
    let changes: any[] = [];
    const cards = Array.from({length: 12}, (_, i) => ({id: `card-${i}`, name: `Card ${i}`, type: 'card', kind: 'unit', rarity: 'common', cost: i, revision: 'r1', json: {id: `card-${i}`, cost: i}}));
    const assets = Array.from({length: 12}, (_, i) => ({id: `asset-${i}`, name: `Asset ${i}`, type: 'asset', kind: 'audio', path: `${i}.wav`, mimeType: 'audio/wav', size: 1, durationMs: 2000, revision: 'r1'}));
    const config = {projectId: 'p', mode, notes: {cards: 'library', knowledge: 'library', assets: 'library'}, resources: [{path: '/guide.md', title: 'Guide'}], ...configPatch};
    function locator(id: string) {return encodeContentRef({projectId: 'p', kind: mode === 'cards' ? 'card' : mode === 'assets' ? 'asset' : 'document', ...(mode === 'knowledge' ? {path: `docs/${id}.md`} : {id})});}
    function page(items: any[], input: any) {const offset = input.cursor ? Number(String(input.cursor).split(':')[1]) : 0; return {items: items.slice(offset, offset + pageSize), revision: String(contentRevision), total: items.length, ...(offset + pageSize < items.length ? {next: `${contentRevision}:${offset + pageSize}`} : {})};}
    function result(name: string, input: any = {}) {
      if (name === 'state') return {value: config, revision: 'config'};
      if (name === 'readiness') return {missingCapabilities: [], missingConfig: []};
      if (name === 'balanceOverview') return {revision:'balance-r1',cardCount:0,groups:[]};
      if (name === 'gameCatalog') return page([],input);
      if (name === 'battleExperiments') return {status:'idle',reports:[]};
      if (name === 'cards') return page(cards.filter(card => !input.query || card.name.includes(input.query)), input);
      if (name === 'card') return cards.find(card => card.id === input.id);
      if (name === 'assets') return page(assets.filter(asset => !input.query || asset.name?.includes(input.query)), input);
      if (name === 'asset') return input.versionId === 'version-8' ? assets[8] : assets.find(asset => asset.id === input.id);
      if (name === 'documentMeta') return {id: input.path, path: input.path, title: input.path, revision: 'r1', size: 100, isScene: false};
      if (name === 'document') return {id: input.path, type: 'document', path: input.path, title: input.path, revision: 'r1', size: 100, links: [], content: `# ${input.path}\n\n[打开 B](B.md)`};
      if (name === 'media') return {id: input.id ?? input.path, variant: input.variant, mimeType: 'audio/wav', size: 1, revision: 'r1'};
      if (name === 'status') return {projectId: 'p', phase: 'ready', documents: 2, directories: 1, cards: cards.length, assets: assets.length, errors: []};
      if (name === 'recentChanges') return page(changes, input);
      if (name === 'referenceDocument') return {path: '/guide.md', content: '# Guide'};
      return {items: []};
    }
    const snapshot = (request: any) => {const data = result(request.name, request.input); return {key: request.name, epoch: 'fixture', version: ++version, ...(request.name === 'card' && !data ? {error: '卡牌已删除', errorCode: 'NOT_FOUND'} : {data: structuredClone(data)}), stale: false};};
    const publish = () => {for (const sub of subscriptions) sub.listener(snapshot(sub.request));};
    // Exercise the actual preference action and CAS contract, not a second UI patch implementation.
    const raw:any={note:{id:'library',version:'fixture',stateRef:'view-state'},caller:{kind:'user'},db:{},files:{},notes:{},resources:{},events:{},store:{
      read:async(ref:string)=>({value:structuredClone(ref==='library:config'?config:state),revision:String(stateRevision)}),
      update:async(_ref:string,request:any)=>{
        if(saveGate){const gate=saveGate;saveGate=undefined;await gate;}
        if(saveFailure){const error=saveFailure;saveFailure=undefined;throw error;}
        if(request.baseRevision!==String(stateRevision))throw Object.assign(Error('State revision conflict'),{code:'revision-conflict'});
        state=structuredClone(request.ops[0].value);stateRevision++;tick();return {value:structuredClone(state),revision:String(stateRevision)};
      },
    }};
    const runtime: any = {note: {id: 'library', stateRef: 'view-state'}, resources: {subscribe: async (request: any, listener: any) => {reads.push(request); const sub = {request, listener}; subscriptions.add(sub); listener(snapshot(request)); return () => subscriptions.delete(sub);}, revalidate: async (request: any) => snapshot(request)}, resolvePreviewUrl: (url: string) => url,
      invokeAction: async (name: string, input: any) => {calls.push({name, input}); if(name==='setViewState')return setViewState(raw,input); return {};}, openNote: async (id: string, ref?: string) => {calls.push({openNote: id, ref});}};
    function Frame() {const [, update] = useState(0); tick = () => update(value => value + 1); return <RuntimeProvider runtime={runtime}><NoteViewContext.Provider value={{metadata: {id: 'library', name: 'Library'}, mode: displayMode, focus, focusRequestId, layout: {width: 900, maxHeight: 700}, snapshot: {value: state, revision: String(stateRevision)}}}><View /></NoteViewContext.Provider></RuntimeProvider>;}
    return {element: <Frame />, cards, calls, reads, rejectNextSave(message:string){saveFailure=Error(message);}, delayNextSave(){let release!:()=>void;saveGate=new Promise<void>(resolve=>{release=resolve;});return release;}, openRef(ref:Parameters<typeof encodeContentRef>[0]){focus=encodeContentRef(ref);focusRequestId++;tick();}, setChanges(items: any[]) {changes = items; publish();}, openVersion(id: string) {focus = encodeContentRef({projectId: 'p', kind: 'asset', id, context: {changeKind: 'version'}}); focusRequestId++; tick();}, state: () => state, open(id: string) {focus = locator(id); focusRequestId++; tick();}, show(mode: 'compact' | 'expanded') {displayMode = mode; tick();}, subscriptions, update(id: string, patch: any) {Object.assign(cards.find(card => card.id === id)!, patch); contentRevision++; publish();}, delete(id: string) {const index = cards.findIndex(card => card.id === id); cards.splice(index, 1); contentRevision++; publish();}};
  }
  async function mountLibrary(element: import('react').ReactNode, mode: 'compact' | 'expanded' = 'expanded') {
    const view=await mount(element);
    // Real module boundaries may suspend beyond the initial React commit.
    await flush(()=>mode==='expanded'?import('../notes/note-1/view-expanded'):import('../notes/note-1/view-compact'));
    return view;
  }
  test('one card focus saves its path and selection together through the real action',async()=>{
    const f=fixture('cards'),view=await mountLibrary(f.element);
    try{
      await flush(()=>f.openRef({projectId:'p',kind:'card',id:'card-0',path:'data/units.json'}));
      const saves=f.calls.filter(call=>call.name==='setViewState');
      expect(saves).toHaveLength(1);
      expect(saves[0].input).toEqual({patch:{query:'data/units.json',views:{cardsSelection:['card-0']}}});
      expect(f.state()).toMatchObject({query:'data/units.json',views:{cardsSelection:['card-0']}});
      expect(view.container.textContent).toContain('Card 0');
      expect(view.container.querySelector('[role="alert"]')).toBeNull();
    }finally{await view.unmount();}
  });
  test('newer choices queue behind an in-flight save and finish with the latest local intent',async()=>{
    const f=fixture('cards'),view=await mountLibrary(f.element);
    const release=f.delayNextSave();
    try{
      await flush(()=>button(view.container,'表格').click());
      await flush(()=>button(view.container,'网格').click());
      expect(f.calls.filter(call=>call.name==='setViewState')).toHaveLength(1);
      await flush(()=>release());
      expect(f.calls.filter(call=>call.name==='setViewState').map(call=>call.input.patch.views.cards)).toEqual(['table','grid']);
      expect(f.state().views.cards).toBe('grid');
    }finally{release();await view.unmount();}
  });
  test('a rejected preference save stays visible instead of disappearing into console',async()=>{
    const f=fixture('cards'),view=await mountLibrary(f.element);
    try{
      f.rejectNextSave('preference disk unavailable');
      await flush(()=>button(view.container,'表格').click());
      expect(view.container.querySelector('[role="alert"]')?.textContent).toContain('preference disk unavailable');
      expect(f.state().views?.cards).toBeUndefined();
      await flush(()=>button(view.container,'网格').click());
      expect(f.state().views.cards).toBe('grid');
      expect(view.container.querySelector('[role="alert"]')).toBeNull();
    }finally{await view.unmount();}
  });
  test('card compare selection uses GridList and refuses a fourth card without dropping existing choices', async () => {
    const f = fixture('cards'), view = await mountLibrary(f.element);
    try {
      await flush(() => button(view.container, '比较').click());
      const row = (i: number) => view.container.querySelector<HTMLElement>(`[data-content-id="card-${i}"]`)!;
      for (let i = 0; i < 4; i++) await flush(() => {row(i).focus(); key(row(i), ' ');});
      expect(view.container.querySelectorAll('[aria-selected="true"]').length).toBe(3);
      expect(row(0).getAttribute('aria-selected')).toBe('true'); expect(row(3).getAttribute('aria-selected')).toBe('false');
      expect(view.container.textContent).toContain('最多比较 3 张');
      await flush(() => key(row(1), ' ')); await flush(() => key(row(3), ' '));
      expect(row(3).getAttribute('aria-selected')).toBe('true'); expect(view.container.textContent).toContain('已选 3');
      await flush(() => button(view.container, '查看比较 (3)').click());
      expect(view.container.textContent).toContain('对比 3 张卡牌');
    } finally {await view.unmount();}
  });
  for (const mode of ['cards', 'assets', 'knowledge'] as const) test(`${mode} reapplies the same external target after internal navigation using focusRequestId`, async () => {
    const first = mode === 'cards' ? 'card-0' : mode === 'assets' ? 'asset-0' : 'A';
    const f = fixture(mode, first), view = await mountLibrary(f.element);
    try {
      if (mode === 'knowledge') {
        expect(view.container.querySelector('.reader-path')?.textContent).toContain('docs/A.md');
        const link = view.container.querySelector<HTMLAnchorElement>('.cg-markdown a')!;
        await flush(() => link.click());
        expect(view.container.querySelector('.reader-path')?.textContent).toContain('docs/B.md');
      } else {
        const second = mode === 'cards' ? 'card-1' : 'asset-1';
        const row = view.container.querySelector<HTMLElement>(`[data-content-id="${second}"]`)!;
        await flush(() => {row.focus(); key(row, 'Enter');});
        expect(mode === 'cards' ? f.state().views.cardsSelection : f.state().views.assetsSelection).toEqual(mode === 'cards' ? [second] : second);
      }
      await flush(() => f.open(first));
      if (mode === 'knowledge') expect(view.container.querySelector('.reader-path')?.textContent).toContain('docs/A.md');
      else expect(mode === 'cards' ? f.state().views.cardsSelection : f.state().views.assetsSelection).toEqual(mode === 'cards' ? [first] : first);
    } finally {await view.unmount();}
  });

  test('narrow cards return to the collection and reopen an external repeated target', async () => {
    const previous = globalThis.matchMedia;
    globalThis.matchMedia = ((query: string) => ({matches: true, media: query, addEventListener() {}, removeEventListener() {}})) as typeof matchMedia;
    const f = fixture('cards', 'card-0'), view = await mountLibrary(f.element);
    try {
      expect(view.container.querySelector('.cl-workspace')?.classList.contains('cl-show-detail')).toBe(true);
      await flush(() => button(view.container, '← 返回卡牌库').click());
      expect(view.container.querySelector('.cl-workspace')?.classList.contains('cl-show-detail')).toBe(false);
      const row = view.container.querySelector<HTMLElement>('[data-content-id="card-1"]')!;
      await flush(() => {row.focus(); key(row, 'Enter');});
      expect(view.container.querySelector('.cl-workspace')?.classList.contains('cl-show-detail')).toBe(true);
      await flush(() => key(document.activeElement!, 'Escape'));
      expect(view.container.querySelector('.cl-workspace')?.classList.contains('cl-show-detail')).toBe(false);
      await flush(() => f.open('card-0'));
      expect(view.container.querySelector('.cl-workspace')?.classList.contains('cl-show-detail')).toBe(true);
      expect(f.state().views.cardsSelection).toEqual(['card-0']);
    } finally {await view.unmount(); globalThis.matchMedia = previous;}
  });

  test('native pages preserve three cross-page comparisons, refresh by revision, and allow removing a deleted selection', async () => {
    const f = fixture('cards', undefined, 3), view = await mountLibrary(f.element);
    const nav = () => view.container.querySelector('[aria-label="卡牌分页"]')!;
    const row = (id: string) => view.container.querySelector<HTMLElement>(`[data-content-id="${id}"]`)!;
    const choose = async (id: string) => flush(() => {row(id).focus(); key(row(id), ' ');});
    try {
      await flush(() => button(view.container, '比较').click());
      await choose('card-0'); await choose('card-1');
      await flush(() => button(nav(), '下一页').click());
      expect(nav().textContent).toContain('第 2 页'); expect(row('card-0')).toBeNull();
      await choose('card-3'); await choose('card-4');
      expect(view.container.textContent).toContain('已选 3'); expect(row('card-4').getAttribute('aria-selected')).toBe('false');
      await flush(() => f.update('card-0', {name: 'Updated off-page card', cost: 99}));
      expect(nav().textContent).toContain('第 1 页');
      expect(view.container.textContent).toContain('Updated off-page card');
      expect(view.container.querySelector('.cl-selection-items')?.textContent).toContain('Card 3');
      await flush(() => f.delete('card-3'));
      expect(view.container.textContent).toContain('比较卡牌读取失败');
      expect(button(view.container, '查看比较 (3)').disabled).toBe(true);
      await flush(() => button(view.container, '移出比较：Card 3').click());
      expect(view.container.textContent).toContain('已选 2'); expect(button(view.container, '查看比较 (2)').disabled).toBe(false);
    } finally {await view.unmount();}
  });
  for (const mode of ['cards', 'assets'] as const) test(`${mode} paging resets on a repeated focus request and filters without stitching old rows`, async () => {
    const first = mode === 'cards' ? 'card-0' : 'asset-0', second = mode === 'cards' ? 'card-3' : 'asset-3';
    const f = fixture(mode, first, 3), view = await mountLibrary(f.element);
    const nav = () => view.container.querySelector(`[aria-label="${mode === 'cards' ? '卡牌' : '资源'}分页"]`)!;
    try {
      await flush(() => button(nav(), '下一页').click()); expect(nav().textContent).toContain('第 2 页');
      const target = view.container.querySelector<HTMLElement>(`[data-content-id="${second}"]`)!;
      await flush(() => {target.focus(); key(target, 'Enter');});
      await flush(() => f.open(first));
      expect(nav().textContent).toContain('第 1 页');
      expect(mode === 'cards' ? f.state().views.cardsSelection : f.state().views.assetsSelection).toEqual(mode === 'cards' ? [first] : first);
      await flush(() => button(nav(), '下一页').click());
      const search = view.container.querySelector<HTMLInputElement>('input[type="search"]')!;
      await input(search, mode === 'cards' ? 'Card 1' : 'Asset 1');
      await flush(() => key(search, 'Enter'));
      expect(nav().textContent).toContain('第 1 页');
      expect(view.container.querySelector('[data-content-id="'+first+'"]')).toBeNull();
      expect(view.container.querySelectorAll('[data-content-id]').length).toBe(3);
    } finally {await view.unmount();}
  });

  test('native display Activities retain an expanded card draft across compact switching', async () => {
    const f = fixture('cards', 'card-0'), view = await mountLibrary(f.element);
    try {
      const editor = view.container.querySelector<HTMLTextAreaElement>('[aria-label="卡牌原始 JSON"]')!;
      await flush(() => {Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(editor, '{"cost":19}'); editor.dispatchEvent(new Event('input', {bubbles: true}));});
      await flush(() => f.show('compact'));
      await flush(()=>import('../notes/note-1/view-compact'));
      expect(view.container.querySelector('.cg-card-fan')).not.toBeNull();
      expect(Array.from(f.subscriptions).filter((item: any) => item.request.name === 'card')).toHaveLength(0);
      await flush(() => f.show('expanded'));
      expect((view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement).value).toBe('{"cost":19}');
      expect(view.container.textContent).toContain('未保存');
    } finally {await view.unmount();}
  });

  test('off-page version links resolve their owning asset directly and keep its bookmark usable', async () => {
    const f = fixture('assets', undefined, 3), view = await mountLibrary(f.element);
    try {
      await flush(() => f.openVersion('version-8'));
      expect(f.state().views.assetsSelection).toBe('asset-8');
      expect(view.container.querySelector('[data-content-id="asset-8"]')).toBeNull();
      expect(view.container.querySelector('.cg-asset-detail')?.textContent).toContain('Asset 8');
      expect(f.reads.some(read => read.name === 'asset' && read.input?.versionId === 'version-8')).toBe(true);
      expect(f.reads.some(read => read.name === 'media' && read.input?.versionId === 'version-8')).toBe(true);
      await flush(() => button(view.container, '收藏').click());
      expect(f.state().bookmarks).toHaveLength(1);
      expect(f.state().bookmarks[0]).toContain(encodeURIComponent('asset-8'));
      await flush(() => f.setChanges([{kind: 'version', id: 'version-8', change: 'created', at: '2026-10-17T00:00:00Z'}]));
      await flush(() => f.show('compact'));
      await flush(()=>import('../notes/note-1/view-compact'));
      const entry = view.container.querySelector<HTMLButtonElement>('.cg-compact-row')!;
      await flush(() => entry.click());
      const opened = f.calls.find(call => call.openNote)?.ref;
      expect(decodeURIComponent(opened)).toContain('"changeKind":"version"');
    } finally {await view.unmount();}
  });

  test('compact to expanded to compact releases only hidden query subscriptions and restores the authoritative draft target',async()=>{
    const f=fixture('cards','card-0');f.show('compact');
    const view=await mountLibrary(f.element,'compact');
    const active=(name:string)=>Array.from(f.subscriptions).filter((item:any)=>item.request.name===name).length;
    try {
      expect(active('cards')).toBe(1);expect(active('status')).toBe(0);expect(active('card')).toBe(0);
      await flush(()=>f.show('expanded'));await flush(()=>import('../notes/note-1/view-expanded'));
      expect(active('status')).toBe(1);expect(active('card')).toBe(1);
      await flush(()=>f.open('card-1'));
      const editor=view.container.querySelector<HTMLTextAreaElement>('[aria-label="卡牌原始 JSON"]')!;
      await flush(()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(editor,'{"cost":19}');editor.dispatchEvent(new Event('input',{bubbles:true}));});
      await flush(()=>f.show('compact'));
      expect(active('cards')).toBe(1);expect(active('status')).toBe(0);expect(active('card')).toBe(0);
      expect(view.container.querySelector('.cg-card-fan')).not.toBeNull();
      await flush(()=>f.show('expanded'));
      expect(active('status')).toBe(1);expect(active('card')).toBe(1);
      expect((view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement).value).toBe('{"cost":19}');
      expect(view.container.textContent).toContain('未保存');
      expect(Array.from(f.subscriptions).filter((item:any)=>item.request.name==='card').map((item:any)=>item.request.input.id)).toEqual(['card-1']);
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });
  test('missing project keeps the compact setup hint and expanded configuration form without content queries',async()=>{
    const f=fixture('cards',undefined,3,{projectId:undefined});f.show('compact');
    const view=await mountLibrary(f.element,'compact');
    const contentReads=()=>f.reads.filter((item:any)=>item.name!=='state'&&item.name!=='readiness');
    try {
      expect(view.container.textContent).toContain('展开后选择一次项目目录');expect(contentReads()).toHaveLength(0);
      await flush(()=>f.show('expanded'));await flush(()=>import('../notes/note-1/view-expanded'));
      const root=view.container.querySelector<HTMLInputElement>('input[placeholder="本机项目的绝对路径"]')!;
      expect(root).not.toBeNull();await input(root,'/project');
      await flush(()=>view.container.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
      expect(f.calls.find((call:any)=>call.name==='configureProject')?.input).toEqual({root:'/project'});
      expect(contentReads()).toHaveLength(0);
      await flush(()=>f.show('compact'));expect(view.container.textContent).toContain('展开后选择一次项目目录');
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });
  for (const [mode,configPatch,expected] of [
    ['knowledge',{},[]],
    ['cards',{},['cards']],
    ['assets',{assetScope:'audio'},['assets']],
    ['cards',{presentation:'story'},['gameCatalog']],
    ['cards',{presentation:'balance'},['balanceOverview','gameCatalog','gameCatalog','battleExperiments']],
  ] as const) test(`compact ${JSON.stringify(configPatch).slice(0,80)} ${mode} subscribes only to its displayed authority`,async()=>{
    const f=fixture(mode,undefined,3,configPatch);f.show('compact');
    const view=await mountLibrary(f.element,'compact');
    try {
      const business=Array.from(f.subscriptions).map((item:any)=>item.request.name).filter((name:string)=>name!=='state'&&name!=='readiness');
      expect(business.sort()).toEqual([...expected].sort());
      expect(view.container.querySelector('[role="grid"]')).toBeNull();
      expect(view.container.querySelector('[aria-label="卡牌原始 JSON"]')).toBeNull();
      if(configPatch.presentation==='story')expect(f.reads.find((item:any)=>item.name==='gameCatalog')?.input.limit).toBe(3);
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });

} else test.skip('content UI DOM regressions need WORKA_SOURCE_ROOT', () => {});
