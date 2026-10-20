# AI 资源生产

The production note owns briefs, pinned content references, rounds, bounded
candidate references, execution bindings, and the separate adoption fact. A
draft is saved by `upsertRequest`; only the explicit Generate action submits
the immutable requirement snapshot to the existing execution note.

Generation, candidate registration, asset adoption, and game integration are
separate facts. Receiving a completed generation result never marks a Todo
done. Candidates stay references to the asset backend so this note does not
copy media or an unbounded history into note state.

# 卡牌生成与卡面主题

在卡牌库选中卡牌，点击“制作卡面”，或在 AI 资源生产中新建卡牌工作流。新批次通过原生便笺对话生成结构化草稿，随后由宿主 Codex CLI 生图、回填、组装并建立试玩候选。正式游戏只接受在功能进展中确认的确切候选。

插画默认由 Codex 内置 imagegen 生成；若 CLI 不可用，制作单保留可复制任务与手工回填入口。工作流保存于现有制作单，资源复用 CardGame 版本库。主题包括青玉与宣纸，预览、模板版本和游戏动态数值分开保存。支持单位、法器、符箓、场地、丹药和技能；后两类进入战斗槽位与技能栏。

中文 PNG 仍依赖运行环境的系统 CJK 字体或宿主提供的字体路径；缺失时可能缺字或产生不同外观。本轮不分发字体，未消除这一环境依赖。卡面主题和 SVG 渲染都从本便笺的 card-face.ts 编译，修改后需正常重建便笺与后台。

普通需求、卡牌、来源关联、配套符箓和插画回填都使用 Worka 的宿主持久草稿。后台更新不会覆盖未保存文字；保存按开始编辑的修订核对，冲突保留输入。切换制作单或收起便笺会移除对应编辑器，宿主继续保留草稿。项目重绑时旧编辑继续可读，保存被拒绝；点击“读取当前项目”才能进入新绑定。

旧版无项目代次的交办事件不会自动执行。原地升级且项目从未重绑时，“重试交办”只读核对原任务来源、冻结需求及原请求回执，再补回绑定，不重新交办。未知副作用或不一致的回执交给原生会话核对原执行任务（包括归档任务）及实际输出，不能靠换请求 ID 重跑。跨项目重绑后旧轮次不能重试或写回；明确“新一轮”才建立新意图。旧历史保留，无需重建桌面或填写代次。

通用素材候选可预览、复制真实资源引用或否决；当前不支持直接写入正式游戏，旧的必败“采用”按钮已移除。卡牌与牌组沿用制作单 → 隔离试玩候选 → 功能进展确认。旧采用事件只提示核对，实际历史回执仍可验证，不把提示算作完成。

列表复用 Worka 的 `usePagedQuery`：每页最多 100 项，框架拥有游标栈和快照切换；筛选或项目身份变更不会拼接旧页。服务快照使用项目生产记录的单调 revision 总量，SQLite 只读取整数元数据，不读取完整轮次、媒体或大字段。

表单使用 `useMutation(action, { draft: query, input })`，其中 `input(value, { baseline })` 是纯业务映射。按钮命令绑定原始 action 和固定业务 key。提交、原始输入、去重与回执由宿主管理，视图只渲染状态和用户选择。提交后输入保持锁定，成功后明确继续编辑；新建的制作单只通过“打开已创建制作单”进入。

插画由 `draft.attach('files', files, 'file')` 交给宿主，新上传限制为 4 MiB 的 PNG、JPEG 或 WebP；已存入资源库的较大原文件仍能预览和使用。小卡只显示最多四项制作状态，详细编辑、候选图片和播放控件均在展开后读取。
