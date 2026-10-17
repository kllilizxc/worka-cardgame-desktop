# Bounded execution note

This ordinary note is a small execution desk for work received through a
Skill relation or added manually. Copy the directory into a note code directory and
activate its executable `model.ts`. That model defines the state/config schemas,
initial values, isolated migration and stable-identity behavior check. The manifest
contains only distributable files and presentation metadata.

`acceptRequirement` is the public relation entry. The Skill relation reads a source node's
published query at a specific revision, chooses a stable object binding, then calls
this action. An existing delegation keeps its owner and ID. A new manual task uses
`addManual({goal, scope?, cwd?})`; the new task gets its own stable identity.
A saved draft by itself does not dispatch work. Historical delegations are retained.

For a blank note, a goal is enough to create a direct bounded source,
for example `addManual({goal: "处理该待办", cwd: "/repo"})`.
`cwd` is the actual repository or project workspace for the native owner. Keep
it separate from the note's generated code directory; pass it explicitly when
the delegation targets a concrete project.

One delegation owns one prepared DSH session. The action persists the dispatch
intent before calling agent.prepare or agent.run, uses stable request IDs, and
never replays an ambiguous request. reconcile records the native result as
review, needs-input, failed, cancelled or unknown. It does not turn a completed
native run into a completed business goal.

## Model judgment and host responsibilities

The owner decides how to investigate, which available connections apply, how to
verify its work, and what conclusion the evidence supports. Ordinary prompts
include the goal, source, latest feedback and a pointer to this guide. Read the
relevant sections and project references when needed; a consultation does not
need the development or preview workflow.

`checkpoint` records the owner's conclusion and evidence. It does not certify
business success and no longer re-delivers an existing candidate. Use
`setCandidate` for an explicit preview handoff and `syncPreview` for an explicit
retry. Passing a new `candidate` to checkpoint remains a compatible, explicit
handoff. Use `continue` only to request a further turn; it is not a progress-log
status. A normal final checkpoint supersedes that request.

`reconcile` observes native receipts and durable user intent. It does not decide
what constitutes a successful business result. It retains cancellation,
single-round repair authorization, same-owner restart recovery and the existing
one-time missing-result check; these boundaries prevent duplicate or unauthorized
execution. It never infers approval from model text.

The owner records its result with:

~~~ts
checkpoint(ctx, {
  delegationId,
  status: "completed",
  summary: "实际目标和边界的核对结果",
  evidence: [{ kind: "commit", summary: "通过限定测试", ref: "<exact-ref>" }],
  proposal: {
    id: "proposal-1",
    summary: "具体、可审查的合入操作",
    operations: [{
      kind: "git-merge",
      repository: "/absolute/repository",
      targetRef: "main",
      expectedBase: "<exact-current-head>",
      head: "<exact-reviewed-head>",
      worktree: "/absolute/worktree"
    }],
    evidence: ["<exact-ref or log>"],
    status: "pending-approval"
  },
  candidate: { argv: ["pnpm", "dev"], url: "http://127.0.0.1:5173/" }
})
~~~

## Development baseline

Before code changes, the owner reads the task's existing baseline evidence and
the applicable project development workflow from its knowledge entry. The
current Skill relation index is included in the first dispatch and refreshed
on continuation; use `connection.skillGet({id})` for relation details and the
provider's public query or native file tools for the source material.
Call the knowledge base `tools/setup/setup.mjs` with project configuration before
development; retain its ready receipt for development, continuation and preview.
Preview consumes that receipt instead of independently selecting dependencies.
New features default to `origin/main`; project configuration or knowledge may
specify another remote branch. Verify the remote, successfully fetch that branch,
resolve its full commit, and create a new branch and worktree from that commit
before editing. Local HEAD, local main/pre, dirty changes, stale remote refs and
other features are not valid starting points. Fetch failures, missing branches
or conflicting rules require a concrete blocker, never a local fallback.

