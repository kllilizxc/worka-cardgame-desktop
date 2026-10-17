---
name: worka-desk-preview
description: Deliver one execution task's candidate to Preview and return its exact verification pass to the original owner.
eventScripts:
  tasks.candidateReady: scripts/candidate.ts
  tasks.previewControlRequested: scripts/control.ts
  tasks.previewTitleChanged: scripts/title.ts
  tasks.changed: scripts/progress.ts
  candidates.feedbackReported: scripts/feedback.ts
---

# 执行台与候选预览

执行台保留任务、候选规格和原 owner；预览节点保留进程、检查轮次和用户授权的修复请求。先按任务 ID 与候选 key 查询当前状态，再跨节点调用。候选启动或收到回执不等于验证通过。

每个检查轮次只归属一份候选修订。过期结果只记为跳过，不覆盖新结果。普通失败仅记录并提示用户；预览节点明确标记 `autoRepair` 的用户请求，才可续跑原任务。暂停、归档和原任务未知结果都不能被绕过。独立候选经用户授权后可以创建一份修复任务，之后用候选与任务的稳定绑定复用它。

节点调用和对象关联经过宿主回执；结果不明时先核对原操作，不换 ID 重派。不要读写另一节点的私有状态，也不要把预览故障当作发布授权。

## CardGame 试玩约定

每次首次交付或继续修改可运行候选后，在最终 checkpoint 前核对本次实际预览。先从项目知识库索引读取权威启动脚本、验收方法和默认预览端清单；本机历史配置或只改了某一端，都不能自行缩小项目约定的范围。只有用户明确要求时才缩小，并记录该要求。回执保留原任务 ID、candidateKey、修订和 runId；失败、重启试玩均不授权自动启动模型，修复必须由用户在原任务明确发起。
