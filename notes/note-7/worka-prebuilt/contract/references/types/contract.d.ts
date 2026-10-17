/** Public implementation-free wire contract. The normal backend build copies
 * these exact bytes into independently editable content notes. */
import { z } from '@realiz3r/worka/extension-contracts';
export declare const jsonObject: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
export declare const libraryItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const pageSchema: <S extends z.ZodType>(item: S) => z.ZodObject<{
    items: z.ZodArray<S>;
    next: z.ZodOptional<z.ZodString>;
    revision: z.ZodString;
    total: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const documentLinkSchema: z.ZodObject<{
    targetPath: z.ZodString;
    targetKind: z.ZodEnum<{
        asset: "asset";
        card: "card";
        document: "document";
        external: "external";
        unknown: "unknown";
    }>;
    targetId: z.ZodOptional<z.ZodString>;
    anchor: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    line: z.ZodNumber;
    rawTarget: z.ZodString;
}, z.core.$strip>;
export declare const documentItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"document">;
    size: z.ZodNumber;
    links: z.ZodArray<z.ZodObject<{
        targetPath: z.ZodString;
        targetKind: z.ZodEnum<{
            asset: "asset";
            card: "card";
            document: "document";
            external: "external";
            unknown: "unknown";
        }>;
        targetId: z.ZodOptional<z.ZodString>;
        anchor: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        line: z.ZodNumber;
        rawTarget: z.ZodString;
    }, z.core.$strip>>;
    updatedAt: z.ZodOptional<z.ZodString>;
    snippet: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const documentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"document">;
    size: z.ZodNumber;
    links: z.ZodArray<z.ZodObject<{
        targetPath: z.ZodString;
        targetKind: z.ZodEnum<{
            asset: "asset";
            card: "card";
            document: "document";
            external: "external";
            unknown: "unknown";
        }>;
        targetId: z.ZodOptional<z.ZodString>;
        anchor: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        line: z.ZodNumber;
        rawTarget: z.ZodString;
    }, z.core.$strip>>;
    updatedAt: z.ZodOptional<z.ZodString>;
    snippet: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
}, z.core.$strip>;
export declare const documentMetaSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
    title: z.ZodString;
    revision: z.ZodString;
    size: z.ZodNumber;
    isScene: z.ZodBoolean;
}, z.core.$strip>;
export declare const directorySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"directory">;
    path: z.ZodString;
    hasChildren: z.ZodOptional<z.ZodBoolean>;
    parentPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const backlinkSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    sourceId: z.ZodString;
    sourcePath: z.ZodString;
    targetPath: z.ZodString;
    line: z.ZodNumber;
    snippet: z.ZodOptional<z.ZodString>;
    anchor: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const graphSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodEnum<{
            asset: "asset";
            document: "document";
        }>;
        depth: z.ZodNumber;
    }, z.core.$strip>>;
    edges: z.ZodArray<z.ZodObject<{
        sourceId: z.ZodString;
        targetId: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodString;
        targetPath: z.ZodString;
        kind: z.ZodEnum<{
            asset: "asset";
            card: "card";
            document: "document";
            external: "external";
            unknown: "unknown";
        }>;
        anchor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    truncated: z.ZodBoolean;
}, z.core.$strip>;
export declare const movePreviewSchema: z.ZodObject<{
    source: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        type: z.ZodLiteral<"document">;
        size: z.ZodNumber;
        links: z.ZodArray<z.ZodObject<{
            targetPath: z.ZodString;
            targetKind: z.ZodEnum<{
                asset: "asset";
                card: "card";
                document: "document";
                external: "external";
                unknown: "unknown";
            }>;
            targetId: z.ZodOptional<z.ZodString>;
            anchor: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            line: z.ZodNumber;
            rawTarget: z.ZodString;
        }, z.core.$strip>>;
        updatedAt: z.ZodOptional<z.ZodString>;
        snippet: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    toPath: z.ZodString;
    affected: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        changed: z.ZodBoolean;
        changedLinks: z.ZodNumber;
    }, z.core.$strip>>;
    conflicts: z.ZodArray<z.ZodString>;
    canApply: z.ZodBoolean;
}, z.core.$strip>;
export declare const cardItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"card">;
    name: z.ZodString;
    kind: z.ZodString;
    attack: z.ZodOptional<z.ZodNumber>;
    health: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    rarity: z.ZodOptional<z.ZodString>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    facePreview: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const cardSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"card">;
    name: z.ZodString;
    kind: z.ZodString;
    attack: z.ZodOptional<z.ZodNumber>;
    health: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    rarity: z.ZodOptional<z.ZodString>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    facePreview: z.ZodOptional<z.ZodString>;
    json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
}, z.core.$strip>;
export declare const assetVersionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    assetId: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    source: z.ZodEnum<{
        adopted: "adopted";
        candidate: "candidate";
        project: "project";
    }>;
    candidateId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    createdAt: z.ZodString;
    adopted: z.ZodBoolean;
}, z.core.$strip>;
export declare const assetSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    path: z.ZodString;
    revision: z.ZodString;
    type: z.ZodLiteral<"asset">;
    kind: z.ZodEnum<{
        audio: "audio";
        image: "image";
        other: "other";
        spritesheet: "spritesheet";
    }>;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadataRevision: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentVersionId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        assetId: z.ZodString;
        path: z.ZodString;
        revision: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        source: z.ZodEnum<{
            adopted: "adopted";
            candidate: "candidate";
            project: "project";
        }>;
        candidateId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        createdAt: z.ZodString;
        adopted: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const mediaSchema: z.ZodObject<{
    id: z.ZodString;
    versionId: z.ZodOptional<z.ZodString>;
    variant: z.ZodEnum<{
        original: "original";
        thumbnail: "thumbnail";
        waveform: "waveform";
    }>;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    revision: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    absolutePath: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
}, z.core.$strip>;
export declare const statusSchema: z.ZodObject<{
    projectId: z.ZodString;
    phase: z.ZodEnum<{
        closed: "closed";
        error: "error";
        indexing: "indexing";
        pending: "pending";
        ready: "ready";
    }>;
    indexedAt: z.ZodOptional<z.ZodString>;
    documents: z.ZodNumber;
    directories: z.ZodNumber;
    cards: z.ZodNumber;
    assets: z.ZodNumber;
    errors: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const recentChangeSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        asset: "asset";
        card: "card";
        document: "document";
        version: "version";
    }>;
    id: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    change: z.ZodEnum<{
        created: "created";
        updated: "updated";
    }>;
    at: z.ZodString;
}, z.core.$strip>;
export declare const contentQueries: {
    readonly status: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            projectId: z.ZodString;
            phase: z.ZodEnum<{
                closed: "closed";
                error: "error";
                indexing: "indexing";
                pending: "pending";
                ready: "ready";
            }>;
            indexedAt: z.ZodOptional<z.ZodString>;
            documents: z.ZodNumber;
            directories: z.ZodNumber;
            cards: z.ZodNumber;
            assets: z.ZodNumber;
            errors: z.ZodArray<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"status">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                projectId: z.ZodString;
                phase: z.ZodEnum<{
                    closed: "closed";
                    error: "error";
                    indexing: "indexing";
                    pending: "pending";
                    ready: "ready";
                }>;
                indexedAt: z.ZodOptional<z.ZodString>;
                documents: z.ZodNumber;
                directories: z.ZodNumber;
                cards: z.ZodNumber;
                assets: z.ZodNumber;
                errors: z.ZodArray<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly documents: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"document">;
                size: z.ZodNumber;
                links: z.ZodArray<z.ZodObject<{
                    targetPath: z.ZodString;
                    targetKind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    targetId: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                    rawTarget: z.ZodString;
                }, z.core.$strip>>;
                updatedAt: z.ZodOptional<z.ZodString>;
                snippet: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"documents">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"document">;
                    size: z.ZodNumber;
                    links: z.ZodArray<z.ZodObject<{
                        targetPath: z.ZodString;
                        targetKind: z.ZodEnum<{
                            asset: "asset";
                            card: "card";
                            document: "document";
                            external: "external";
                            unknown: "unknown";
                        }>;
                        targetId: z.ZodOptional<z.ZodString>;
                        anchor: z.ZodOptional<z.ZodString>;
                        label: z.ZodOptional<z.ZodString>;
                        line: z.ZodNumber;
                        rawTarget: z.ZodString;
                    }, z.core.$strip>>;
                    updatedAt: z.ZodOptional<z.ZodString>;
                    snippet: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly directories: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"directory">;
                path: z.ZodString;
                hasChildren: z.ZodOptional<z.ZodBoolean>;
                parentPath: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"directories">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"directory">;
                    path: z.ZodString;
                    hasChildren: z.ZodOptional<z.ZodBoolean>;
                    parentPath: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly document: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"document">;
            size: z.ZodNumber;
            links: z.ZodArray<z.ZodObject<{
                targetPath: z.ZodString;
                targetKind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    external: "external";
                    unknown: "unknown";
                }>;
                targetId: z.ZodOptional<z.ZodString>;
                anchor: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                line: z.ZodNumber;
                rawTarget: z.ZodString;
            }, z.core.$strip>>;
            updatedAt: z.ZodOptional<z.ZodString>;
            snippet: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"document">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"document">;
                size: z.ZodNumber;
                links: z.ZodArray<z.ZodObject<{
                    targetPath: z.ZodString;
                    targetKind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    targetId: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                    rawTarget: z.ZodString;
                }, z.core.$strip>>;
                updatedAt: z.ZodOptional<z.ZodString>;
                snippet: z.ZodOptional<z.ZodString>;
                content: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly documentMeta: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodString;
            revision: z.ZodString;
            size: z.ZodNumber;
            isScene: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"documentMeta">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                title: z.ZodString;
                revision: z.ZodString;
                size: z.ZodNumber;
                isScene: z.ZodBoolean;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly backlinks: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                sourceId: z.ZodString;
                sourcePath: z.ZodString;
                targetPath: z.ZodString;
                line: z.ZodNumber;
                snippet: z.ZodOptional<z.ZodString>;
                anchor: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"backlinks">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    sourceId: z.ZodString;
                    sourcePath: z.ZodString;
                    targetPath: z.ZodString;
                    line: z.ZodNumber;
                    snippet: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly graph: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
            depth: z.ZodOptional<z.ZodNumber>;
            maxNodes: z.ZodOptional<z.ZodNumber>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            nodes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodEnum<{
                    asset: "asset";
                    document: "document";
                }>;
                depth: z.ZodNumber;
            }, z.core.$strip>>;
            edges: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                targetId: z.ZodOptional<z.ZodString>;
                sourcePath: z.ZodString;
                targetPath: z.ZodString;
                kind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    external: "external";
                    unknown: "unknown";
                }>;
                anchor: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            truncated: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"graph">;
                depth: z.ZodOptional<z.ZodNumber>;
                maxNodes: z.ZodOptional<z.ZodNumber>;
                limit: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                nodes: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodEnum<{
                        asset: "asset";
                        document: "document";
                    }>;
                    depth: z.ZodNumber;
                }, z.core.$strip>>;
                edges: z.ZodArray<z.ZodObject<{
                    sourceId: z.ZodString;
                    targetId: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodString;
                    targetPath: z.ZodString;
                    kind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    anchor: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                truncated: z.ZodBoolean;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly movePreview: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
            toPath: z.ZodOptional<z.ZodString>;
            targetPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            source: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"document">;
                size: z.ZodNumber;
                links: z.ZodArray<z.ZodObject<{
                    targetPath: z.ZodString;
                    targetKind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    targetId: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                    rawTarget: z.ZodString;
                }, z.core.$strip>>;
                updatedAt: z.ZodOptional<z.ZodString>;
                snippet: z.ZodOptional<z.ZodString>;
                content: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            toPath: z.ZodString;
            affected: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                changed: z.ZodBoolean;
                changedLinks: z.ZodNumber;
            }, z.core.$strip>>;
            conflicts: z.ZodArray<z.ZodString>;
            canApply: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"movePreview">;
                toPath: z.ZodOptional<z.ZodString>;
                targetPath: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                source: z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"document">;
                    size: z.ZodNumber;
                    links: z.ZodArray<z.ZodObject<{
                        targetPath: z.ZodString;
                        targetKind: z.ZodEnum<{
                            asset: "asset";
                            card: "card";
                            document: "document";
                            external: "external";
                            unknown: "unknown";
                        }>;
                        targetId: z.ZodOptional<z.ZodString>;
                        anchor: z.ZodOptional<z.ZodString>;
                        label: z.ZodOptional<z.ZodString>;
                        line: z.ZodNumber;
                        rawTarget: z.ZodString;
                    }, z.core.$strip>>;
                    updatedAt: z.ZodOptional<z.ZodString>;
                    snippet: z.ZodOptional<z.ZodString>;
                    content: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
                toPath: z.ZodString;
                affected: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    changed: z.ZodBoolean;
                    changedLinks: z.ZodNumber;
                }, z.core.$strip>>;
                conflicts: z.ZodArray<z.ZodString>;
                canApply: z.ZodBoolean;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly cards: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"card">;
                name: z.ZodString;
                kind: z.ZodString;
                attack: z.ZodOptional<z.ZodNumber>;
                health: z.ZodOptional<z.ZodNumber>;
                description: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                facePreview: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"cards">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"card">;
                    name: z.ZodString;
                    kind: z.ZodString;
                    attack: z.ZodOptional<z.ZodNumber>;
                    health: z.ZodOptional<z.ZodNumber>;
                    description: z.ZodOptional<z.ZodString>;
                    rarity: z.ZodOptional<z.ZodString>;
                    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                    facePreview: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly card: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"card">;
            name: z.ZodString;
            kind: z.ZodString;
            attack: z.ZodOptional<z.ZodNumber>;
            health: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            facePreview: z.ZodOptional<z.ZodString>;
            json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"card">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"card">;
                name: z.ZodString;
                kind: z.ZodString;
                attack: z.ZodOptional<z.ZodNumber>;
                health: z.ZodOptional<z.ZodNumber>;
                description: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                facePreview: z.ZodOptional<z.ZodString>;
                json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly assets: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"asset">;
                kind: z.ZodEnum<{
                    audio: "audio";
                    image: "image";
                    other: "other";
                    spritesheet: "spritesheet";
                }>;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                metadataRevision: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                status: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                currentVersionId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    source: z.ZodEnum<{
                        adopted: "adopted";
                        candidate: "candidate";
                        project: "project";
                    }>;
                    candidateId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    createdAt: z.ZodString;
                    adopted: z.ZodBoolean;
                }, z.core.$strip>>>;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"assets">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"asset">;
                    kind: z.ZodEnum<{
                        audio: "audio";
                        image: "image";
                        other: "other";
                        spritesheet: "spritesheet";
                    }>;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    name: z.ZodOptional<z.ZodString>;
                    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    metadataRevision: z.ZodOptional<z.ZodString>;
                    format: z.ZodOptional<z.ZodString>;
                    status: z.ZodOptional<z.ZodString>;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    currentVersionId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        title: z.ZodOptional<z.ZodString>;
                        name: z.ZodOptional<z.ZodString>;
                        assetId: z.ZodString;
                        path: z.ZodString;
                        revision: z.ZodString;
                        mimeType: z.ZodString;
                        size: z.ZodNumber;
                        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        source: z.ZodEnum<{
                            adopted: "adopted";
                            candidate: "candidate";
                            project: "project";
                        }>;
                        candidateId: z.ZodOptional<z.ZodString>;
                        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                        createdAt: z.ZodString;
                        adopted: z.ZodBoolean;
                    }, z.core.$strip>>>;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly asset: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"asset">;
            kind: z.ZodEnum<{
                audio: "audio";
                image: "image";
                other: "other";
                spritesheet: "spritesheet";
            }>;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadataRevision: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            currentVersionId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                assetId: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                source: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    project: "project";
                }>;
                candidateId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                createdAt: z.ZodString;
                adopted: z.ZodBoolean;
            }, z.core.$strip>>>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"asset">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"asset">;
                kind: z.ZodEnum<{
                    audio: "audio";
                    image: "image";
                    other: "other";
                    spritesheet: "spritesheet";
                }>;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                metadataRevision: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                status: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                currentVersionId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    source: z.ZodEnum<{
                        adopted: "adopted";
                        candidate: "candidate";
                        project: "project";
                    }>;
                    candidateId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    createdAt: z.ZodString;
                    adopted: z.ZodBoolean;
                }, z.core.$strip>>>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly versions: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            directory: z.ZodOptional<z.ZodString>;
            parentPath: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            assetScope: z.ZodOptional<z.ZodEnum<{
                art: "art";
                audio: "audio";
            }>>;
            format: z.ZodOptional<z.ZodString>;
            mimeType: z.ZodOptional<z.ZodString>;
            minWidth: z.ZodOptional<z.ZodNumber>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            minDurationMs: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                assetId: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                source: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    project: "project";
                }>;
                candidateId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                createdAt: z.ZodString;
                adopted: z.ZodBoolean;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                directory: z.ZodOptional<z.ZodString>;
                parentPath: z.ZodOptional<z.ZodString>;
                kind: z.ZodOptional<z.ZodString>;
                assetScope: z.ZodOptional<z.ZodEnum<{
                    art: "art";
                    audio: "audio";
                }>>;
                format: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                minWidth: z.ZodOptional<z.ZodNumber>;
                maxWidth: z.ZodOptional<z.ZodNumber>;
                minDurationMs: z.ZodOptional<z.ZodNumber>;
                maxDurationMs: z.ZodOptional<z.ZodNumber>;
                status: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                labels: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"versions">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    source: z.ZodEnum<{
                        adopted: "adopted";
                        candidate: "candidate";
                        project: "project";
                    }>;
                    candidateId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    createdAt: z.ZodString;
                    adopted: z.ZodBoolean;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly media: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodEnum<{
                original: "original";
                thumbnail: "thumbnail";
                waveform: "waveform";
            }>>;
            from: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            versionId: z.ZodOptional<z.ZodString>;
            variant: z.ZodEnum<{
                original: "original";
                thumbnail: "thumbnail";
                waveform: "waveform";
            }>;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            revision: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            data: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            absolutePath: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"media">;
                versionId: z.ZodOptional<z.ZodString>;
                variant: z.ZodOptional<z.ZodEnum<{
                    original: "original";
                    thumbnail: "thumbnail";
                    waveform: "waveform";
                }>>;
                from: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                versionId: z.ZodOptional<z.ZodString>;
                variant: z.ZodEnum<{
                    original: "original";
                    thumbnail: "thumbnail";
                    waveform: "waveform";
                }>;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                revision: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                data: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                absolutePath: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly inspection: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            kinds: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                "asset-missing-metadata": "asset-missing-metadata";
                "broken-link": "broken-link";
                "card-missing-art": "card-missing-art";
                "orphan-asset": "orphan-asset";
                "scene-dead-end": "scene-dead-end";
            }>>>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            findings: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                severity: z.ZodEnum<{
                    high: "high";
                    info: "info";
                    warning: "warning";
                }>;
                ref: z.ZodObject<{
                    type: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                    }>;
                    id: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
                detail: z.ZodString;
            }, z.core.$strip>>;
            counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            nextCursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"inspection">;
                kinds: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    "asset-missing-metadata": "asset-missing-metadata";
                    "broken-link": "broken-link";
                    "card-missing-art": "card-missing-art";
                    "orphan-asset": "orphan-asset";
                    "scene-dead-end": "scene-dead-end";
                }>>>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                findings: z.ZodArray<z.ZodObject<{
                    kind: z.ZodString;
                    severity: z.ZodEnum<{
                        high: "high";
                        info: "info";
                        warning: "warning";
                    }>;
                    ref: z.ZodObject<{
                        type: z.ZodEnum<{
                            asset: "asset";
                            card: "card";
                            document: "document";
                        }>;
                        id: z.ZodOptional<z.ZodString>;
                        path: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                    detail: z.ZodString;
                }, z.core.$strip>>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
                nextCursor: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly recentChanges: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            since: z.ZodOptional<z.ZodString>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    version: "version";
                }>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                change: z.ZodEnum<{
                    created: "created";
                    updated: "updated";
                }>;
                at: z.ZodString;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"recentChanges">;
                since: z.ZodOptional<z.ZodString>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    kind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        version: "version";
                    }>;
                    id: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    change: z.ZodEnum<{
                        created: "created";
                        updated: "updated";
                    }>;
                    at: z.ZodString;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly storyBuilds: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                storyId: z.ZodString;
                entryPath: z.ZodString;
                outputPath: z.ZodString;
                sourcePaths: z.ZodArray<z.ZodString>;
                errorCount: z.ZodNumber;
                warningCount: z.ZodNumber;
                nodeCount: z.ZodNumber;
                choiceCount: z.ZodNumber;
                builtAt: z.ZodString;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"storyBuilds">;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    storyId: z.ZodString;
                    entryPath: z.ZodString;
                    outputPath: z.ZodString;
                    sourcePaths: z.ZodArray<z.ZodString>;
                    errorCount: z.ZodNumber;
                    warningCount: z.ZodNumber;
                    nodeCount: z.ZodNumber;
                    choiceCount: z.ZodNumber;
                    builtAt: z.ZodString;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly storyScenePage: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            freshKind: z.ZodOptional<z.ZodString>;
            offset: z.ZodOptional<z.ZodNumber>;
            limit: z.ZodOptional<z.ZodNumber>;
            expectedRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            nodeId: z.ZodString;
            title: z.ZodString;
            chapter: z.ZodString;
            summary: z.ZodString;
            dialogueCount: z.ZodNumber;
            offset: z.ZodNumber;
            nextOffset: z.ZodOptional<z.ZodNumber>;
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                speakerId: z.ZodString;
                speakerName: z.ZodString;
                text: z.ZodString;
                emotion: z.ZodOptional<z.ZodString>;
                line: z.ZodNumber;
            }, z.core.$strip>>;
            diagnostics: z.ZodArray<z.ZodObject<{
                severity: z.ZodEnum<{
                    error: "error";
                    warning: "warning";
                }>;
                path: z.ZodString;
                line: z.ZodOptional<z.ZodNumber>;
                detail: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                freshKind: z.ZodOptional<z.ZodString>;
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"storyScenePage">;
                offset: z.ZodOptional<z.ZodNumber>;
                limit: z.ZodOptional<z.ZodNumber>;
                expectedRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                nodeId: z.ZodString;
                title: z.ZodString;
                chapter: z.ZodString;
                summary: z.ZodString;
                dialogueCount: z.ZodNumber;
                offset: z.ZodNumber;
                nextOffset: z.ZodOptional<z.ZodNumber>;
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    speakerId: z.ZodString;
                    speakerName: z.ZodString;
                    text: z.ZodString;
                    emotion: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                }, z.core.$strip>>;
                diagnostics: z.ZodArray<z.ZodObject<{
                    severity: z.ZodEnum<{
                        error: "error";
                        warning: "warning";
                    }>;
                    path: z.ZodString;
                    line: z.ZodOptional<z.ZodNumber>;
                    detail: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly pinnedReferenceTarget: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            kind: z.ZodString;
            id: z.ZodString;
            anchor: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            key: z.ZodString;
            projectId: z.ZodString;
            kind: z.ZodString;
            id: z.ZodString;
            revision: z.ZodString;
            title: z.ZodString;
            anchor: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            freshness: z.ZodOptional<z.ZodEnum<{
                current: "current";
                stale: "stale";
                unavailable: "unavailable";
            }>>;
            currentRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"pinnedReferenceTarget">;
                kind: z.ZodString;
                id: z.ZodString;
                anchor: z.ZodOptional<z.ZodString>;
                context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                key: z.ZodString;
                projectId: z.ZodString;
                kind: z.ZodString;
                id: z.ZodString;
                revision: z.ZodString;
                title: z.ZodString;
                anchor: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                freshness: z.ZodOptional<z.ZodEnum<{
                    current: "current";
                    stale: "stale";
                    unavailable: "unavailable";
                }>>;
                currentRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly pinnedReferences: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                projectId: z.ZodString;
                kind: z.ZodString;
                id: z.ZodString;
                revision: z.ZodString;
                title: z.ZodString;
                anchor: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                freshness: z.ZodOptional<z.ZodEnum<{
                    current: "current";
                    stale: "stale";
                    unavailable: "unavailable";
                }>>;
                currentRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            limit: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"pinnedReferences">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    key: z.ZodString;
                    projectId: z.ZodString;
                    kind: z.ZodString;
                    id: z.ZodString;
                    revision: z.ZodString;
                    title: z.ZodString;
                    anchor: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    freshness: z.ZodOptional<z.ZodEnum<{
                        current: "current";
                        stale: "stale";
                        unavailable: "unavailable";
                    }>>;
                    currentRevision: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                limit: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly battleExperiments: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            status: z.ZodString;
            experiment: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                snapshotId: z.ZodString;
                contentRevision: z.ZodString;
                sourceRevision: z.ZodString;
                runtimeRevision: z.ZodOptional<z.ZodString>;
                source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                    kind: z.ZodLiteral<"registered-project">;
                }, z.core.$strip>, z.ZodObject<{
                    productionId: z.ZodString;
                    candidateId: z.ZodString;
                    candidateHash: z.ZodString;
                    kind: z.ZodLiteral<"candidate">;
                    commit: z.ZodString;
                }, z.core.$strip>]>>;
                createdAt: z.ZodString;
                error: z.ZodOptional<z.ZodString>;
                url: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            reports: z.ZodArray<z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
                source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                    kind: z.ZodLiteral<"registered-project">;
                }, z.core.$strip>, z.ZodObject<{
                    productionId: z.ZodString;
                    candidateId: z.ZodString;
                    candidateHash: z.ZodString;
                    kind: z.ZodLiteral<"candidate">;
                    commit: z.ZodString;
                }, z.core.$strip>]>>;
                report: z.ZodObject<{
                    schemaVersion: z.ZodLiteral<1>;
                    createdAt: z.ZodString;
                    settings: z.ZodObject<{
                        deckId: z.ZodString;
                        encounterId: z.ZodString;
                        policyVersion: z.ZodString;
                        seeds: z.ZodArray<z.ZodNumber>;
                        turnLimit: z.ZodNumber;
                        actionLimit: z.ZodNumber;
                        opening: z.ZodLiteral<"player-first">;
                    }, z.core.$strip>;
                    settingsHash: z.ZodString;
                    contentRevision: z.ZodString;
                    runtimeRevision: z.ZodString;
                    adapterVersion: z.ZodString;
                    deckCardIds: z.ZodArray<z.ZodString>;
                    trials: z.ZodArray<z.ZodObject<{
                        seed: z.ZodNumber;
                        result: z.ZodOptional<z.ZodObject<{
                            outcome: z.ZodEnum<{
                                defeat: "defeat";
                                draw: "draw";
                                incomplete: "incomplete";
                                victory: "victory";
                            }>;
                            turns: z.ZodNumber;
                            actions: z.ZodNumber;
                            reason: z.ZodOptional<z.ZodString>;
                            playedCardIds: z.ZodArray<z.ZodString>;
                            finalStateHash: z.ZodString;
                        }, z.core.$strip>>;
                        error: z.ZodOptional<z.ZodString>;
                        cancelled: z.ZodOptional<z.ZodLiteral<true>>;
                    }, z.core.$strip>>;
                    summary: z.ZodObject<{
                        requested: z.ZodNumber;
                        executed: z.ZodNumber;
                        valid: z.ZodNumber;
                        decisive: z.ZodNumber;
                        victories: z.ZodNumber;
                        defeats: z.ZodNumber;
                        draws: z.ZodNumber;
                        incomplete: z.ZodNumber;
                        failed: z.ZodNumber;
                        cancelled: z.ZodBoolean;
                        victoryRate: z.ZodNullable<z.ZodNumber>;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                projectCheck: z.ZodObject<{
                    status: z.ZodString;
                    checkedAt: z.ZodString;
                    scope: z.ZodString;
                    error: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
            reportScope: z.ZodLiteral<"historical-snapshot">;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"battleExperiments">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                status: z.ZodString;
                experiment: z.ZodOptional<z.ZodObject<{
                    id: z.ZodString;
                    snapshotId: z.ZodString;
                    contentRevision: z.ZodString;
                    sourceRevision: z.ZodString;
                    runtimeRevision: z.ZodOptional<z.ZodString>;
                    source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                        kind: z.ZodLiteral<"registered-project">;
                    }, z.core.$strip>, z.ZodObject<{
                        productionId: z.ZodString;
                        candidateId: z.ZodString;
                        candidateHash: z.ZodString;
                        kind: z.ZodLiteral<"candidate">;
                        commit: z.ZodString;
                    }, z.core.$strip>]>>;
                    createdAt: z.ZodString;
                    error: z.ZodOptional<z.ZodString>;
                    url: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                reports: z.ZodArray<z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                    source: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                        kind: z.ZodLiteral<"registered-project">;
                    }, z.core.$strip>, z.ZodObject<{
                        productionId: z.ZodString;
                        candidateId: z.ZodString;
                        candidateHash: z.ZodString;
                        kind: z.ZodLiteral<"candidate">;
                        commit: z.ZodString;
                    }, z.core.$strip>]>>;
                    report: z.ZodObject<{
                        schemaVersion: z.ZodLiteral<1>;
                        createdAt: z.ZodString;
                        settings: z.ZodObject<{
                            deckId: z.ZodString;
                            encounterId: z.ZodString;
                            policyVersion: z.ZodString;
                            seeds: z.ZodArray<z.ZodNumber>;
                            turnLimit: z.ZodNumber;
                            actionLimit: z.ZodNumber;
                            opening: z.ZodLiteral<"player-first">;
                        }, z.core.$strip>;
                        settingsHash: z.ZodString;
                        contentRevision: z.ZodString;
                        runtimeRevision: z.ZodString;
                        adapterVersion: z.ZodString;
                        deckCardIds: z.ZodArray<z.ZodString>;
                        trials: z.ZodArray<z.ZodObject<{
                            seed: z.ZodNumber;
                            result: z.ZodOptional<z.ZodObject<{
                                outcome: z.ZodEnum<{
                                    defeat: "defeat";
                                    draw: "draw";
                                    incomplete: "incomplete";
                                    victory: "victory";
                                }>;
                                turns: z.ZodNumber;
                                actions: z.ZodNumber;
                                reason: z.ZodOptional<z.ZodString>;
                                playedCardIds: z.ZodArray<z.ZodString>;
                                finalStateHash: z.ZodString;
                            }, z.core.$strip>>;
                            error: z.ZodOptional<z.ZodString>;
                            cancelled: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strip>>;
                        summary: z.ZodObject<{
                            requested: z.ZodNumber;
                            executed: z.ZodNumber;
                            valid: z.ZodNumber;
                            decisive: z.ZodNumber;
                            victories: z.ZodNumber;
                            defeats: z.ZodNumber;
                            draws: z.ZodNumber;
                            incomplete: z.ZodNumber;
                            failed: z.ZodNumber;
                            cancelled: z.ZodBoolean;
                            victoryRate: z.ZodNullable<z.ZodNumber>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                    projectCheck: z.ZodObject<{
                        status: z.ZodString;
                        checkedAt: z.ZodString;
                        scope: z.ZodString;
                        error: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                }, z.core.$strip>>;
                reportScope: z.ZodLiteral<"historical-snapshot">;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly battleSources: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                productionId: z.ZodString;
                candidateId: z.ZodString;
                candidateHash: z.ZodString;
                commit: z.ZodString;
                kind: z.ZodString;
                targetId: z.ZodString;
                status: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"battleSources">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    productionId: z.ZodString;
                    candidateId: z.ZodString;
                    candidateHash: z.ZodString;
                    commit: z.ZodString;
                    kind: z.ZodString;
                    targetId: z.ZodString;
                    status: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly battleComparison: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            before: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            after: z.ZodObject<{
                experimentId: z.ZodString;
                reportId: z.ZodString;
            }, z.core.$strip>;
            settings: z.ZodObject<{
                deckId: z.ZodString;
                encounterId: z.ZodString;
                policyVersion: z.ZodString;
                seeds: z.ZodArray<z.ZodNumber>;
                turnLimit: z.ZodNumber;
                actionLimit: z.ZodNumber;
                opening: z.ZodLiteral<"player-first">;
            }, z.core.$strip>;
            pairs: z.ZodArray<z.ZodObject<{
                seed: z.ZodNumber;
                before: z.ZodEnum<{
                    defeat: "defeat";
                    draw: "draw";
                    incomplete: "incomplete";
                    victory: "victory";
                }>;
                after: z.ZodEnum<{
                    defeat: "defeat";
                    draw: "draw";
                    incomplete: "incomplete";
                    victory: "victory";
                }>;
            }, z.core.$strip>>;
            excludedSeeds: z.ZodArray<z.ZodNumber>;
            pairedCount: z.ZodNumber;
            beforeVictoryRate: z.ZodNullable<z.ZodNumber>;
            afterVictoryRate: z.ZodNullable<z.ZodNumber>;
            beforeVersion: z.ZodObject<{
                content: z.ZodString;
                runtime: z.ZodString;
            }, z.core.$strip>;
            afterVersion: z.ZodObject<{
                content: z.ZodString;
                runtime: z.ZodString;
            }, z.core.$strip>;
            interpretation: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"battleComparison">;
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                before: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                after: z.ZodObject<{
                    experimentId: z.ZodString;
                    reportId: z.ZodString;
                }, z.core.$strip>;
                settings: z.ZodObject<{
                    deckId: z.ZodString;
                    encounterId: z.ZodString;
                    policyVersion: z.ZodString;
                    seeds: z.ZodArray<z.ZodNumber>;
                    turnLimit: z.ZodNumber;
                    actionLimit: z.ZodNumber;
                    opening: z.ZodLiteral<"player-first">;
                }, z.core.$strip>;
                pairs: z.ZodArray<z.ZodObject<{
                    seed: z.ZodNumber;
                    before: z.ZodEnum<{
                        defeat: "defeat";
                        draw: "draw";
                        incomplete: "incomplete";
                        victory: "victory";
                    }>;
                    after: z.ZodEnum<{
                        defeat: "defeat";
                        draw: "draw";
                        incomplete: "incomplete";
                        victory: "victory";
                    }>;
                }, z.core.$strip>>;
                excludedSeeds: z.ZodArray<z.ZodNumber>;
                pairedCount: z.ZodNumber;
                beforeVictoryRate: z.ZodNullable<z.ZodNumber>;
                afterVictoryRate: z.ZodNullable<z.ZodNumber>;
                beforeVersion: z.ZodObject<{
                    content: z.ZodString;
                    runtime: z.ZodString;
                }, z.core.$strip>;
                afterVersion: z.ZodObject<{
                    content: z.ZodString;
                    runtime: z.ZodString;
                }, z.core.$strip>;
                interpretation: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly storyExecutionReport: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            status: z.ZodEnum<{
                failed: "failed";
                idle: "idle";
                interrupted: "interrupted";
                running: "running";
                succeeded: "succeeded";
            }>;
            startedAt: z.ZodOptional<z.ZodString>;
            finishedAt: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
            report: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                storyRevision: z.ZodString;
                runtimeRevision: z.ZodString;
                createdAt: z.ZodString;
                exploredStates: z.ZodNumber;
                totalNodes: z.ZodNumber;
                reachedNodeIds: z.ZodArray<z.ZodString>;
                unvisitedNodeIds: z.ZodArray<z.ZodString>;
                stateLimit: z.ZodNumber;
                depthLimit: z.ZodNumber;
                bounded: z.ZodBoolean;
                depthCutoffs: z.ZodNumber;
                stateCutoffs: z.ZodNumber;
                externalStops: z.ZodNumber;
                errors: z.ZodNumber;
                witnesses: z.ZodArray<z.ZodObject<{
                    kind: z.ZodString;
                    nodeId: z.ZodString;
                    path: z.ZodArray<z.ZodString>;
                    detail: z.ZodOptional<z.ZodString>;
                    state: z.ZodJSONSchema;
                }, z.core.$strip>>;
                blockedExamples: z.ZodArray<z.ZodObject<{
                    choiceId: z.ZodString;
                    nodeId: z.ZodString;
                    reason: z.ZodString;
                    path: z.ZodArray<z.ZodString>;
                }, z.core.$strip>>;
                limits: z.ZodArray<z.ZodString>;
                initialState: z.ZodJSONSchema;
            }, z.core.$strip>>;
            currentStoryRevision: z.ZodOptional<z.ZodString>;
            contentMatches: z.ZodOptional<z.ZodBoolean>;
            runtimeFreshness: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"storyExecutionReport">;
                id: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                status: z.ZodEnum<{
                    failed: "failed";
                    idle: "idle";
                    interrupted: "interrupted";
                    running: "running";
                    succeeded: "succeeded";
                }>;
                startedAt: z.ZodOptional<z.ZodString>;
                finishedAt: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                report: z.ZodOptional<z.ZodObject<{
                    storyId: z.ZodString;
                    storyRevision: z.ZodString;
                    runtimeRevision: z.ZodString;
                    createdAt: z.ZodString;
                    exploredStates: z.ZodNumber;
                    totalNodes: z.ZodNumber;
                    reachedNodeIds: z.ZodArray<z.ZodString>;
                    unvisitedNodeIds: z.ZodArray<z.ZodString>;
                    stateLimit: z.ZodNumber;
                    depthLimit: z.ZodNumber;
                    bounded: z.ZodBoolean;
                    depthCutoffs: z.ZodNumber;
                    stateCutoffs: z.ZodNumber;
                    externalStops: z.ZodNumber;
                    errors: z.ZodNumber;
                    witnesses: z.ZodArray<z.ZodObject<{
                        kind: z.ZodString;
                        nodeId: z.ZodString;
                        path: z.ZodArray<z.ZodString>;
                        detail: z.ZodOptional<z.ZodString>;
                        state: z.ZodJSONSchema;
                    }, z.core.$strip>>;
                    blockedExamples: z.ZodArray<z.ZodObject<{
                        choiceId: z.ZodString;
                        nodeId: z.ZodString;
                        reason: z.ZodString;
                        path: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>;
                    limits: z.ZodArray<z.ZodString>;
                    initialState: z.ZodJSONSchema;
                }, z.core.$strip>>;
                currentStoryRevision: z.ZodOptional<z.ZodString>;
                contentMatches: z.ZodOptional<z.ZodBoolean>;
                runtimeFreshness: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly candidateDiff: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            productionId: z.ZodString;
            candidateId: z.ZodString;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            candidateId: z.ZodString;
            candidateHash: z.ZodString;
            commit: z.ZodString;
            status: z.ZodString;
            targetBaseRevision: z.ZodString;
            currentBaseRevision: z.ZodString;
            baseCurrent: z.ZodBoolean;
            comparison: z.ZodString;
            files: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                changed: z.ZodBoolean;
                binary: z.ZodBoolean;
                truncated: z.ZodBoolean;
                beforeRevision: z.ZodNullable<z.ZodString>;
                afterRevision: z.ZodNullable<z.ZodString>;
                beforeBytes: z.ZodNumber;
                afterBytes: z.ZodNumber;
                before: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                after: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"gameCandidateDiff">;
                productionId: z.ZodString;
                candidateId: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                candidateId: z.ZodString;
                candidateHash: z.ZodString;
                commit: z.ZodString;
                status: z.ZodString;
                targetBaseRevision: z.ZodString;
                currentBaseRevision: z.ZodString;
                baseCurrent: z.ZodBoolean;
                comparison: z.ZodString;
                files: z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    changed: z.ZodBoolean;
                    binary: z.ZodBoolean;
                    truncated: z.ZodBoolean;
                    beforeRevision: z.ZodNullable<z.ZodString>;
                    afterRevision: z.ZodNullable<z.ZodString>;
                    beforeBytes: z.ZodNumber;
                    afterBytes: z.ZodNumber;
                    before: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    after: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly balanceOverview: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            revision: z.ZodString;
            cardCount: z.ZodNumber;
            groups: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                count: z.ZodNumber;
                attack: z.ZodNullable<z.ZodObject<{
                    sample: z.ZodNumber;
                    min: z.ZodNumber;
                    max: z.ZodNumber;
                    mean: z.ZodNumber;
                }, z.core.$strip>>;
                health: z.ZodNullable<z.ZodObject<{
                    sample: z.ZodNumber;
                    min: z.ZodNumber;
                    max: z.ZodNumber;
                    mean: z.ZodNumber;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            measurement: z.ZodLiteral<"definitions">;
            battleReport: z.ZodNull;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"balanceOverview">;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                revision: z.ZodString;
                cardCount: z.ZodNumber;
                groups: z.ZodArray<z.ZodObject<{
                    kind: z.ZodString;
                    count: z.ZodNumber;
                    attack: z.ZodNullable<z.ZodObject<{
                        sample: z.ZodNumber;
                        min: z.ZodNumber;
                        max: z.ZodNumber;
                        mean: z.ZodNumber;
                    }, z.core.$strip>>;
                    health: z.ZodNullable<z.ZodObject<{
                        sample: z.ZodNumber;
                        min: z.ZodNumber;
                        max: z.ZodNumber;
                        mean: z.ZodNumber;
                    }, z.core.$strip>>;
                }, z.core.$strip>>;
                measurement: z.ZodLiteral<"definitions">;
                battleReport: z.ZodNull;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly gameDeck: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            cards: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                count: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                missing: z.ZodBoolean;
            }, z.core.$strip>>;
            total: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"gameDeck">;
                id: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                name: z.ZodString;
                description: z.ZodString;
                cards: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    count: z.ZodNumber;
                    name: z.ZodOptional<z.ZodString>;
                    missing: z.ZodBoolean;
                }, z.core.$strip>>;
                total: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly gameCatalog: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            kind: z.ZodEnum<{
                deck: "deck";
                encounter: "encounter";
                story: "story";
            }>;
            q: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodString>;
            cursor: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                kind: z.ZodString;
            }, z.core.$strip>>;
            next: z.ZodOptional<z.ZodString>;
            revision: z.ZodString;
            total: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"gameCatalog">;
                kind: z.ZodEnum<{
                    deck: "deck";
                    encounter: "encounter";
                    story: "story";
                }>;
                q: z.ZodOptional<z.ZodString>;
                query: z.ZodOptional<z.ZodString>;
                cursor: z.ZodOptional<z.ZodString>;
                limit: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                    path: z.ZodString;
                    kind: z.ZodString;
                }, z.core.$strip>>;
                next: z.ZodOptional<z.ZodString>;
                revision: z.ZodString;
                total: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly storyAnalysis: {
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            nodeId: z.ZodOptional<z.ZodString>;
            expectedRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        output: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            selectedNode: z.ZodObject<{
                id: z.ZodString;
                detail: z.ZodString;
                onEnter: z.ZodArray<z.ZodJSONSchema>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            catalogRevision: z.ZodString;
            title: z.ZodString;
            entry: z.ZodString;
            nodes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                type: z.ZodString;
                summary: z.ZodString;
                chapter: z.ZodString;
                sourceMatch: z.ZodLiteral<"node-id">;
                sources: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    path: z.ZodString;
                    title: z.ZodString;
                    revision: z.ZodString;
                }, z.core.$strip>>;
                sourceCount: z.ZodNumber;
            }, z.core.$strip>>;
            edges: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                from: z.ZodString;
                to: z.ZodString;
                text: z.ZodString;
                conditional: z.ZodBoolean;
                enabledWhen: z.ZodOptional<z.ZodJSONSchema>;
                visibleWhen: z.ZodOptional<z.ZodJSONSchema>;
                effects: z.ZodOptional<z.ZodArray<z.ZodJSONSchema>>;
            }, z.core.$strip>>;
            findings: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                id: z.ZodString;
                detail: z.ZodString;
            }, z.core.$strip>>;
            terminalIds: z.ZodArray<z.ZodString>;
            reachableCount: z.ZodNumber;
            conditionalCount: z.ZodNumber;
            reachability: z.ZodLiteral<"structural">;
        }, z.core.$strip>]>, z.ZodObject<{
            projectGeneration: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        resource: Readonly<{
            readonly name: "extension.cardgame-content.query";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                op: z.ZodLiteral<"storyAnalysis">;
                id: z.ZodString;
                nodeId: z.ZodOptional<z.ZodString>;
                expectedRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                selectedNode: z.ZodObject<{
                    id: z.ZodString;
                    detail: z.ZodString;
                    onEnter: z.ZodArray<z.ZodJSONSchema>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                catalogRevision: z.ZodString;
                title: z.ZodString;
                entry: z.ZodString;
                nodes: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                    type: z.ZodString;
                    summary: z.ZodString;
                    chapter: z.ZodString;
                    sourceMatch: z.ZodLiteral<"node-id">;
                    sources: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        path: z.ZodString;
                        title: z.ZodString;
                        revision: z.ZodString;
                    }, z.core.$strip>>;
                    sourceCount: z.ZodNumber;
                }, z.core.$strip>>;
                edges: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    from: z.ZodString;
                    to: z.ZodString;
                    text: z.ZodString;
                    conditional: z.ZodBoolean;
                    enabledWhen: z.ZodOptional<z.ZodJSONSchema>;
                    visibleWhen: z.ZodOptional<z.ZodJSONSchema>;
                    effects: z.ZodOptional<z.ZodArray<z.ZodJSONSchema>>;
                }, z.core.$strip>>;
                findings: z.ZodArray<z.ZodObject<{
                    kind: z.ZodString;
                    id: z.ZodString;
                    detail: z.ZodString;
                }, z.core.$strip>>;
                terminalIds: z.ZodArray<z.ZodString>;
                reachableCount: z.ZodNumber;
                conditionalCount: z.ZodNumber;
                reachability: z.ZodLiteral<"structural">;
            }, z.core.$strip>]>, z.ZodObject<{
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
};
export type ContentQueryName = keyof typeof contentQueries;
export type ContentQueryInput<K extends ContentQueryName> = z.input<(typeof contentQueries)[K]['input']>;
export type ContentQueryOutput<K extends ContentQueryName> = z.output<(typeof contentQueries)[K]['output']>;
export declare const contentActions: {
    readonly pinReference: {
        input: z.ZodObject<{
            kind: z.ZodString;
            id: z.ZodString;
            anchor: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            revision: z.ZodString;
        }, z.core.$strict>;
        output: z.ZodObject<{
            items: z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                projectId: z.ZodString;
                kind: z.ZodString;
                id: z.ZodString;
                revision: z.ZodString;
                title: z.ZodString;
                anchor: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                freshness: z.ZodOptional<z.ZodEnum<{
                    current: "current";
                    stale: "stale";
                    unavailable: "unavailable";
                }>>;
                currentRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            limit: z.ZodNumber;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "pinReference";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                kind: z.ZodString;
                id: z.ZodString;
                anchor: z.ZodOptional<z.ZodString>;
                context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                revision: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                items: z.ZodArray<z.ZodObject<{
                    key: z.ZodString;
                    projectId: z.ZodString;
                    kind: z.ZodString;
                    id: z.ZodString;
                    revision: z.ZodString;
                    title: z.ZodString;
                    anchor: z.ZodOptional<z.ZodString>;
                    path: z.ZodOptional<z.ZodString>;
                    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    binding: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    freshness: z.ZodOptional<z.ZodEnum<{
                        current: "current";
                        stale: "stale";
                        unavailable: "unavailable";
                    }>>;
                    currentRevision: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                limit: z.ZodNumber;
            }, z.core.$strip>;
        }>;
    };
    readonly removePinnedReference: {
        input: z.ZodObject<{
            key: z.ZodString;
        }, z.core.$strict>;
        output: z.ZodObject<{
            removed: z.ZodLiteral<true>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "removePinnedReference";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                key: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                removed: z.ZodLiteral<true>;
            }, z.core.$strip>;
        }>;
    };
    readonly prepareBattleExperiment: {
        input: z.ZodObject<{
            fresh: z.ZodOptional<z.ZodBoolean>;
            candidate: z.ZodOptional<z.ZodObject<{
                productionId: z.ZodString;
                candidateId: z.ZodString;
                candidateHash: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            id: z.ZodString;
            url: z.ZodString;
            snapshotId: z.ZodString;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "prepareBattleExperiment";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                fresh: z.ZodOptional<z.ZodBoolean>;
                candidate: z.ZodOptional<z.ZodObject<{
                    productionId: z.ZodString;
                    candidateId: z.ZodString;
                    candidateHash: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                id: z.ZodString;
                url: z.ZodString;
                snapshotId: z.ZodString;
            }, z.core.$strip>;
        }>;
    };
    readonly stopBattleExperiment: {
        input: z.ZodObject<{}, z.core.$strict>;
        output: z.ZodObject<{
            stopped: z.ZodLiteral<true>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "stopBattleExperiment";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                stopped: z.ZodLiteral<true>;
            }, z.core.$strip>;
        }>;
    };
    readonly analyzeStoryPaths: {
        input: z.ZodObject<{
            id: z.ZodString;
            expectedRevision: z.ZodString;
        }, z.core.$strict>;
        output: z.ZodObject<{
            status: z.ZodEnum<{
                failed: "failed";
                idle: "idle";
                interrupted: "interrupted";
                running: "running";
                succeeded: "succeeded";
            }>;
            startedAt: z.ZodOptional<z.ZodString>;
            finishedAt: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
            report: z.ZodOptional<z.ZodObject<{
                storyId: z.ZodString;
                storyRevision: z.ZodString;
                runtimeRevision: z.ZodString;
                createdAt: z.ZodString;
                exploredStates: z.ZodNumber;
                totalNodes: z.ZodNumber;
                reachedNodeIds: z.ZodArray<z.ZodString>;
                unvisitedNodeIds: z.ZodArray<z.ZodString>;
                stateLimit: z.ZodNumber;
                depthLimit: z.ZodNumber;
                bounded: z.ZodBoolean;
                depthCutoffs: z.ZodNumber;
                stateCutoffs: z.ZodNumber;
                externalStops: z.ZodNumber;
                errors: z.ZodNumber;
                witnesses: z.ZodArray<z.ZodObject<{
                    kind: z.ZodString;
                    nodeId: z.ZodString;
                    path: z.ZodArray<z.ZodString>;
                    detail: z.ZodOptional<z.ZodString>;
                    state: z.ZodJSONSchema;
                }, z.core.$strip>>;
                blockedExamples: z.ZodArray<z.ZodObject<{
                    choiceId: z.ZodString;
                    nodeId: z.ZodString;
                    reason: z.ZodString;
                    path: z.ZodArray<z.ZodString>;
                }, z.core.$strip>>;
                limits: z.ZodArray<z.ZodString>;
                initialState: z.ZodJSONSchema;
            }, z.core.$strip>>;
            currentStoryRevision: z.ZodOptional<z.ZodString>;
            contentMatches: z.ZodOptional<z.ZodBoolean>;
            runtimeFreshness: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "analyzeStoryPaths";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                id: z.ZodString;
                expectedRevision: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                status: z.ZodEnum<{
                    failed: "failed";
                    idle: "idle";
                    interrupted: "interrupted";
                    running: "running";
                    succeeded: "succeeded";
                }>;
                startedAt: z.ZodOptional<z.ZodString>;
                finishedAt: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodString>;
                report: z.ZodOptional<z.ZodObject<{
                    storyId: z.ZodString;
                    storyRevision: z.ZodString;
                    runtimeRevision: z.ZodString;
                    createdAt: z.ZodString;
                    exploredStates: z.ZodNumber;
                    totalNodes: z.ZodNumber;
                    reachedNodeIds: z.ZodArray<z.ZodString>;
                    unvisitedNodeIds: z.ZodArray<z.ZodString>;
                    stateLimit: z.ZodNumber;
                    depthLimit: z.ZodNumber;
                    bounded: z.ZodBoolean;
                    depthCutoffs: z.ZodNumber;
                    stateCutoffs: z.ZodNumber;
                    externalStops: z.ZodNumber;
                    errors: z.ZodNumber;
                    witnesses: z.ZodArray<z.ZodObject<{
                        kind: z.ZodString;
                        nodeId: z.ZodString;
                        path: z.ZodArray<z.ZodString>;
                        detail: z.ZodOptional<z.ZodString>;
                        state: z.ZodJSONSchema;
                    }, z.core.$strip>>;
                    blockedExamples: z.ZodArray<z.ZodObject<{
                        choiceId: z.ZodString;
                        nodeId: z.ZodString;
                        reason: z.ZodString;
                        path: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>;
                    limits: z.ZodArray<z.ZodString>;
                    initialState: z.ZodJSONSchema;
                }, z.core.$strip>>;
                currentStoryRevision: z.ZodOptional<z.ZodString>;
                contentMatches: z.ZodOptional<z.ZodBoolean>;
                runtimeFreshness: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }>;
    };
    readonly saveDocument: {
        input: z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
            expectedRevision: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"document">;
            size: z.ZodNumber;
            links: z.ZodArray<z.ZodObject<{
                targetPath: z.ZodString;
                targetKind: z.ZodEnum<{
                    asset: "asset";
                    card: "card";
                    document: "document";
                    external: "external";
                    unknown: "unknown";
                }>;
                targetId: z.ZodOptional<z.ZodString>;
                anchor: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                line: z.ZodNumber;
                rawTarget: z.ZodString;
            }, z.core.$strip>>;
            updatedAt: z.ZodOptional<z.ZodString>;
            snippet: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "saveDocument";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                content: z.ZodString;
                expectedRevision: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"document">;
                size: z.ZodNumber;
                links: z.ZodArray<z.ZodObject<{
                    targetPath: z.ZodString;
                    targetKind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    targetId: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                    rawTarget: z.ZodString;
                }, z.core.$strip>>;
                updatedAt: z.ZodOptional<z.ZodString>;
                snippet: z.ZodOptional<z.ZodString>;
                content: z.ZodString;
            }, z.core.$strip>;
        }>;
    };
    readonly moveDocument: {
        input: z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            toPath: z.ZodString;
            expectedRevision: z.ZodOptional<z.ZodString>;
            expectedRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            updateLinks: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            source: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"document">;
                size: z.ZodNumber;
                links: z.ZodArray<z.ZodObject<{
                    targetPath: z.ZodString;
                    targetKind: z.ZodEnum<{
                        asset: "asset";
                        card: "card";
                        document: "document";
                        external: "external";
                        unknown: "unknown";
                    }>;
                    targetId: z.ZodOptional<z.ZodString>;
                    anchor: z.ZodOptional<z.ZodString>;
                    label: z.ZodOptional<z.ZodString>;
                    line: z.ZodNumber;
                    rawTarget: z.ZodString;
                }, z.core.$strip>>;
                updatedAt: z.ZodOptional<z.ZodString>;
                snippet: z.ZodOptional<z.ZodString>;
                content: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            toPath: z.ZodString;
            affected: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                changed: z.ZodBoolean;
                changedLinks: z.ZodNumber;
            }, z.core.$strip>>;
            conflicts: z.ZodArray<z.ZodString>;
            canApply: z.ZodBoolean;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "moveDocument";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                id: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                toPath: z.ZodString;
                expectedRevision: z.ZodOptional<z.ZodString>;
                expectedRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                updateLinks: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                source: z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    title: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    type: z.ZodLiteral<"document">;
                    size: z.ZodNumber;
                    links: z.ZodArray<z.ZodObject<{
                        targetPath: z.ZodString;
                        targetKind: z.ZodEnum<{
                            asset: "asset";
                            card: "card";
                            document: "document";
                            external: "external";
                            unknown: "unknown";
                        }>;
                        targetId: z.ZodOptional<z.ZodString>;
                        anchor: z.ZodOptional<z.ZodString>;
                        label: z.ZodOptional<z.ZodString>;
                        line: z.ZodNumber;
                        rawTarget: z.ZodString;
                    }, z.core.$strip>>;
                    updatedAt: z.ZodOptional<z.ZodString>;
                    snippet: z.ZodOptional<z.ZodString>;
                    content: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
                toPath: z.ZodString;
                affected: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    changed: z.ZodBoolean;
                    changedLinks: z.ZodNumber;
                }, z.core.$strip>>;
                conflicts: z.ZodArray<z.ZodString>;
                canApply: z.ZodBoolean;
            }, z.core.$strip>;
        }>;
    };
    readonly updateCard: {
        input: z.ZodObject<{
            id: z.ZodString;
            card: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            patch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            expectedRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"card">;
            name: z.ZodString;
            kind: z.ZodString;
            attack: z.ZodOptional<z.ZodNumber>;
            health: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            facePreview: z.ZodOptional<z.ZodString>;
            json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "updateCard";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                id: z.ZodString;
                card: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                patch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                expectedRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"card">;
                name: z.ZodString;
                kind: z.ZodString;
                attack: z.ZodOptional<z.ZodNumber>;
                health: z.ZodOptional<z.ZodNumber>;
                description: z.ZodOptional<z.ZodString>;
                rarity: z.ZodOptional<z.ZodString>;
                labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                facePreview: z.ZodOptional<z.ZodString>;
                json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
            }, z.core.$strip>;
        }>;
    };
    readonly updateAsset: {
        input: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            expectedMetadataRevision: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"asset">;
            kind: z.ZodEnum<{
                audio: "audio";
                image: "image";
                other: "other";
                spritesheet: "spritesheet";
            }>;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadataRevision: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            currentVersionId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                assetId: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                source: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    project: "project";
                }>;
                candidateId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                createdAt: z.ZodString;
                adopted: z.ZodBoolean;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "updateAsset";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                expectedMetadataRevision: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"asset">;
                kind: z.ZodEnum<{
                    audio: "audio";
                    image: "image";
                    other: "other";
                    spritesheet: "spritesheet";
                }>;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                metadataRevision: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                status: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                currentVersionId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    source: z.ZodEnum<{
                        adopted: "adopted";
                        candidate: "candidate";
                        project: "project";
                    }>;
                    candidateId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    createdAt: z.ZodString;
                    adopted: z.ZodBoolean;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
        }>;
    };
    readonly registerCandidates: {
        input: z.ZodObject<{
            candidates: z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                fileName: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                data: z.ZodOptional<z.ZodString>;
                base64: z.ZodOptional<z.ZodString>;
                sourcePath: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strip>>;
            autoAdopt: z.ZodOptional<z.ZodObject<{
                path: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strip>>;
        }, z.core.$strict>;
        output: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            metadata: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
            status: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "registerCandidates";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                candidates: z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    fileName: z.ZodOptional<z.ZodString>;
                    mimeType: z.ZodOptional<z.ZodString>;
                    data: z.ZodOptional<z.ZodString>;
                    base64: z.ZodOptional<z.ZodString>;
                    sourcePath: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                }, z.core.$strip>>;
                autoAdopt: z.ZodOptional<z.ZodObject<{
                    path: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                }, z.core.$strip>>;
            }, z.core.$strict>;
            readonly output: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                metadata: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
                status: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }>;
    };
    readonly adoptVersion: {
        input: z.ZodObject<{
            candidateId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            assetId: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            fileName: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"asset">;
            kind: z.ZodEnum<{
                audio: "audio";
                image: "image";
                other: "other";
                spritesheet: "spritesheet";
            }>;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadataRevision: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            currentVersionId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                assetId: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                source: z.ZodEnum<{
                    adopted: "adopted";
                    candidate: "candidate";
                    project: "project";
                }>;
                candidateId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                createdAt: z.ZodString;
                adopted: z.ZodBoolean;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "adoptVersion";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                candidateId: z.ZodOptional<z.ZodString>;
                versionId: z.ZodOptional<z.ZodString>;
                assetId: z.ZodOptional<z.ZodString>;
                path: z.ZodOptional<z.ZodString>;
                fileName: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                path: z.ZodString;
                revision: z.ZodString;
                type: z.ZodLiteral<"asset">;
                kind: z.ZodEnum<{
                    audio: "audio";
                    image: "image";
                    other: "other";
                    spritesheet: "spritesheet";
                }>;
                mimeType: z.ZodString;
                size: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
                metadataRevision: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                status: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                currentVersionId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    assetId: z.ZodString;
                    path: z.ZodString;
                    revision: z.ZodString;
                    mimeType: z.ZodString;
                    size: z.ZodNumber;
                    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    durationMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    frameCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    source: z.ZodEnum<{
                        adopted: "adopted";
                        candidate: "candidate";
                        project: "project";
                    }>;
                    candidateId: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
                    createdAt: z.ZodString;
                    adopted: z.ZodBoolean;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
        }>;
    };
    readonly compileStory: {
        input: z.ZodObject<{
            entry: z.ZodString;
            storyId: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            storyId: z.ZodString;
            outputPath: z.ZodString;
            catalogUpdated: z.ZodBoolean;
            nodeCount: z.ZodNumber;
            choiceCount: z.ZodNumber;
            diagnostics: z.ZodArray<z.ZodObject<{
                severity: z.ZodEnum<{
                    error: "error";
                    warning: "warning";
                }>;
                path: z.ZodString;
                line: z.ZodOptional<z.ZodNumber>;
                detail: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "compileStory";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                entry: z.ZodString;
                storyId: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                storyId: z.ZodString;
                outputPath: z.ZodString;
                catalogUpdated: z.ZodBoolean;
                nodeCount: z.ZodNumber;
                choiceCount: z.ZodNumber;
                diagnostics: z.ZodArray<z.ZodObject<{
                    severity: z.ZodEnum<{
                        error: "error";
                        warning: "warning";
                    }>;
                    path: z.ZodString;
                    line: z.ZodOptional<z.ZodNumber>;
                    detail: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
        }>;
    };
    readonly stageDocumentsCandidate: {
        input: z.ZodObject<{
            featureId: z.ZodString;
            brief: z.ZodString;
            documents: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            candidate: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                productionId: z.ZodString;
                candidateHash: z.ZodString;
                commit: z.ZodString;
                status: z.ZodString;
            }, z.core.$strip>;
            production: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                revision: z.ZodNumber;
            }, z.core.$strip>;
            reused: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "stageDocumentsCandidate";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                featureId: z.ZodString;
                brief: z.ZodString;
                documents: z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    content: z.ZodString;
                    expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                candidate: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    productionId: z.ZodString;
                    candidateHash: z.ZodString;
                    commit: z.ZodString;
                    status: z.ZodString;
                }, z.core.$strip>;
                production: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    revision: z.ZodNumber;
                }, z.core.$strip>;
                reused: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
        }>;
    };
    readonly stageStoryCandidate: {
        input: z.ZodObject<{
            featureId: z.ZodString;
            storyId: z.ZodString;
            entryPath: z.ZodString;
            brief: z.ZodString;
            documents: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>;
            referenceDocuments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                content: z.ZodString;
                expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>>;
            assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                candidateId: z.ZodString;
                path: z.ZodString;
            }, z.core.$strip>>>;
            npcs: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            items: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            shops: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            recipes: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            quests: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            copyEdits: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
            launch: z.ZodOptional<z.ZodObject<{
                hubPath: z.ZodString;
                locationId: z.ZodString;
                actionId: z.ZodString;
                label: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            candidate: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                productionId: z.ZodString;
                candidateHash: z.ZodString;
                commit: z.ZodString;
                status: z.ZodString;
            }, z.core.$strip>;
            production: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                revision: z.ZodNumber;
            }, z.core.$strip>;
            reused: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "stageStoryCandidate";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                featureId: z.ZodString;
                storyId: z.ZodString;
                entryPath: z.ZodString;
                brief: z.ZodString;
                documents: z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    content: z.ZodString;
                    expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>>;
                referenceDocuments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    content: z.ZodString;
                    expectedRevision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>>>;
                assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    candidateId: z.ZodString;
                    path: z.ZodString;
                }, z.core.$strip>>>;
                npcs: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                items: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                shops: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                recipes: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                quests: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                copyEdits: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>>;
                launch: z.ZodOptional<z.ZodObject<{
                    hubPath: z.ZodString;
                    locationId: z.ZodString;
                    actionId: z.ZodString;
                    label: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                candidate: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    productionId: z.ZodString;
                    candidateHash: z.ZodString;
                    commit: z.ZodString;
                    status: z.ZodString;
                }, z.core.$strip>;
                production: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    revision: z.ZodNumber;
                }, z.core.$strip>;
                reused: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
        }>;
    };
    readonly createCardBatch: {
        input: z.ZodObject<{
            cardIds: z.ZodArray<z.ZodString>;
            featureId: z.ZodString;
            requestId: z.ZodOptional<z.ZodString>;
            sourceRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            brief: z.ZodString;
        }, z.core.$strict>;
        output: z.ZodObject<{
            production: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                revision: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "createCardBatch";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                cardIds: z.ZodArray<z.ZodString>;
                featureId: z.ZodString;
                requestId: z.ZodOptional<z.ZodString>;
                sourceRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                brief: z.ZodString;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                production: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    revision: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }>;
    };
    readonly saveCardDraft: {
        input: z.ZodObject<{
            productionId: z.ZodString;
            cardId: z.ZodString;
            baseRevision: z.ZodNumber;
            definition: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
            presentation: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            production: z.ZodObject<{
                id: z.ZodString;
                projectId: z.ZodString;
                revision: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "saveCardDraft";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                productionId: z.ZodString;
                cardId: z.ZodString;
                baseRevision: z.ZodNumber;
                definition: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
                presentation: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                production: z.ZodObject<{
                    id: z.ZodString;
                    projectId: z.ZodString;
                    revision: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }>;
    };
    readonly createTodo: {
        input: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            priority: z.ZodString;
            category: z.ZodString;
            context: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
        }, z.core.$strict>;
        output: z.ZodObject<{
            item: z.ZodObject<{
                id: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
        method: Readonly<{
            readonly extension: "cardgame-content";
            readonly method: "createTodo";
            readonly input: z.ZodObject<{
                projectId: z.ZodString;
                projectGeneration: z.ZodOptional<z.ZodString>;
                title: z.ZodString;
                description: z.ZodString;
                priority: z.ZodString;
                category: z.ZodString;
                context: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
            }, z.core.$strict>;
            readonly output: z.ZodObject<{
                item: z.ZodObject<{
                    id: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }>;
    };
};
export declare const configureProjectContract: Readonly<{
    readonly extension: "cardgame-content";
    readonly method: "configureProject";
    readonly input: z.ZodObject<{
        root: z.ZodString;
        desktopId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    readonly output: z.ZodObject<{
        configured: z.ZodLiteral<true>;
        projectId: z.ZodString;
        projectRoot: z.ZodString;
        notes: z.ZodRecord<z.ZodString, z.ZodString>;
    }, z.core.$strip>;
}>;
export declare const referenceResourceSchema: z.ZodObject<{
    title: z.ZodString;
    path: z.ZodString;
    root: z.ZodOptional<z.ZodString>;
    linkBase: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const referenceDocumentSchema: z.ZodObject<{
    content: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const featureChoicesSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const localActions: {
    discussAudio: {
        input: z.ZodObject<{}, z.core.$strip>;
        output: z.ZodObject<{
            sessionId: z.ZodString;
        }, z.core.$strip>;
    };
    discussSelection: {
        input: z.ZodObject<{
            itemIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
        output: z.ZodObject<{
            sessionId: z.ZodString;
        }, z.core.$strip>;
    };
    addResource: {
        input: z.ZodObject<{
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        output: z.ZodObject<{
            title: z.ZodString;
            path: z.ZodString;
            root: z.ZodOptional<z.ZodString>;
            linkBase: z.ZodOptional<z.ZodString>;
            revision: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    rejectAssetVersion: {
        input: z.ZodObject<{
            assetId: z.ZodString;
            reason: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        output: z.ZodObject<{
            reverted: z.ZodBoolean;
            versionId: z.ZodOptional<z.ZodString>;
            todoId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    createCardWorkflow: {
        input: z.ZodObject<{
            itemIds: z.ZodArray<z.ZodString>;
            featureId: z.ZodString;
            draft: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
            expectedRevision: z.ZodOptional<z.ZodString>;
            requestId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        output: z.ZodObject<{
            noteId: z.ZodString;
            itemId: z.ZodString;
        }, z.core.$strip>;
    };
    switchCardTheme: {
        input: z.ZodObject<{
            id: z.ZodString;
            themeId: z.ZodString;
            expectedRevision: z.ZodString;
        }, z.core.$strip>;
        output: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            path: z.ZodString;
            revision: z.ZodString;
            type: z.ZodLiteral<"card">;
            name: z.ZodString;
            kind: z.ZodString;
            attack: z.ZodOptional<z.ZodNumber>;
            health: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            rarity: z.ZodOptional<z.ZodString>;
            labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            facePreview: z.ZodOptional<z.ZodString>;
            json: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
        }, z.core.$strip>;
    };
};
