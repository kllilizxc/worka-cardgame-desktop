import {requestExtension,readExtension} from '@dsh-workbench/runtime';
import {configureProjectContract,contentActions,contentQueries,type ContentQueryOutput} from '../plugins/cardgame-content/src/contract';
import type {NoteActions} from '@dsh-workbench/react';
import type * as ContentNote from '../../notes/note-1/actions';

async function contractTypes(extensions:Parameters<typeof requestExtension>[0],resources:Parameters<typeof readExtension>[0],actions:NoteActions<typeof ContentNote>) {
  const saved=await requestExtension(extensions,contentActions.saveDocument.method,{projectId:'project',path:'knowledge/entry.md',content:'Text',expectedRevision:'r1'});
  const text:string=saved.content;
  // @ts-expect-error Content methods cannot swap their declared response for a consumer-selected type.
  const wrongSaved:number=saved.content;
  // @ts-expect-error Operation input is derived from the same schema the service validates.
  await requestExtension(extensions,contentActions.saveDocument.method,{projectId:'project',content:3});
  // @ts-expect-error Caller authority is host-owned and is not a business input.
  await requestExtension(extensions,configureProjectContract,{root:'/game',caller:{kind:'user'}});
  // @ts-expect-error Runtime generation checks receive strings, never untyped IDs.
  await readExtension(resources,contentQueries.cards.resource,{op:'cards',projectId:'project',projectGeneration:3});
  // @ts-expect-error The note's configured project cannot be overridden through a UI query.
  const noteInput:import('../plugins/cardgame-content/src/contract').ContentQueryInput<'cards'>={projectId:'another'};
  await actions.createCardWorkflow({itemIds:['card'],featureId:'feature',draft:{name:'Title',attack:0}});
  // @ts-expect-error State patches are derived from the declared view state.
  await actions.setViewState({patch:{unregisteredField:true}});
  await actions.setViewState({patch:{views:{cards:'table'}},bookmark:{key:'card',saved:true},filter:{name:'large',minWidth:100}});
  // @ts-expect-error View preferences do not accept a whole-state UI revision.
  await actions.setViewState({expectedRevision:'r1',patch:{query:'cards'}});
  // @ts-expect-error Bookmarks are changed by key, never by replacing an old array.
  await actions.setViewState({patch:{bookmarks:['card']}});
  // @ts-expect-error Named filters are changed by name, never by replacing an old array.
  await actions.setViewState({patch:{views:{assetsFilters:[]}}});
  return {text,wrongSaved,noteInput};
}
function moveSource(move:ContentQueryOutput<'movePreview'>) {
  const id:string=move.source.id;
  // @ts-expect-error A move source is a complete document identity, not a path string.
  const path:string=move.source;
  return {id,path};
}
void contractTypes;void moveSource;
