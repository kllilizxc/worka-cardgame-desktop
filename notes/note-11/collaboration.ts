import { taskOutcome, z, type NoteActionContext, type TaskOutcomeSource } from "@dsh-workbench/runtime";
import {
  note, normalizeStatus, delegateTodoInputSchema, editTodoInputSchema, events, feedbackInputSchema,
  importItemInputSchema, importItemResultSchema, importItemsInputSchema,
  moveTodoInputSchema, todoSnapshotSchema, todoStatusSchema, todoItemSchema,
} from './contracts';

import type { TodoImage, TodoItem, TodoItemSource, TodoStatus } from './model';
export type { TodoData, TodoImage, TodoItem, TodoItemSource, TodoPriority, TodoStatus } from './model';
export { normalizeStatus } from './model';
type Context = NoteActionContext<typeof note>;

/** Match the status shown for a delegated item, including live blocking states. */
export function effectiveDelegatedStatus(task: TaskOutcomeSource): TodoStatus {
  if (["blocked", "failed", "unknown", "needs-input"].includes(task.status)) {
    return "blocking";
  }
  return taskOutcome(task).todoStatus;
}

export type DelegateTodoInput = z.infer<typeof delegateTodoInputSchema>;

export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export type MoveTodoInput = z.infer<typeof moveTodoInputSchema>;

/**
 * 拖拽落位：同时改状态与列内顺序。
 *
 * 状态里只有一条扁平数组，列内顺序就是数组顺序过滤后的结果，所以落位 =
 * 先摘出被移动的条目，再在目标列剩余条目里找到第 index 个作为锚点插回去。
 * 其他列的相对顺序因此完全不动。
 */
export const moveTodo = note.action({
  description: '将待办移动到目标状态列和列内位置。', visibility: 'private',
  input: moveTodoInputSchema,
  output: z.object({ id: z.string(), status: todoStatusSchema, index: z.number(), revision: z.string() }),
}, async (ctx, input) => {
  const id = input.id.trim();
  if (!id) throw new Error("移动需要 id");
  const result = await ctx.state.update(draft => {
    const moving = draft.items.find(item => item.id === id);
    if (!moving) throw new Error("找不到待办条目");
    const rest = draft.items.filter(item => item.id !== id);
    const laneIds = rest.filter(item => normalizeStatus(item) === input.status).map(item => item.id);
    const requested = typeof input.index === 'number' && Number.isFinite(input.index) ? Math.round(input.index) : laneIds.length;
    const index = Math.max(0, Math.min(requested, laneIds.length));
    const anchorId = index < laneIds.length ? laneIds[index] : laneIds.at(-1);
    const at = anchorId ? rest.findIndex(item => item.id === anchorId) : -1;
    const insertAt = at < 0 ? rest.length : index < laneIds.length ? at : at + 1;
    const next = { ...moving, status: input.status, completed: input.status === 'done' };
    draft.items = [...rest.slice(0, insertAt), next, ...rest.slice(insertAt)];
    draft.summary = updateSummary(draft.items);
  });
  const index = result.value.items.filter(item => normalizeStatus(item) === input.status).findIndex(item => item.id === id);
  return { id, status: input.status, index, revision: result.revision };
});

/** Stable JSON Pointer used by the registered repair relation. */
export function todoItemPath(itemId: string): string {
  return `/items/${itemId.replaceAll("~", "~0").replaceAll("/", "~1")}`;
}

export function updateSummary(items: TodoItem[]): string {
  const total = items.length;
  const done = items.filter((item) => normalizeStatus(item) === "done").length;
  const inProgress = items.filter((item) => normalizeStatus(item) === "in_progress").length;
  const blocking = items.filter((item) => normalizeStatus(item) === "blocking").length;
  const todo = total - done - inProgress - blocking;
  return `${total} 项待办 · ${todo} 待开始 · ${inProgress} 进行中 · ${blocking ? `${blocking} 阻塞 · ` : ""}${done} 完成`;
}

