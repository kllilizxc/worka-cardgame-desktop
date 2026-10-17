import { isNoteController } from '@realiz3r/worka/host';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProjectBindingManager } from './project-binding';
import { createCardgameProvider } from './plugins/cardgame-content/src/registration';
import { cardgameNativeWriteDenial } from './plugins/cardgame-content/src/native-guard';
export const name = 'cardgame-local-content';
export const inject = ['worka'];
export async function apply(ctx: any, config: { bunPath?: string } = {}) {
  const host = ctx.worka;
  if (!host.media) throw Error('CardGame 需要宿主媒体服务');
  const here = dirname(fileURLToPath(import.meta.url));
  const packageRoot = basename(here) === 'dist' ? resolve(here, '..') : here;
  const manager = createProjectBindingManager({ host, media: host.media, packageRoot, bunPath: config.bunPath ?? 'bun',
    createProvider: createCardgameProvider, isNoteController,
    beforeNativeTool: input => cardgameNativeWriteDenial(host.app.core, input.sessionId, input.name, input.parentSessionId),
  });
  let unregister: (() => Promise<void>) | undefined;
  try {
    const dispose = await host.register('cardgame-content', manager);
    unregister = dispose;
    ctx.effect(() => dispose, 'CardGame 桌面项目扩展');
  } catch (error) {
    try { if (unregister) await unregister(); else await manager.close(); }
    catch (cleanupError) { throw new AggregateError([error, cleanupError], 'CardGame 扩展注册失败'); }
    throw error;
  }
}
