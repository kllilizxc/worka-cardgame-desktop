---
name: worka-cardgame-todo-desk
description: Deliver one CardGame Todo to its original execution task and return verified progress.
eventScripts:
  cardgame.todo.delegationRequested: scripts/delegate.ts
  tasks.changed: scripts/progress.ts
---

# CardGame 待办与执行台

只处理用户明确交办的 Todo。按项目、冻结请求的目录代次与 Todo ID 查询当前需求，核对请求中的需求修订，再调用执行台 `acceptRequirement`。同一 Todo 继续使用原任务；已有旧任务但来源身份不一致时先核对，不新建并行任务。执行台回执写回原 Todo，使用稳定请求 ID；任务结论使用原任务来源中的目录代次核对后，只同步到原 Todo，不覆盖用户并发修改的需求。任务完成不等于试玩、资源采用或进入正式游戏。

事件只携带稳定项目/目录代次、Todo、请求身份与交办说明；完整原图从同代次需求查询按需读取，不在事件中再复制需求和图片。旧目录任务或缺少目录代次的请求先核对，不写入当前目录的同 ID Todo。

Todo 事件对象、连线来源与执行台来源使用同一个项目/目录代次/Todo 组合身份；事件去重与执行台 updateId 还包含业务请求 ID。显式业务 requestId 保持原样写回原 Todo，同代次重试继续去重。进展同步从来源快照的 id 查询业务 Todo，并先核对来源 itemId 的组合身份。
