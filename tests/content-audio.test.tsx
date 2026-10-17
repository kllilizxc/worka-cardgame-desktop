import {expect,test} from 'bun:test';
import {Activity,useState} from 'react';
import {join} from 'node:path';
const worka=process.env.WORKA_SOURCE_ROOT;
if(worka){
 const {mount,flush}=await import(join(worka,'tests/web/dom-test-helpers.tsx'));
 const {AudioPreview}=await import('../notes/note-1/audio-preview');
 test('compact/native controls play; autoplay false, Activity hiding and page hiding pause media',async()=>{
  const play=window.HTMLMediaElement.prototype.play,pause=window.HTMLMediaElement.prototype.pause;
  const hidden=Object.getOwnPropertyDescriptor(document,'hidden');
  let starts=0,stops=0,isHidden=false,setAutoPlay=(value:boolean)=>{},setVisible=(value:boolean)=>{};
  Object.defineProperty(document,'hidden',{configurable:true,get:()=>isHidden});
  window.HTMLMediaElement.prototype.play=function(){starts++;return Promise.resolve();};
  window.HTMLMediaElement.prototype.pause=function(){stops++;};
  function Probe(){const[autoPlay,updateAutoPlay]=useState(false),[visible,updateVisible]=useState(true);setAutoPlay=updateAutoPlay;setVisible=updateVisible;return <Activity mode={visible?'visible':'hidden'}><AudioPreview src="/fixture.wav" autoPlay={autoPlay}/></Activity>;}
  const view=await mount(<Probe/>);
  try{
   const audio=view.container.querySelector('audio')!;const initialStops=stops;
   await flush(()=>audio.dispatchEvent(new Event('play',{bubbles:true})));expect(stops).toBe(initialStops);
   await flush(()=>setAutoPlay(true));expect(starts).toBe(1);
   await flush(()=>setAutoPlay(false));expect(stops).toBeGreaterThan(initialStops);
   const afterPause=stops;await flush(()=>audio.dispatchEvent(new Event('play',{bubbles:true})));expect(stops).toBe(afterPause);
   await flush(()=>setVisible(false));expect(stops).toBeGreaterThan(afterPause);
   await flush(()=>setVisible(true));const beforeHide=stops;
   await flush(()=>{isHidden=true;document.dispatchEvent(new Event('visibilitychange'));});expect(stops).toBeGreaterThan(beforeHide);
  }finally{await view.unmount();window.HTMLMediaElement.prototype.play=play;window.HTMLMediaElement.prototype.pause=pause;if(hidden)Object.defineProperty(document,'hidden',hidden);else delete(document as unknown as Record<string,unknown>).hidden;}
 });
}else test.skip('content audio DOM regression requires WORKA_SOURCE_ROOT',()=>{});
