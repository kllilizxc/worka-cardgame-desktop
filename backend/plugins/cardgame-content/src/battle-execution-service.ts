import { isPathDescendant } from './path-safety';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, readdir, stat, realpath, lstat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join } from 'node:path';
import type { ManagedProcess, ProcessReadable, SubprocessHost } from '@realiz3r/worka/host';
import type { ContentProject } from './types';
import { createBattleSnapshot, readBattleProjectRevision } from './battle-snapshot';
import { compareBattleExperiments, type BattleExperimentReport } from './battle-experiment';

export type BattleReportRef = { experimentId: string; reportId: string };
export type BattleCandidateRef = { productionId: string; candidateId: string; candidateHash: string };
type ExperimentSource = { kind: 'registered-project' } | (BattleCandidateRef & { kind: 'candidate'; commit: string });
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

type Project = ContentProject & { battlePhaserModule?: string };
type Experiment = { id: string; projectId: string; snapshotId: string; snapshotDirectory: string; output: string; contentRevision: string; sourceRevision: string; source?: ExperimentSource; createdAt: string; status: 'preparing' | 'running' | 'stopped' | 'failed'; url?: string; runtimeRevision?: string; error?: string };
export async function createBattleExecutionService(options: { dataRoot: string; packageRoot: string; projects: Project[]; subprocess: SubprocessHost; bunPath: string; startupTimeoutMs?: number; resolveCandidate?: (projectId: string, candidate: BattleCandidateRef) => Promise<{ root: string; source: Extract<ExperimentSource, { kind: 'candidate' }>; verify(): Promise<void> }> }) {
  const directory = join(options.dataRoot, 'battle-experiments');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const live = new Map<string, { process: ManagedProcess; done: Promise<void> }>(), pending = new Map<string, Promise<Experiment>>(), stopping = new Set<string>(), listeners = new Set<() => void>();
  const pendingSelections = new Map<string, string>();
  let closed = false;
  const invalidate = () => { for (const listener of listeners) { try { listener(); } catch {} } };
  const watcher = watch(directory, { recursive: true }, invalidate);
  watcher.on('error', () => invalidate());
  const rootFor = (projectId: string) => {
    const project = options.projects.find(item => item.id === projectId);
    if (!project) throw Error('未登记的游戏项目');
    return { project, root: join(directory, createHash('sha256').update(projectId).digest('hex')) };
  };
  async function load(projectId: string): Promise<Experiment | undefined> {
    const { root } = rootFor(projectId);
    try { return JSON.parse(await readFile(join(root, 'current.json'), 'utf8')); } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return; throw error; }
  }
  async function save(record: Experiment) {
    const { root } = rootFor(record.projectId); await mkdir(root, { recursive: true, mode: 0o700 });
    const temp = join(root, randomUUID() + '.tmp'); await writeFile(temp, JSON.stringify(record), { mode: 0o600 }); await rename(temp, join(root, 'current.json')); invalidate();
    const runRoot = join(root, 'runs', record.id), runTemp = join(runRoot, randomUUID() + '.tmp');
    await writeFile(runTemp, JSON.stringify(record), { mode: 0o600 }); await rename(runTemp, join(runRoot, 'experiment.json'));
  }
  async function query(projectId: string) {
    const { root, project } = rootFor(projectId), record = await load(projectId);
    const sources = new Map<string, ExperimentSource>(), records = new Map<string, Experiment>();
    const reportFiles: Array<{ path: string; modified: number; experimentId: string; reportId: string }> = [];
    const entries = await readdir(join(root, 'runs')).catch(error => { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; });
    for (const id of entries.filter(id => /^[a-f0-9-]{36}$/.test(id))) {
      const saved = await readFile(join(root, 'runs', id, 'experiment.json'), 'utf8').then(value => JSON.parse(value) as Experiment, error => { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw error; });
      if (saved) records.set(id, saved);
      if (saved?.source) sources.set(id, saved.source);
      const reports = join(root, 'runs', id, 'output/reports');
      const files = await readdir(reports).catch(error => { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; });
      for (const name of files.filter(name => uuid.test(name.replace(/\.json$/, '')) && name.endsWith('.json'))) { const path = join(reports, name); reportFiles.push({ path, modified: (await stat(path)).mtimeMs, experimentId: id, reportId: name.slice(0, -5) }); }
    }
    reportFiles.sort((a,b) => b.modified - a.modified);
    const current = reportFiles.length ? await readBattleProjectRevision(project.root).then(revision => ({ revision, error: '' }), error => ({ revision: undefined, error: error instanceof Error ? error.message : String(error) })) : undefined;
    const checkedAt = new Date().toISOString();
    const reports = await Promise.all(reportFiles.slice(0,30).map(async file => {
      const report = JSON.parse(await readFile(file.path, 'utf8')), saved = records.get(file.experimentId);
      const known = current?.revision && saved?.sourceRevision && saved.contentRevision === report.contentRevision && saved.runtimeRevision === report.runtimeRevision;
      const projectStatus = !known ? 'unknown' : current.revision!.contentRevision === report.contentRevision && current.revision!.runtimeRevision === saved.sourceRevision ? 'matches-project' : 'different-project';
      return { experimentId: file.experimentId, reportId: file.reportId, ...(sources.has(file.experimentId) ? { source: sources.get(file.experimentId)! } : {}), report,
        projectCheck: { status: projectStatus, checkedAt, scope: 'project-files', ...(current?.error ? { error: current.error } : {}) } };
    }));
    const status = pending.has(projectId) ? 'preparing' : record && ['running', 'preparing'].includes(record.status) && !live.has(projectId) ? 'interrupted' : record?.status ?? 'idle';
    return { status, ...(record ? { experiment: { id: record.id, snapshotId: record.snapshotId, contentRevision: record.contentRevision, sourceRevision: record.sourceRevision, ...(record.source ? { source: record.source } : {}), ...(record.runtimeRevision ? { runtimeRevision: record.runtimeRevision } : {}), createdAt: record.createdAt, ...(record.error ? { error: record.error } : {}), ...(live.has(projectId) && record.url ? { url: record.url } : {}) } } : {}), reports, reportScope: 'historical-snapshot' };
  }
  async function compare(projectId: string, before: BattleReportRef, after: BattleReportRef) {
    const { root } = rootFor(projectId);
    async function read(ref: BattleReportRef): Promise<BattleExperimentReport> {
      if (!ref || !uuid.test(ref.experimentId) || !uuid.test(ref.reportId)) throw Error('需要有效的实验和报告 ID');
      const path = join(root, 'runs', ref.experimentId, 'output/reports', ref.reportId + '.json');
      const info = await lstat(path).catch(error => { if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw Error('当前项目中找不到所选报告，请刷新后重新选择'); throw error; });
      if (!info.isFile() || info.size > 2 * 1024 * 1024) throw Error('对局报告文件无效或过大');
      if (!isPathDescendant(await realpath(root), await realpath(path))) throw Error('对局报告路径越界');
      const report = JSON.parse(await readFile(path, 'utf8')) as BattleExperimentReport;
      if (report.schemaVersion !== 1 || !Array.isArray(report.trials) || report.trials.length > 200
        || ![report.contentRevision, report.runtimeRevision].every(value => /^[a-f0-9]{64}$/.test(value)) || !report.adapterVersion) throw Error('对局报告格式无效');
      return report;
    }
    if (before?.experimentId === after?.experimentId && before?.reportId === after?.reportId) throw Error('请选择两份不同的报告');
    const [left, right] = await Promise.all([read(before), read(after)]);
    return { before: { ...before }, after: { ...after }, settings: { ...left.settings }, ...await compareBattleExperiments(left, right) };
  }
  function start(projectId: string, fresh: boolean, candidate?: BattleCandidateRef): Promise<Experiment> {
    if (closed) return Promise.reject(Error('自动对局服务正在关闭'));
    if (candidate && (!fresh || !candidate.productionId || !candidate.candidateId || !candidate.candidateHash)) return Promise.reject(Error('候选实验需要明确身份并准备新快照'));
    const selection = JSON.stringify({ fresh, candidate: candidate ?? null });
    if (pending.has(projectId)) return pendingSelections.get(projectId) === selection ? pending.get(projectId)! : Promise.reject(Error('当前实验仍在准备，请完成后再选择版本'));
    const job = execute(); pending.set(projectId, job);
    pendingSelections.set(projectId, selection);
    void job.finally(() => { pending.delete(projectId); pendingSelections.delete(projectId); invalidate(); }).catch(() => undefined);
    return job;
    async function execute() {
      const { project, root } = rootFor(projectId);
      const existingProcess = live.get(projectId);
      if (existingProcess) {
        if (fresh) throw Error('请先停止当前实验，再准备新版本');
        const existing = await load(projectId);
        if (existing?.status === 'running' && existing.url) return existing;
        await existingProcess.done;
      }
      const phaser = project.battlePhaserModule ?? join(project.root, 'node_modules/phaser/dist/phaser.esm.js');
      if (!(await stat(phaser).catch(() => undefined))?.isFile()) throw Error('游戏 Phaser 依赖尚未准备。请在本机项目配置 battlePhaserModule，或安装游戏依赖后重试');
      let record = fresh ? undefined : await load(projectId);
      if (!record) {
        const selected = candidate ? await options.resolveCandidate?.(projectId, candidate) : undefined;
        if (candidate && !selected) throw Error('候选实验来源尚未接通');
        const id = randomUUID(), runRoot = join(root, 'runs', id); await mkdir(runRoot, { recursive: true, mode: 0o700 });
        const snapshot = await createBattleSnapshot(selected?.root ?? project.root, join(runRoot, 'snapshots'));
        await selected?.verify();
        record = { id, projectId, snapshotId: snapshot.manifest.id, snapshotDirectory: snapshot.directory, output: join(runRoot, 'output'), contentRevision: snapshot.manifest.contentRevision, sourceRevision: snapshot.manifest.runtimeRevision, source: selected?.source ?? { kind: 'registered-project' }, createdAt: new Date().toISOString(), status: 'preparing' };
      }
      record.status = 'preparing'; delete record.error; delete record.url; await save(record);
      let process: ManagedProcess | undefined;
      try {
        if (closed) throw Error('自动对局服务正在关闭');
        await mkdir(record.output, { recursive: true, mode: 0o700 });
        // Extension-owned process: its writable workspace is this experiment directory, not a note source tree.
        process = await options.subprocess.spawn({ command: options.bunPath, args: [join(options.packageRoot, 'plugins/cardgame-content/analysis/battle-server.ts'), '--snapshot', record.snapshotDirectory, '--phaser', phaser, '--output', record.output], cwd: join(root, 'runs', record.id) });
        if (closed) { await process.kill(); throw Error('自动对局服务正在关闭'); }
        let stdout = '', stderr = '', exited = false;
        let ready!: (value: { url: string; runtimeRevision: string }) => void, rejectReady!: (error: Error) => void;
        const readiness = new Promise<{ url: string; runtimeRevision: string }>((resolve, reject) => { ready = resolve; rejectReady = reject; });
        const releaseOut = subscribe(process.stdout, chunk => {
          stdout = (stdout + Buffer.from(chunk).toString('utf8')).slice(-16_384);
          for (const line of stdout.split('\n')) try { const value = JSON.parse(line); if (value.snapshotId === record!.snapshotId && /^http:\/\/127\.0\.0\.1:\d+\/$/.test(value.url) && /^[a-f0-9]{64}$/.test(value.runtimeRevision)) ready(value); } catch {}
        });
        const releaseError = subscribe(process.stderr, chunk => { stderr = (stderr + Buffer.from(chunk).toString('utf8')).slice(-16_384); });
        const done = process.wait().then(async exit => {
          exited = true; rejectReady(Error(stderr.trim() || `实验进程退出：${exit.code ?? exit.signal}`));
          record!.status = stopping.has(projectId) || closed ? 'stopped' : 'failed'; delete record!.url;
          if (record!.status === 'failed') record!.error = stderr.trim() || '实验进程意外退出';
          await save(record!);
        }, async error => {
          exited = true; rejectReady(error instanceof Error ? error : Error(String(error))); record!.status = 'failed'; record!.error = String(error); delete record!.url; await save(record!);
        }).finally(() => { if (live.get(projectId)?.process === process) live.delete(projectId); releaseOut(); releaseError(); invalidate(); });
        void done.catch(() => undefined);
        live.set(projectId, { process, done });
        const timer = setTimeout(() => rejectReady(Error('准备自动对局超时')), options.startupTimeoutMs ?? 45_000);
        try { const value = await readiness; if (closed || exited) throw Error('实验进程已关闭'); record.status = 'running'; record.url = value.url; record.runtimeRevision = value.runtimeRevision; await save(record); return record; }
        finally { clearTimeout(timer); }
      } catch (error) {
        if (process) { await process.kill(); await live.get(projectId)?.done.catch(() => undefined); }
        record.status = 'failed'; record.error = error instanceof Error ? error.message : String(error); delete record.url; await save(record); throw error;
      }
    }
  }
  async function stop(projectId: string) {
    rootFor(projectId); if (pending.has(projectId)) throw Error('实验仍在准备，请稍后停止');
    const running = live.get(projectId); if (!running) return;
    stopping.add(projectId); try { await running.process.kill(); await running.done; } finally { stopping.delete(projectId); }
  }
  return { query, compare, start, stop, subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    async close() { closed = true; await Promise.allSettled([...live.values()].map(async entry => { await entry.process.kill(); await entry.done; })); await Promise.allSettled([...pending.values()]); watcher.close(); listeners.clear(); },
  };
}
function subscribe(stream: ProcessReadable | undefined, callback: (chunk: string | Uint8Array) => void) {
  if (stream?.onData) return stream.onData(callback);
  stream?.on?.('data', callback); return () => { stream?.off?.('data', callback); };
}
