import type { JsonValue } from "@dsh-workbench/runtime";
import type { ExecutionContext, Delegation, DelegationSource, Evidence, NativeResult } from "./model";

/**
 * State is the desk's board: what each task is now, small enough to read
 * whole. Everything a task accumulates (the full source it came from, every
 * requirement version, feedback diagnostics, the evidence behind its results)
 * is its file in the note database. Business code keeps reading and writing
 * whole delegations; `shelve` moves what is new and bulky into the file when
 * the desk is written, and `hydrate` brings it back where the full text
 * matters. A copied or shared desk has no file: reads fall back to the board.
 */

type DbHost=ExecutionContext["db"];

const base = (id: string) => `delegation/${id}/`;
export const sourceKey = (id: string, revision?: string) => `${base(id)}source${revision ? `/version/${encodeURIComponent(revision)}` : ""}`;
export const evidenceKey = (id: string) => `${base(id)}evidence`;
export const feedbackKey = (id: string, feedbackId: string) => `${base(id)}feedback/${feedbackId}`;
const resultKey = (id: string, checkedAt?: number) => `${base(id)}result${checkedAt === undefined ? "" : `/version/${checkedAt}`}`;
/** Feedback a board keeps per connection and subject after the last pass; decisions only look at the current streak. */
const STREAK_KEPT = 20;
const RESULT_TEXT_KEPT = 1000;
const requirementKey = (id: string, version: number, index: number) => `${base(id)}requirement/${String(version).padStart(4, "0")}-${index}`;

/** Facts the host already records elsewhere (source revisions, feedback, run errors, past outcomes); they are not evidence. */
const SYSTEM_EVIDENCE = /^(来源快照 revision |下游反馈：|原生执行状态未知：|此前结果：|投递未建立会话（第)/;
const TEXT_LIMIT = 500;

/** What the board keeps of a source: identity, and the few fields people and linked notes read. */
export function boardSource(source: DelegationSource): DelegationSource {
  const { value, ...facts } = source;
  return { ...facts, value: boardValue(value), shelved: true };
}

function boardValue(value: JsonValue): JsonValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return typeof value === "string" ? value.slice(0, TEXT_LIMIT) : null;
  const kept: Record<string, JsonValue> = {};
  for (const field of ["slackItemId", "title", "summary", "goal"]) {
    const text = value[field];
    if (typeof text === "string") kept[field] = text.slice(0, TEXT_LIMIT);
  }
  if (value.sources && typeof value.sources === "object" && !Array.isArray(value.sources)) {
    kept.sources = Object.fromEntries(Object.entries(value.sources).map(([key, item]) => {
      const record = item && typeof item === "object" && !Array.isArray(item) ? item : {};
      return [key, Object.fromEntries(["key", "id", "noteId", "itemId", "itemPath", "path", "revision"].filter(field => typeof record[field] === "string").map(field => [field, record[field]!]))];
    }));
  }
  return kept;
}

type Write = () => Promise<unknown>;

function sourceItems(value: JsonValue | undefined): Record<string, JsonValue> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) && value.sources && typeof value.sources === "object" && !Array.isArray(value.sources) ? value.sources as Record<string, JsonValue> : undefined;
}

/**
 * Move what is new and bulky out of the board, returning the file writes to
 * make before the board is saved (so the board never points at a missing
 * file). Only unmarked content is moved; a settled board costs nothing.
 */
export function shelve(delegations: Record<string, Delegation>, db: DbHost): Write[] {
  const writes: Write[] = [];
  for (const d of Object.values(delegations)) {
    if (d.source && !d.source.shelved) {
      const full = d.source;
      writes.push(() => db.write(sourceKey(d.id,full.revision), full));
      d.source = boardSource(full);
    }
    // Past versions keep only the source items the current one no longer names; the rest are already on the board once.
    const current = sourceItems(d.source?.value);
    d.requirementHistory = d.requirementHistory?.map((entry, index) => {
      if (entry.shelved) return entry;
      writes.push(() => db.write(requirementKey(d.id, entry.version, index), entry));
      const source = boardSource(entry.source);
      const items = sourceItems(source.value);
      if (items) source.value = { ...(source.value as Record<string, JsonValue>), sources: Object.fromEntries(Object.entries(items).filter(([key]) => !current || !(key in current))) };
      return { version: entry.version, goal: entry.goal.slice(0, TEXT_LIMIT), scope: [], source, shelved: true };
    });
    for (const item of d.feedback ?? []) {
      if (item.shelved || (item.diagnostics === undefined && !item.instruction)) continue;
      const detail = { diagnostics: item.diagnostics, instruction: item.instruction };
      writes.push(() => db.write(feedbackKey(d.id, item.id), detail));
      delete item.diagnostics;
      delete item.instruction;
      item.shelved = true;
    }
    if (d.feedback) {
      const kept = keptFeedback(d.feedback);
      for (const item of d.feedback) if (!kept.has(item)) {
        // The whole entry joins its details in the file, so later duplicates are still recognized.
        const entry = { ...item };
        writes.push(() => db.update<Record<string, unknown>>(feedbackKey(d.id, item.id), current => ({ ...current, ...entry })));
      }
      if (kept.size < d.feedback.length) d.feedback = d.feedback.filter(item => kept.has(item));
    }
    const result = d.execution?.result;
    if (result && !result.textShelved && boardResult(result) !== result) {
      // One latest result per task; `checkedAt` tells whether the file still holds this one.
      const filedResult = { checkedAt: result.checkedAt, text: result.text! };
      writes.push(() => db.write(resultKey(d.id,result.checkedAt), filedResult));
      d.execution!.result = boardResult(result);
    }
    const evidence = (d.evidence ?? []).filter(item => !SYSTEM_EVIDENCE.test(item.summary ?? ""));
    if (evidence.length) writes.push(() => db.update<Evidence[]>(evidenceKey(d.id), current => mergeEvidence(current ?? [], evidence)));
    d.evidence = [];
    if (d.outcome) delete (d.outcome as { evidence?: Evidence[] }).evidence;
  }
  return writes;
}

