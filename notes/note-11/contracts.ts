import { z } from '@dsh-workbench/runtime';
import { note, todoStatusSchema, todoPrioritySchema, todoImageSchema, todoItemSourceSchema } from './model';
export * from './model';

export const delegateTodoInputSchema = z.object({
  itemId: z.string(), goal: z.string().optional(), scope: z.array(z.string()).optional(),
  cwd: z.string().optional(), requestId: z.string().optional(),
  // Manual continuation may resume a paused owner; automatic imports may not.
  resumePaused: z.boolean().optional(),
});
export const feedbackInputSchema = z.object({
  itemId: z.string(), status: todoStatusSchema, conclusion: z.string(), expectedRevision: z.string().optional(),
});
export const moveTodoInputSchema = z.object({
  id: z.string(), status: todoStatusSchema,
  // Index in the destination lane after removing the moving item; omit to append.
  index: z.number().optional(),
});
export const editTodoInputSchema = z.object({
  itemId: z.string(), title: z.string(), description: z.string().optional(), images: z.array(todoImageSchema).optional(),
  base: z.object({ title: z.string(), description: z.string().optional(), images: z.array(todoImageSchema).optional() }),
});
export const importItemInputSchema = z.object({
  title: z.string(), description: z.string().optional(), priority: todoPrioritySchema.optional(),
  category: z.string().optional(),
  // Local date YYYY-MM-DD, or YYYY-MM-DDTHH:mm when a time is present.
  dueDate: z.string().optional(), source: todoItemSourceSchema.optional(),
});
export const importItemsInputSchema = z.object({
  items: z.array(importItemInputSchema), mode: z.enum(['append', 'upsert']).optional(), autoDelegate: z.boolean().optional(),
});
export const importItemResultSchema = z.object({
  itemId: z.string(), deduped: z.boolean().optional(), updated: z.boolean().optional(),
  delegation: z.object({ status: z.string() }).optional(), error: z.string().optional(),
});

export const events = {
  changed: note.event({
    name: 'items.changed',
    visibility: 'public',
    description: '一个待办条目发生变化；itemId 是稳定条目 ID，接收方按需查询当前内容。',
    payload: z.object({ itemId: z.string(), title: z.string(), revision: z.string() }),
    objectRef: '/itemId', objectLabel: '/title', revision: '/revision',
  }),
  delegationRequested: note.event({
    name: 'items.delegationRequested',
    visibility: 'public',
    description: '用户明确要求交办一个已保存的待办条目；连线按事项 ID 查询最新内容。',
    payload: z.object({
      itemId: z.string(), title: z.string(), revision: z.string(), goal: z.string(), scope: z.array(z.string()),
    }),
    objectRef: '/itemId', objectLabel: '/title', revision: '/revision',
  }),
};
