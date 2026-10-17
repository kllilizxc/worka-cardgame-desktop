# CardGame Worka 桌面

12 个便笺、7 条 Skill 连线，以及配套的 CardGame 后台都放在本仓库。游戏源码仍使用 [CardGame](https://github.com/kllilizxc/CardGame)，不需要向游戏仓库复制工作台代码。

## 导入和连接项目

1. 在支持桌面包版本 4 的新版 Worka 中，从本仓库地址导入桌面。Worka 会校验并加载便笺和配套后台，不在接收端编译或安装依赖。
2. 展开“CardGame 内容库”，填写本机 CardGame 源码目录的绝对路径，点击“连接此桌面”。一次操作会连接本桌面的全部游戏便笺。

导入本身不会选择项目，也不会读取导出者的目录。项目路径、授权、任务数据库和凭据不随桌面导出。切换项目可在展开便笺底部的“项目目录”中完成；旧项目任务和本桌面预览会先停止，新旧项目数据分别保留。无效路径或保存失败不会改变原来的有效绑定。

用户点击目录按钮就是本次选择；Agent 通过宿主扩展工具配置目录还必须取得原生确认。普通动作、计划、只读、回放、试运行和其他桌面的调用不能借此获得项目访问权。正式游戏源码的采用仍走原有确认流程。

功能进展使用 Worka 自带的 Feature Tracker，天气使用相应天气服务。AI 文本、图像生成等功能需要使用者自行配置对应的本机工具和模型，本包不提供账号或凭据。后台使用宿主共享的 sharp、music-metadata 和 Worka 接口，版本不匹配时导入会明确失败，不会静默安装另一份宿主依赖。

## 仓库结构

- `desktop.json`：布局、初始角色配置、连线和后台引用
- `notes/`：便笺源码及严格校验的 `worka-prebuilt` 产物
- `relations/`：连线脚本和授权声明
- `backend/`：CardGame 专用后台源码、构建脚本和回归测试
- `extensions/cardgame/`：由构建生成的可移植后台制品及校验清单

## 修改和重新发布

后台开发环境需要 Node.js 24+、Bun，以及包含 `@realiz3r/worka/desktop-package` 公共打包入口的 Worka 开发依赖。运行：

```sh
bun --cwd backend run build
```

该命令先把后台唯一公开契约及 note-1 共享业务源码同步到六个内容库（保留各实例配置和元数据），再编译后台，并用 Worka 的打包入口生成 `extensions/cardgame/`。共享源码维护位置和 hash 校验见 [后台开发说明](backend/README.md#内容库源码的唯一来源)。接收桌面的人不需要执行此命令。

修改便笺源码后，在 Worka 中重新构建、激活并导出，保留导出包的完整文件列表。不要手工修改校验清单来让旧产物匹配新源码。提交时保留根目录、便笺和后台制品内的 `.gitattributes`，避免 Git 换行或过滤转换破坏校验。

直接相关的回归测试：

```sh
bun test tests/todo-event-contract.test.ts tests/todo-update-check.test.ts backend/tests/project-binding.test.ts backend/tests/path-safety.test.ts
```

这些测试使用隔离样例，不调用模型。实际项目读取、预览和浏览器显示仍应在使用者的平台上单独验收。
