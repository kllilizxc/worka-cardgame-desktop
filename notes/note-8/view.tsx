import {defineNoteView} from '@dsh-workbench/react';

export default defineNoteView({
  compact: () => import('./view-compact'),
  expanded: () => import('./view-expanded'),
  prerequisites: {configurationInView: true},
});
