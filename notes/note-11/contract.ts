/** Public implementation-free wire contract. The normal backend build copies
 * these exact bytes into independently editable content notes. */
import { z, extensionMethod, extensionResource, type JsonValue } from '@realiz3r/worka/extension-contracts';
const textSchema = z.string(), numberSchema = z.number(), booleanSchema = z.boolean(), stringListSchema = z.array(textSchema), emptyInputSchema = z.object({});
export const jsonObject = z.record(textSchema, z.json());
export const libraryItemSchema = z.object({
    id: textSchema, title: textSchema.optional(), name: textSchema.optional(), path: textSchema.optional(), revision: textSchema.optional()
});
const contentItemSchema = libraryItemSchema.extend({
    title: textSchema, path: textSchema, revision: textSchema
});
export const pageSchema = <S extends z.ZodType>(item: S) => z.object({
    items:z.array(item),next:textSchema.min(1).optional(),revision:textSchema.min(1),total:numberSchema.int().nonnegative().optional()
});
export const documentLinkSchema = z.object({
    targetPath: textSchema, targetKind: z.enum(['document', 'card', 'asset', 'unknown', 'external']), targetId: textSchema.optional(), anchor: textSchema.optional(), label: textSchema.optional(), line: numberSchema, rawTarget: textSchema
});
export const documentItemSchema = contentItemSchema.extend({
    title: textSchema, path: textSchema, revision: textSchema, type: z.literal('document'), size: numberSchema, links: z.array(documentLinkSchema), updatedAt: textSchema.optional(), snippet: textSchema.optional()
});
export const documentSchema = documentItemSchema.extend({ content: textSchema });
export const documentMetaSchema = z.object({
    id: textSchema, path: textSchema, title: textSchema, revision: textSchema, size: numberSchema, isScene: booleanSchema
});
export const directorySchema = contentItemSchema.extend({
    type: z.literal('directory'), path: textSchema, hasChildren: booleanSchema.optional(), parentPath: textSchema.optional()
});
export const backlinkSchema = contentItemSchema.extend({
    sourceId: textSchema, sourcePath: textSchema, targetPath: textSchema, line: numberSchema, snippet: textSchema.optional(), anchor: textSchema.optional(), label: textSchema.optional()
});
export const graphSchema = z.object({
    nodes: z.array(contentItemSchema.extend({ type: z.enum(['document', 'asset']), depth: numberSchema })), edges: z.array(z.object({
        sourceId: textSchema, targetId: textSchema.optional(), sourcePath: textSchema, targetPath: textSchema, kind: z.enum(['document', 'card', 'asset', 'unknown', 'external']), anchor: textSchema.optional()
    })), truncated: booleanSchema
});
export const movePreviewSchema = z.object({
    source: documentItemSchema.extend({ content: textSchema.optional() }), toPath: textSchema, affected: z.array(z.object({
        id: textSchema, path: textSchema, revision: textSchema, changed: booleanSchema, changedLinks: numberSchema
    })), conflicts: stringListSchema, canApply: booleanSchema
});
export const cardItemSchema = contentItemSchema.extend({
    type: z.literal('card'), name: textSchema, kind: textSchema, attack: numberSchema.optional(), health: numberSchema.optional(), description: textSchema.optional(), rarity: textSchema.optional(), labels: stringListSchema.optional(), cost: z.union([numberSchema, textSchema]).optional(), facePreview: textSchema.optional()
});
export const cardSchema = cardItemSchema.extend({ json: jsonObject });
export const assetVersionSchema = libraryItemSchema.extend({
    assetId: textSchema, path: textSchema, revision: textSchema, mimeType: textSchema, size: numberSchema, width: numberSchema.nullish(), height: numberSchema.nullish(), durationMs: numberSchema.nullish(), frameCount: numberSchema.nullish(), source: z.enum(['project', 'candidate', 'adopted']), candidateId: textSchema.optional(), metadata: jsonObject.optional(), createdAt: textSchema, adopted: booleanSchema
});
export const assetSchema = contentItemSchema.extend({
    type: z.literal('asset'), kind: z.enum(['image', 'audio', 'spritesheet', 'other']), mimeType: textSchema, size: numberSchema, name: textSchema.optional(), tags: stringListSchema.optional(), metadataRevision: textSchema.optional(), format: textSchema.optional(), status: textSchema.optional(), width: numberSchema.nullish(), height: numberSchema.nullish(), durationMs: numberSchema.nullish(), frameCount: numberSchema.nullish(), currentVersionId: textSchema.optional(), metadata: jsonObject.optional(), versions: z.array(assetVersionSchema).optional()
});
export const mediaSchema = z.object({
    id: textSchema, versionId: textSchema.optional(), variant: z.enum(['thumbnail', 'original', 'waveform']), mimeType: textSchema, size: numberSchema, revision: textSchema, url: textSchema.optional(), data: textSchema.optional(), path: textSchema.optional(), absolutePath: textSchema.optional(), width: numberSchema.nullish(), height: numberSchema.nullish(), durationMs: numberSchema.nullish(), frameCount: numberSchema.nullish(), metadata: jsonObject.optional()
});
export const statusSchema = z.object({
    projectId: textSchema, phase: z.enum(['pending', 'indexing', 'ready', 'error', 'closed']), indexedAt: textSchema.optional(), documents: numberSchema, directories: numberSchema, cards: numberSchema, assets: numberSchema, errors: stringListSchema
});
export const recentChangeSchema = z.object({
    kind: z.enum(['document', 'card', 'asset', 'version']), id: textSchema.optional(), path: textSchema.optional(), name: textSchema.optional(), change: z.enum(['created', 'updated']), at: textSchema
});
const diagnostic = z.object({
    severity: z.enum(['error', 'warning']), path: textSchema, line: numberSchema.optional(), detail: textSchema
});
const storyBuild = z.object({
    storyId: textSchema, entryPath: textSchema, outputPath: textSchema, sourcePaths: stringListSchema, errorCount: numberSchema, warningCount: numberSchema, nodeCount: numberSchema, choiceCount: numberSchema, builtAt: textSchema
});
const storyScene = z.object({
    id: textSchema, path: textSchema, revision: textSchema, nodeId: textSchema, title: textSchema, chapter: textSchema, summary: textSchema, dialogueCount: numberSchema, offset: numberSchema, nextOffset: numberSchema.optional(), items: z.array(z.object({
        id: textSchema, speakerId: textSchema, speakerName: textSchema, text: textSchema, emotion: textSchema.optional(), line: numberSchema
    })), diagnostics: z.array(diagnostic)
});
const pinnedIdentity = z.object({
    key: textSchema, projectId: textSchema, kind: textSchema, id: textSchema, revision: textSchema, title: textSchema, anchor: textSchema.optional(), path: textSchema.optional(), context: jsonObject.optional(), binding: jsonObject.optional(), freshness: z.enum(['current', 'stale', 'unavailable']).optional(), currentRevision: textSchema.optional()
});
const candidateBinding = z.object({
    productionId:textSchema,candidateId:textSchema,candidateHash:textSchema,commit:textSchema,productionRevision:numberSchema,
    requirementRevision:numberSchema.nullable(),round:numberSchema.nullable(),currentRequirementRevision:numberSchema,
    currentRound:numberSchema,current:booleanSchema,status:textSchema
});
const previewReference = pinnedIdentity.extend({kind:z.literal('candidate'),binding:candidateBinding});
export const formalPreviewRecordSchema = z.object({
    projectId:textSchema,key:textSchema,snapshotId:textSchema,createdAt:textSchema,commit:textSchema,
    contentRevision:textSchema,runtimeRevision:textSchema,snapshotRevision:textSchema
});
export type FormalPreviewRecord=z.output<typeof formalPreviewRecordSchema>;
const formalPreview = z.object({record:formalPreviewRecordSchema.nullable(),freshness:z.enum(['missing','current','stale','unavailable']),error:textSchema.optional()});
const pinnedPage = z.object({ items: z.array(pinnedIdentity), limit: numberSchema });
const reportRef = z.object({ experimentId: textSchema, reportId: textSchema }), candidateRef = z.object({
    productionId: textSchema, candidateId: textSchema, candidateHash: textSchema
});
const battleSource = z.union([z.object({ kind: z.literal('registered-project') }), candidateRef.extend({ kind: z.literal('candidate'), commit: textSchema })]);
const battleSettings = z.object({
    deckId: textSchema, encounterId: textSchema, policyVersion: textSchema, seeds: z.array(numberSchema), turnLimit: numberSchema, actionLimit: numberSchema, opening: z.literal('player-first')
});
const battleOutcome = z.enum(['victory', 'defeat', 'draw', 'incomplete']);
const battleTrial = z.object({
    outcome: battleOutcome, turns: numberSchema, actions: numberSchema, reason: textSchema.optional(), playedCardIds: stringListSchema, finalStateHash: textSchema
});
const battleReport = z.object({
    schemaVersion: z.literal(1), createdAt: textSchema, settings: battleSettings, settingsHash: textSchema, contentRevision: textSchema, runtimeRevision: textSchema, adapterVersion: textSchema, deckCardIds: stringListSchema, trials: z.array(z.object({
        seed: numberSchema, result: battleTrial.optional(), error: textSchema.optional(), cancelled: z.literal(true).optional()
    })), summary: z.object({
        requested: numberSchema, executed: numberSchema, valid: numberSchema, decisive: numberSchema, victories: numberSchema, defeats: numberSchema, draws: numberSchema, incomplete: numberSchema, failed: numberSchema, cancelled: booleanSchema, victoryRate: numberSchema.nullable()
    })
});
const battleExperiments = z.object({
    status: textSchema, experiment: z.object({
        id: textSchema, snapshotId: textSchema, contentRevision: textSchema, sourceRevision: textSchema, runtimeRevision: textSchema.optional(), source: battleSource.optional(), createdAt: textSchema, error: textSchema.optional(), url: textSchema.optional()
    }).optional(), reports: z.array(z.object({
        experimentId: textSchema, reportId: textSchema, source: battleSource.optional(), report: battleReport, projectCheck: z.object({
            status: textSchema, checkedAt: textSchema, scope: textSchema, error: textSchema.optional()
        })
    })), reportScope: z.literal('historical-snapshot')
});
const battleComparison = z.object({
    before: reportRef, after: reportRef, settings: battleSettings, pairs: z.array(z.object({
        seed: numberSchema, before: battleOutcome, after: battleOutcome
    })), excludedSeeds: z.array(numberSchema), pairedCount: numberSchema, beforeVictoryRate: numberSchema.nullable(), afterVictoryRate: numberSchema.nullable(), beforeVersion: z.object({ content: textSchema, runtime: textSchema }), afterVersion: z.object({ content: textSchema, runtime: textSchema }), interpretation: textSchema
});
const executionReport = z.object({
    storyId: textSchema, storyRevision: textSchema, runtimeRevision: textSchema, createdAt: textSchema, exploredStates: numberSchema, totalNodes: numberSchema, reachedNodeIds: stringListSchema, unvisitedNodeIds: stringListSchema, stateLimit: numberSchema, depthLimit: numberSchema, bounded: booleanSchema, depthCutoffs: numberSchema, stateCutoffs: numberSchema, externalStops: numberSchema, errors: numberSchema, witnesses: z.array(z.object({
        kind: textSchema, nodeId: textSchema, path: stringListSchema, detail: textSchema.optional(), state: z.json()
    })), blockedExamples: z.array(z.object({
        choiceId: textSchema, nodeId: textSchema, reason: textSchema, path: stringListSchema
    })), limits: stringListSchema, initialState: z.json()
});
const executionState = z.object({
    status: z.enum(['idle', 'running', 'succeeded', 'failed', 'interrupted']), startedAt: textSchema.optional(), finishedAt: textSchema.optional(), error: textSchema.optional(), report: executionReport.optional(), currentStoryRevision: textSchema.optional(), contentMatches: booleanSchema.optional(), runtimeFreshness: textSchema.optional()
});
const metric = z.object({
    sample: numberSchema, min: numberSchema, max: numberSchema, mean: numberSchema
}).nullable();
const balance = z.object({
    revision: textSchema, cardCount: numberSchema, groups: z.array(z.object({
        kind: textSchema, count: numberSchema, attack: metric, health: metric
    })), measurement: z.literal('definitions'), battleReport: z.null()
});
const deck = z.object({
    id: textSchema, path: textSchema, revision: textSchema, name: textSchema, description: textSchema, cards: z.array(z.object({
        id: textSchema, count: numberSchema, name: textSchema.optional(), missing: booleanSchema
    })), total: numberSchema
});
const storyNode = z.object({
    id: textSchema, title: textSchema, type: textSchema, summary: textSchema, chapter: textSchema, sourceMatch: z.literal('node-id'), sources: z.array(z.object({
        id: textSchema, path: textSchema, title: textSchema, revision: textSchema
    })), sourceCount: numberSchema
});
const storyAnalysis = z.union([z.object({
        id: textSchema, path: textSchema, revision: textSchema, selectedNode: z.object({
            id: textSchema, detail: textSchema, onEnter: z.array(z.json())
        })
    }), z.object({
        id: textSchema, path: textSchema, revision: textSchema, catalogRevision: textSchema, title: textSchema, entry: textSchema, nodes: z.array(storyNode), edges: z.array(z.object({
            id: textSchema, from: textSchema, to: textSchema, text: textSchema, conditional: booleanSchema, enabledWhen: z.json().optional(), visibleWhen: z.json().optional(), effects: z.array(z.json()).optional()
        })), findings: z.array(z.object({
            kind: textSchema, id: textSchema, detail: textSchema
        })), terminalIds: stringListSchema, reachableCount: numberSchema, conditionalCount: numberSchema, reachability: z.literal('structural')
    })]);