/** Whether a task still carries content the board no longer keeps (a desk written before tasks had files). */
export function needsShelving(d: Delegation): boolean {
  return Boolean((d.source && !d.source.shelved)
    || d.requirementHistory?.some(entry => !entry.shelved)
    || d.feedback?.some(item => !item.shelved && (item.diagnostics !== undefined || item.instruction))
    || (d.feedback && keptFeedback(d.feedback).size < d.feedback.length)
    || d.evidence?.length
    || (d.outcome && "evidence" in d.outcome)
    || (d.execution?.result && boardResult(d.execution.result) !== d.execution.result));
}

/** A native result as the board keeps it: a long text keeps its beginning. Short results are returned as they are. */
export function boardResult(result: NativeResult): NativeResult {
  if (result.textShelved || !result.text || result.text.length <= RESULT_TEXT_KEPT) return result;
  return { ...result, text: result.text.slice(0, RESULT_TEXT_KEPT) + "…", textShelved: true };
}

/** Per connection and subject: the last pass and the recent streak after it, unresolved items, and every delivery repair. */
function keptFeedback(feedback: NonNullable<Delegation["feedback"]>): Set<NonNullable<Delegation["feedback"]>[number]> {
  const groups = new Map<string, NonNullable<Delegation["feedback"]>>();
  for (const item of feedback) {
    const key = JSON.stringify([item.connectionId, item.subject]);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const kept = new Set<NonNullable<Delegation["feedback"]>[number]>();
  for (const items of groups.values()) {
    const lastPass = items.findLastIndex(item => item.status === "passed");
    const streak = items.slice(lastPass + 1);
    for (const item of items) if (item.pending || item.subject === "delivery-repair") kept.add(item);
    if (lastPass >= 0) kept.add(items[lastPass]!);
    for (const item of streak.slice(-STREAK_KEPT)) kept.add(item);
  }
  return kept;
}

/** The task with its file: full source and feedback details, and its evidence. Missing records leave the board's version. */
export async function hydrate(db: Pick<DbHost,"read">, d: Delegation): Promise<Delegation> {
  const filedResult = d.execution?.result?.textShelved ? (await db.read<{ checkedAt: number; text: string }>(resultKey(d.id,d.execution.result.checkedAt)) ?? await db.read<{ checkedAt: number; text: string }>(resultKey(d.id))) : undefined;
  const resultText = filedResult && filedResult.checkedAt === d.execution?.result?.checkedAt ? filedResult.text : undefined;
  const [source, evidence, feedback] = await Promise.all([
    d.source?.shelved ? (async()=>await db.read<DelegationSource>(sourceKey(d.id,d.source.revision)) ?? await db.read<DelegationSource>(sourceKey(d.id)))() : undefined,
    db.read<Evidence[]>(evidenceKey(d.id)),
    Promise.all((d.feedback ?? []).map(async item => item.shelved ? { ...item, ...(await db.read<{ diagnostics?: string; instruction?: string }>(feedbackKey(d.id, item.id))) } : item)),
  ]);
  return {
    ...d,
    // Only a file of the same revision is this source; otherwise keep what the board has.
    ...(source && source.revision === d.source.revision ? { source } : {}),
    evidence: mergeEvidence(evidence ?? [], d.evidence ?? []),
    ...(d.feedback ? { feedback } : {}),
    ...(resultText !== undefined && d.execution?.result ? { execution: { ...d.execution, result: { ...d.execution.result, text: resultText, textShelved: undefined } } } : {}),
  };
}

export function mergeEvidence(existing: Evidence[], incoming: Evidence[]): Evidence[] {
  const result = [...existing];
  const seen = new Set(existing.map(item => JSON.stringify(item)));
  for (const item of incoming) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) { seen.add(key); result.push(JSON.parse(key)); }
  }
  return result;
}
