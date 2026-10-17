import { cardgameSelectionLines } from './context';
import { createPinnedReferenceService, pinnedReferenceLines } from './pinned-references';
import { createBattleExecutionService } from './battle-execution-service';
import { createFormalPreviewService } from './formal-preview';
import { createStoryExecutionService } from './story-execution-service';
import { cardgameNativeWriteDenial } from './native-guard';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WorkaExtensionHost } from '@realiz3r/worka/host';
import type { Caller } from '@realiz3r/worka/host';
type MediaCapabilities = NonNullable<WorkaExtensionHost['media']>;
import type { ResourceValue } from '@realiz3r/worka/host';
import { createContentService } from './content';
import { createWorkflowService, type GameCandidateRecord, type ProductionRecord } from './workflow';
import { assertDeckWriteAccess } from './deck-plan';
import { createCardPipeline, CARD_PIPELINE_COMMANDS } from './card-pipeline';
import { createCodexImageGenerator } from './codex-imagegen';
import { candidateCardKind, createGameCandidateService } from './game-candidates';
import { createGameAdoptionService } from './game-adoption';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import type { ContentCommandMethod } from './types';
import type { GameChangeSummary } from './changes';

/** Source comes from host-owned access and the registered native session, never command input. */
export async function verifiedCardDraftSource(app: Pick<WorkaExtensionHost['app'], 'dispatch'>, caller: Caller): Promise<{ _draftOrigin: 'agent' | 'user' | 'unknown'; _draftSource?: { kind: 'native-session'; noteId: string; sessionId: string } }> {
  if (caller.kind === 'user') return { _draftOrigin: 'user' };
  if (caller.kind !== 'agent' || !caller.noteId || !caller.sessionId) return { _draftOrigin: 'unknown' };
  try {
    const session = await app.dispatch('session.get', { sessionId: caller.sessionId, noteId: caller.noteId }, caller) as { id?: string; noteId?: string; hasMessages?: boolean };
    if (session.id === caller.sessionId && session.noteId === caller.noteId && session.hasMessages === true) {
      return { _draftOrigin: 'agent', _draftSource: { kind: 'native-session', noteId: caller.noteId, sessionId: caller.sessionId } };
    }
  } catch { /* Keep the source unverified when a native session cannot be checked. */ }
  return { _draftOrigin: 'unknown' };
}

export interface CardgameProject { id: string; root: string; title?: string; battlePhaserModule?: string; cardFaceFont?: { file: string; family: string } }
const workflowQueries = new Set(['todos', 'todo', 'productions', 'production', 'workflowStatus', 'gameCandidates', 'changes']);
const contentCommands = new Set(['saveDocument', 'moveDocument', 'updateCard', 'updateAsset', 'registerCandidates', 'adoptVersion', 'compileStory']);
const formalMutations = new Set(['saveDocument', 'moveDocument', 'updateCard', 'updateAsset', 'adoptVersion', 'compileStory', 'adoptAsset']);
const internalWorkflowCommands = new Set(['recordGameCandidate', 'recordGameAdoption']);

export function requiredGamePreviewChecks(candidate: Pick<GameCandidateRecord, 'kind' | 'deckArtFingerprints' | 'shopTargets' | 'recipeIds' | 'itemUseIds' | 'questIds' | 'copyPaths' | 'portraitPaths' | 'itemIconPaths'>, cardKind?: string): string[] {
  if (candidate.kind === 'deck') return ['game-shell', 'content-catalog', 'deck-definition', 'deck-composition', ...(candidate.deckArtFingerprints ? ['deck-art'] : [])];
  if (candidate.kind === 'documents') return ['game-shell', 'content-catalog', 'knowledge-documents'];
  if (candidate.kind === 'story') return ['game-shell', 'content-catalog', 'story-resource', 'story-route',
    ...(candidate.shopTargets?.length ? ['story-shops'] : []),
    ...(candidate.recipeIds?.length ? ['story-recipes'] : []),
    ...(candidate.itemUseIds?.length || candidate.itemIconPaths?.length ? ['story-items'] : []),
    ...(candidate.questIds?.length ? ['story-quests'] : []),
    ...(candidate.copyPaths?.length ? ['story-copy'] : []),
    ...(candidate.portraitPaths?.length ? ['story-portraits'] : []),
    ...(candidate.itemIconPaths?.length ? ['story-item-icons'] : [])];
  return ['game-shell', 'content-catalog', 'card-definition', 'card-themes',
    cardKind === 'pill' || cardKind === 'skill' ? 'playable-loadout' : 'playable-deck'];
}

