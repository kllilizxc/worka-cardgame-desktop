import {defineNote,z} from '@dsh-workbench/runtime';
import {projectTracker} from './projection';

export const note=defineNote({
  state:{schema:z.looseObject({title:z.string().optional(),summary:z.string().optional(),changeSelection:z.string().nullable().optional()}),initial:{}},
  config:{schema:z.looseObject({projectId:z.string().optional(),presentation:z.string().optional(),notes:z.record(z.string(),z.string()).optional()}),defaults:{}},
  update:{dataVersion:'feature-progress@1',compatibleFrom:['legacy','feature-progress@1'],checks:[{
    name:'关键能力与稳定身份',run(){
      const view=projectTracker({features:[{id:'retained-id',title:'Existing',links:[],archived:true}],context:{},serverUrl:''},[]);
      return view.features[0]?.id==='retained-id'&&view.features[0]?.archived===true&&view.archivedCount===1;
    },
  }]},
});
