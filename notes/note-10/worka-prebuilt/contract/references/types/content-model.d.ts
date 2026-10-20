import type { NoteState, NoteConfig, z } from '@dsh-workbench/runtime';
import type { note, viewPatchSchema } from './model';
import type { libraryItemSchema, pageSchema, documentItemSchema, documentSchema, documentMetaSchema, directorySchema, backlinkSchema, graphSchema, movePreviewSchema, cardItemSchema, cardSchema, assetSchema, assetVersionSchema, mediaSchema, statusSchema, recentChangeSchema, referenceResourceSchema, contentQueries } from './contract';
/** The three domain views share one template and differ only by instance config. */
export type LibraryMode = "knowledge" | "cards" | "assets";
export type ContentKind = "document" | "card" | "asset" | "production" | "todo" | "preview";
export type CardGameNotes = NonNullable<CardGameConfig['notes']>;
export type CardGameConfig = NoteConfig<typeof note>;
export type ReferenceResource = z.output<typeof referenceResourceSchema>;
/** Persistent view state. It deliberately contains no document, card, or media payload. */
export type LibraryState = NoteState<typeof note>;
export type ViewStatePatch = z.input<typeof viewPatchSchema>;
export type AssetFilters = NonNullable<NonNullable<LibraryState['views']>['assetsFilters']>[number];
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
export declare function registeredReferenceFromFocus(ref: ContentRef | undefined, projectId: string, resources: ReferenceResource[]): {
    title: string;
    path: string;
    root?: string | undefined;
    linkBase?: string | undefined;
    revision?: string | undefined;
} | undefined;
/** Encode a content locator in the shared `cg:` deep-link format. */
export declare function encodeContentRef(ref: ContentRef): string;
/** Decode a shared content locator; malformed IDs are treated as absent. */
export declare function decodeContentRef(itemId: string | undefined | null): ContentRef | undefined;
export type LibraryItem = z.output<typeof libraryItemSchema>;
export type ContentList<T extends LibraryItem = LibraryItem> = Omit<z.output<ReturnType<typeof pageSchema<typeof libraryItemSchema>>>, 'items'> & {
    items: T[];
};
export type DirectoryItem = z.output<typeof directorySchema>;
export type DocumentItem = z.output<typeof documentItemSchema>;
export type DocumentData = z.output<typeof documentSchema>;
export type DocumentMeta = z.output<typeof documentMetaSchema>;
export type BacklinkItem = z.output<typeof backlinkSchema>;
export type GraphData = z.output<typeof graphSchema>;
export type MovePreviewData = z.output<typeof movePreviewSchema>;
export type CardItem = z.output<typeof cardItemSchema>;
export type CardData = z.output<typeof cardSchema>;
export type AssetItem = z.output<typeof assetSchema>;
export type AssetData = AssetItem;
export type VersionItem = z.output<typeof assetVersionSchema>;
export type MediaData = z.output<typeof mediaSchema>;
export type RecentChangeItem = z.output<typeof recentChangeSchema>;
export type RecentChangesData = z.output<typeof contentQueries.recentChanges.output>;
/** The change stream shows only the domain objects of the current mode. */
export declare function recentChangesForMode(items: RecentChangeItem[], mode: LibraryMode): RecentChangeItem[];
export declare function recentChangeLabel(item: RecentChangeItem): string;
export type StatusData = z.output<typeof statusSchema>;
export declare function itemLabel(item: LibraryItem): string;
export declare function mediaSource(media: MediaData | undefined): string | undefined;
/** Decode a Markdown URL path exactly once before resolving it as a file path. */
export declare function decodeMarkdownUrlPath(value: string): string;
export declare function resolveRelativePath(from: string, target: string): string;
/** Follow indexed identities rather than assuming every local Markdown link is a document. */
export declare function markdownContentTarget(document: DocumentData, href: string): {
    ref: Omit<ContentRef, "projectId">;
    noteKind: "knowledge" | "cards" | "assets";
};
