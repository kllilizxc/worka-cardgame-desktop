# Candidate preview

An ordinary note holding `{title, candidates: [], attached: []}`. Each candidate declares its source; the host writes its per-surface `status` and `desired` state (see docs/preview-adapters.md).

`candidates` are launch options for a project preview. They can be delivered over a
registered work connection by an execution desk, or registered standalone by any
note or conversation: the sender verifies the actual candidate commit/worktree and
supplies `{key, adapter, repos}` (or `{key, cwd, revision}` for one repository, or `{key, argv, url}` with `{port}`). A candidate synced from a
delegation also carries `originNoteId` and `delegationId`; those are optional
provenance, used to route failure feedback back to the source task and to let the
view jump back to its delegation. Delegation-sourced candidates use the delegation
id as their key (additional options use `delegationId#2`, `delegationId#3`, …);
standalone candidates use a self-chosen stable key. `title` names the option in the
list. Provenance is optional but never silently dropped: an update or retry reuses
the same key and, when it already exists, the same source identity.
`status[surface]` is written only by the host: phase, steps, URL, project checks and, on failure, who is handling it. The view renders it as-is.
`attached` is the durable set of options the user opened in the embedded frame:
closing the detail destroys the note view, so the set — not React state — is what
lets the frame come back on reopen while the selected running page opens automatically.
`attach({key, attached})` maintains it; `forget` clears it with the option.

Expanded mode groups short surface tabs by `featureId`, falling back to the producing
note/delegation. Groups fold while keeping the selected tab visible. Adapter launch
options disappear from the tab strip once their surfaces exist. The toolbar contains
one play/stop control, page reload, an editable URL (Enter navigates, Escape resets),
fullscreen, and a More menu for source, process refresh, archive/restore/delete and
a visible link for opening another browser tab. Address edits are local to this view and never alter
launch/readiness URLs. Only HTTP(S) navigation is accepted; the selected running page displays inline without an embed declaration.
Starting immediately displays an in-flight spinner and prevents duplicate actions;
a separate loading indicator remains until the embedded frame loads. Fullscreen
requires the host note iframe to allow fullscreen and exits with Escape.
Compact mode stays a small light list: title, counts, and one status row per
option.

The host serves note views from the loopback alias the interface itself does not
use (interface on `127.0.0.1`, views on `localhost`), and gives
the isolated alias `sandbox allow-scripts allow-same-origin allow-forms
allow-popups allow-popups-to-escape-sandbox` while the canonical alias keeps the
opaque sandbox. An embedded frame therefore keeps its own origin, so
localStorage, cookies and forms work, and the interface origin and its API token
stay out of reach. Measured against a real candidate: embedded from the isolated
alias the app renders and `sessionStorage` works; embedded from the canonical
alias it stays blank (`typeof sessionStorage` throws in a sandboxed document).
A `sandbox` attribute on the nested element cannot restore either behaviour.

## Lifecycle

Recording is not running. `receive` stores the candidate; `start: true` (or the play
button) sets the desired state to running, and the host converges on it:
materialize Worka-owned worktrees at the exact commits, allocate ports, run the
project's preflight and preparation, start services in dependency order, wait for
readiness, then run the project's checks. `stop` sets the desired state to stopped
and preempts a start in flight. The host keeps converging afterwards: a crashed
service is restarted, a host restart restores running previews, and orphans left by
a host crash are reclaimed when they provably belong to the candidate's workspace.

Never start your own dev server for a candidate: the host owns every process, port
and workspace, and a stray process only makes the host move to another port.

## Failures

Every failure names who resolves it, and the card says what happens next:

- **Worka**: lost workspace, taken port, transient exit — retried automatically.
- **Agent, after your click**: project module errors, dependency installation, service
  errors, failed project checks wait at “交给 Agent 修复”. Only that click hands the
  failure to the source task (or a new repair task for standalone candidates); the
  button then becomes “查看修复会话” and opens the Agent's session. The preview
  restarts and re-checks when the repair ends.
- **User**: credentials, VPN, access — stated once, never retried in a loop.

A failed project check keeps the page viewable while it waits for your decision.

Controls from the source task: `receive({operation:'stop'|'restart', key, originNoteId,
delegationId})` must match the saved source. Renaming uses
`receive({operation:'rename', originNoteId, delegationId, title})` or
`receive({operation:'rename', key, title})` and never touches the lifecycle.

The contract for project modules, state and failure handling is in
`docs/preview-adapters.md`.