export function candidatePreviewOptions(candidate: GameCandidateRecord) {
  const cardKind = candidate.kind === 'story' || candidate.kind === 'documents' || candidate.kind === 'deck' ? undefined : candidateCardKind(candidate);
  return { projectId: candidate.projectId, ...(candidate.kind !== 'documents' ? { cardId: candidate.cardId } : {}), candidateHash: candidate.candidateHash,
    ...(cardKind && cardKind !== 'unit' ? { cardKind } : {}),
    ...(candidate.kind === 'deck' ? { candidateKind: 'deck', deckPath: candidate.deckPath, deckCardIds: candidate.deckCardIds, placeholderCardIds: candidate.placeholderCardIds, ...(candidate.deckArtFingerprints ? { deckArtFingerprints: candidate.deckArtFingerprints } : {}) } : {}),
    ...(candidate.kind === 'documents' ? { candidateKind: 'documents', documentRevisions: candidate.dependencies } : {}),
    ...(candidate.kind === 'story' ? { storyId: candidate.targetId,
      ...(candidate.entryHubId && candidate.entryActionId ? { entryHubId: candidate.entryHubId, entryActionId: candidate.entryActionId } : {}),
      ...(candidate.shopTargets?.length ? { shopTargets: candidate.shopTargets } : {}),
      ...(candidate.recipeIds?.length ? { recipeIds: candidate.recipeIds } : {}),
      ...(candidate.itemUseIds?.length ? { itemUseIds: candidate.itemUseIds } : {}),
      ...(candidate.questIds?.length ? { questIds: candidate.questIds } : {}),
      ...(candidate.copyPaths?.length ? { copyPaths: candidate.copyPaths } : {}),
      ...(candidate.portraitPaths?.length ? { portraitPaths: candidate.portraitPaths } : {}),
      ...(candidate.itemIconPaths?.length ? { itemIconPaths: candidate.itemIconPaths } : {}) } : {}) };
}