function validateTodoImages(images: TodoImage[] | undefined): void {
  if (images === undefined) return;
  if (!Array.isArray(images) || images.length > 3) throw new Error("最多添加 3 张图片");
  let totalLength = 0;
  for (const image of images) {
    if (!image || typeof image.dataUrl !== "string" || !/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(image.dataUrl)) throw new Error("图片附件格式无效");
    if (image.dataUrl.length > 600_000) throw new Error("图片压缩后仍然过大，请换一张图片");
    totalLength += image.dataUrl.length;
  }
  if (totalLength > 900_000) throw new Error("图片附件总大小过大，请减少图片数量或换小图");
}

function defaultScope(): string[] {
  return ["仅处理这一个待办", "保留可核对结论", "不要自动合并、发布或扩大范围"];
}

/** Merge receipt fields into the latest draft; never replace edits made during delivery. */
async function updateDelivery(ctx: Context, itemId: string, change: (item: TodoItem) => TodoItem) {
  return ctx.state.update(draft => {
    if (!draft.items.some(item => item.id === itemId)) throw new Error("待办已删除");
    draft.items = draft.items.map(item => item.id === itemId ? change(item) : item);
  });
}

/** Editing a requirement never sends it to an agent. */
export const editTodo = note.action({
  description: '保存待办需求草稿并拒绝覆盖并发修改。', visibility: 'private',
  input: editTodoInputSchema, output: todoSnapshotSchema,
}, async (ctx, input) => {
  if(!input.title?.trim())throw new Error("需求标题不能为空");
  validateTodoImages(input.images);
  return updateDelivery(ctx,input.itemId,item=>{
    const hasImageDraft = Object.prototype.hasOwnProperty.call(input, "images");
    if(item.title!==input.base.title || (item.description??'')!==(input.base.description??'') || (hasImageDraft && JSON.stringify((item.images??[]).map(image=>[image.id,image.dataUrl]))!==JSON.stringify((input.base.images??[]).map(image=>[image.id,image.dataUrl]))))throw new Error("该需求已被修改，请重新打开编辑");
    const next: TodoItem = {...item,title:input.title.trim(),description:input.description?.trim()??''};
    if(hasImageDraft){
      const images = (input.images ?? []).slice(0, 3);
      if(images.length) next.images = images;
      else delete next.images;
    }
    return next;
  });
});

/** Apply a result to one original item while retaining every other state field. */
export const feedback = note.action({
  description: '将结果和结论写回原待办，保留其他状态字段。', visibility: 'private',
  input: feedbackInputSchema,
  output: z.object({ itemId: z.string(), status: todoStatusSchema, revision: z.string() }),
}, async (ctx, input) => {
  const itemId = input.itemId.trim();
  const conclusion = input.conclusion.trim();
  if (!itemId) throw new Error("反馈需要 itemId");
  if (!conclusion) throw new Error("反馈需要 conclusion");
  const delegatedAt = new Date().toISOString();
  const next = await ctx.state.update(draft => {
    const item = draft.items.find(value => value.id === itemId);
    if (!item) throw new Error("找不到待反馈的待办条目");
    item.status = input.status;
    item.completed = input.status === 'done';
    item.conclusion = conclusion;
    // A real receipt also locks historical assignments that lacked a timestamp.
    item.delegatedAt ??= delegatedAt;
    item.delegatedRunStatus = 'completed';
    draft.summary = updateSummary(draft.items);
  }, input.expectedRevision ? { expectedRevision: input.expectedRevision } : undefined);
  return { itemId, status: input.status, revision: next.revision };
});

const createTodoInputSchema = importItemInputSchema.extend({ status: todoStatusSchema.optional() });
export function createTodoItem(
  input: z.infer<typeof createTodoInputSchema>,
  identity: { id: string; createdAt: string },
): z.infer<typeof todoItemSchema> {
  const status = input.status ?? "todo";
  return {
    id: identity.id,
    title: input.title.trim(),
    status,
    completed: status === "done",
    priority: input.priority ?? "medium",
    category: input.category?.trim() || "日常",
    ...(input.dueDate ? { dueDate: input.dueDate } : {}),
    createdAt: identity.createdAt,
    ...(input.description?.trim() ? { description: input.description.trim() } : {}),
    ...(input.source ? { source: { ...input.source, importedAt: input.source.importedAt ?? identity.createdAt } } : {}),
  };
}

