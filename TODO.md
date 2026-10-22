# 原 HTML 小卡与按需前端 TODO

更新于 2026-10-22。每完成一个 feature，在同一提交中更新本文件、记录针对性验证并推送远端。只将有本轮证据的实现和验收标为完成；保留测试范围及环境限制。

## 目标与边界

- 12 张小卡保留原版 compact HTML、内容、布局、字体和配色。继续使用现有 query、mutation、view state 和 compact/expanded 视图接口。
- 首页只读取概览所需数据，不挂载详情编辑器、完整业务列表或试玩游戏；点击小卡后由宿主打开详情。
- Worka 负责订阅、队列、缓存、静态图像降级、运动与像素预算。CardGame 不增加截图、冻结、恢复或宿主渲染能力接口。
- 输入、未确认写入、上传与未存档游戏必须先保护再回收。不得为减少实例数量丢弃状态或重复执行动作。
- 原 HTML 冷启动仍需要一个有界、只读临时 renderer；“稳态首页没有 iframe”不表示“从未创建临时 iframe”。静态 DOM 图像由宿主以 `<img>` 显示，不把便笺 HTML/CSS/脚本注入宿主。

## 源码与预编译的交付顺序

C1/C2 源码 feature `efdfc28c428767242e1148b1d74486ef0be97642` 保留远端 main `1b5d2694ca80c187626ab9dc4e55046c0b44ded7` 的原 `worka-prebuilt`，该中间提交的源码与旧产物尚未同步。C3 在 Worka `cd41e53198ac6f1655c5851b6629c6bd7433ad9b` 完整构建成功后，用其编译后的 SDK 重新生成全部 12 份便笺，整体替换旧编译目录，核验源码、产物、发布清单和运行目标，并直接加载新导出动作验证初始状态。当前提交已完成这些发布制品校验；真实用户项目的导入、激活及跨平台操作仍需下述 C4 验收。

## Features

| ID | 状态 | 范围与证据 |
| --- | --- | --- |
| C1 | 本轮验收通过 | `f189588` 恢复 12 张原 compact HTML，小卡只读，详情按需挂载；48 组视觉对照总计 10,158,800 像素、0 差异。原版对照为 `1b5d2694ca80c187626ab9dc4e55046c0b44ded7`。 |
| C2 | 本轮已完成 | 视觉回归共享同一套 React/ReactDOM，服务仅绑定 loopback，浏览器阻断测试源之外请求；当前 Worka 源码 SDK 的 4 个生命周期文件：40 pass、0 fail、269 assertions。 |
| C3 | 本轮已完成 | 当前 Worka SDK 严格类型检查 12/12；整体构建并验证 12 份 `worka-prebuilt`；新导出动作的种子回归 12 pass、65 assertions；最终 SDK 生命周期回归再次 40 pass、269 assertions。 |
| C4 | 待平台验收 | macOS/iOS 真机、真实项目目录与实际未存档游戏的开合恢复；本轮只使用 Linux Chromium 和隔离业务样例。 |

## 本轮验证

- [x] 12 张卡 × 浅/深主题 × 1×/2× 像素密度的 48 组原 HTML 逐像素对照：Chrome 158.0.8116.0、10,158,800 像素、0 差异。
- [x] 视觉样例禁止业务写入、试玩 iframe 与未解码图片；测试访问仅限本次 loopback 服务。
- [x] 执行台 compact 保留原行内容，收起时移除详情，宿主接管的归档命令继续完成。
- [x] 试玩 compact 只查询当前列表，不打开 archive、outbox、详情或游戏；查询失败和 pending 有正确呈现。
- [x] 内容库选择与过滤保持查看者偏好；展开编辑器被替换后可恢复宿主已接管的草稿；收起释放隐藏查询订阅。
- [x] 天气搜索按需打开，已接管的城市选择命令在收起后继续完成。
- [x] 当前 SDK 的 12 份预编译制品已重新生成并通过发布校验；全部契约文档状态为 ready，旧编译目录整体替换。
- [x] 直接加载 12 份新导出动作，校验桌面初始状态、配置和内容库数据版本：12 pass、65 assertions。
- [ ] 真实用户项目及跨平台操作验收。

### 可重复执行的最小命令

