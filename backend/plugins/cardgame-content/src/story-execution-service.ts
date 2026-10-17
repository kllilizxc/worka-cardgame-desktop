import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import type { AccessContext, ManagedProcess, ProcessReadable, SubprocessHost } from '@realiz3r/worka/host';
import type { ContentService, ContentProject } from './types';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
type RecordState = { status: 'running' | 'succeeded' | 'failed' | 'interrupted'; startedAt: string; finishedAt?: string; error?: string; report?: any };
export function createStoryExecutionService(options: { dataRoot: string; packageRoot: string; projects: ContentProject[]; content: Pick<ContentService, 'query'>; subprocess: SubprocessHost; bunPath: string; timeoutMs?: number }) {
  const active = new Map<string, Promise<RecordState>>(), processes = new Set<ManagedProcess>(), listeners = new Set<() => void>();
  let closed = false;
  const directory = join(options.dataRoot, 'story-execution');
  const identity = (projectId: string, id: string) => {
    const project = options.projects.find(project => project.id === projectId);
    if (!project || typeof id !== 'string' || !id.trim() || id.length > 256) throw Error('未登记的剧情项目或剧情 ID');
    return { project, key: hash(JSON.stringify([projectId, id])) };
  };
  const read = async (key: string): Promise<RecordState | undefined> => {
    try { return JSON.parse(await readFile(join(directory, `${key}.json`), 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return; throw error; }
  };
  const save = async (key: string, state: RecordState) => {
    await mkdir(directory, { recursive: true });
    const temporary = join(directory, `${key}.${randomUUID()}.tmp`);
    await writeFile(temporary, JSON.stringify(state), { mode: 0o600 });
    await rename(temporary, join(directory, `${key}.json`));
    for (const invalidate of listeners) { try { invalidate(); } catch { /* Invalidators do not own the durable result. */ } }
  };
  async function query(projectId: string, id: string) {
    const { key } = identity(projectId, id);
    const current: any = await options.content.query({ projectId, op: 'storyAnalysis', id });
    const saved = await read(key);
    return { ...saved, status: saved?.status === 'running' && !active.has(key) ? 'interrupted' : saved?.status ?? 'idle',
      currentStoryRevision: current.revision,
      contentMatches: saved?.report ? saved.report.storyRevision === current.revision && saved.report.catalogRevision === current.catalogRevision : false,
      runtimeFreshness: 'snapshot-only',
    };
  }
  function run(projectId: string, id: string, expectedRevision: string, access: AccessContext): Promise<RecordState> {
    if (closed) return Promise.reject(Error('剧情分析服务正在关闭'));
    const { project, key } = identity(projectId, id);
    if (active.has(key)) return Promise.reject(Error('这份剧情正在检查，请等待当前报告'));
    const job = execute();
    active.set(key, job);
    void job.finally(() => { active.delete(key); }).catch(() => undefined);
    return job;
    async function execute() {
      const current: any = await options.content.query({ projectId, op: 'storyAnalysis', id });
      if (!expectedRevision || expectedRevision !== current.revision) throw Error('剧情已变化，请刷新后重新检查');
      const previous = await read(key);
      const state: RecordState = { status: 'running', startedAt: new Date().toISOString(), ...(previous?.report ? { report: previous.report } : {}) };
      await save(key, state);
      let process: ManagedProcess | undefined, timer: ReturnType<typeof setTimeout> | undefined, release: (() => void) | undefined, releaseOutput: (() => void) | undefined;
      let stderr = '', timedOut = false, oversized = false;
      const stdout: Buffer[] = []; let outputBytes = 0;
      try {
        if (closed) throw Error('剧情分析服务正在关闭');
        process = await options.subprocess.spawn({ command: options.bunPath,
          args: [join(options.packageRoot, 'plugins/cardgame-content/analysis/story-runner.ts'), '--project', project.root, '--story', id, '--output', '-'], cwd: project.root }, { access });
        processes.add(process);
        if (closed) { await process.kill('SIGTERM'); await process.wait(); throw Error('剧情分析服务已关闭'); }
        const append = (chunk: string | Uint8Array) => { stderr = (stderr + (typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'))).slice(-16_384); };
        release = subscribe(process.stderr, append);
        releaseOutput = subscribe(process.stdout, chunk => {
          const bytes = Buffer.from(chunk); outputBytes += bytes.length;
          if (outputBytes > 8 * 1024 * 1024) { oversized = true; void Promise.resolve(process?.kill('SIGKILL')).catch(() => undefined); }
          else if (!oversized) stdout.push(bytes);
        });
        timer = setTimeout(() => { timedOut = true; void Promise.resolve(process?.kill('SIGKILL')).catch(() => undefined); }, options.timeoutMs ?? 45_000);
        const exit = await process.wait();
        if (closed) throw Error('剧情分析服务已关闭');
        if (timedOut) throw Error('剧情检查超时，保留上次报告；请减少剧情规模或核对运行规则');
        if (oversized) throw Error('剧情报告超过 8 MiB');
        if (exit.code !== 0) throw Error(stderr.trim() || `剧情检查进程退出：${exit.code ?? exit.signal}`);
        const report = JSON.parse(Buffer.concat(stdout).toString('utf8'));
        if (report.schemaVersion !== 1 || report.storyId !== id || report.storyRevision !== expectedRevision || !Array.isArray(report.witnesses) || !/^[a-f0-9]{64}$/.test(report.runtimeRevision)) throw Error('剧情报告身份或版本不一致');
        const latest: any = await options.content.query({ projectId, op: 'storyAnalysis', id, expectedRevision });
        if (latest.catalogRevision !== report.catalogRevision) throw Error('剧情目录已变化，请重新检查');
        state.status = 'succeeded'; state.report = report; state.finishedAt = new Date().toISOString();
        await save(key, state); return state;
      } catch (error) {
        state.status = closed ? 'interrupted' : 'failed'; state.error = error instanceof Error ? error.message : String(error); state.finishedAt = new Date().toISOString();
        await save(key, state); throw error;
      } finally { if (timer) clearTimeout(timer); release?.(); releaseOutput?.(); if (process) processes.delete(process); }
    }
  }
  return { query, run,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    async close() { closed = true; await Promise.allSettled([...processes].map(process => process.kill('SIGTERM'))); await Promise.allSettled([...active.values()]); listeners.clear(); },
  };
}
function subscribe(stream: ProcessReadable | undefined, listener: (chunk: string | Uint8Array) => void) {
  if (stream?.onData) return stream.onData(listener);
  stream?.on?.('data', listener);
  return () => { if (stream?.off) stream.off('data', listener); else stream?.removeListener?.('data', listener); };
}