export type ImportItemInput = z.infer<typeof importItemInputSchema>;
export type ImportItemsInput = z.infer<typeof importItemsInputSchema>;
export type ImportItemResult = z.infer<typeof importItemResultSchema>;

/** Idempotency key for imported items; items without a source are always added. With a source taskKey the match follows the key alone, so retitled tasks still hit the same item. */
function importKey(item: {title: string; source?: TodoItemSource}): string | null {
  if (!item.source) return null;
  return JSON.stringify({kind: item.source.kind, itemId: item.source.itemId, task: item.source.taskKey ?? item.title.trim().toLocaleLowerCase()});
}

/** Import items decomposed from a source note: dedupe by source identity, optionally update and delegate. */
export const importItems = note.action({
  description: '按来源身份去重或更新导入的待办，可请求自动交办。', visibility: 'private',
  input: importItemsInputSchema, output: z.object({ results: z.array(importItemResultSchema) }),
}, async (ctx, input) => {
  const entries = input.items;
  const mode = input.mode ?? "append";
  // IDs, clocks and provider calls must never run inside a retryable updater.
  const now = new Date().toISOString();
  const candidates = entries.map(entry => createTodoItem(entry, { id: ctx.id(), createdAt: now }));
  let committed: { results: ImportItemResult[]; delegated: Set<string>; snapshot: Awaited<ReturnType<Context['state']['read']>> } | undefined;

  // Returning per-item receipts needs the exact successful read version. An
  // explicit CAS makes that plan stable; retry only a known revision conflict.
  for (let attempt = 0; attempt < 8; attempt++) {
    const current = await ctx.state.read();
    const nextItems = [...current.value.items];
    const matched = new Map<string, TodoItem>();
    for (const item of nextItems) {
      const key = importKey(item);
      if (key && !matched.has(key)) matched.set(key, item);
    }
    const results: ImportItemResult[] = [];
    const delegated = new Set<string>();
    for (const [index, entry] of entries.entries()) {
      const title = entry.title.trim();
      if (!title) { results.push({ itemId: '', error: '导入项缺少标题' }); continue; }
      const key = importKey({ title, source: entry.source });
      const found = key ? matched.get(key) : undefined;
      if (found) {
        const description = entry.description?.trim() ?? '';
        if (mode === 'upsert' && (found.title !== title || (found.description ?? '') !== description)) {
          const updated = { ...found, title, description, sourceAutoUpdatedAt: now };
          nextItems[nextItems.findIndex(item => item.id === found.id)] = updated;
          matched.set(key!, updated);
          results.push({ itemId: found.id, updated: true });
          if (input.autoDelegate) delegated.add(found.id);
        } else results.push({ itemId: found.id, deduped: true });
        continue;
      }
      const created = candidates[index]!;
      nextItems.unshift(created);
      if (key) matched.set(key, created);
      results.push({ itemId: created.id });
      if (input.autoDelegate) delegated.add(created.id);
    }
    try {
      const snapshot = await ctx.state.update(draft => {
        draft.items = nextItems;
        draft.summary = updateSummary(nextItems);
      }, { expectedRevision: current.revision });
      committed = { results, delegated, snapshot };
      break;
    } catch (error) {
      if (attempt === 7 || !error || typeof error !== 'object' || !('code' in error) || error.code !== 'revision-conflict') throw error;
    }
  }
  if (!committed) throw new Error('待办版本已变化，请重新读取');
  const { results, delegated, snapshot } = committed;
  if (input.autoDelegate) {
    for (const itemId of delegated) {
      const matchingResults = results.filter(result => result.itemId === itemId);
      try {
        const item = snapshot.value.items.find(value => value.id === itemId)!;
        await events.delegationRequested.publish(ctx, {
          itemId, title: item.title, revision: snapshot.revision,
          goal: `处理待办：${item.title}`, scope: defaultScope(),
        }, { key: `${itemId}:${snapshot.revision}:import-delegate`, exclusive: true });
        for (const result of matchingResults) result.delegation = { status: 'queued' };
      } catch (error) {
        for (const result of matchingResults) result.error = String(error instanceof Error ? error.message : error);
      }
    }
  }
  return { results };
});
