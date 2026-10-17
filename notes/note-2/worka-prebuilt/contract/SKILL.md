---
name: worka-execution
description: 接收关联资料，交办持续任务，保存检查点并跟踪原生会话成果。
---

`acceptRequirement` 接收连线核验过的来源对象：以稳定来源 ID 和对象绑定创建任务或继续原任务，不按标题猜测身份。手动独立任务使用 `addManual({goal,scope?,cwd?})`。`append` 追加用户对已有任务的要求；`checkpoint` 保存结论、证据、剩余工作和阻塞，不能凭一次模型轮次断言业务完成。

任务与原生会话由执行台持久管理。`reconcile` 核对真实运行，`resume` 继续指定委托，`stow` 暂停，归档与恢复使用对应 action。候选由 `tasks.candidateReady` 等事件交给 Skill 连线；`acceptPreviewFeedback` 核对原任务和预览轮次后记录反馈。没有已登记关系或准确对象 ID 时不要猜测接收目标，也不重派结果不明的外部操作。提案、合入和发布沿用宿主审批。

## 当前版本与调用

先用 `note.describe({noteId})` 确认实例与版本，参数以 [公共接口与状态类型](references/api.d.ts) 为准。`action.invoke({noteId,action,input})` 执行业务命令；`note.query({noteId,name,input})` 读取公开查询，`note.query.revalidate` 显式重新验证；`note.read({noteId,path?})` 仅读取持久状态。ctx 由宿主注入，动态类型字段不能代替实际 schema。

加载本指南不改变任务归属或授权。写入使用当前 revision；冲突后重新读取并按业务重新计算，不能直接重试旧值覆盖新数据。关联交付核对目标 action 与输入；历史补处理须由用户明确指定范围，并核对原操作回执。
