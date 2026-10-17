# 功能进展 / Feature Tracker

官方桌面的外部版 Feature Tracker，使用随 Worka 附带的 official-feature-tracker 后台。源码在 Worka 仓库独立维护。

通过便笺对话建立功能记录。未登记项目由 Agent 按 official-feature-tracker 指南及 discover-repo 检查指定仓库和 GitHub CI/CD。台账与映射首次为空，复用用户自己的 gh 登录，每张便笺独立保存数据。

支持 GitHub PR、Actions 和 Deployments，界面沿用 dev/pre/main 的 Git、CI、CD 阶段。已有便笺源码按正常来源升级流程更新，不覆盖其业务状态。
