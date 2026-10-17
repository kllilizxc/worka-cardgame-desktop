/** The three domain views share one template and differ only by instance config. */
export type LibraryMode = "knowledge" | "cards" | "assets";
export type ContentKind = "document" | "card" | "asset" | "production" | "todo" | "preview";
export interface CardGameNotes {
    knowledge: string;
    cards: string;
    assets: string;
    production: string;
    todo: string;
    execution: string;
    preview: string;
}
export interface CardGameConfig {
    projectId: string;
    projectRoot?: string;
    mode: LibraryMode;
    assetScope?: 'art' | 'audio';
    presentation?: 'story' | 'balance';
    notes: CardGameNotes;
    /** Legacy registered references (design docs, memory, and similar local files). */
    resources?: ReferenceResource[];
}
export interface ReferenceResource {
    title: string;
    path: string;
    root?: string;
    linkBase?: string;
    revision?: string;
}
/** Persistent view state. It deliberately contains no document, card, or media payload. */
export interface LibraryState {
    query?: string;
    bookmarks?: string[];
    views?: {
        storySelection?: string;
        storyNodeSelection?: {
            storyId: string;
            nodeId: string;
        };
        balanceMetricSelection?: {
            kind: string;
            metric: 'attack' | 'health';
        };
        battleComparisonSelection?: {
            before: {
                experimentId: string;
                reportId: string;
            };
            after: {
                experimentId: string;
                reportId: string;
            };
        } | null;
        knowledge?: "reader" | "source";
        knowledgeSelection?: {
            id?: string;
            path: string;
        };
        cards?: "table" | "grid";
        cardsSelection?: string[];
        assets?: "grid" | "list";
        assetsSelection?: string;
        assetsFilters?: AssetFilters[];
    };
}
export interface AssetFilters {
    name: string;
    kind?: string;
    mimeType?: string;
    format?: string;
    minWidth?: number;
    maxWidth?: number;
    minDurationMs?: number;
    maxDurationMs?: number;
    status?: string;
}
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
export declare function registeredReferenceFromFocus(ref: ContentRef | undefined, projectId: string, resources: ReferenceResource[]): ReferenceResource | undefined;
/** Encode a content locator in the shared `cg:` deep-link format. */
export declare function encodeContentRef(ref: ContentRef): string;
/** Decode a shared content locator; malformed IDs are treated as absent. */
export declare function decodeContentRef(itemId: string | undefined | null): ContentRef | undefined;
export interface LibraryItem {
    id: string;
    title?: string;
    name?: string;
    path?: string;
    revision?: string;
    [key: string]: unknown;
}
export interface ContentList<T extends LibraryItem = LibraryItem> {
    items: T[];
    nextCursor?: string | null;
    total?: number;
    [key: string]: unknown;
}
export interface DirectoryItem extends LibraryItem {
    hasChildren?: boolean;
    parentPath?: string;
}
export interface DocumentItem extends LibraryItem {
    title: string;
    path: string;
    snippet?: string;
    match?: {
        line?: number;
        column?: number;
        text?: string;
    };
}
export interface DocumentData extends DocumentItem {
    links?: Array<{
        targetPath: string;
        targetKind: "document" | "card" | "asset" | "unknown" | "external";
        targetId?: string;
        anchor?: string;
        rawTarget: string;
    }>;
    content: string;
    format?: string;
}
export interface DocumentMeta {
    id: string;
    path: string;
    title: string;
    revision: string;
    size: number;
    isScene: boolean;
}
export interface BacklinkItem extends LibraryItem {
    sourceId?: string;
    sourcePath?: string;
    sourceTitle?: string;
    line?: number;
    snippet?: string;
    anchor?: string;
}
export interface GraphData {
    nodes?: Array<LibraryItem & {
        kind?: ContentKind;
        type?: ContentKind;
    }>;
    edges?: Array<{
        source?: string;
        target?: string;
        sourceId?: string;
        targetId?: string;
        sourcePath?: string;
        targetPath?: string;
        label?: string;
    }>;
    truncated?: boolean;
}
export interface MovePreviewData {
    source?: string;
    target?: string;
    toPath?: string;
    affected?: Array<LibraryItem & {
        from?: string;
        to?: string;
        kind?: string;
        changedLinks?: number;
        changed?: boolean;
    }>;
    errors?: string[];
    conflicts?: string[];
    canApply?: boolean;
    [key: string]: unknown;
}
export interface CardItem extends LibraryItem {
    name: string;
    attack?: number;
    health?: number;
    kind?: string;
    rarity?: string;
    labels?: string[];
    cost?: number | string;
    sourcePath?: string;
    cardRevision?: string;
    facePreview?: string;
}
export interface CardData extends CardItem {
    json?: Record<string, unknown>;
    raw?: unknown;
    definition?: unknown;
    content?: string;
}
export interface AssetItem extends LibraryItem {
    name?: string;
    kind?: string;
    mimeType?: string;
    width?: number;
    height?: number;
    durationMs?: number;
    frameCount?: number;
    format?: string;
    tags?: string[];
    versionId?: string;
    currentVersionId?: string;
    sourcePath?: string;
    status?: string;
    metadataRevision?: string;
    metadata?: Record<string, unknown>;
}
export interface AssetData extends AssetItem {
    description?: string;
    currentVersion?: Record<string, unknown>;
}
export interface VersionItem extends LibraryItem {
    version?: string;
    versionId?: string;
    status?: string;
    createdAt?: string;
    mimeType?: string;
    width?: number;
    height?: number;
    frameCount?: number;
}
export interface MediaData {
    path?: string;
    url?: string;
    src?: string;
    data?: string;
    mimeType?: string;
    revision?: string;
    width?: number;
    height?: number;
    durationMs?: number;
    frameCount?: number;
    frameWidth?: number;
    frameHeight?: number;
    columns?: number;
    rows?: number;
    [key: string]: unknown;
}
export interface RecentChangeItem {
    kind: "document" | "card" | "asset" | "version";
    id?: string;
    path?: string;
    name?: string;
    change: "created" | "updated";
    at: string;
}
export interface RecentChangesData {
    items: RecentChangeItem[];
    nextCursor?: string | null;
    total?: number;
}
export declare function asRecentChanges(value: unknown): RecentChangesData;
/** The change stream shows only the domain objects of the current mode. */
export declare function recentChangesForMode(items: RecentChangeItem[], mode: LibraryMode): RecentChangeItem[];
export declare function recentChangeLabel(item: RecentChangeItem): string;
/** Resolve a change entry to a selectable asset; version rows carry the version id. */
export declare function locateAssetForChange(item: RecentChangeItem, assets: AssetItem[]): string | undefined;
export interface StatusData {
    projectId?: string;
    ready?: boolean;
    indexedAt?: string;
    documents?: number;
    cards?: number;
    assets?: number;
    error?: string;
    [key: string]: unknown;
}
/** Normalize a backend list while preserving extra metadata for future fields. */
export declare function asContentList<T extends LibraryItem = LibraryItem>(value: unknown): ContentList<T>;
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