This applies separately to hosts, subapps and every local backend. Record each
repository's rule source/version, remote, fetch result, baseline ref and full
commit, feature-only delta, branch and worktree as `record` evidence in the final `checkpoint`; use `continue` only when another turn is actually needed. Missing preview support must be implemented in the knowledge
base, not obtained by borrowing unrelated business commits.

Same-feature continuations reuse their recorded compliant workspace; remote
advancement does not require rebuilding it each turn. Preserve and report any
noncompliant historical work rather than resetting it or claiming valid delivery.
Development baseline and merge target are separate decisions. These are Prompt
instructions, not runtime Git enforcement. Read-only recovery creates no worktree.

## Candidate preview

Preview is delivery work. At task start, read the project preview module from the
knowledge-base index and record the expected surfaces and their source. Judge
applicability by the affected product flow: backend-only changes, no UI changes,
passing unit tests or an existing PR are not reasons to skip. Read-only analysis or
documentation may omit preview according to the project requirements, with evidence.

Register the candidate as soon as it is ready with
`setCandidate({delegationId, candidate})`: `candidate{adapter, repos?, options?,
featureId?, cwd?, revision?, argv?, url?, readinessPath?, start}`. `adapter` is the
project module (`preview.config.mjs`) in the knowledge base; `repos` maps each
repository role to `{repo, commit}`. A single-repository project may pass `cwd` and
`revision` instead; they default to the worktree and head of the latest git-merge
proposal, and a declared pair that disagrees with that proposal is rejected. A plain
command candidate uses `argv + url` with `{port}`. Worka owns workspaces, ports,
processes, dependency installation and restarts, so never start the project's
servers yourself.

The desk records the launch spec on the delegation and delivers it over the
registered `preview` connection with `key` equal to the delegation id, plus `title`,
`delegationId` and `originNoteId`. `start: true` asks the receiver to converge on
running; it is not readiness evidence. A delivery failure is recorded as
`preview.status: "failed"` and shown on the card. `syncPreview({delegationId,
retry:true})` re-delivers with a fresh request id; plain re-registration reuses the
delivery receipt. Judge the result by the preview note's status and project checks;
record it, or what is unfinished, in the final checkpoint summary.

## Proposal

The proposal is review material. approved and applied are rejected by the
ordinary action and must be written by the host only after a real native
approval and head check. The workbench proposal bridge reads
delegations[delegationId].proposal; it does not accept an approved: true flag
from note code.

A proposal ID identifies immutable review material. Use a new ID when changing
operations, commits, or approval evidence. Completion commentary belongs in the
checkpoint summary/evidence, not in an already approved proposal. The host
projects matching receipt status into the view; it remains the sole authority.
Use `proposal.get` with the original `hash` to inspect a historical receipt.

An ordinary native turn ending is not a goal completion. If it has not written
an outcome, reconcile requests one read-only completion check in the same owner
session. If that check also omits the outcome, the task waits for user confirmation;
it cannot request another check using `continue`. A checkpoint with a real outcome (completed, blocked, needs-input,
failed or cancelled) closes that continuation. A recovery turn must use
`status: "continue"` when the original goal still needs ordinary work; its
read-only facts alone never mark the goal complete.

A cancellation caused by `stow` or an explicit stop remains paused. A host
interruption or ambiguous/unknown result without that durable stop intent is
treated as a restart boundary and enters the same read-only recovery path. A
native user's cancellation without the host interruption marker remains a
terminal cancellation. `stow` is an explicit execution-desk pause; it does not
become active merely because the note or host is restored.

That recovery uses the existing owner session. When an earlier turn was
waiting on an approval, the owner reads the host receipt with
`workbench proposal.get` and presents `proposal.apply` again only through a
fresh native approval; an old interaction or a state flag cannot authorize it.

