---
name: worka-feature-progress
description: 读取功能进展与交付状态，刷新跟踪器或调整功能归档状态。
---

权威功能记录由关联的 feature-tracker 扩展及其文件维护；便笺是投影。权威文件变化由框架自动同步；需要手动重新验证时使用 `note.query.revalidate({noteId,name:"view",input:{}})`。功能进展是 Skill 连线中的参考节点；在协调轮次中按公开能力使用 `connection.nodeQuery` 读取，不调用刷新 action。`setArchiveStatus({id,archived})` 修改指定功能的归档状态。

本便笺通过实时 query 展示跟踪器数据，不能把 store 中的旧 features 当作当前远端事实。需要创建/更新功能时遵循已安装的 feature-tracker 业务 skill，完成后刷新核对。区分 PR 合并、构建、部署和验收各自的证据。缺扩展时报告不可用，不回退到伪造进度。

## 当前版本与调用

先用 `note.describe({noteId})` 确认实例与版本，参数以 [公共接口与状态类型](references/api.d.ts) 为准。`action.invoke({noteId,action,input})` 执行业务命令；`note.query({noteId,name,input})` 读取公开查询，`note.query.revalidate` 显式重新验证；`note.read({noteId,path?})` 仅读取持久状态。ctx 由宿主注入，动态类型字段不能代替实际 schema。

加载本指南不改变任务归属或授权。写入使用当前 revision；冲突后重新读取并按业务重新计算，不能直接重试旧值覆盖新数据。关联交付核对目标 action 与输入；历史补投须明确使用 catchUp。

## 官方版本

后台身份是 official-feature-tracker，数据目录按便笺隔离。通过 getFeature 读取当前记录与 revision、context，通过 recordFeature 的 baseRevision 合并保存；保留 PR 证据与创建时间。执行台入口从 tracker 连线读取，禁止写死另一台电脑的便笺 ID。CI/CD 使用本实例项目映射的 GitHub Actions 与 deployments；诊断查询不代表业务更新成功。
