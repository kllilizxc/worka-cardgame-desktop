import {defineNoteView} from '@dsh-workbench/react';

export default defineNoteView({
  compact: () => import('./view-compact'),
  expanded: () => import('./view-expanded'),
  state: 'legacy',
  prerequisites: {configurationInView: true},
});