resume({delegationId}) continues the same owner session and has one pending
continuation. If a native run is unknown after restart, reconcile first looks up
the durable requestId. If that lookup fails, it starts one same-owner,
read-only recovery turn that inspects the original run, workspace and external
effect without repeating the action. The recovery turn must checkpoint its
facts; only a real blocked or unresolved result becomes a user notification.
It can read a stale proposal with workbench proposal.get and may call
proposal.apply only after the host obtains a fresh native approval.
stow({}) pauses the durable reconciliation schedule and requests cancellation
of owned runs. It leaves the native cancellation fact for reconciliation. A
safe reconcile may call `schedules.retry(scheduleId)` only after reading the
durable dispatch, checking the request and external effect, and confirming the
dispatch is `ambiguous`; this is not a general action or agent retry.

The schedule is only a durable wakeup. It is independent of the iframe and
does not depend on the view being open. A cumulative active wait of 30 minutes
(excluding needs-input approval waits) creates one durable notification and
continues waiting.

The finite `background.start` handler reads the persisted delegations and reinstalls this
wakeup when the note code is activated again. It includes pending approval,
verification, an interrupted dispatch, and an uncheckpointed native result;
an explicitly stowed note remains paused.


## 交办与结果回流
Slack 通过稳定的 `/handoffs/<itemId>` 来源关联进入执行台 `submit`，事项只保存任务引用；执行台的 delegation 是任务状态、对话与成果的唯一来源。Slack 通过已授权的任务查询订阅展示结果，分页和结果更新不会改变来源身份。用户可在消息旁定位执行台条目，也可从任务返回原消息；画布固定的是引用卡片，不建立第二个会话。

Slack 来源可在 checkpoint 中保存 `replySuggestion` 供用户复制；回复建议是成果的一部分，不是完成条件。未解决时描述进展与缺失项。无 Slack 自动发送功能。原生 turn 完成不等于目标完成，仍须 checkpoint。用户直接在原生会话续聊由宿主 `observeOwner` 接回同一任务并恢复状态核对。

旧独立调查通过 `adopt` 关联原会话，默认暂停且不重新执行；隐藏旧画布展示但保留历史，之后可按需固定。多个执行台时在 Slack 设置中选择，不按名称猜测。需要先启用执行台模板。

展示收敛：默认仅保留原 Slack 便笺和执行台任务项，不提供独立结果卡片入口。Slack 原消息下显示仅用户可见的建议回复，保留复制与查看任务；详细过程、证据在执行台。画布按方向聚合交办/结果返回关系，返回关系仅引用共享任务，不投递 action。

### 通用交付反馈

来源节点发布自己的事件，Skill 连线决定是否调用执行台的公开 action。
`acceptPreviewFeedback` 按原任务和候选检查轮次记录反馈；已过期的候选版本不会覆盖新结果。
仅用户授权的修复请求可唤醒原任务，暂停和归档任务不会自行恢复。
预览停止、重启和标题变化由 `tasks.previewControlRequested`、`tasks.previewTitleChanged` 事件交给同一关系处理。

### 成果展示与降噪

运行状态与交付状态分别展示。共享 `taskOutcome` 投影供执行台、Todo 和 Slack 读取：原生一轮结束不等于交付完成，候选、待合入、交接失败各自保留；人工交付反馈未解决时，即使 Agent 再次 checkpoint 也仍显示待处理。

执行台按“待你处理、新成果、执行中、历史”排列；打开成果会话仅确认该时间戳的结果已阅，新结论仍会重新出现。结果通知只在正式 checkpoint 后发出，使用原 owner 会话入口；状态恢复和成功验证清理对应旧故障提醒。

巡检交办由 Skill 连线读取准确问题 ID 与证据版本，再调用 `acceptRequirement`。缺失归属只提示核对，不新建通用任务。

Slack 来源在自己的节点发布稳定事项事件；连线处理新要求、对象绑定和原任务续办。执行台只接收经关系核验的来源快照。

缩略卡保留“全部 / 待处理 / 执行中”带数量的筛选入口。筛选先于最多四行的显示限制，即使待处理积压超过四项，也能直接查看正在运行的任务；零项时显示明确空状态。


### Preview feedback and repair

