/** Compare restored HTML against the immutable original source under one browser.
 * WORKA_SOURCE_ROOT, COMPACT_BASELINE_ROOT and COMPACT_BROWSER are required.
 * COMPACT_FONT selects a local Noto Sans CJK font; screenshots go to COMPACT_OUTPUT.
 * No fixture executes business operations or accesses a game project. */
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
const repository=resolve(import.meta.dir,'../..');
const worka=resolve(process.env.WORKA_SOURCE_ROOT!);
const baseline=resolve(process.env.COMPACT_BASELINE_ROOT!);
const output=resolve(process.env.COMPACT_OUTPUT??resolve(repository,'.compact-visual-output'));
const externalRequire=createRequire(resolve(process.env.COMPACT_TEST_MODULES??process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES??resolve(repository,'node_modules'),'../package.json'));
const {chromium}=externalRequire('playwright');
const {PNG}=externalRequire('pngjs');
const pixelmatch=(await import(externalRequire.resolve('pixelmatch'))).default;
await mkdir(output,{recursive:true});
const built=await Bun.build({entrypoints:[resolve(import.meta.dir,'entry.tsx')],target:'browser',format:'esm',outdir:resolve(output,'bundle'),minify:true,splitting:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'read-only-visual-fixture',setup(build){
 // Independent source checkouts must still share one React dispatcher.
 build.onResolve({filter:/^(?:react|react-dom)(?:\/.*)?$/},args=>({path:Bun.resolveSync(args.path,repository)}));
 build.onResolve({filter:/^@visual\//},args=>{
  if(args.path==='@visual/actual-sdk')return {path:resolve(worka,'sdk/react/src/index.tsx')};
  if(args.path==='@visual/theme')return {path:resolve(worka,'sdk/runtime/src/theme.ts')};
  return {path:Bun.resolveSync(args.path.replace('@visual/baseline/',baseline+'/'),repository)};
 });
 build.onResolve({filter:/^@dsh-workbench\/react$/},()=>({path:resolve(import.meta.dir,'sdk.tsx')}));
 build.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));
}}]});
if(!built.success)throw new AggregateError(built.logs,'Visual fixture compilation failed');
const desktop=JSON.parse(await readFile(resolve(repository,'desktop.json'),'utf8'));
const selected=process.env.COMPACT_NOTES?.split(',');
const notes=selected?desktop.notes.filter((note:any)=>selected.includes(note.key)):desktop.notes;
if(!notes.length)throw Error('No compact visual fixtures selected.');
const themes=await Promise.all(['light','dark'].map(async name=>JSON.parse(await readFile(resolve(worka,`design/themes/${name}/theme.json`),'utf8'))));
const font=await readFile(process.env.COMPACT_FONT!);
const script=await readFile(resolve(output,'bundle/entry.js'));
const baseStyle='html,body,#root{margin:0;min-height:100%;width:100%}body{font-family:system-ui,sans-serif;background:transparent}#root{box-sizing:border-box}';
const server=Bun.serve({hostname:'127.0.0.1',port:0,fetch:async request=>{
 const url=new URL(request.url);
 if(url.pathname==='/entry.js')return new Response(script,{headers:{'content-type':'text/javascript'}});
 if(url.pathname==='/font.otf')return new Response(font,{headers:{'content-type':'font/otf'}});
 const note=desktop.notes.find((n:any)=>n.key===url.searchParams.get('note'));
 if(!note)return new Response('missing fixture',{status:404});
 const theme=themes.find(t=>t.id===url.searchParams.get('theme'));
 const originalTheme={...theme,tokens:{...theme.tokens,'font-family':'"Noto Sans CJK SC Fixture", sans-serif'}};
 const svg=await readFile(resolve(baseline,'notes',note.key,'icon.svg'));
 const input={note,theme:originalTheme,variant:url.searchParams.get('variant'),icon:{type:'svg',src:'data:image/svg+xml;base64,'+svg.toString('base64'),monochrome:true}};
 const styles=await Promise.all(['entry-bundle.tailwind.css','entry-bundle.css'].map(async name=>{try{return await readFile(resolve(baseline,'notes',note.key,'worka-prebuilt',name),'utf8');}catch{return '';}}));
 return new Response(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>${styles.join('\n')}</style><style>${baseStyle}@font-face{font-family:'Noto Sans CJK SC Fixture';src:url('/font.otf')}@font-face{font-family:'PingFang SC';src:url('/font.otf');unicode-range:U+2E80-9FFF,U+F900-FAFF,U+FF00-FFEF}@font-face{font-family:'Segoe UI';src:url('/font.otf');unicode-range:U+2E80-9FFF,U+F900-FAFF,U+FF00-FFEF}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}</style></head><body><div id="root"></div><script>globalThis.__VISUAL_INPUT__=${JSON.stringify(input).replaceAll('<','\\u003c')};</script><script type="module" src="/entry.js"></script></body></html>`,{headers:{'content-type':'text/html'}});
}});
const browser=await chromium.launch({executablePath:process.env.COMPACT_BROWSER,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results:any[]=[];
try{
 for(const scale of [1,2])for(const theme of themes)for(const note of notes){
  const id=`${note.key}-${theme.id}-${scale}x`;
  const context=await browser.newContext({viewport:{width:note.layout.width,height:note.layout.height},deviceScaleFactor:scale,locale:'zh-CN',timezoneId:'Asia/Shanghai',reducedMotion:'reduce'});
  await context.route('**/*',(route:any)=>new URL(route.request().url()).origin===`http://127.0.0.1:${server.port}`?route.continue():route.abort());
  const screenshots:any={};
  const detail:any={};
  for(const variant of ['baseline','restored']){
   const page=await context.newPage();
   const errors:string[]=[];
   page.on('pageerror',(error:Error)=>{errors.push(error.message);console.error(`${id} ${variant}: ${error.message}`);});
   await page.goto(`http://127.0.0.1:${server.port}/?note=${note.key}&theme=${theme.id}&variant=${variant}`);
   await page.waitForFunction(()=>document.querySelector('#root')!.children.length>0,undefined,{timeout:10000});
   await page.evaluate(async()=>{await document.fonts.load('14px "Noto Sans CJK SC Fixture"');await document.fonts.ready;await Promise.all(Array.from(document.images).map(image=>image.decode().catch(()=>{})));await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));});
   if(errors.length)throw Error(`${id} ${variant}: ${errors.join('; ')}`);
   const meta=await page.evaluate(()=>({reads:(globalThis as any).__VISUAL_FIXTURE__.reads,writes:(globalThis as any).__VISUAL_FIXTURE__.writes,body:document.querySelector('#root')!.textContent,images:Array.from(document.images).map(img=>({ready:img.complete&&img.naturalWidth>0,src:img.src.slice(0,40)})),iframes:document.querySelectorAll('iframe').length}));
   if(meta.writes.length||meta.iframes||meta.images.some((img:any)=>!img.ready))throw Error(`Invalid compact visual fixture ${id} ${variant}`);
   detail[variant]=meta;
   screenshots[variant]=await page.screenshot({path:resolve(output,`${id}-${variant}.png`),animations:'disabled'});
   await page.close();
  }
  const before=PNG.sync.read(screenshots.baseline),after=PNG.sync.read(screenshots.restored),diff=new PNG({width:before.width,height:before.height});
  const pixels=pixelmatch(before.data,after.data,diff.data,before.width,before.height,{threshold:0,includeAA:true});
  if(pixels)await writeFile(resolve(output,`${id}-diff.png`),PNG.sync.write(diff));
  results.push({id,width:before.width,height:before.height,differingPixels:pixels,totalPixels:before.width*before.height,baselineReads:detail.baseline.reads,restoredReads:detail.restored.reads});
  await writeFile(resolve(output,'results.json'),JSON.stringify({baseline:'1b5d2694ca80c187626ab9dc4e55046c0b44ded7',browser:await browser.version(),scope:'HTML components; same deterministic data and host styles, not the host capture rasterizer',results},null,2));
  console.log(`${id}: ${pixels} differing pixels`);
  await context.close();
 }
}finally{await browser.close();server.stop(true);}
if(results.some(result=>result.differingPixels))process.exitCode=1;
