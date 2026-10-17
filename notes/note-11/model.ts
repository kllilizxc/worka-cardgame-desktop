import { defineNote, z } from '@dsh-workbench/runtime';

export const todoStatusSchema = z.enum(['todo', 'in_progress', 'blocking', 'done']);
export const todoPrioritySchema = z.enum(['low', 'medium', 'high']);
export const todoImageSchema = z.object({
  id: z.string(), dataUrl: z.string(), name: z.string().optional(),
  type: z.enum(['image/png', 'image/jpeg', 'image/webp', 'image/gif']).optional(),
  width: z.number().optional(), height: z.number().optional(),
});
// The source belongs to the sender; retain its additional identity/payload fields.
export const todoItemSourceSchema = z.looseObject({
  kind: z.string(), itemId: z.string(), label: z.string().optional(), url: z.string().optional(),
  title: z.string().optional(), messageIds: z.array(z.string()).optional(),
  taskKey: z.string().optional(), importedAt: z.string().optional(),
});
// Persisted items can contain fields added by older note versions or integrations.
export const todoItemSchema = z.looseObject({
  id: z.string(), title: z.string(), description: z.string().optional(),
  status: todoStatusSchema, createdAt: z.string(), completed: z.boolean().optional(),
  priority: todoPrioritySchema.optional(), category: z.string().optional(), dueDate: z.string().optional(),
  images: z.array(todoImageSchema).optional(), source: todoItemSourceSchema.optional(),
  sourceAutoUpdatedAt: z.string().optional(), autoDeliveryPending: z.string().optional(),
  conclusion: z.string().optional(), taskId: z.string().optional(), delivery: z.string().optional(), next: z.string().optional(),
  deliveryIntent: z.object({
    requestId: z.string(), fingerprint: z.string(), payload: z.unknown().optional(),
    status: z.string().optional(), requirementVersion: z.number().optional(), updateStatus: z.string().optional(),
  }).optional(),
  delegation: z.object({ id: z.string(), deskNoteId: z.string(), stateRef: z.string() }).optional(),
  delegatedAt: z.string().optional(), delegatedRunStatus: z.enum(['queued', 'started', 'accepted', 'completed']).optional(),
});
// Historical items may only have the completed flag and no creation timestamp.
export const storedTodoItemSchema = todoItemSchema.extend({
  status: z.union([todoStatusSchema, z.literal('blocked')]).optional(), createdAt: z.string().optional(),
});
export const todoDataSchema = z.looseObject({
  items: z.array(storedTodoItemSchema), filter: z.enum(['all', 'active', 'completed']).optional(),
  summary: z.string().optional(), executionDesk: z.object({ noteId: z.string().optional(), stateRef: z.string().optional() }).optional(),
});
export const todoSnapshotSchema = z.object({
  value: todoDataSchema, revision: z.string(), updatedAt: z.string().optional(),
  origin: z.object({ chain: z.array(z.string()), deliveryId: z.string().optional() }).optional(),
});
export const revisionOutputSchema = z.object({ revision: z.string() });

export const todoConfigSchema = z.looseObject({
  filter: z.enum(['all', 'active', 'completed']).optional(),
});

export type TodoStatus = z.infer<typeof todoStatusSchema>;
export type TodoPriority = z.infer<typeof todoPrioritySchema>;
export type TodoImage = z.infer<typeof todoImageSchema>;
export type TodoItemSource = z.infer<typeof todoItemSourceSchema>;
export type TodoItem = z.infer<typeof storedTodoItemSchema>;
export type TodoData = z.infer<typeof todoDataSchema>;

export function normalizeStatus(item: { status?: string; completed?: boolean }): TodoStatus {
  if (item.status === 'in_progress' || item.status === 'blocking' || item.status === 'blocked') {
    return item.status === 'blocked' ? 'blocking' : item.status;
  }
  if (item.status === 'done' || item.status === 'todo') return item.status;
  return item.completed ? 'done' : 'todo';
}

export const note = defineNote({
  state: { schema: todoDataSchema, initial: { items: [] } },
  config: { schema: todoConfigSchema, defaults: {} },
  update: {
    dataVersion: 'todo-note@2',
    compatibleFrom: ['todo-note@2'],
    async migrate(ctx) {
      const state = todoDataSchema.partial({ items: true }).parse((await ctx.state.read()).value);
      const config = todoConfigSchema.parse((await ctx.config.read()).value);
      const filter = config.filter ?? state.filter;
      await ctx.config.set(z.json().parse(filter === undefined ? config : { ...config, filter }));
      const { filter: _legacyFilter, ...rest } = state;
      await ctx.state.set(z.json().parse({ ...rest, items: state.items ?? [] }));
    },
    checks: [{
      name: '关键能力与稳定身份',
      async run(ctx): Promise<boolean> {
        const row = await ctx.state.read();
        // Exercise the actual public query as well as its stable identity/status projection.
        const { queries } = await import('./actions');
        const result = await queries.items(ctx, {});
        return result.revision === row.revision && ('items' in result ? result.items : []).every((item, index) =>
          item.id === row.value.items[index]?.id && normalizeStatus(item) !== undefined);
      },
    }],
  },
});