Preview feedback carries candidateKey/surface/runId, where runId is the preview
pass. The desk checks it against the receiver's current surface status and retains
it as evidence; results of an older pass are superseded. Preview failures are
records: they never start a model. Only the user's click in the preview sends a report
marked `autoRepair:true`, the grant of one repair round: an idle task starts a repair
turn for that exact failure, a busy one consumes it next turn, and the reply carries
the task's `sessionId` so the preview can open the repairing session. One repair run
may use multiple model/tool steps, but cannot request checkpoint continue or gain
another run from a missing checkpoint; restart verification keeps this limit. A
standalone candidate gets its repair task only when the user confirms. Other
downstream feedback keeps its existing bounded automatic handling.

Watch intake reads the current registered source before selecting changed items;
items explicitly marked completed:true or status done/completed are not new work.
Exact invoke payloads retain their command semantics. Each newly reserved execution
records its trigger reason/source for auditing.


### Resource boundaries

Native terminal execution events reconcile only the owning delegation. The
existing schedule is a five-minute missed-event fallback; undispatched requests
retain their fifteen-second retry check. Action/state events do not wake models.
Host interruption survives metadata projections and remains restart recovery,
not permission to start work during shutdown.

Source data appears once in a prompt, never duplicated in agent.run input. Large
source values remain in the authoritative state and are read on demand through
`note.read({noteId,path})`; paths use JSON Pointer. The core projects before cloning
to avoid materializing unrelated tasks. No additional summarization model is used.

Preview idle refreshes and coordinator checks avoid unchanged writes. Terminal
feedback stops polling. Running desk observations retain their timestamp for
interruption-time accounting, but now use the lower-frequency fallback.


## Reading Skill relation history

The relation detail shows its current goal, members, capabilities and Skill
version. Its event list links coordination turns to their real native sessions;
script turns show their inputs and node call receipts without a model session.
Node writes carry stable operation IDs and can be checked against the original
receipts. A listed relation or source path does not prove the model read it.

Migrated runs retain their original run and session IDs as read-only history.
A linked native run may predate the handoff when a task is reused. Its saved
dispatch text is evidence, not a reconstruction of the complete model context.
Missing or expired payloads stay explicitly unavailable; current Skill changes
do not rewrite historical content.


Slack 任务由执行 Agent 理解来源后调用 `setTitle({delegationId,title})` 保存简短任务名，显示为「任务名（原消息名）」。标题只保存任务动作与对象，原消息名由界面追加；首次命名前暂用原消息名。任务目标实质变化时更新标题，命名不改变目标、来源身份、执行状态或启动新执行。

已有预览的任务调用 `setTitle` 时，通过 preview 关联同步名称；失败可重试同一标题。后续候选交办使用当前展示名。

用户授权一轮 Agent 修复时，范围包括恢复本候选所必需的直接依赖缺陷；保留指定基线和工作树，仅追加最小修复，用户明确限制优先。更新实际运行版本后通过原预览流程核对全部约定端、项目检查及实际页面，全部通过才报告恢复；业务代码完成不代表预览恢复。重新启动不修改代码，也不调用 Agent。修复反馈仅显示对应轮次结论或原始失败，不借用后续业务任务结果。


### 连线上下文
执行台任务的运行上下文只保留当前 Skill 连线索引（ID、参与节点、用途）。需要关系详情时用 `connection.skillGet({id})`；首次派发和续做不复制整条连线的 Skill 正文。用户直接续聊仍按最新范围更新适用交付。


归档是用户控制的任务状态。来源更新仍保存需求版本与待续办标记，但 submit 不会取消归档或向已归档 owner 追加执行；需要继续时先显式恢复任务或调用 resume。该规则也适用于重复投递、来源重新出现和 delivery=steer。

## State and private task files

`ctx.state.update` only runs a synchronous, pure business mutation. Full content is
committed before idempotent writes to private task files, then compacted only at the
expected state revision. A crash leaves the full content recoverable; an intervening
edit wins and defers compaction. Source/result file keys include the business revision
or result timestamp, so a delayed writer cannot replace another version. Native
sessions, schedules, previews and notifications are reached through `ctx.host`.
