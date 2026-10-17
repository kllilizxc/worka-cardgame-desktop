import { expect, test } from 'bun:test';
import { posix, win32 } from 'node:path';
import { isPathDescendant } from '../plugins/cardgame-content/src/path-safety';
test('native path containment accepts children and rejects adjacent or escaping paths', () => {
  for (const [paths, root, child, neighbor] of [[posix, '/games/card', '/games/card/data/a.json', '/games/card-copy/a.json'], [win32, 'C:\\games\\card', 'C:\\games\\card\\data\\a.json', 'C:\\games\\card-copy\\a.json']] as const) {
    expect(isPathDescendant(root, child, paths)).toBe(true);
    expect(isPathDescendant(root, root, paths)).toBe(false);
    expect(isPathDescendant(root, neighbor, paths)).toBe(false);
    expect(isPathDescendant(root, paths.join(root, '..', 'escape'), paths)).toBe(false);
  }
  expect(isPathDescendant('C:\\games', 'D:\\games\\a', win32)).toBe(false);
});
