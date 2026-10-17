import path from 'node:path';
/** A strict filesystem descendant; never use URL-style slashes for native paths. */
export function isPathDescendant(root: string, target: string, paths = path): boolean {
  const relative = paths.relative(paths.resolve(root), paths.resolve(target));
  return Boolean(relative) && relative !== '..' && !relative.startsWith(`..${paths.sep}`) && !paths.isAbsolute(relative);
}