本轮生命周期回归：

```sh
WORKA_SOURCE_ROOT=/absolute/path/to/worka \
bun test tests/execution-query-lifecycle.test.tsx \
  tests/preview-query-lifecycle.test.tsx \
  tests/content-library-ui.test.tsx \
  tests/weather-query-lifecycle.test.tsx
```

原 HTML 视觉对照：

```sh
WORKA_SOURCE_ROOT=/absolute/path/to/worka \
COMPACT_BASELINE_ROOT=/absolute/path/to/original-desktop \
COMPACT_BROWSER=/absolute/path/to/chrome \
COMPACT_FONT=/absolute/path/to/NotoSansCJKsc-Regular.otf \
COMPACT_OUTPUT=/absolute/path/to/comparison-output \
bun tests/compact-html-visual/run.ts
```

对照使用相同业务数据、主题、字体、尺寸和浏览器。它证明原 HTML 外观，不是宿主纹理 rasterizer 的逐像素证明，也不是性能采样。宿主静态 DOM 图像、原生纹理、取消、身份隔离和资源预算由 Worka 的对应测试覆盖。

本轮 C3 使用 Node.js 24.19.0、Bun 1.4.3，在上述 Worka commit 完成 `bun run pack` 后执行：

```sh
(cd backend && WORKA_SOURCE_ROOT=/absolute/path/to/worka bun run check:notes)
(cd backend && WORKA_SOURCE_ROOT=/absolute/path/to/worka bun run build:notes)
WORKA_SOURCE_ROOT=/absolute/path/to/worka bun test tests/desktop-seeds.test.ts
```

最后重跑的 4 个生命周期文件仍为 40 pass、269 assertions。构建步骤和共享源码顺序见 [README](README.md#修改和重新发布)。不手工更新生成文件的 hash，不把源码测试替代为预编译包验收。本轮未运行全量测试，未访问个人项目或调用模型。

## 推送记录

| Feature | 提交说明 | 状态 |
| --- | --- | --- |
| C1 原 HTML 恢复 | 继承 `f189588` 原 HTML 源码；源码 feature 暂时保留 main 预编译 | 已随 C2 推送为 `efdfc28c428767242e1148b1d74486ef0be97642`，分支 `codex/home-texture-plan-20261022` |
| C2 当前 SDK 回归 | Fix compact visual fixture dependency ownership and record current lifecycle verification | 已随 C1 推送为 `efdfc28c428767242e1148b1d74486ef0be97642` |
| C3 最终 SDK 预编译 | Rebuild all twelve notes with the protected frontend SDK | 本 feature 的代码、产物与验收记录一同提交；由主流程（root）推送，远端结果以分支历史为准 |

每条记录随该功能代码一同提交；完整 SHA 与推送状态以远端分支为准。


## 可见素材与旧状态兼容修复（2026-10-22）

- [x] 素材缩略图只在进入可见区域时持有媒体查询，离开后释放；保留原有列表与数据，音频缩略图直接显示图标。
- [x] 缩略图使用 minmax 网格轨道维持原 92px 槽位和居中完整显示，避免包装层造成图片裁剪。
- [x] 六个内容库的共享模型显式接受并保留旧版可选 title；title 不进入查看偏好的修改契约，无需改写已保存状态。
- [x] 共享源码已从 note-1 同步到其余五个内容库，12 份便笺预编译目录及发布清单已整体重新构建、验证；严格类型检查 12/12 通过。
- [x] 提交前重新运行可见媒体、查看偏好和预编译种子回归：29 pass / 322 assertions；预编译种子同时验证旧 title 可保留、错误类型仍拒绝。此前素材相关 UI 子集 5 pass / 32 assertions，未运行全量测试。
- [x] Windows Chrome 155 隔离浏览器检查实际可见缩略图加载、滚动后释放/补齐与 92px 图片适配；无资源查询错误、未捕获异常或 API 400。部分裁剪在边缘的原生 lazy 图片允许等待滚动后加载，不将其计为已完成加载。
- [ ] 纯 Canvas 首页卡牌 hover 与卡内点击命中仍待实现，本次只修复订阅生命周期和兼容性。

此次验证不替代 C4 真机验收；跨版本草稿保持保留，未声明性能百分位目标通过。
