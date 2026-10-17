import {expect,test} from 'bun:test';
import {CARD_FACE_VERSION,renderCardFace,DEFAULT_FACE} from '../../notes/note-4/card-face';
test('single canonical layout preserves existing fingerprint version, two themes and preview/runtime numeric separation',()=>{
 expect(CARD_FACE_VERSION).toBe(4);
 const card={id:'UNIT',name:'玄霄剑诀',kind:'unit',description:'保留真实规则',attack:5,health:9};
 const art='data:image/png;base64,AAAA';
 for(const themeId of ['jade','scroll'] as const){const preview=renderCardFace(card,art,{...DEFAULT_FACE,themeId},true,'Noto Serif CJK SC'),runtime=renderCardFace(card,art,{...DEFAULT_FACE,themeId},false,'Noto Serif CJK SC');expect(preview).toContain('攻 5');expect(runtime).not.toContain('攻 5');expect(runtime).toContain('保留真实规则');expect(preview).toContain('Noto Serif CJK SC');}
});
