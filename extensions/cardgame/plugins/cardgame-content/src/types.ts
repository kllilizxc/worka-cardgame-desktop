import type {z} from '@dsh-workbench/runtime';
import type {contentQueries,contentActions,documentLinkSchema,documentItemSchema,documentSchema,cardItemSchema} from './contract';
/**
 * Public contract for the CardGame content backend.
 *
 * The backend deliberately returns plain JSON-shaped values.  This keeps the
 * contract usable from a native host, an iframe client, and Bun based tests
 * without leaking the SQLite implementation into the UI.
 */

export interface ContentProject {
  id: string;
  root: string;
  title?: string;
}

export interface ContentServiceOptions {
  /** Worka owned data directory.  The service creates its SQLite cache here. */
  dataRoot: string;
  projects: ContentProject[];
  /** Primarily useful for tests; defaults to `${dataRoot}/content.sqlite`. */
  dbPath?: string;
  /** Maximum number of bytes included inline by the media query. */
  inlineMediaLimit?: number;
}

export type ContentQueryOp =
  | 'status'
  | 'documents'
  | 'directories'
  | 'document'
  | 'documentMeta'
  | 'backlinks'
  | 'graph'
  | 'movePreview'
  | 'cards'
  | 'card'
  | 'assets'
  | 'asset'
  | 'versions'
  | 'inspection'
  | 'recentChanges'
  | 'storyBuilds'
  | 'storyScenePage'
  | 'gameDeck'
  | 'gameCatalog'
  | 'storyAnalysis'
  | 'balanceOverview'
  | 'media';

export interface ContentQueryBase {
  projectId: string;
  op: ContentQueryOp;
}

export interface ContentListQuery extends ContentQueryBase {
  op:
    | 'documents'
    | 'directories'
    | 'backlinks'
    | 'cards'
    | 'assets'
    | 'versions';
  q?: string;
  directory?: string;
  kind?: string;
  /** Two views over the same resource catalog; applied before counts and pagination. */
  assetScope?: 'art' | 'audio';
  /** Asset format, with or without a leading dot (for example `png`). */
  format?: string;
  mimeType?: string;
  minWidth?: number;
  maxWidth?: number;
  minDurationMs?: number;
  maxDurationMs?: number;
  /** Asset state (`ready` for indexed project assets or `candidate`). */
  status?: string;
  /** Card rarity and labels/tags filters. */
  rarity?: string;
  tags?: string | string[];
  labels?: string | string[];
  cursor?: string;
  limit?: number;
  id?: string;
  path?: string;
  assetId?: string;
}

export interface ContentDetailQuery extends ContentQueryBase {
  op: 'document' | 'documentMeta' | 'card' | 'asset';
  versionId?: string;
  id?: string;
  path?: string;
  assetId?: string;
  /** Refresh only this trusted card collection before binding a formal source revision. */
  freshKind?: string;
}

export interface GraphQuery extends ContentQueryBase {
  op: 'graph';
  id?: string;
  path?: string;
  depth?: number;
  maxNodes?: number;
}

export interface MovePreviewQuery extends ContentQueryBase {
  op: 'movePreview';
  id?: string;
  path?: string;
  toPath: string;
}

export interface MediaQuery extends ContentQueryBase {
  op: 'media';
  id?: string;
  path?: string;
  versionId?: string;
  variant?: 'thumbnail' | 'original' | 'waveform';
  from?: string;
}

export type InspectionKind =
  | 'broken-link'
  | 'scene-dead-end'
  | 'orphan-asset'
  | 'card-missing-art'
  | 'asset-missing-metadata';

export interface InspectionQuery extends ContentQueryBase {
  op: 'inspection';
  kinds?: InspectionKind[];
  cursor?: string;
  limit?: number;
}

export type InspectionFinding=z.output<typeof contentQueries.inspection.output>['findings'][number];

export type InspectionResult=z.output<typeof contentQueries.inspection.output>;

export interface RecentChangesQuery extends ContentQueryBase {
  op: 'recentChanges';
  /** ISO timestamp; only changes after this instant are returned. */
  since?: string;
  cursor?: string;
  limit?: number;
}

export type RecentChangeItem=z.output<typeof contentQueries.recentChanges.output>['items'][number];

export interface StoryBuildsQuery extends ContentQueryBase {
  op: 'storyBuilds';
  cursor?: string;
  limit?: number;
}

export interface StoryScenePageQuery extends ContentQueryBase {
  op: 'storyScenePage';
  id?: string;
  path?: string;
  /** Zero-based dialogue position in this one scene. */
  offset?: number;
  /** 1–50 lines. */
  limit?: number;
  /** Keeps consecutive pages on the same source revision. */
  expectedRevision?: string;
}

export type StoryScenePage=z.output<typeof contentQueries.storyScenePage.output>;

export type StoryDiagnostic=z.output<typeof contentQueries.storyScenePage.output>['diagnostics'][number];

export type StoryBuildItem=z.output<typeof contentQueries.storyBuilds.output>['items'][number];

export type CompileStoryInput=z.output<typeof contentActions.compileStory.method.input>;

export type CompileStoryResult=z.output<typeof contentActions.compileStory.output>;

