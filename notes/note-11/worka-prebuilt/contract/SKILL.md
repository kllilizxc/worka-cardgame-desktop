---
name: cardgame-todo
description: 管理 CardGame 项目需求、缺陷、反馈和开发交办。
---

Todo 保存要做什么、为什么和当前状态。使用稳定 `itemId`；修改需求时携带
完整的 `title`、`description`、`images` 与 `todo` 查询返回的 `requirementFingerprint`（作为 `baseFingerprint`）；状态动作使用实际记录修订。收到执行反馈时只更新状态、结论和执行绑定，保留用户同时修改的
标题与正文。`delegateTodo` 发布带稳定请求 ID 的交办事件，由 Skill 连线继续原执行台任务；不要在 Todo
便笺内启动 agent。

保留原 Todo 的 compact 快速添加和 expanded 三栏看板，以及分类、优先级、卡片内编辑和交办交互。用户已明确否定列表／详情替换版；数据与协作能力直接使用 SDK 的查询、动作与草稿能力接入，不因新增后端能力重做 UI。

生产请求用 `productionRequest` 创建草稿并打开生产便笺。草稿不会生成素材；生成、
候选注册和采用均由生产流程显式触发。

`todos` 返回 `{items,next,revision,total}` 的轻量摘要页，`cursor` 是不透明游标。图片数量与名称在卡片显示，点击“查看图片 / 编辑需求”才读取完整原图与需求；不要把列表中的截断文本用作保存基线或制作说明。业务生成和标题去重需要全文时，用相同 `todos` 的 `view: "text"` 有界分页。`todo` 默认只读需求与必要小元数据；历史用 `view: "history"` 和原历史游标按需读取，不把交付 payload 或执行详情混入编辑来源。

分类使用 canonical `categories` 查询的原生 `{items,next,revision,total}` 页，每项为完整的 `{category,count}`，计数来自项目全量事项。`workflowStatus` 只提供固定全局计数；分类页独立导航，翻页保留当前选中项与“全部”入口，读取错误只在分类区呈现。