export async function createCardgameProvider(host: WorkaExtensionHost, media: Pick<MediaCapabilities, 'register' | 'issue'>, packageRoot: string, bunPath: string, projects: CardgameProject[], resolvePreviewNote: (projectId: string) => Promise<string>) {
  const options = { dataRoot: resolve(host.dataRoot, 'plugins/cardgame-content'), projects };
  const content = await createContentService(options);
  const battleExecution = await createBattleExecutionService({ ...options, packageRoot, subprocess: host.runtime.subprocess, bunPath, resolveCandidate: async (projectId, ref) => {
    const detail = await workflows.query({ projectId, op: 'production', productionId: ref.productionId }) as { production: ProductionRecord };
    const candidate = detail.production.gameCandidates?.find(item => item.id === ref.candidateId);
    if (!candidate || candidate.candidateHash !== ref.candidateHash) throw Error('所选候选身份已变化，请刷新后重新选择');
    return gameAdoptions.snapshotSource({ projectId, productionId: ref.productionId, candidateId: ref.candidateId, candidateHash: ref.candidateHash,
      featureId: candidate.featureId, targetBaseRevision: candidate.targetBaseRevision, validationManifest: candidate.validationManifest });
  } });
  const storyExecution = createStoryExecutionService({ ...options, packageRoot, content, subprocess: host.runtime.subprocess, bunPath });
  const workflows = await Promise.resolve().then(() => createWorkflowService(options)).catch(async error => { await Promise.allSettled([battleExecution.close(), storyExecution.close(), content.close()]); throw error; });
  const pinnedReferences = createPinnedReferenceService(host.app.core, input => input.op === 'battleComparison' ? battleExecution.compare(String(input.projectId), input.before as any, input.after as any) : input.op === 'production' ? workflows.query(input) : content.query(input as any));
  const previewNote = async (candidate: Pick<GameCandidateRecord, 'projectId'>) => {
    const noteId = await resolvePreviewNote(candidate.projectId);
    const config = await host.app.core.readRecord<any>('states', `${noteId}:config`);
    if (config?.value?.projectId !== candidate.projectId) throw Error('试玩便笺绑定了另一项目');
    return noteId;
  };
  const registerPreview = async (candidate: GameCandidateRecord) => {
    const noteId = await previewNote(candidate);
    return host.app.requireEngine().invoke(noteId, 'receive', {
      key: candidate.id, title: candidate.kind === 'deck' ? `牌组 ${candidate.targetId}` : candidate.kind === 'story' ? `剧情 ${candidate.targetId}` : candidate.kind === 'documents' ? `资料 ${candidate.targetId}` : `卡牌 ${candidate.cardId}`, featureId: candidate.featureId,
      adapter: join(candidate.repo, 'knowledge/tools/preview/preview.config.mjs'),
      repos: { game: { repo: candidate.repo, commit: candidate.commit } },
      options: candidatePreviewOptions(candidate), start: true,
    }, { kind: 'action', noteId });
  };
  const gameCandidates = createGameCandidateService({ ...options, content, workflow: workflows, registerPreview, deckPreviewAdapter: resolve(packageRoot, 'plugins/cardgame-content/preview/preview.config.mjs') });
  const formalPreview = createFormalPreviewService({ ...options, register: async (record, repo) => {
    const noteId = await previewNote(record);
    const note = await host.app.note(noteId);
    if (!host.runtime.previews?.command) throw Error('宿主没有提供受管预览命令');
    return host.runtime.previews.command('receive', {
      key: record.key, title: `正式内容快照 · ${record.createdAt}`, adapter: resolve(packageRoot, 'plugins/cardgame-content/preview/preview.config.mjs'),
      repos: { game: { repo, commit: record.commit } },
      options: { projectId: record.projectId, profile: 'formal-snapshot', formalPreview: true, snapshotRevision: record.snapshotRevision, snapshotCreatedAt: record.createdAt }, start: true,
    }, { access: { noteId, version: note.value.codeVersion ?? '', caller: { kind: 'system' } } });
  } });
  const previewEvidence = async (candidate: GameCandidateRecord) => {
    const noteId = await previewNote(candidate);
    const note = await host.app.note(noteId);
    const state = await host.app.core.readRecord<any>('states', note.value.stateRef);
    const entry = state?.value?.candidates?.find((item: any) => item.key === candidate.id);
    const expectedAdapter = join(candidate.repo, 'knowledge/tools/preview/preview.config.mjs');
    const expectedRepos = { game: { repo: candidate.repo, commit: candidate.commit } };
    const cardKind = candidate.kind === 'story' || candidate.kind === 'documents' || candidate.kind === 'deck' ? undefined : candidateCardKind(candidate);
    const expectedOptions = candidatePreviewOptions(candidate);
    if (entry?.adapter !== expectedAdapter || !isDeepStrictEqual(entry.repos, expectedRepos)
      || !isDeepStrictEqual(entry.options, expectedOptions)) throw Error('请先在试玩便笺完成这个确切候选的运行与验证');
    // The note stores JSON properties in its own order. Match their values,
    // then bind the proof to the exact stored request that the preview ran.
    const fingerprint = createHash('sha256').update(JSON.stringify({ adapter: entry.adapter, repos: entry.repos, options: entry.options })).digest('hex').slice(0, 16);
    const status = entry.status?.web;
    if (status?.phase !== 'ready' || status.source !== fingerprint || status.verified?.ok !== true) throw Error('请先在试玩便笺完成这个确切候选的运行与验证');
    const passed = new Set((status.verified.checks ?? []).filter((check: any) => check.ok).map((check: any) => check.name));
    const required = requiredGamePreviewChecks(candidate, cardKind);
    if (!required.every(name => passed.has(name))) throw Error('游戏候选的验证项目不完整');
  };
  const gameAdoptions = createGameAdoptionService({ ...options, workflow: workflows, previewEvidence });
  try { await gameAdoptions.recover(); }
  catch (error) { await Promise.allSettled([battleExecution.close(), storyExecution.close(), gameAdoptions.close(), gameCandidates.close(), content.close(), workflows.close()]); throw error; }
  const pipeline = createCardPipeline(content, workflows, Object.fromEntries(projects.filter(project => project.cardFaceFont).map(project => [project.id, project.cardFaceFont!])), gameCandidates, { imageGenerator: createCodexImageGenerator() });
  const projectIds = new Set(projects.map(project => project.id));
  const featureProgressNote = async (noteId?: string) => {
    if (!noteId) return false;
    const note = await host.app.note(noteId);
    return Boolean(note.value.actions?.includes('confirmGameCandidate') && note.value.actions?.includes('undoGameCandidate'));
  };
  const assertProject = async (input: Record<string, unknown>, noteId?: string, featureProgress = false) => {
    if (typeof input.projectId !== 'string' || !projectIds.has(input.projectId)) throw Error('项目尚未登记，请先在内容库选择 CardGame 项目目录');
    if (noteId) {
      const config = await host.app.core.readRecord<any>('states', `${noteId}:config`);
      if (config?.value?.projectId !== input.projectId && !(featureProgress && await featureProgressNote(noteId))) throw Error('便笺尚未绑定这个项目');
    }
  };
  let removeMedia: () => void = () => {};
  let closing: Promise<void> | undefined;
  const close = () => closing ??= (async () => {
    const failures: unknown[] = [];
    try { removeMedia(); } catch (error) { failures.push(error); }
    // Drain dependants before closing their stores; one failing close cannot
    // skip another owner or leak its watchers/database handles.
    for (const phase of [[() => formalPreview.close(), () => battleExecution.close(), () => storyExecution.close(), () => pipeline.close()], [() => gameCandidates.close(), () => gameAdoptions.close()], [() => content.close(), () => workflows.close()]]) {
      const results = await Promise.allSettled(phase.map(dispose => Promise.resolve().then(dispose)));
      for (const result of results) if (result.status === 'rejected') failures.push(result.reason);
    }
    if (failures.length) throw new AggregateError(failures, 'CardGame content shutdown failed');
  })();
  try {
    removeMedia = media.register('cardgame-content', async input => {
      await assertProject(input);
      const file = await content.resolveMedia(input as any);
      return { ...file, path: file.absolutePath ?? file.path };
    });
    return {
      beforeNativeTool: input => cardgameNativeWriteDenial(host.app.core, input.sessionId, input.name, input.parentSessionId),
      noteContext: async note => {
        const lines = await cardgameSelectionLines(host, note);
        const config = await host.app.core.readRecord<{ projectId?: string }>('states', `${note.id}:config`);
        const projectId = config?.value.projectId;
        if (!projectId || !projectIds.has(projectId)) return lines;
        try { return [...lines, ...pinnedReferenceLines((await pinnedReferences.query(projectId)).items)]; }
        catch { return [...lines, '固定引用当前无法核对；不要把旧上下文当成当前内容。']; }
      },
      resources: { query: {
        version: '1',
        async load(value, context) {
          const input = value as Record<string, unknown>;
          if (input.op === 'previewReferenceTarget') {
            await assertProject(input, context.scope.noteId);
            const page = await workflows.query({ projectId: input.projectId, op: 'gameCandidates' }) as { items: GameCandidateRecord[] };
            const candidate = page.items.find(item => item.id === input.key && item.commit === input.commit);
            if (!candidate) throw Error('当前预览不是已登记的游戏候选，或提交已变化');
            return await pinnedReferences.describe(String(input.projectId), { kind: 'candidate', id: candidate.id, context: { productionId: candidate.productionId, commit: candidate.commit } }) as unknown as ResourceValue;
          }
          if (input.op === 'pinnedReferences' || input.op === 'pinnedReferenceTarget') {
            await assertProject(input, context.scope.noteId);
            return await (input.op === 'pinnedReferenceTarget' ? pinnedReferences.describe(String(input.projectId), input) : pinnedReferences.query(String(input.projectId))) as unknown as ResourceValue;
          }
          if (input.op === 'formalPreview') {
            await assertProject(input, context.scope.noteId);
            return await formalPreview.query(String(input.projectId)) as ResourceValue;
          }
          if (input.op === 'featureChanges') {
            if (!await featureProgressNote(context.scope.noteId)) throw Error('只有功能进展可读取游戏改动');
            await assertProject(input, context.scope.noteId, true);
            const page = await workflows.query({ ...input, op: 'changes' }) as { items: GameChangeSummary[] };
            return { ...page, items: await Promise.all(page.items.map(async change => {
              const { production } = await workflows.query({ projectId: change.projectId, op: 'production', id: change.productionId }) as { production: import('./workflow').ProductionRecord };
              const candidates = await Promise.all(change.candidates.map(async candidate => ({ ...candidate,
                previewVerified: candidate.current && candidate.status === 'candidate'
                  ? await previewEvidence(production.gameCandidates!.find(item => item.id === candidate.id)!).then(() => true, () => false) : false,
              })));
              return { ...change, candidates, stage: change.stage === 'checking' && candidates.some(candidate => candidate.current && candidate.status === 'candidate' && candidate.previewVerified) ? 'review' : change.stage };
            })) } as ResourceValue;
          }
          if (input.op === 'gameCandidateDiff') {
            await assertProject(input, context.scope.noteId);
            const detail = await workflows.query({ projectId: input.projectId, op: 'production', productionId: input.productionId }) as { production: ProductionRecord };
            const candidate = detail.production.gameCandidates?.find(item => item.id === input.candidateId);
            if (!candidate) throw Error('找不到制作单对应的候选');
            return await gameAdoptions.inspect({ projectId: candidate.projectId, productionId: candidate.productionId, candidateId: candidate.id,
              featureId: candidate.featureId, candidateHash: candidate.candidateHash, targetBaseRevision: candidate.targetBaseRevision, validationManifest: candidate.validationManifest }) as ResourceValue;
          }
          if (input.op === 'featureCandidates') {
            if (!await featureProgressNote(context.scope.noteId)) throw Error('只有功能进展可读取游戏候选');
            const groups = await Promise.all(projects.map(async project => workflows.query({ projectId: project.id, op: 'gameCandidates' }) as Promise<{ items: GameCandidateRecord[] }>));
            const items = groups.flatMap(group => group.items);
            return { items: await Promise.all(items.map(async candidate => {
              const { repo: _repo, dependencies: _dependencies, ...publicCandidate } = candidate;
              const previewVerified = await previewEvidence(candidate).then(() => true, () => false);
              return { ...publicCandidate, previewVerified };
            })) } as ResourceValue;
          }
          await assertProject(input, context.scope.noteId);
          if (input.op === 'battleExperiments') return await battleExecution.query(String(input.projectId)) as ResourceValue;
          if (input.op === 'battleSources') {
            const page = await workflows.query({ projectId: input.projectId, op: 'gameCandidates' }) as { items: GameCandidateRecord[] };
            return { items: page.items.map(item => ({ productionId: item.productionId, candidateId: item.id, candidateHash: item.candidateHash, commit: item.commit,
              kind: item.kind ?? 'card', targetId: item.targetId ?? item.cardId ?? item.id, status: item.status })) } as ResourceValue;
          }
          if (input.op === 'battleComparison') return await battleExecution.compare(String(input.projectId), input.before as any, input.after as any) as ResourceValue;
          if (input.op === 'storyExecutionReport') return await storyExecution.query(String(input.projectId), String(input.id)) as ResourceValue;
          if (input.op === 'cardBatch' || input.op === 'cardFaceThemes') return JSON.parse(JSON.stringify(await pipeline.query(input))) as ResourceValue;
          if (input.op === 'media' && input.variant !== 'waveform') {
            const file = await content.resolveMedia(input as any);
            const { path: _path, absolutePath: _absolutePath, ...metadata } = file;
            return { ...metadata, url: media.issue('cardgame-content', input) } as ResourceValue;
          }
          if (workflowQueries.has(String(input.op))) {
            return await workflows.query(input, { execution: async binding => {
              if (!binding.deskNoteId || !binding.delegationId) return null;
              await assertProject(input, binding.deskNoteId);
              const desk = await host.app.note(binding.deskNoteId);
              const task = await host.app.core.readProjected<any, any>('states', desk.value.stateRef, state => {
                const item = state?.delegations?.[binding.delegationId!];
                return item ? { id: item.id, status: item.status, updatedAt: item.updatedAt, outcome: item.outcome ?? null, delivery: item.delivery ?? null } : null;
              });
              return task?.value ?? null;
            } }) as ResourceValue;
          }
          return await content.query(input as any) as ResourceValue;
        },
        async subscribe(input, invalidate) {
          if (['pinnedReferences', 'pinnedReferenceTarget', 'previewReferenceTarget'].includes(String((input as any).op))) {
            const releases = [pinnedReferences.subscribe(String((input as any).projectId), invalidate), content.subscribe(() => invalidate()), workflows.subscribe(() => invalidate()), battleExecution.subscribe(invalidate)];
            return () => { for (const release of releases) release(); };
          }
          if ((input as any).op === 'battleSources') return workflows.subscribe(() => invalidate());
          if (['battleExperiments', 'battleComparison'].includes(String((input as any).op))) return battleExecution.subscribe(invalidate);
          if ((input as any).op === 'storyExecutionReport') {
            const release = storyExecution.subscribe(invalidate), releaseContent = content.subscribe(() => invalidate());
            return () => { release(); releaseContent(); };
          }
          if ((input as any).op === 'gameCandidateDiff') {
            const releaseWorkflow = workflows.subscribe(() => invalidate());
            const releaseContent = content.subscribe(() => invalidate());
            return () => { releaseWorkflow(); releaseContent(); };
          }
          const store = workflowQueries.has(String((input as any).op)) || (input as any).op === 'cardBatch' || (input as any).op === 'featureCandidates' || (input as any).op === 'featureChanges' ? workflows : content;
          const release = store.subscribe(() => invalidate());
          if (!['featureCandidates', 'featureChanges'].includes(String((input as any).op))) return release;
          // Preview verification changes independently of production receipts.
          // Subscribe to the existing preview state instead of giving views a polling timer.
          try {
            const projectId = String((input as any).projectId ?? projects[0]?.id ?? '');
            if (!projectIds.has(projectId)) return release;
            const preview = await host.app.note(await resolvePreviewNote(projectId));
            const releasePreview = host.app.core.subscribe('states', preview.value.stateRef, () => invalidate());
            return () => { releasePreview(); release(); };
          } catch (error) { release(); throw error; }
        },
      } },
      async invoke(method, input, caller) {
        await assertProject(input, caller.noteId, method === 'confirmGameCandidate' || method === 'undoGameCandidate');
        if (method === 'pinReference' || method === 'removePinnedReference') {
          if (!caller.noteId || caller.dryRun || caller.replay) throw Error('请从项目便笺操作固定引用');
          return method === 'pinReference' ? pinnedReferences.pin(String(input.projectId), input) : pinnedReferences.remove(String(input.projectId), input.key);
        }
        if (method === 'prepareFormalPreview') {
          if (!caller.noteId || caller.dryRun || caller.replay) throw Error('请从试玩便笺明确准备正式内容快照');
          if (caller.noteId !== await previewNote({ projectId: String(input.projectId) })) throw Error('只有已登记的试玩便笺可准备正式内容快照');
          return formalPreview.prepare(String(input.projectId), input.fresh === true);
        }
        if (method === 'prepareBattleExperiment' || method === 'stopBattleExperiment') {
          if (!caller.noteId || caller.dryRun || caller.replay) throw Error('自动对局只能从正常运行的便笺显式启动或停止');
          if (method === 'stopBattleExperiment') { await battleExecution.stop(String(input.projectId)); return { stopped: true }; }
          const result = await battleExecution.start(String(input.projectId), input.fresh === true, input.candidate as any);
          return { id: result.id, url: result.url, snapshotId: result.snapshotId };
        }
        if (method === 'analyzeStoryPaths') {
          if (!caller.noteId) throw Error('请从剧情便笺启动检查');
          const note = await host.app.note(caller.noteId);
          return storyExecution.run(String(input.projectId), String(input.id), String(input.expectedRevision ?? ''), { noteId: caller.noteId, version: note.value.codeVersion ?? '', caller: { ...caller, kind: caller.kind === 'action' ? 'system' : caller.kind } });
        }
        if (formalMutations.has(method) && !(method === 'compileStory' && input.dryRun === true)) throw Error('正式项目改动需先建立可试玩候选，再到功能进展确认采用');
        if (internalWorkflowCommands.has(method)) throw Error('候选与采用记录只能由制作及采用服务写入');
        if (method === 'confirmGameCandidate' || method === 'undoGameCandidate') {
          if (caller.kind !== 'user' || !await featureProgressNote(caller.noteId)) throw Error('只有功能进展中的用户操作可以确认或撤销');
          return method === 'confirmGameCandidate' ? gameAdoptions.confirm(input) : gameAdoptions.undo(input);
        }
        if (method === 'stageStoryCandidate' || method === 'stageDocumentsCandidate') {
          if (!caller.noteId) throw Error('资料或剧情候选需要知识库便笺来源');
          const config = await host.app.core.readRecord<any>('states', `${caller.noteId}:config`);
          if (config?.value?.mode !== 'knowledge') throw Error('只有知识库便笺可以建立资料或剧情候选');
          return method === 'stageStoryCandidate' ? gameCandidates.stageStory(input as any) : gameCandidates.stageDocuments(input as any);
        }
        assertDeckWriteAccess(method, input, caller.kind);
        if (CARD_PIPELINE_COMMANDS.has(method)) {
          const source = method === 'setCardDrafts' || method === 'createCardBatch' ? await verifiedCardDraftSource(host.app, caller) : { _draftOrigin: 'unknown' as const };
          return pipeline.command(method, { ...input, _draftSource: undefined, ...source });
        }
        if (method === 'requestPreviewRepair') {
          if (caller.kind !== 'user' || !caller.noteId) throw Error('修复需要执行台中的用户操作');
          const desk = await host.app.note(caller.noteId);
          const state = await host.app.core.readRecord<any>('states', desk.value.stateRef);
          const task = state?.value?.delegations?.[String(input.delegationId)];
          const feedback = task?.feedback?.find((item: any) => item.id === input.feedbackId && item.candidateKey && item.status === 'failed');
          if (!feedback) throw Error('找不到这个任务的预览失败记录');
          const relations = (await host.app.skillConnections.list(desk.value.desktopId)).filter(relation =>
            relation.enabled && !relation.archived && relation.nodeIds.includes(caller.noteId!) &&
            relation.nodes.some(node => node.noteId === caller.noteId && node.available.actions.some(action => action.name === 'acceptPreviewFeedback')) &&
            relation.nodes.some(node => node.noteId !== caller.noteId && node.available.actions.some(action => action.name === 'receive') && node.available.queries.some(query => query.name === 'candidate')));
          const previewIds = [...new Set(relations.flatMap(relation => relation.nodes.filter(node => node.noteId !== caller.noteId && node.available.actions.some(action => action.name === 'receive')).map(node => node.noteId)))];
          const previewId = typeof task.preview?.noteId === 'string' ? task.preview.noteId : previewIds.length === 1 ? previewIds[0] : undefined;
          if (!previewId || !previewIds.includes(previewId)) throw Error('候选预览 Skill 连线不可用或来源不明确');
          return host.app.requireEngine().invoke(previewId, 'requestRepair', {
            key: feedback.candidateKey, revision: feedback.revision, runId: feedback.runId, surface: feedback.surface,
          }, { kind: 'user', noteId: caller.noteId });
        }
        return contentCommands.has(method)
          ? content.command(method as ContentCommandMethod, input)
          : workflows.command(method, input as any);
      },
      close,
    } satisfies import('@realiz3r/worka/host').Extension;
  } catch (cause) {
    try { await close(); }
    catch (cleanupError) { throw new AggregateError([cause, cleanupError], 'CardGame extension activation failed'); }
    throw cause;
  }
}