export type ContentQuery =
  | (ContentQueryBase & { op: 'status' })
  | (ContentQueryBase & { op: 'balanceOverview' })
  | (ContentQueryBase & { op: 'gameDeck'; id: string })
  | (ContentQueryBase & { op: 'gameCatalog'; kind: 'story' | 'deck' | 'encounter'; q?: string; cursor?: string; limit?: number })
  | (ContentQueryBase & { op: 'storyAnalysis'; id: string; nodeId?: string; expectedRevision?: string })
  | ContentListQuery
  | ContentDetailQuery
  | GraphQuery
  | MovePreviewQuery
  | InspectionQuery
  | RecentChangesQuery
  | StoryBuildsQuery
  | StoryScenePageQuery
  | MediaQuery;

export interface Page<T> {
  items: T[];
  next?: string;
  revision: string;
  total?: number;
}

export type ContentStatus=z.output<typeof contentQueries.status.output>;

export interface ContentListItem {
  id: string;
  title: string;
  path: string;
  revision: string;
  type: string;
  [key: string]: unknown;
}

export type DocumentLink=z.output<typeof documentLinkSchema>;

export type ContentDocument=z.output<typeof documentItemSchema> & Partial<Pick<z.output<typeof documentSchema>,'content'>>;

export type ContentDocumentMeta=z.output<typeof contentQueries.documentMeta.output>;

export type BacklinkItem=z.output<typeof contentQueries.backlinks.output>['items'][number];

export type GraphNode=z.output<typeof contentQueries.graph.output>['nodes'][number];

export type GraphEdge=z.output<typeof contentQueries.graph.output>['edges'][number];

export type ContentGraph=z.output<typeof contentQueries.graph.output>;

export type MoveAffectedDocument=z.output<typeof contentQueries.movePreview.output>['affected'][number];

export type MovePreview=z.output<typeof contentQueries.movePreview.output>;

export type CardItem=z.output<typeof cardItemSchema> & {json?:Record<string,unknown>};

export type AssetVersion=Omit<z.output<typeof contentQueries.versions.output>['items'][number],'metadata'> & {metadata?:Record<string,unknown>};

export type AssetItem=Omit<z.output<typeof contentQueries.asset.output>,'metadata'|'versions'> & {metadata?:Record<string,unknown>;versions?:AssetVersion[]};

export interface MediaResponse {
  id: string;
  path: string;
  versionId?: string;
  variant: 'thumbnail' | 'original' | 'waveform';
  mimeType: string;
  size: number;
  revision: string;
  width?: number;
  height?: number;
  durationMs?: number;
  frameCount?: number;
  metadata?: Record<string, unknown>;
  /** The host can turn this bounded path into a capability URL. */
  absolutePath: string;
  /** Present only for small media and only when explicitly requested. */
  data?: string;
}

export type SaveDocumentInput=z.output<typeof contentActions.saveDocument.method.input>;

export type MoveDocumentInput=z.output<typeof contentActions.moveDocument.method.input>;

export interface UpdateCardInput {
  projectId: string;
  id: string;
  card?: Record<string, unknown>;
  patch?: Record<string, unknown>;
  expectedRevision?: string;
}

export interface CandidateInput {
  id?: string;
  name?: string;
  fileName?: string;
  mimeType?: string;
  data?: string;
  base64?: string;
  sourcePath?: string;
  metadata?: Record<string, unknown>;
}

export interface RegisterCandidatesInput {
  projectId: string;
  candidates: CandidateInput[];
  /**
   * When set, each registered candidate is machine-checked immediately and
   * adopted through the regular adoptVersion path when the check passes.
   * Failed candidates stay candidates and carry the report in their metadata.
   */
  autoAdopt?: AutoAdoptOptions;
}

export interface AutoAdoptOptions {
  /** Target asset path; normalized under public/assets/ like adoptVersion. */
  path?: string;
  assetId?: string;
  metadata?: Record<string, unknown>;
}

export interface CandidateInspection {
  passed: boolean;
  reasons: string[];
}

export interface AdoptVersionInput {
  projectId: string;
  candidateId?: string;
  versionId?: string;
  assetId?: string;
  path?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateAssetInput=z.output<typeof contentActions.updateAsset.method.input>;

export type ContentCommandMethod =
  | 'saveDocument'
  | 'moveDocument'
  | 'updateCard'
  | 'savePipelineCard'
  | 'updateAsset'
  | 'registerCandidates'
  | 'adoptVersion'
  | 'compileStory';

export interface ContentInvalidation {
  projectId?: string;
  paths?: string[];
  kinds?: Array<'document' | 'card' | 'asset' | 'directory' | 'status'>;
  reason: 'index' | 'save' | 'move' | 'card' | 'candidate' | 'adopt';
}

export type ContentInvalidationListener = (event: ContentInvalidation) => void;

export interface ContentService {
  query(input: ContentQuery): Promise<unknown>;
  command(method: ContentCommandMethod, input: unknown): Promise<unknown>;
  subscribe(listener: ContentInvalidationListener): () => void;
  resolveMedia(input: MediaQuery): Promise<MediaResponse>;
  close(): Promise<void>;
}

export class ContentServiceError extends Error {
  readonly code:
    | 'CONTENT_CONFLICT'
    | 'PATH_ESCAPE'
    | 'INVALID_INPUT'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'SERVICE_CLOSED';
  readonly details?: unknown;

  constructor(
    code: ContentServiceError['code'],
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ContentServiceError';
    this.code = code;
    this.details = details;
  }
}
