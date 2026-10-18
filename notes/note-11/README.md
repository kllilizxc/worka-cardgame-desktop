# CardGame Todo

The UI preserves the original Todo note: compact quick entry and the expanded
three-column kanban, category filters, priorities, inline editing and delegation.
The CardGame adapter changes persistence, not the interaction model. Keep this
interface when adding backend capabilities; do not replace it with a list/detail
dashboard. Extra pages are loaded on request, with at most 500 cached lightweight summaries.

CardGame Todo keeps the durable requirements, priority, status, execution
feedback, and links to production requests for one configured project. The
list is read through the `cardgame-content` extension and remains paginated;
the note never copies the whole project into its state.

Editing saves the complete title, description, and images against the source requirement fingerprint. The backend still checks its current record revision; an unrelated status update does not change the requirement fingerprint. Execution feedback changes
only status, conclusion, and execution facts, so a result received after a
title or description edit cannot overwrite that edit. Creating a production
request saves a draft and opens the production note; it does not dispatch AI.

The list contains image counts/names and short text previews, not base64 image bodies or frozen delivery payloads. Images and complete editable text remain available inline through “查看图片 / 编辑需求”. Native SDK pagination owns opaque cursors and snapshot resets; cards remain in the same compact entry / three-column interaction. `todos` with `view: "text"` is the full-text business read for generation/deduplication. `todo` with `view: "history"` is the separate historical read. Save/create replies contain identities and revisions, never image copies.

`workflowStatus` supplies fixed global counts. The canonical `categories` query returns `{items,next,revision,total}`, with complete `{category,count}` rows from the whole project; its independently paged filter bar keeps the current selection and the “全部” option available across pages and local read errors.
