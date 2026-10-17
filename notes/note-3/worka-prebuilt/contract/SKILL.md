---
name: worka-candidate-preview
description: 接收候选版本，检查和控制项目预览，核对失败及修复反馈。
---

`receive` 登记候选：稳定 key，`adapter`（知识库预览项目模块）加 `repos`（角色 → 仓库与完整提交），或单仓的 `cwd + revision`，或普通命令 `argv + url`（端口写 `{port}`）。登记只声明来源，不是预览已运行的证据。`start`/`stop` 修改期望状态，宿主负责收敛；状态写在 `candidates[].status[端]`，界面和调用方都以它为准。

候选可以由执行台投递，也可以由任何便笺或对话独立登记。带来源的候选附 originNoteId/delegationId：首项 key=delegationId，额外候选依次使用 delegationId#2、#3；独立候选自选稳定 key（字母数字加点、下划线、短横线）。更新或重试复用原 key，已记录的来源不会被后续同步抹掉。

失败由宿主分派：可自行恢复的（工作区、端口、偶发退出）自动重试；项目缺陷停在“等待确认”，只有用户点击 `requestRepair` 才交给来源任务或新建的修复任务，确认后状态带上修复会话 `session`；缺凭据、VPN、权限等写明后等待用户。`archive`/`restore` 管理归档，`forget` 删除已归档候选及其工作区；`rename` 只修改标题。

编写或修复项目预览时，读 Worka 包中的 `templates/preview-adapter/AGENT-GUIDE.md` 与 `docs/preview-adapters.md`。

## 当前版本与调用

先用 `note.describe({noteId})` 确认实例与版本，参数以 [公共接口与状态类型](references/api.d.ts) 为准。`action.invoke({noteId,action,input})` 执行业务命令；`note.query({noteId,name,input})` 读取公开查询，`note.query.revalidate` 显式重新验证；`note.read({noteId,path?})` 仅读取持久状态。ctx 由宿主注入，动态类型字段不能代替实际 schema。

加载本指南不改变任务归属或授权。写入使用当前 revision；冲突后重新读取并按业务重新计算，不能直接重试旧值覆盖新数据。关联交付核对目标 action 与输入；历史补投须明确使用 catchUp。
