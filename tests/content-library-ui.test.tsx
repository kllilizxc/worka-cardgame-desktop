import {hostUiFixture, mount, flush, button, until, typeInto} from './host-ui-fixture';
import {expect, test} from 'bun:test';
import {useState} from 'react';
const worka = process.env.WORKA_SOURCE_ROOT;
if (worka) {
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

  const {NoteViewContext} = await import('@dsh-workbench/react/internal');
  const {useViewState} = await import('@dsh-workbench/react');
  const {default: View} = await import('../notes/note-1/view');
  const {encodeContentRef} = await import('../notes/note-1/content-model');
  async function fixture(mode: 'cards' | 'assets' | 'knowledge', initialId?: string, pageSize = 100, configPatch: Record<string,unknown> = {}) {
    let saveFailure: Error | undefined, contentRevision = 1, state: any = {}, persisted: any = {}, displayMode: 'compact' | 'expanded' = 'expanded', focusRequestId = 1, tick = () => {};
    let focus = initialId ? locator(initialId) : undefined;
    const subscriptions = new Set<any>(), viewWrites: any[] = [];
    let changes: any[] = [];
    const cards = Array.from({length: 12}, (_, i) => ({id: `card-${i}`, name: `Card ${i}`, type: 'card', kind: 'unit', rarity: 'common', cost: i, revision: 'r1', projectGeneration: 'generation-one', json: {id: `card-${i}`, cost: i}}));
    const assets = Array.from({length: 12}, (_, i) => ({id: `asset-${i}`, name: `Asset ${i}`, type: 'asset', kind: 'audio', path: `${i}.wav`, mimeType: 'audio/wav', size: 1, durationMs: 2000, revision: 'r1'}));
    const config = JSON.parse(JSON.stringify({projectId: 'p', mode, notes: {cards: 'library', knowledge: 'library', assets: 'library'}, resources: [{path: '/guide.md', title: 'Guide'}], ...configPatch}));
    function locator(id: string) {return encodeContentRef({projectId: 'p', kind: mode === 'cards' ? 'card' : mode === 'assets' ? 'asset' : 'document', ...(mode === 'knowledge' ? {path: `docs/${id}.md`} : {id})});}
    function page(items: any[], input: any) {const offset = input.cursor ? Number(String(input.cursor).split(':')[1]) : 0; return {items: items.slice(offset, offset + pageSize), revision: String(contentRevision), total: items.length, ...(offset + pageSize < items.length ? {next: `${contentRevision}:${offset + pageSize}`} : {})};}
    function result(name: string, input: any = {}) {
      if (name === 'preferences') return {};
      if (name === 'overview') {
        if (!config.projectId) return {summary: '尚未连接 CardGame 项目', items: []};
        if (changes.length) return {summary: `${changes.length} 个最近变更`, items: changes.map(item => ({id: item.id, title: item.id, status: item.change}))};
        const items = mode === 'cards' ? cards : mode === 'assets' ? assets : [{id: 'guide', name: 'Guide'}];
        return {summary: `${items.length} 项内容`, items: items.slice(0, 4).map(item => ({id: item.id, title: item.name, status: '可查看'}))};
      }
      if (name === 'balanceOverview') return {revision:'balance-r1',cardCount:0,groups:[]};
      if (name === 'gameCatalog') return page([],input);
      if (name === 'battleExperiments') return {status:'idle',reports:[]};
      if (name === 'cards') return page(cards.filter(card => !input.query || card.name.includes(input.query)), input);
      if (name === 'card' || name === 'cardEditInput') {
        const card = cards.find(card => card.id === input.id);
        if (!card) throw Error('卡牌已删除');
        return name === 'card' ? card : {text: JSON.stringify(card.json, null, 2), featureId: '', itemId: card.id, projectId: input.projectId, projectGeneration: card.projectGeneration, revision: card.revision};
      }
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
    const f = await hostUiFixture({config, query: result});
    f.runtime.resolvePreviewUrl = async (url: string) => url;
    const subscribe = f.runtime.resources.subscribe;
    f.runtime.resources.subscribe = async (request: any, listener: any) => {
      const sub = {request}; subscriptions.add(sub);
      const release = await subscribe(request, listener);
      return () => {subscriptions.delete(sub); release();};
    };
    const request = f.bridge.request;
    f.bridge.request = async (method: string, input: any) => {
      if (method === 'ui.viewStateSet') {
        viewWrites.push(structuredClone(input.values));
        if (saveFailure) {const error = saveFailure; saveFailure = undefined; throw error;}
        persisted = structuredClone(input.values);
      }
      return request(method, input);
    };
    const publish = async () => {
      const names = new Set<string>([...Array.from(subscriptions, item => item.request.name), 'cardEditInput']);
      for (const name of names) await f.publish(name);
    };
    function Preferences() { [state] = useViewState('library', {}); return null; }
    function Frame() {const [, update] = useState(0); tick = () => update(value => value + 1); return f.render(<NoteViewContext.Provider value={{metadata: {id: f.runtime.note.id, name: 'Library'}, mode: displayMode, focus, focusRequestId, layout: {width: 900, maxHeight: 700}}}><Preferences /><View /></NoteViewContext.Provider>, displayMode);}
    return {...f, element: <Frame />, cards, viewWrites, persisted: () => persisted, rejectNextSave(message:string){saveFailure=Error(message);}, openRef(ref:Parameters<typeof encodeContentRef>[0]){focus=encodeContentRef(ref);focusRequestId++;tick();}, async setChanges(items: any[]) {changes = items; await publish();}, openVersion(id: string) {focus = encodeContentRef({projectId: 'p', kind: 'asset', id, context: {changeKind: 'version'}}); focusRequestId++; tick();}, state: () => state, open(id: string) {focus = locator(id); focusRequestId++; tick();}, show(mode: 'compact' | 'expanded') {displayMode = mode; tick();}, subscriptions, async update(id: string, patch: any) {Object.assign(cards.find(card => card.id === id)!, patch); contentRevision++; await publish();}, async delete(id: string) {const index = cards.findIndex(card => card.id === id); cards.splice(index, 1); contentRevision++; await publish();}};
  }
  async function mountLibrary(f: Awaited<ReturnType<typeof fixture>>, mode: 'compact' | 'expanded' = 'expanded') {
    const view=await mount(f.element);
    // Real module boundaries may suspend beyond the initial React commit.
    await flush(()=>mode==='expanded'?import('../notes/note-1/view-expanded'):import('../notes/note-1/view-compact'));
    return {...view, async unmount() {await view.unmount(); await f.close();}};
  }
  async function retainedInput(f: Awaited<ReturnType<typeof fixture>>, text: string) {
    await until(() => f.requests.some(request => request.op === 'set' && request.value.text === text), 'draft handed to host');
    const request = f.requests.find(request => request.op === 'set' && request.value.text === text)!;
    let snapshot: any;
    await flush(async () => { ({snapshot} = await f.runtime.mutations.request({op: 'read', id: request.id})); });
    expect(snapshot.retained).toBe(true);
    expect(snapshot.dirty).toBe(true);
    expect(snapshot.value.text).toBe(text);
  }
  test('one card focus shares its path and selection through viewer state without a business write',async()=>{
    const f=await fixture('cards'),view=await mountLibrary(f);
    try{
      await flush(()=>f.openRef({projectId:'p',kind:'card',id:'card-0',path:'data/units.json'}));
      expect(f.state()).toMatchObject({query:'data/units.json',views:{cardsSelection:['card-0']}});
      await until(() => f.persisted().library?.views?.cardsSelection?.[0] === 'card-0', 'viewer preference persistence');
      expect(f.persisted().library).toMatchObject({query:'data/units.json',views:{cardsSelection:['card-0']}});
      expect(f.calls).toEqual([]);
      expect(view.container.textContent).toContain('Card 0');
      expect(view.container.querySelector('[role="alert"]')).toBeNull();
    }finally{await view.unmount();}
  });
  test('rapid display choices coalesce in viewer state with the latest local intent',async()=>{
    const f=await fixture('cards'),view=await mountLibrary(f);
    try{
      await flush(()=>button(view.container,'表格').click());
      await flush(()=>button(view.container,'网格').click());
      expect(f.state().views.cards).toBe('grid');
      await until(() => f.persisted().library?.views?.cards === 'grid', 'latest viewer choice');
      expect(f.viewWrites.at(-1).library.views.cards).toBe('grid');
      expect(f.calls).toEqual([]);
    }finally{await view.unmount();}
  });
  test('unavailable optional viewer storage preserves the local choice and a later choice can persist',async()=>{
    const f=await fixture('cards'),view=await mountLibrary(f);
    try{
      f.rejectNextSave('preference disk unavailable');
      await flush(()=>button(view.container,'表格').click());
      await until(() => f.viewWrites.length === 1, 'first viewer persistence attempt');
      expect(f.state().views?.cards).toBe('table');
      expect(f.persisted().library?.views?.cards).toBeUndefined();
      await flush(()=>button(view.container,'网格').click());
      expect(f.state().views.cards).toBe('grid');
      await until(() => f.persisted().library?.views?.cards === 'grid', 'later viewer persistence');
      expect(f.calls).toEqual([]);
    }finally{await view.unmount();}
  });
  test('card compare selection uses GridList and refuses a fourth card without dropping existing choices', async () => {
    const f = await fixture('cards'), view = await mountLibrary(f);
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
    const f = await fixture(mode, first), view = await mountLibrary(f);
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
    const f = await fixture('cards', 'card-0'), view = await mountLibrary(f);
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
    const f = await fixture('cards', undefined, 3), view = await mountLibrary(f);
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
    const f = await fixture(mode, first, 3), view = await mountLibrary(f);
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

  test('the host restores a retained card draft after the expanded editor is replaced by the overview', async () => {
    const f = await fixture('cards', 'card-0'), view = await mountLibrary(f);
    try {
      const editor = view.container.querySelector<HTMLTextAreaElement>('[aria-label="卡牌原始 JSON"]')!;
      await until(() => !editor.disabled && editor.value.includes('card-0'), 'source draft ready');
      await typeInto(editor, '{"cost":19}');
      await retainedInput(f, '{"cost":19}');
      await flush(() => f.show('compact'));
      await flush(()=>import('../notes/note-1/view-compact'));
      expect(view.container.querySelector('.note-overview')).not.toBeNull();
      expect(Boolean(view.container.querySelector('[aria-label="卡牌原始 JSON"]'))).toBe(false);
      expect(Array.from(f.subscriptions).filter((item: any) => item.request.name === 'card')).toHaveLength(0);
      await flush(() => f.show('expanded'));
      await until(() => (view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement)?.value === '{"cost":19}', 'retained source draft restored');
      expect((view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement).value).toBe('{"cost":19}');
      expect(view.container.querySelector('[aria-label="卡牌原始 JSON"]')).not.toBe(editor);
      expect(view.container.textContent).toContain('未保存');
    } finally {await view.unmount();}
  });

  test('off-page version links resolve their owning asset directly and keep its bookmark usable', async () => {
    const f = await fixture('assets', undefined, 3), view = await mountLibrary(f);
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
      expect(view.container.querySelector('.note-overview')?.textContent).toContain('version-8');
      expect(view.container.querySelectorAll('button,input,textarea').length).toBe(0);
      expect(f.opened).toEqual([]);
      expect(f.state().bookmarks).toHaveLength(1);
    } finally {await view.unmount();}
  });

  test('compact to expanded to compact releases only hidden query subscriptions and restores the authoritative draft target',async()=>{
    const f=await fixture('cards','card-0');f.show('compact');
    const view=await mountLibrary(f,'compact');
    const active=(name:string)=>Array.from(f.subscriptions).filter((item:any)=>item.request.name===name).length;
    try {
      expect(active('overview')).toBe(1);expect(active('cards')).toBe(0);expect(active('status')).toBe(0);expect(active('card')).toBe(0);
      await flush(()=>f.show('expanded'));await flush(()=>import('../notes/note-1/view-expanded'));
      // The library indicator and creation entry independently own binding status reads.
      expect(active('status')).toBe(2);expect(active('card')).toBe(1);
      await flush(()=>f.open('card-1'));
      const editor=view.container.querySelector<HTMLTextAreaElement>('[aria-label="卡牌原始 JSON"]')!;
      await until(() => !editor.disabled && editor.value.includes('card-1'), 'second source draft ready');
      await typeInto(editor, '{"cost":19}');
      await retainedInput(f, '{"cost":19}');
      await flush(()=>f.show('compact'));
      expect(active('overview')).toBe(1);expect(active('cards')).toBe(0);expect(active('status')).toBe(0);expect(active('card')).toBe(0);
      expect(view.container.querySelector('.note-overview')).not.toBeNull();
      await flush(()=>f.show('expanded'));
      await until(() => (view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement)?.value === '{"cost":19}', 'second retained draft restored');
      expect(active('status')).toBe(2);expect(active('card')).toBe(1);
      expect((view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement).value).toBe('{"cost":19}');
      expect(view.container.textContent).toContain('未保存');
      expect(Array.from(f.subscriptions).filter((item:any)=>item.request.name==='card').map((item:any)=>item.request.input.id)).toEqual(['card-1']);
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });
  test('missing project keeps the compact setup hint and expanded configuration form without content queries',async()=>{
    const f=await fixture('cards',undefined,3,{projectId:undefined});f.show('compact');
    const view=await mountLibrary(f,'compact');
    const contentReads=()=>f.reads.filter((item:any)=>!['state','readiness','preferences'].includes(item.name));
    try {
      expect(view.container.textContent).toContain('尚未连接 CardGame 项目');expect(contentReads().map(read => read.name)).toEqual(['overview']);
      await flush(()=>f.show('expanded'));await flush(()=>import('../notes/note-1/view-expanded'));
      const root=view.container.querySelector<HTMLInputElement>('input[placeholder="本机项目的绝对路径"]')!;
      expect(root).not.toBeNull();await until(() => !root.disabled, 'configuration draft ready');await input(root,'/project');
      await flush(()=>view.container.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
      await until(() => f.calls.some(call => call.name === 'configureProject'), 'configuration mutation execution');
      expect(f.calls.find((call:any)=>call.name==='configureProject')?.input).toEqual({root:'/project'});
      expect(contentReads().every(read => read.name === 'overview')).toBe(true);
      await flush(()=>f.show('compact'));expect(view.container.textContent).toContain('尚未连接 CardGame 项目');
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });
  for (const [mode,configPatch] of [
    ['knowledge',{}],
    ['cards',{}],
    ['assets',{assetScope:'audio'}],
    ['cards',{presentation:'story'}],
    ['cards',{presentation:'balance'}],
  ] as const) test(`compact ${JSON.stringify(configPatch).slice(0,80)} ${mode} subscribes only to its displayed authority`,async()=>{
    const f=await fixture(mode,undefined,3,configPatch);f.show('compact');
    const view=await mountLibrary(f,'compact');
    try {
      const business=Array.from(f.subscriptions).map((item:any)=>item.request.name).filter((name:string)=>name!=='state'&&name!=='readiness');
      expect(business).toEqual(['overview']);
      expect(view.container.querySelector('[role="grid"]')).toBeNull();
      expect(view.container.querySelector('[aria-label="卡牌原始 JSON"]')).toBeNull();
      expect(f.reads.find((item:any)=>item.name==='overview')?.input).toEqual({});
      expect(view.container.querySelectorAll('.note-overview li').length).toBeLessThanOrEqual(4);
      expect(view.container.querySelectorAll('button,input,textarea,iframe').length).toBe(0);
      expect(f.calls).toEqual([]);
    }finally{await view.unmount();}
    expect(f.subscriptions.size).toBe(0);
  });

} else test.skip('content UI DOM regressions need WORKA_SOURCE_ROOT', () => {});
