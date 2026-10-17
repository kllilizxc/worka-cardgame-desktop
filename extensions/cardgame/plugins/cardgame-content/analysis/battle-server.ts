/** Local experiment host. Builds one browser bundle from a verified snapshot; never serves the live project. */
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, realpath, readdir, stat, rename } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { verifyBattleSnapshot } from '../src/battle-snapshot';
import { runBattleExperiment, validateBattleSettings, type BattleExperimentReport } from '../src/battle-experiment';

const hash = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex');
export async function startBattleServer(options: { snapshot: string; phaser: string; output: string; port?: number }) {
  const manifest = await verifyBattleSnapshot(options.snapshot), project = join(options.snapshot, 'project');
  const output = resolve(options.output); await mkdir(output, { recursive: true, mode: 0o700 });
  const adapterPath = join(import.meta.dir, 'battle-browser-adapter.ts'), experimentPath = join(import.meta.dir, '../src/battle-experiment.ts');
  const adapterVersion = hash(await readFile(adapterPath));
  const phaserCopy = join(output, 'phaser.mjs'); await writeFile(phaserCopy, await readFile(options.phaser));
  const phaserBridge = join(output, 'phaser-bridge.ts');
  await writeFile(phaserBridge, "import * as Phaser from './phaser.mjs'; export * from './phaser.mjs'; export default Phaser;");
  const catalog = JSON.parse(await readFile(join(project, 'public/data/content-catalog.json'), 'utf8'));
  const entries = Array.isArray(catalog.resources) ? catalog.resources : catalog.entries;
  if (!Array.isArray(entries)) throw Error('不支持的内容目录');
  const resources = entries.filter((entry: any) => ['deck', 'encounter'].includes(entry.kind)).map((entry: any) => {
    if (typeof entry.resourceId !== 'string' || typeof entry.publicPath !== 'string' || !entry.publicPath.startsWith('data/') || entry.publicPath.includes('\\') || entry.publicPath.split('/').some((part: string) => part === '..' || part === '.')) throw Error('非法对局资源路径');
    if (!manifest.files.some(file => file.path === 'public/' + entry.publicPath)) throw Error('目录引用不属于实验快照');
    return { id: entry.resourceId, kind: entry.kind, path: entry.publicPath };
  });
  const entry = join(output, 'entry.ts');
  await writeFile(entry, `import Phaser from 'phaser';
import {BattleScene} from ${JSON.stringify(join(project, 'src/game/scenes/battle/BattleScene.ts'))};
import {CardSprite} from ${JSON.stringify(join(project, 'src/game/objects/CardSprite.ts'))};
import {createPhaserBattleTrial} from ${JSON.stringify(adapterPath)};
import {runBattleExperiment} from ${JSON.stringify(experimentPath)};
(globalThis as any).Phaser=Phaser;
const $=(id:string)=>document.getElementById(id) as any;
const metadata=await(await fetch('/metadata')).json();
for(const kind of ['deck','encounter'])for(const item of metadata.resources.filter((r:any)=>r.kind===kind)){const option=document.createElement('option');option.value=item.id;option.textContent=item.id;$(kind).append(option);}
const trial=createPhaserBattleTrial({Phaser,BattleScene,CardSprite},$('game'));let controller:AbortController|undefined;
$('cancel').onclick=()=>controller?.abort();
$('history').onclick=async()=>{try{const rows=await(await fetch('/reports')).json();$('result').textContent=JSON.stringify(rows,null,2);}catch(error){$('result').textContent=String(error);}};
$('run').onclick=async()=>{ $('run').disabled=true;$('cancel').disabled=false;controller=new AbortController();$('result').textContent='正在读取快照…';try{
 const deck=metadata.resources.find((r:any)=>r.kind==='deck'&&r.id===$('deck').value),encounter=metadata.resources.find((r:any)=>r.kind==='encounter'&&r.id===$('encounter').value);
 const data=await(await fetch('/'+deck.path)).json();
 const settings={deckId:deck.id,encounterId:encounter.id,policyVersion:'first-free-unit-per-turn-v1',opening:'player-first' as const,seeds:$('seeds').value.split(',').map((v:string)=>Number(v.trim())),turnLimit:Number($('turns').value),actionLimit:100};
 const report=await runBattleExperiment({contentRevision:metadata.contentRevision,runtimeRevision:metadata.runtimeRevision,adapterVersion:metadata.adapterVersion,deckCardIds:data.cards.flatMap((s:any)=>Array(s.count).fill(s.id)),run:async(input:any)=>{$('result').textContent='正在执行种子 '+input.seed;return trial({...input,deck:data.cards,encounterFile:encounter.path});}},settings,controller.signal);
 $('result').textContent=JSON.stringify(report,null,2);
 const response=await fetch('/report',{method:'POST',headers:{'content-type':'application/json','x-worka-experiment':metadata.token},body:JSON.stringify(report)});if(!response.ok)throw Error(await response.text());
 $('result').textContent=JSON.stringify({saved:await response.json(),report},null,2);
 }catch(error){$('result').textContent+=String.fromCharCode(10)+String(error);}finally{$('run').disabled=false;$('cancel').disabled=true;}};
`);
  const built = await Bun.build({ entrypoints: [entry], target: 'browser', minify: true, define: { 'import.meta.env.DEV': 'false' }, plugins: [{ name: 'snapshot-phaser', setup(build) { build.onResolve({ filter: /^phaser$/ }, () => ({ path: phaserBridge })); } }] });
  if (!built.success || built.outputs.length !== 1) throw Error('战斗执行器构建失败：' + built.logs.map(log => log.message).join('; '));
  const bundle = await built.outputs[0]!.text(), runtimeRevision = hash(bundle), token = randomUUID();
  await writeFile(join(output, 'bundle.js'), bundle);
  await writeFile(join(output, 'execution.json'), JSON.stringify({ snapshotId: manifest.id, snapshotRevision: manifest.snapshotRevision, runtimeRevision, adapterVersion, phaserRevision: hash(await readFile(phaserCopy)) }, null, 2));
  const html = `<!doctype html><html lang="zh"><meta charset="utf-8"><title>自动对局 · 固定版本</title><style>body{font:15px system-ui;max-width:1100px;margin:24px auto;padding:0 16px;color:#222;background:#fafafa}label{display:inline-flex;flex-direction:column;gap:4px;margin:8px}button,input,select{font:inherit;padding:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere}#game{width:100%;height:540px}</style><h1>自动对局 · 固定版本</h1><p>玩家牌组对抗遭遇。策略每回合打出首张无需献祭的单位，选牌提示取首项；不主动使用其他卡种、技能或丹药。预算耗尽不计作败局。</p><label>牌组<select id="deck"></select></label><label>遭遇<select id="encounter"></select></label><label>种子（逗号分隔）<input id="seeds" value="42,43"></label><label>回合上限<input id="turns" type="number" min="1" max="200" value="10"></label><button id="run">开始批量对局</button><button id="cancel" disabled>停止对局</button><button id="history">读取保存报告</button><pre id="result">尚未运行。结果仅描述此自动策略，不代表玩家胜率。</pre><div id="game"></div><script type="module" src="/bundle.js"></script></html>`;
  const publicRoot = await realpath(join(project, 'public'));
  const server = Bun.serve({ hostname: '127.0.0.1', port: options.port ?? 0, maxRequestBodySize: 2 * 1024 * 1024, async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== '127.0.0.1') return new Response('Invalid local host', { status: 403 });
    try {
      if (request.method === 'POST' && url.pathname === '/report') {
        if (request.headers.get('x-worka-experiment') !== token || request.headers.get('origin') !== url.origin) return new Response('请求身份不一致', { status: 403 });
        await verifyBattleSnapshot(options.snapshot);
        const report = await request.json() as BattleExperimentReport, settings = validateBattleSettings(report.settings);
        if (report.contentRevision !== manifest.contentRevision || report.runtimeRevision !== runtimeRevision || report.adapterVersion !== adapterVersion) throw Error('报告版本不一致');
        const deck = resources.find((item: any) => item.kind === 'deck' && item.id === settings.deckId), encounter = resources.find((item: any) => item.kind === 'encounter' && item.id === settings.encounterId);
        if (!deck || !encounter || !Array.isArray(report.trials) || report.trials.length > settings.seeds.length) throw Error('报告资源或对局列表无效');
        const data = JSON.parse(await readFile(join(publicRoot, deck.path), 'utf8'));
        if (report.trials.length < settings.seeds.length && !report.summary.cancelled) throw Error('缺少未执行对局的取消标记');
        const cancellation = new AbortController();
        if (!report.trials.length && report.summary.cancelled) cancellation.abort();
        const canonical = await runBattleExperiment({ contentRevision: manifest.contentRevision, runtimeRevision, adapterVersion,
          deckCardIds: data.cards.flatMap((stack: any) => Array(stack.count).fill(stack.id)), async run({seed}) { const index = settings.seeds.indexOf(seed), observed = report.trials[index]; if (!observed || observed.seed !== seed) throw Error('对局种子顺序不一致'); if (report.summary.cancelled && index === report.trials.length - 1) cancellation.abort(); if (observed.error) throw Error(observed.error); if (!observed.result) throw Error('对局没有结果'); return observed.result; } }, settings, cancellation.signal);
        if (JSON.stringify(canonical.summary) !== JSON.stringify(report.summary) || canonical.settingsHash !== report.settingsHash || JSON.stringify(canonical.trials) !== JSON.stringify(report.trials)) throw Error('报告统计或对局内容不一致');
        const id = randomUUID(); await mkdir(join(output, 'reports'), { recursive: true, mode: 0o700 });
        const temporary = join(output, 'reports', id + '.tmp');
        await writeFile(temporary, JSON.stringify({ ...canonical, snapshotId: manifest.id }, null, 2), { mode: 0o600 });
        await rename(temporary, join(output, 'reports', id + '.json'));
        return Response.json({ id, snapshotId: manifest.id });
      }
      if (request.method !== 'GET') return new Response('Not found', { status: 404 });
      if (url.pathname === '/') return new Response(html, { headers: { 'content-type': 'text/html;charset=utf-8' } });
      if (url.pathname === '/metadata') return Response.json({ contentRevision: manifest.contentRevision, runtimeRevision, adapterVersion, resources, token });
      if (url.pathname === '/reports') {
        const names = await readdir(join(output, 'reports')).catch(error => { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; });
        const recent = await Promise.all(names.filter(name => /^[a-f0-9-]{36}\.json$/.test(name)).map(async name => ({ name, modified: (await stat(join(output, 'reports', name))).mtimeMs })));
        recent.sort((a,b) => b.modified - a.modified);
        const reports = await Promise.all(recent.slice(0,50).map(async ({ name }) => ({ id: name.slice(0, -5), report: JSON.parse(await readFile(join(output, 'reports', name), 'utf8')) })));
        return Response.json(reports.sort((a,b) => b.report.createdAt.localeCompare(a.report.createdAt)));
      }
      if (url.pathname === '/bundle.js') return new Response(bundle, { headers: { 'content-type': 'application/javascript' } });
      const path = await realpath(join(publicRoot, decodeURIComponent(url.pathname)));
      if (!path.startsWith(publicRoot + sep)) return new Response('Not found', { status: 404 });
      return new Response(Bun.file(path));
    } catch (error) { return new Response(error instanceof Error ? error.message : String(error), { status: 400 }); }
  } });
  return { server, url: `http://127.0.0.1:${server.port}/`, runtimeRevision, snapshotId: manifest.id };
}
if (import.meta.main) {
  const flag = (name: string) => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
  const snapshot = flag('--snapshot'), phaser = flag('--phaser'), output = flag('--output');
  if (!snapshot || !phaser || !output) throw Error('Required: --snapshot DIR --phaser ESM_FILE --output DIR [--port N]');
  const result = await startBattleServer({ snapshot: resolve(snapshot), phaser: resolve(phaser), output: resolve(output), ...(flag('--port') ? { port: Number(flag('--port')) } : {}) });
  console.log(JSON.stringify({ url: result.url, snapshotId: result.snapshotId, runtimeRevision: result.runtimeRevision }));
}
