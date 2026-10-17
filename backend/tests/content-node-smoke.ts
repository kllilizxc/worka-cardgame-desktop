import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createContentService } from '../plugins/cardgame-content/src/content';

const [gameRoot, dataRoot, output] = process.argv.slice(2).map(value => resolve(value));
if (!gameRoot || !dataRoot || !output) throw Error('Explicit disposable game/data/output paths required');
await mkdir(dataRoot, { recursive: true });
const results = [];
for (let restart = 0; restart < 2; restart++) {
  const service = createContentService({ dataRoot, projects: [{ id: 'acceptance', root: gameRoot }] });
  try {
    const cards = await service.query({ projectId: 'acceptance', op: 'cards', limit: 10 }) as any;
    const status = await service.query({ projectId: 'acceptance', op: 'status' });
    if (!cards.items?.length) throw Error('Actual game card index is empty');
    const card = await service.query({ projectId: 'acceptance', op: 'card', id: cards.items[0].id });
    const balance = await service.query({ projectId: 'acceptance', op: 'balanceOverview' });
    const documents = await service.query({ projectId: 'acceptance', op: 'documents', limit: 10 });
    results.push({ restart, status, cards, card, balance, documents });
  } finally { await service.close(); }
}
await writeFile(output, JSON.stringify({ runtime: process.version, results, passed: true }, null, 2));
console.log(JSON.stringify({ runtime: process.version, passes: results.length, statuses: results.map(item => item.status) }));