const candidateDiff = z.object({
    candidateId: textSchema, candidateHash: textSchema, commit: textSchema, status: textSchema, targetBaseRevision: textSchema, currentBaseRevision: textSchema, baseCurrent: booleanSchema, comparison: textSchema, files: z.array(z.object({
        path: textSchema, changed: booleanSchema, binary: booleanSchema, truncated: booleanSchema, beforeRevision: textSchema.nullable(), afterRevision: textSchema.nullable(), beforeBytes: numberSchema, afterBytes: numberSchema, before: textSchema.nullish(), after: textSchema.nullish()
    }))
});
const listInput = z.object({
    q: textSchema.optional(), query: textSchema.optional(), directory: textSchema.optional(), parentPath: textSchema.optional(), kind: textSchema.optional(), assetScope: z.enum(['art', 'audio']).optional(), format: textSchema.optional(), mimeType: textSchema.optional(), minWidth: numberSchema.optional(), maxWidth: numberSchema.optional(), minDurationMs: numberSchema.optional(), maxDurationMs: numberSchema.optional(), status: textSchema.optional(), rarity: textSchema.optional(), tags: z.union([textSchema, stringListSchema]).optional(), labels: z.union([textSchema, stringListSchema]).optional(), cursor: textSchema.optional(), limit: numberSchema.optional(), id: textSchema.optional(), path: textSchema.optional(), assetId: textSchema.optional()
});
const detailInput = z.object({
    id:textSchema.optional(),path:textSchema.optional(),assetId:textSchema.optional(),versionId:textSchema.optional(),freshKind:textSchema.optional()
});
function query<const N extends string,S extends z.ZodRawShape,O extends z.ZodType>(op:N,input:z.ZodObject<S>,output:O) {
    const response=output.and(z.object({projectGeneration:textSchema.optional()}));
    return {input:input.strict().nullish(),output:response,resource:extensionResource({
        name:'extension.cardgame-content.query',input:input.extend({projectId:textSchema.min(1),projectGeneration:textSchema.optional(),op:z.literal(op)}).strict(),output:response
    })};
}
export const contentQueries = {
    formalPreview:query('formalPreview',emptyInputSchema,formalPreview),
    previewReferenceTarget:query('previewReferenceTarget',z.object({key:textSchema,commit:textSchema}),previewReference),
    status: query('status', emptyInputSchema, statusSchema), documents: query('documents', listInput, pageSchema(documentItemSchema)), directories: query('directories', listInput, pageSchema(directorySchema)), document: query('document', detailInput, documentSchema), documentMeta: query('documentMeta', detailInput, documentMetaSchema), backlinks: query('backlinks', listInput, pageSchema(backlinkSchema)), graph: query('graph', detailInput.extend({
        depth: numberSchema.optional(), maxNodes: numberSchema.optional(), limit: numberSchema.optional()
    }), graphSchema), movePreview: query('movePreview', detailInput.extend({ toPath: textSchema.optional(), targetPath: textSchema.optional() }), movePreviewSchema),
    cards: query('cards', listInput, pageSchema(cardItemSchema)), card: query('card', detailInput, cardSchema), assets: query('assets', listInput, pageSchema(assetSchema)), asset: query('asset', detailInput, assetSchema), versions: query('versions', listInput, pageSchema(assetVersionSchema)), media: query('media', detailInput.extend({
        versionId: textSchema.optional(), variant: z.enum(['thumbnail', 'original', 'waveform']).optional(), from: textSchema.optional()
    }), mediaSchema),
    inspection: query('inspection', z.object({
        kinds: z.array(z.enum(['broken-link', 'scene-dead-end', 'orphan-asset', 'card-missing-art', 'asset-missing-metadata'])).optional(), cursor: textSchema.optional(), limit: numberSchema.optional()
    }), z.object({
        findings: z.array(z.object({
            kind: textSchema, severity: z.enum(['info', 'warning', 'high']), ref: z.object({
                type: z.enum(['document', 'card', 'asset']), id: textSchema.optional(), path: textSchema.optional()
            }), detail: textSchema
        })), counts: z.record(textSchema, numberSchema), nextCursor: textSchema.optional()
    })), recentChanges: query('recentChanges', z.object({
        since: textSchema.optional(), cursor: textSchema.optional(), limit: numberSchema.optional()
    }), pageSchema(recentChangeSchema)), storyBuilds: query('storyBuilds', z.object({ cursor: textSchema.optional(), limit: numberSchema.optional() }), pageSchema(storyBuild)), storyScenePage: query('storyScenePage', detailInput.extend({
        offset: numberSchema.optional(), limit: numberSchema.optional(), expectedRevision: textSchema.optional()
    }), storyScene),
    pinnedReferenceTarget: query('pinnedReferenceTarget', z.object({
        kind: textSchema, id: textSchema, anchor: textSchema.optional(), context: jsonObject.optional()
    }), pinnedIdentity), pinnedReferences: query('pinnedReferences', emptyInputSchema, pinnedPage), battleExperiments: query('battleExperiments', emptyInputSchema, battleExperiments), battleSources: query('battleSources', emptyInputSchema, z.object({ items: z.array(candidateRef.extend({
            commit: textSchema, kind: textSchema, targetId: textSchema, status: textSchema
        })) })), battleComparison: query('battleComparison', z.object({ before: reportRef, after: reportRef }), battleComparison), storyExecutionReport: query('storyExecutionReport', z.object({ id: textSchema }), executionState), candidateDiff: query('gameCandidateDiff', z.object({ productionId: textSchema, candidateId: textSchema }), candidateDiff), balanceOverview: query('balanceOverview', emptyInputSchema, balance), gameDeck: query('gameDeck', z.object({ id: textSchema }), deck), gameCatalog: query('gameCatalog', z.object({
        kind: z.enum(['story', 'deck', 'encounter']), q: textSchema.optional(), query: textSchema.optional(), cursor: textSchema.optional(), limit: numberSchema.optional()
    }), pageSchema(z.object({
        id: textSchema, title: textSchema, path: textSchema, kind: textSchema
    }))), storyAnalysis: query('storyAnalysis', z.object({
        id: textSchema, nodeId: textSchema.optional(), expectedRevision: textSchema.optional()
    }), storyAnalysis)
} as const;
export type ContentQueryName = keyof typeof contentQueries;
export type ContentQueryInput<K extends ContentQueryName> = z.input<(typeof contentQueries)[K]['input']>;
export type ContentQueryOutput<K extends ContentQueryName> = z.output<(typeof contentQueries)[K]['output']>;
const documentDraft = z.object({
    path: textSchema, content: textSchema, expectedRevision: textSchema.nullish()
});
const candidate = z.object({
    id: textSchema, projectId: textSchema, productionId: textSchema, candidateHash: textSchema, commit: textSchema, status: textSchema
}), production = z.object({
    id: textSchema, projectId: textSchema, revision: numberSchema
});
const staged = z.object({
    candidate, production, reused: booleanSchema.optional()
});
const compileResult = z.object({
    storyId: textSchema, outputPath: textSchema, catalogUpdated: booleanSchema, nodeCount: numberSchema, choiceCount: numberSchema, diagnostics: z.array(diagnostic)
});
const registeredCandidate = z.object({
    id: textSchema, title: textSchema, path: textSchema, revision: textSchema, mimeType: textSchema, size: numberSchema, metadata: jsonObject, status: textSchema.optional(), assetId: textSchema.optional(), versionId: textSchema.optional()
});
const command=<const N extends string,S extends z.ZodRawShape,O extends z.ZodType>(method:N,input:z.ZodObject<S>,output:O)=>({
    input:input.strict(),output,method:extensionMethod({extension:'cardgame-content',method,input:input.extend({projectId:textSchema.min(1),projectGeneration:textSchema.optional()}).strict(),output})
});
export const contentActions = {
    prepareFormalPreview:command('prepareFormalPreview',z.object({fresh:booleanSchema.optional()}),formalPreviewRecordSchema),
    pinReference: command('pinReference', z.object({
        kind: textSchema, id: textSchema, anchor: textSchema.optional(), context: jsonObject.optional(), revision: textSchema
    }), pinnedPage), removePinnedReference: command('removePinnedReference', z.object({ key: textSchema }), z.object({ removed: z.literal(true) })), prepareBattleExperiment: command('prepareBattleExperiment', z.object({ fresh: booleanSchema.optional(), candidate: candidateRef.optional() }), z.object({
        id: textSchema, url: textSchema, snapshotId: textSchema
    })), stopBattleExperiment: command('stopBattleExperiment', emptyInputSchema, z.object({ stopped: z.literal(true) })), analyzeStoryPaths: command('analyzeStoryPaths', z.object({ id: textSchema, expectedRevision: textSchema }), executionState),
    saveDocument: command('saveDocument', z.object({
        id: textSchema.optional(), path: textSchema.optional(), content: textSchema, expectedRevision: textSchema.optional(), title: textSchema.optional()
    }), documentSchema), moveDocument: command('moveDocument', z.object({
        id: textSchema.optional(), path: textSchema.optional(), toPath: textSchema, expectedRevision: textSchema.optional(), expectedRevisions: z.record(textSchema, textSchema).optional(), updateLinks: booleanSchema.optional()
    }), movePreviewSchema), updateCard: command('updateCard', z.object({
        id: textSchema, card: jsonObject.optional(), patch: jsonObject.optional(), expectedRevision: textSchema.optional()
    }), cardSchema), updateAsset: command('updateAsset', z.object({
        id: textSchema, name: textSchema.optional(), tags: stringListSchema.optional(), expectedMetadataRevision: textSchema.optional()
    }), assetSchema), registerCandidates: command('registerCandidates', z.object({ candidates: z.array(z.object({
            id: textSchema.optional(), name: textSchema.optional(), fileName: textSchema.optional(), mimeType: textSchema.optional(), data: textSchema.optional(), base64: textSchema.optional(), sourcePath: textSchema.optional(), metadata: jsonObject.optional()
        })), autoAdopt: z.object({
            path: textSchema.optional(), assetId: textSchema.optional(), metadata: jsonObject.optional()
        }).optional() }), z.array(registeredCandidate)), adoptVersion: command('adoptVersion', z.object({
        candidateId: textSchema.optional(), versionId: textSchema.optional(), assetId: textSchema.optional(), path: textSchema.optional(), fileName: textSchema.optional(), metadata: jsonObject.optional()
    }), assetSchema), compileStory: command('compileStory', z.object({
        entry: textSchema, storyId: textSchema.optional(), dryRun: booleanSchema.optional()
    }), compileResult),
    stageDocumentsCandidate: command('stageDocumentsCandidate', z.object({
        featureId: textSchema, brief: textSchema, documents: z.array(documentDraft)
    }), staged), stageStoryCandidate: command('stageStoryCandidate', z.object({
        featureId: textSchema, storyId: textSchema, entryPath: textSchema, brief: textSchema, documents: z.array(documentDraft), referenceDocuments: z.array(documentDraft).optional(), assets: z.array(z.object({ candidateId: textSchema, path: textSchema })).optional(), npcs: z.array(jsonObject).optional(), items: z.array(jsonObject).optional(), shops: z.array(jsonObject).optional(), recipes: z.array(jsonObject).optional(), quests: z.array(jsonObject).optional(), copyEdits: z.array(jsonObject).optional(), launch: z.object({
            hubPath: textSchema, locationId: textSchema, actionId: textSchema, label: textSchema
        }).optional()
    }), staged),
    createCardBatch: command('createCardBatch', z.object({
        cardIds: stringListSchema, featureId: textSchema, requestId: textSchema.optional(), sourceRevisions: z.record(textSchema, textSchema).optional(), brief: textSchema
    }), z.object({ production })), saveCardDraft: command('saveCardDraft', z.object({
        productionId: textSchema, cardId: textSchema, baseRevision: numberSchema, definition: jsonObject, presentation: jsonObject.optional()
    }), z.object({ production })), createTodo: command('createTodo', z.object({
        title: textSchema, description: textSchema, priority: textSchema, category: textSchema, context: jsonObject
    }), z.object({ item: z.object({ id: textSchema }) }))
} as const;
export const configureProjectContract = extensionMethod({
    extension: 'cardgame-content', method: 'configureProject', input:z.strictObject({root:textSchema.trim().min(1),desktopId:textSchema.optional()}), output: z.object({
        configured: z.literal(true), projectId: textSchema, projectRoot: textSchema, notes: z.record(textSchema, textSchema)
    })
});
export const referenceResourceSchema = z.object({
    title: textSchema, path: textSchema, root: textSchema.optional(), linkBase: textSchema.optional(), revision: textSchema.optional()
});
export const referenceDocumentSchema = z.object({
    content: textSchema, path: textSchema.optional(), title: textSchema.optional(), revision: textSchema.optional(), format: textSchema.optional()
});
export const featureChoicesSchema = z.object({ items: z.array(z.object({ id: textSchema, title: textSchema })) });
export const localActions = {
    discussAudio: { input: emptyInputSchema, output: z.object({ sessionId: textSchema }) }, discussSelection: { input: z.object({ itemIds: stringListSchema.optional() }), output: z.object({ sessionId: textSchema }) }, addResource: { input: z.object({ path: textSchema, title: textSchema.optional() }), output: referenceResourceSchema }, rejectAssetVersion: { input: z.object({ assetId: textSchema, reason: textSchema.optional() }), output: z.object({
            reverted: booleanSchema, versionId: textSchema.optional(), todoId: textSchema.optional()
        }) }, createCardWorkflow: { input: z.object({
            itemIds: stringListSchema, featureId: textSchema, draft: jsonObject.optional(), expectedRevision: textSchema.optional(), requestId: textSchema.optional()
        }), output: z.object({ noteId: textSchema, itemId: textSchema }) }, switchCardTheme: { input: z.object({
            id: textSchema, themeId: textSchema, expectedRevision: textSchema
        }), output: cardSchema }
};

