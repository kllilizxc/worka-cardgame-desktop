import { recordedExecutionStatus } from "./projection";
import type {Delegation} from "./model";

/** Desk filters and instructions concern execution only. */
export function executionPresentation(task: Pick<Delegation, "status" | "execution">) {
  const status = recordedExecutionStatus(task);
  const needsAction = ["needs-input", "failed", "unknown"].includes(status);
  const next = status === "needs-input" ? "处理会话中的问题或审批"
    : status === "failed" || status === "unknown" ? "查看本轮运行记录"
    : ["completed", "review"].includes(status) ? "查看执行记录"
    : status === "paused" || status === "cancelled" ? "执行已停止" : "执行中，无需操作";
  return {needsAction, next, executionError: task.execution?.error};
}
