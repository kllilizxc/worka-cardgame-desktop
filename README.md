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

后台开发环境需要 Node.js 24+、Bun，以及包含 `@realiz3r/worka/desktop-package` 公共打包入口的 Worka 开发依赖。本分支的便笺需要 Worka `codex/home-texture-plan-20261022` 分支提供的宿主持久草稿与前端保护 SDK；构建用的 SDK 与加载便笺的宿主必须一致。先按 Worka 开发说明构建该 checkout，确保依赖和 `dist` 编译辅助程序已就绪，再运行：

```sh
(cd backend && bun run build)
(cd backend && WORKA_SOURCE_ROOT=/absolute/path/to/worka bun run check:notes)
(cd backend && WORKA_SOURCE_ROOT=/absolute/path/to/worka bun run build:notes)
```

该命令先把后台唯一公开契约及 note-1 共享业务源码同步到六个内容库（保留各实例配置和元数据），再编译后台，并用 Worka 的打包入口生成 `extensions/cardgame/`。共享源码维护位置和 hash 校验见 [后台开发说明](backend/README.md#内容库源码的唯一来源)。接收桌面的人不需要执行此命令。

`build:notes` 使用指定 Worka checkout 的 SDK、标准便笺构建器、样式和契约文档编译器。它先在暂存目录完成全部 12 个便笺，再替换各便笺完整的编译目录，并核对源码 hash、全部产物 hash、发布清单和运行目标。后台构建会同步共享源码，因此必须先构建后台，最后构建便笺。也可以在同一版本的 Worka 中重新构建、激活并导出。

保留导出包的完整文件列表，不要手工修改校验清单来让旧产物匹配新源码。提交时保留根目录、便笺和后台制品内的 `.gitattributes`，避免 Git 换行或过滤转换破坏校验。

## 本分支的便笺交互

全部 12 个小卡片恢复原版 HTML 的组件和样式：卡牌扇形、美术缩略图、音频列表、知识入口、剧情分支图、数值摘要、执行台、试玩版本组、生产进度、天气、功能改动和待办进度条。小卡保留原来的间距、图标、颜色、排版与控件外观。支持纹理首页的 Worka 会短暂渲染这些 HTML，再把结果作为画布纹理缓存；业务数据变化后由宿主重新生成。便笺作者继续使用现有的 query 和视图 SDK，无须新增截图、冻结或恢复接口。

打开便笺后才挂载编辑器、播放控件、详细列表和试玩 iframe；收起后由宿主管理已经接管的输入和操作。组合输入、文件选择、上传、未存档游戏或尚未接管的操作仍需保护时，详情保持存活，保护解除后才回收。试玩小卡沿用原版的候选版本列表，不会持续运行游戏。小卡的输入或业务动作进入展开视图，主页上的纹理由宿主负责打开便笺。

展开编辑统一使用 `useMutation(action, { draft, input })`：业务 query 返回字段和保存所需的原始业务版本；纯 `input` 映射在提交时把输入和原始 baseline 转为动作参数。草稿、附件接收、冻结提交、去重、回执和恢复都由宿主管理。收起、切换对象和销毁展开界面不会丢弃已接管的输入，`useViewState` 只保留界面选择。

所有根视图均使用 query 模式，无需保护时收起会移除展开 DOM。内容库和制作台通过私有 `preferences` query 读取旧版搜索、筛选和选择，作为查看者本地偏好的初值；已有本地选择优先。项目配置独立读取，执行台按 `workspace` query 读取业务记录，均不依赖旧版全量 state 快照。

提交期间输入会锁定。动作成功后保留已提交内容和结果，用户明确点击“继续编辑”或“再建…”才开始下一份输入；创建制作单、需求或讨论会话后，需要明确点击打开结果。读取最新数据失败时，“核对 / 重新读取”只读回执和数据，不重新执行业务动作。确定尚未产生副作用的前置拒绝可以改正后再次提交；无法确定执行结果的错误保持原操作等待核对。

项目目录切换仍受 CardGame 后台的 project generation 和业务修订检查保护，旧项目草稿不能写进新目录。小卡的纹理呈现不改变展开后的卡牌编辑、制作单、配套符箓、候选核对、Todo、功能进展和采用流程。

附件统一交给 `draft.attach(field, files, mode)`。本分支新上传的插画原文件最大 **4 MiB**，相比旧插画入口的 20 MiB 有所收紧；已经存入资源库的大文件继续可读。Todo 仍最多三张内嵌图，单次上传原文件最大 4 MiB；宿主生成静态图的内嵌预览，单图 data URL 最大 600,000 字符、合计最大 900,000 字符，超限明确拒绝。便笺不再自己读文件、压缩图片或保管中途附件。

直接相关的回归测试：

```sh
bun test tests/todo-event-contract.test.ts tests/todo-update-check.test.ts backend/tests/project-binding.test.ts backend/tests/path-safety.test.ts
WORKA_SOURCE_ROOT=/absolute/path/to/worka bun test tests/todo-editor-draft.test.tsx tests/production-draft.test.tsx tests/card-editor-receipts.test.tsx tests/feature-progress-write-results.test.tsx backend/tests/card-workflow-create.test.tsx
WORKA_SOURCE_ROOT=/absolute/path/to/worka bun test tests/execution-query-lifecycle.test.tsx tests/preview-query-lifecycle.test.tsx tests/content-library-ui.test.tsx tests/weather-query-lifecycle.test.tsx
```

这些测试使用隔离样例，不调用模型。界面回归通过实际 CoreStore、NoteMutations、CommandRegistry、ActionSteps 和文件接收器，Todo 另连接真实 SQLite 工作流；仅业务项目、外部 provider 和导航 I/O 使用样例。实际项目读取、预览和浏览器显示仍应在使用者的平台上单独验收。

### 原版 HTML 视觉回归

`tests/compact-html-visual/` 把恢复版与原版提交 `1b5d2694ca80c187626ab9dc4e55046c0b44ded7` 的完整组件放入同一 Chrome，使用相同的只读业务样例、主题、字体和卡片尺寸，逐像素比较 12 张卡在浅色／深色、1×／2× 像素密度下的结果。样例覆盖卡面、美术、剧情 SVG、天气、进度及不同业务状态；同时拒绝业务写入、试玩 iframe 和未解码图片。它验证 HTML 外观，宿主的 HTML→纹理转换由 Worka 的浏览器测试另行验证。

运行前准备原版独立 checkout、Chrome、Noto Sans CJK 字体，以及可解析的 `playwright`、`pngjs`、`pixelmatch` 测试依赖（也可用 `COMPACT_TEST_MODULES` 指定测试依赖的 node_modules 目录）。原版 checkout 和当前仓库需要解析同一套界面依赖。

```sh
WORKA_SOURCE_ROOT=/absolute/path/to/worka \
COMPACT_BASELINE_ROOT=/absolute/path/to/original-desktop \
COMPACT_BROWSER=/absolute/path/to/chrome \
COMPACT_FONT=/absolute/path/to/NotoSansCJKsc-Regular.otf \
COMPACT_OUTPUT=/absolute/path/to/comparison-output \
bun tests/compact-html-visual/run.ts
```

输出包含原版／恢复版 PNG、差异图（仅在存在差异时生成）和 `results.json`。此对照使用隔离数据，不会读取或修改本机 CardGame 项目。