/** Workflow reads contain displayed facts, never frozen delivery payloads or execution history. */
export const todoImageSchema=z.object({id:textSchema,dataUrl:textSchema,type:z.enum(['image/png','image/jpeg','image/webp','image/gif']).optional(),name:textSchema.optional(),width:numberSchema.optional(),height:numberSchema.optional()});
const todoMetadata={projectId:textSchema,projectGeneration:textSchema.optional(),id:textSchema,status:z.enum(['todo','in_progress','done','blocked']),completed:booleanSchema.optional(),priority:z.enum(['low','medium','high']),category:textSchema.optional(),dueDate:textSchema.optional(),taskId:textSchema.optional(),delegationId:textSchema.optional(),productionId:textSchema.optional(),revision:numberSchema,requirementRevision:numberSchema,createdAt:textSchema,updatedAt:textSchema};
export const todoRequirementSchema=z.object({...todoMetadata,title:textSchema,description:textSchema.optional(),images:z.array(todoImageSchema).optional(),conclusion:textSchema.optional()});
export const todoSummarySchema=z.object({...todoMetadata,title:textSchema,titleTruncated:booleanSchema.optional(),description:textSchema.optional(),descriptionTruncated:booleanSchema.optional(),conclusion:textSchema.optional(),conclusionTruncated:booleanSchema.optional(),imageCount:numberSchema,imageNames:stringListSchema,hasDelivery:booleanSchema.optional()});
export const todoTextSchema=todoRequirementSchema.omit({images:true,conclusion:true});
export const todoReadSchema=z.object({item:todoRequirementSchema,requirementFingerprint:textSchema});
export const todoReceiptSchema=z.object({projectId:textSchema,projectGeneration:textSchema.optional(),id:textSchema,revision:numberSchema,requirementRevision:numberSchema,requirementFingerprint:textSchema});
export const todoHistorySchema=z.object({history:z.array(z.object({id:numberSchema,projectId:textSchema,itemId:textSchema,kind:z.literal('todo'),event:textSchema,revision:numberSchema,payload:z.json(),createdAt:textSchema})),nextCursor:textSchema.optional(),historyLimit:numberSchema});
export const workflowReadContracts={
 todoHistory:query('todo',z.object({projectId:textSchema.optional(),projectGeneration:textSchema.optional(),id:textSchema,view:z.literal('history'),historyCursor:textSchema.optional(),historyLimit:numberSchema.optional()}),todoHistorySchema),
 todoSummary:query('todo',z.object({id:textSchema,view:z.literal('summary')}),z.object({item:todoSummarySchema})),
 todoTexts:query('todos',z.object({projectId:textSchema.optional(),view:z.literal('text'),cursor:textSchema.optional(),limit:numberSchema.optional(),q:textSchema.optional(),category:textSchema.optional(),status:z.enum(['todo','in_progress','done','blocked']).optional()}),z.object({items:z.array(todoTextSchema),next:textSchema.optional(),revision:textSchema,total:numberSchema})),
 workflowStatus:query('workflowStatus',emptyInputSchema,z.object({counts:z.object({todos:numberSchema,todo:numberSchema,inProgress:numberSchema,done:numberSchema,blocked:numberSchema})})),
 categories:query('categories',z.object({projectId:textSchema.optional(),cursor:textSchema.optional(),limit:numberSchema.optional()}),z.object({items:z.array(z.object({category:textSchema,count:numberSchema.int().nonnegative()})),next:textSchema.optional(),revision:textSchema,total:numberSchema.int().nonnegative()})),
 todos:query('todos',z.object({projectId:textSchema.optional(),cursor:textSchema.optional(),limit:numberSchema.optional(),q:textSchema.optional(),category:textSchema.optional(),status:z.enum(['todo','in_progress','done','blocked']).optional()}),z.object({items:z.array(todoSummarySchema),next:textSchema.optional(),revision:textSchema,total:numberSchema})),
 todo:query('todo',z.object({projectId:textSchema.optional(),projectGeneration:textSchema.optional(),id:textSchema}),todoReadSchema),
};
export type TodoImage=z.output<typeof todoImageSchema>;
export type TodoRequirement=z.output<typeof todoRequirementSchema>;
export type TodoSummary=z.output<typeof todoSummarySchema>;
export type TodoRead=z.output<typeof workflowReadContracts.todo.output>;
export type TodoReceipt=z.output<typeof todoReceiptSchema>;

export type TodoText=z.output<typeof todoTextSchema>;
