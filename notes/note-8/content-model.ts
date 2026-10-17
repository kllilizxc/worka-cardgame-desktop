import type {NoteState,NoteConfig,z} from '@dsh-workbench/runtime';
import type {note} from './note-model';
import type {libraryItemSchema,pageSchema,documentItemSchema,documentSchema,documentMetaSchema,directorySchema,backlinkSchema,graphSchema,movePreviewSchema,cardItemSchema,cardSchema,assetSchema,assetVersionSchema,mediaSchema,statusSchema,recentChangeSchema,referenceResourceSchema,contentQueries} from './contract';
/** The three domain views share one template and differ only by instance config. */
export type LibraryMode = "knowledge" | "cards" | "assets";

export type ContentKind =
  | "document"
  | "card"
  | "asset"
  | "production"
  | "todo"
  | "preview";

export type CardGameNotes=NonNullable<CardGameConfig['notes']>;

export type CardGameConfig=NoteConfig<typeof note>;

export type ReferenceResource=z.output<typeof referenceResourceSchema>;

/** Persistent view state. It deliberately contains no document, card, or media payload. */
export type LibraryState=NoteState<typeof note>;

export type AssetFilters=NonNullable<NonNullable<LibraryState['views']>['assetsFilters']>[number];

/** A stable cross-note locator used by the workbench openNote bridge. */
export interface ContentRef {
  projectId: string;
  kind: ContentKind;
  id?: string;
  path?: string;
  anchor?: string;
  revision?: string;
  intent?: "backlinks" | "draft" | "compare" | string;
  context?: Record<string, unknown>;
}

/** Compact reference links must use the exact registered path in this project. */
export function registeredReferenceFromFocus(ref: ContentRef | undefined, projectId: string, resources: ReferenceResource[]) {
  if (ref?.projectId !== projectId || ref.kind !== 'document' || ref.intent !== 'reference') return undefined;
  return resources.find(resource => resource.path === ref.path);
}

/** Encode a content locator in the shared `cg:` deep-link format. */
export function encodeContentRef(ref: ContentRef): string {
  const ordered: ContentRef = {
    projectId: ref.projectId,
    kind: ref.kind,
    ...(ref.id ? { id: ref.id } : {}),
    ...(ref.path ? { path: ref.path } : {}),
    ...(ref.anchor ? { anchor: ref.anchor } : {}),
    ...(ref.revision ? { revision: ref.revision } : {}),
    ...(ref.intent ? { intent: ref.intent } : {}),
    ...(ref.context ? { context: ref.context } : {}),
  };
  return `cg:${encodeURIComponent(JSON.stringify(ordered))}`;
}

/** Decode a shared content locator; malformed IDs are treated as absent. */
export function decodeContentRef(itemId: string | undefined | null): ContentRef | undefined {
  if (!itemId?.startsWith("cg:")) return undefined;
  try {
    const value: unknown = JSON.parse(decodeURIComponent(itemId.slice(3)));
    if (!value || typeof value !== "object") return undefined;
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.projectId !== "string" || typeof candidate.kind !== "string") return undefined;
    const kinds: ContentKind[] = ["document", "card", "asset", "production", "todo", "preview"];
    if (!kinds.includes(candidate.kind as ContentKind)) return undefined;
    const result: ContentRef = {
      projectId: candidate.projectId,
      kind: candidate.kind as ContentKind,
    };
    for (const field of ["id", "path", "anchor", "revision", "intent"] as const) {
      const value = candidate[field];
      if (typeof value !== "string") continue;
      switch (field) {
        case "id": result.id = value; break;
        case "path": result.path = value; break;
        case "anchor": result.anchor = value; break;
        case "revision": result.revision = value; break;
        case "intent": result.intent = value; break;
      }
    }
    if (candidate.context && typeof candidate.context === "object" && !Array.isArray(candidate.context)) {
      result.context = candidate.context as Record<string, unknown>;
    }
    return result;
  } catch {
    return undefined;
  }
}

export type LibraryItem=z.output<typeof libraryItemSchema>;

export type ContentList<T extends LibraryItem=LibraryItem>=Omit<z.output<ReturnType<typeof pageSchema<typeof libraryItemSchema>>>, 'items'> & {items:T[]};

export type DirectoryItem=z.output<typeof directorySchema>;

export type DocumentItem=z.output<typeof documentItemSchema>;

export type DocumentData=z.output<typeof documentSchema>;

export type DocumentMeta=z.output<typeof documentMetaSchema>;

export type BacklinkItem=z.output<typeof backlinkSchema>;

export type GraphData=z.output<typeof graphSchema>;

export type MovePreviewData=z.output<typeof movePreviewSchema>;

export type CardItem=z.output<typeof cardItemSchema>;

export type CardData=z.output<typeof cardSchema>;

export type AssetItem=z.output<typeof assetSchema>;

export type AssetData=AssetItem;

export type VersionItem=z.output<typeof assetVersionSchema>;

export type MediaData=z.output<typeof mediaSchema>;

export type RecentChangeItem=z.output<typeof recentChangeSchema>;

export type RecentChangesData=z.output<typeof contentQueries.recentChanges.output>;

/** The change stream shows only the domain objects of the current mode. */
export function recentChangesForMode(items: RecentChangeItem[], mode: LibraryMode): RecentChangeItem[] {
  if (mode === "cards") return items.filter(item => item.kind === "card");
  if (mode === "assets") return items.filter(item => item.kind === "asset" || item.kind === "version");
  return items.filter(item => item.kind === "document");
}

export function recentChangeLabel(item: RecentChangeItem): string {
  return item.name || item.path || item.id || item.kind;
}

export type StatusData=z.output<typeof statusSchema>;

export function itemLabel(item: LibraryItem): string {
  return item.title || item.name || item.path || item.id;
}

export function mediaSource(media: MediaData | undefined): string | undefined {
  return media?.url || media?.data;
}

/** Decode a Markdown URL path exactly once before resolving it as a file path. */
export function decodeMarkdownUrlPath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    // Keep malformed URL escapes usable as literal paths.
    return value;
  }
}

export function resolveRelativePath(from: string, target: string): string {
  const decodedTarget = decodeMarkdownUrlPath(target);
  if (!decodedTarget || decodedTarget.startsWith("/")) return decodedTarget;
  const base = from.split("/");
  base.pop();
  for (const part of decodedTarget.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") base.pop(); else base.push(part);
  }
  return base.join("/");
}

/** Follow indexed identities rather than assuming every local Markdown link is a document. */
export function markdownContentTarget(document: DocumentData, href: string): { ref: Omit<ContentRef, "projectId">; noteKind: "knowledge" | "cards" | "assets" } {
  const [targetPath, anchor] = href.split("#", 2);
  const path = resolveRelativePath(document.path, targetPath || document.path);
  const link = document.links?.find(item => item.targetPath === path && (item.anchor || "") === decodeMarkdownUrlPath(anchor || ""));
  if (link?.targetKind === "card") return { ref: { kind: "card", path, ...(link.targetId ? { id: link.targetId } : {}) }, noteKind: "cards" };
  if (link?.targetKind === "asset") return { ref: { kind: "asset", path, ...(link.targetId ? { id: link.targetId } : {}) }, noteKind: "assets" };
  return { ref: { kind: "document", path, ...(anchor ? { anchor } : {}) }, noteKind: "knowledge" };
}
