import {useNote} from '@dsh-workbench/react';
import {useMemo} from 'react';
type Api=ReturnType<typeof useNote<typeof import('./actions')>>;
export type WidgetProps=Pick<Api,'metadata'|'mode'|'layout'|'focus'>;
export function useRuntime(){const n=useNote<typeof import('./actions')>();return useMemo(()=>({note:{id:n.metadata.id},resources:n.host.resources,resolvePreviewUrl:n.host.resolvePreviewUrl}),[n.metadata.id,n.host.resources,n.host.resolvePreviewUrl]);}
