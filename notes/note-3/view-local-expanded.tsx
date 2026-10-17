import {useViewProps} from './surface';
import {usePreviewModel} from './view-model';
import Expanded from './view-expanded';
export default function ExpandedNote(){return <Expanded model={usePreviewModel(useViewProps())}/>;}
