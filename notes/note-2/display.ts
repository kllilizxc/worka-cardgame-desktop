import type { Delegation } from "./model";

export function isExecuting(item: Pick<Delegation, "status">): boolean {
  return item.status === "running" || item.status === "dispatching";
}

type DeskTaskForSort = Pick<Delegation, "id" | "createdAt" | "updatedAt" | "outcome" | "execution">;

function completedAt(item: DeskTaskForSort): number {
  return item.outcome?.recordedAt ?? item.execution?.result?.checkedAt ?? 0;
}

/** Sort durable task activity first; completion time breaks ties for legacy records. */
export function compareDeskTasks(a: DeskTaskForSort, b: DeskTaskForSort): number {
  return (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
    || completedAt(b) - completedAt(a)
    || b.createdAt - a.createdAt
    || a.id.localeCompare(b.id);
}

function compact(value: string): string {
  const text = value.trim();
  return text.length > 80 ? text.slice(0, 79) + "…" : text;
}

/** A source-facing card label; the full delegation goal remains execution prompt data. */
export function delegationDisplayName(item: Pick<Delegation, "source" | "goal" | "title">): string {
  const value = item.source.value;
  // append keeps the same task and owner session, but its synthetic source has
  // no business title. Older records also have no display metadata to recover.
  if (item.source.id?.startsWith("direct/append:")) {
    return compact((item.title?.trim() || item.goal).replace(/\s+/g, " ")) || "未命名委托";
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (record.slackItemId && typeof record.title === "string") {
      const title = item.title?.trim();
      const message = compact(record.title);
      return title ? compact(title) + (message ? `（${message}）` : "") : message;
    }
    if (record.sources && item.goal) return compact(item.goal);
    for (const field of ["title", "summary", "goal"]) {
      if (typeof record[field] === "string" && record[field].trim()) return compact(record[field]) + (item.source.itemId ? ' · '+item.source.itemId : '');
    }
  }
  if (item.source.itemId?.trim()) return compact(item.source.itemId);
  return compact(item.source.key) || "未命名委托";
}

/** The current owner turn, shown in both the desk and its native session. */
export function executionDisplayName(item: Pick<Delegation, "source" | "goal" | "title" | "origin" | "execution">): string {
  const title = item.origin ? compact(item.goal) : delegationDisplayName(item);
  return item.execution?.trigger?.reason === "preview-repair" ? compact(`预览修复 · ${title}`) : title;
}
