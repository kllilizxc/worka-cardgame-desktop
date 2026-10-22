import {defineNoteView} from '@dsh-workbench/react';
export const View=defineNoteView({compact:()=>import('./view-compact'),expanded:()=>import('./view-expanded')});
export default View;
