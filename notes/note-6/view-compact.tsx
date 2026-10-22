import {useNote,NoteIcon} from '@dsh-workbench/react';
import type {WidgetProps} from './surface';
import GameChangesCompact from './game-changes-compact';

function SyncDiagnostics({compact}:{compact?:boolean}){
  const {useQuery}=useNote<typeof import('./actions')>();
  const resource=useQuery('diagnostics',{});
  const entries=Object.entries(resource.data?.ci??{}).filter(([,value])=>Boolean(value&&typeof value==='object'&&'error' in value&&value.error));
  if(entries.length)return <span className="compact-diagnostic" title="展开卡片查看 CI 查询详情">CI 异常 · {entries.length}</span>;
  return resource.data?.syncing?<span className="compact-diagnostic" role="status">后台同步中</span>:null;
}
function BrandIcon({ icon }: { icon: WidgetProps["metadata"]["icon"] }) {
  return (<span className="brand-logo" aria-hidden="true">
              <NoteIcon icon={icon} size={13} />
            </span>);
}

export default function Compact(){
  const {config}=useNote<typeof import('./actions')>();
  return config.presentation==='changes'?<GameChangesCompact/>:<FeatureCompact/>;
}
function FeatureCompact(){
  const {metadata,host,useQuery}=useNote<typeof import('./actions')>();
  const displayResource=useQuery('summary',{});
  const data=displayResource.data;
  const compactFeatures=(data?.features??[]).filter(feature=>!feature.archived);
  const compactActiveCount=data?.activeCount??compactFeatures.length;
  const ledgerIssues=data?.errors??[];
  const refreshing=false;
  const openExecutionDesk=(_feature?:unknown)=>host.openNote(metadata.id);
  const handleRefresh=()=>host.openNote(metadata.id);
  const refreshAction:{error?:Error}={};
  const navigationError='';
  const renderBadge = (f: {totalPrs:number;mergedPrs:number;links:unknown[]}) => {
    if (!f.links || f.links.length === 0) {
      return <span className="badge-overall muted">尚未关联项目</span>;
    }
    if (f.totalPrs > 0 && f.mergedPrs === f.totalPrs) {
      return <span className="badge-overall ok">✓ 全部合并 ({f.mergedPrs}/{f.totalPrs})</span>;
    }
    if (f.mergedPrs > 0) {
      return <span className="badge-overall pending">部分合并 ({f.mergedPrs}/{f.totalPrs})</span>;
    }
    if (f.totalPrs > 0) {
      return <span className="badge-overall pending">待合并 ({f.totalPrs} PR)</span>;
    }
    return <span className="badge-overall muted">未登记 PR</span>;
  };

    return (
      <section className="ft-widget compact">
        <style>{css}</style>
        <header className="navbar-compact">
          <div className="brand-box">
            <BrandIcon icon={metadata.icon} />
            <span className="brand-title">{metadata.name}</span>
            <span className="brand-count">{compactActiveCount} 个功能</span>
          </div>
          <div className="navbar-actions">

            <span className="sync-box">
              <span className={`dot ${refreshing ? "busy" : ""}`} />
              {refreshing ? "同步中..." : "在线"}
            </span>
            <button
              className="btn-compact-refresh"
              disabled={refreshing}
              onClick={() => void handleRefresh()}
              aria-label="刷新功能进展"
              title="刷新功能进展"
            >
              <svg className={`refresh-spin ${refreshing ? "is-spinning" : ""}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3" />
              </svg>
            </button>
          </div>
        </header>

        <div className="compact-card-list">
          {compactFeatures.slice(0, 3).map((f) => (
            <article key={f.id} className="feature-card-compact">
              <div className="compact-feature-card-head">
                <div className="card-header-compact">
                  <div className="compact-feature-title-row">
                    <span className="feature-title" style={{ fontSize: "14px" }} title={f.title}>{f.title}</span>
                    <button
                      type="button"
                      className="btn-compact-feature-execution"
                      onClick={() => void openExecutionDesk(f)}
                      aria-label={`打开「${f.title}」对应的执行台任务`}
                      title="打开该功能对应的执行台任务"
                    >
                      ↗
                    </button>
                  </div>
                  <div className="compact-feature-meta">
                    {renderBadge(f)}
                    {f.summary && <div className="feature-summary" title={f.summary}>{f.summary}</div>}
                  </div>
                </div>
              </div>
            </article>
          ))}
          {compactActiveCount > 3 && (
            <div className="compact-more">
              还有 {compactActiveCount - 3} 个功能，展开查看完整矩阵 ↗
            </div>
          )}
        </div>

        <footer className="compact-footer">
          <div className="compact-footer-status">
            <SyncDiagnostics compact />
            <span
              className={`compact-ledger-status${ledgerIssues.length > 0 ? " is-warning" : displayResource.error || data?.status === "error" ? " is-failed" : ""}`}
              title={ledgerIssues.length > 0 ? `台账 ${ledgerIssues.length} 条记录无法解析，其他记录仍可操作` : displayResource.error || data?.status === "error" ? "状态同步暂不可用" : "功能进展自动同步"}
            >
              {ledgerIssues.length > 0 ? `台账异常 · ${ledgerIssues.length}` : displayResource.error || data?.status === "error" ? "同步异常" : "自动同步"}
            </span>
          </div>
          <div className="compact-footer-actions">
            <button
              type="button"
              className="btn-compact-execution"
              onClick={() => void openExecutionDesk()}
              title="打开执行台总览"
            >
              执行台总览 ↗
            </button>
            <a href={data?.serverUrl || "http://127.0.0.1:47831"} target="_blank" rel="noopener noreferrer" style={{ color: "var(--link)", fontWeight: 550 }}>
              独立看板 ↗
            </a>
          </div>
          {refreshAction.error && <span role="alert">刷新未完成：{refreshAction.error.message}</span>}
          {navigationError && <span className="navigation-error" role="alert">执行台打开失败：{navigationError}</span>}
        </footer>
      </section>
    );
}
const css = `
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", "Segoe UI", sans-serif;
  --font-mono: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;

  --bg-page: var(--wb-surface);
  --surface: var(--wb-paper);
  --surface-subtle: var(--wb-surface);
  --surface-header: var(--wb-paper);
  --surface-hover: var(--wb-surface-deep);
  --surface-active: var(--wb-surface-deep);


  --text-primary: var(--wb-ink);
  --text-secondary: var(--wb-ink-soft);
  --text-muted: var(--wb-muted);
  --text-faint: var(--wb-muted-light);

  --link: var(--wb-accent);
  --link-hover: var(--wb-accent-strong);

  --tone-ok-fg: var(--wb-success);
  --tone-ok-bg: var(--wb-success-pale);

  --tone-pending-fg: var(--wb-warning);
  --tone-pending-bg: var(--wb-warning-pale);

  --tone-failed-fg: var(--wb-danger);
  --tone-failed-bg: var(--wb-danger-pale);

  --tone-muted-fg: var(--wb-ink-soft);
  --tone-muted-bg: var(--wb-surface);


  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-pill: 9999px;
}

.ft-widget {
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background-color: var(--bg-page);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.ft-widget * { box-sizing: border-box; }
.ft-widget.expanded { padding: 16px 20px 24px; min-width: 0; overflow-wrap: anywhere; }
.ft-widget .toolbar-strip { flex-wrap: wrap; }
.ft-widget .segmented-control { max-width: 100%; overflow-x: auto; }
.ft-widget .navbar-inner { flex-wrap: wrap; height: auto; min-height: 52px; padding: 8px 0; }
.ft-widget .feature-feed, .ft-widget .feature-card, .ft-widget .table-scroll { min-width: 0; max-width: 100%; }
.ft-widget .matrix-table { min-width: 760px; }
a { color: var(--link); text-decoration: none; }
a:hover { color: var(--link-hover); }

/* Compact View */
.ft-widget.compact {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
}
.navbar-compact {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.compact-card-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 0 0 auto;
}
.compact-feature-card-head { display: block; }
.card-header-compact {
  min-width: 0;
  flex: 1;
}
.feature-card-compact {
  min-width: 0;
  border: 0;
  border-radius: var(--radius-md);
  padding: 0;
  background: var(--surface);
  box-shadow: none;
}

/* Expanded Navbar */
.navbar {
  background: var(--surface);
  border: 0;
  position: sticky;
  top: 0;
  z-index: 40;
  margin: 0 0 18px;
}
.navbar-inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 28px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-box {
  flex-shrink: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 5px;
  background: var(--link);
  color: var(--wb-accent-foreground);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
.brand-title {
  font-size: 15px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}
.brand-count {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 550;
  color: var(--text-muted);
  background: transparent;
  padding: 2px 0;
  border-radius: var(--radius-sm);
  border: 0;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.copy-trigger { min-height: 32px; height: 32px; padding: 0 9px; font-size: 11px; font-weight: 600; gap: 5px; }
.copy-feedback { max-width: 170px; color: var(--tone-ok-fg); font-size: 11px; line-height: 1.35; text-align: right; }
.copy-feedback.is-error { color: var(--tone-failed-fg); }
.search-box {
  position: relative;
  width: 220px;
}
.sync-box {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--tone-ok-fg);
}
.dot.busy {
  background-color: var(--link);
  animation: pulse 1s infinite alternate;
}
.dot.error {
  background-color: var(--tone-failed-fg);
}
@keyframes pulse { from { opacity: 0.3; } to { opacity: 1; } }

.btn-nav {
  background: var(--surface-subtle);
  border: 0;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.12s ease;
  white-space: nowrap;
}
.btn-nav:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.toolbar-strip {
  max-width: 1360px;
  margin: 0 auto 14px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--surface-hover);
  padding: 2px;
  border-radius: var(--radius-md);
  border: 0;
}
.segment-tab {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.12s ease;
}
.segment-tab:hover { color: var(--text-primary); }
.segment-tab.active {
  background: var(--surface);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: none;
}

.feature-feed {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* Light mode needs a recessed canvas and white cards, not near-white on near-white. */
:root[data-theme="light"] .ft-widget.expanded {
  --bg-page: color-mix(in srgb, var(--wb-surface) 92%, var(--wb-ink));
  --surface-subtle: var(--wb-surface-deep);
}
:root[data-theme="light"] .expanded .feature-card {
  --feature-surface: var(--wb-paper);
  --feature-inset: var(--wb-surface-deep);
}

/* Dark mode: lower surface contrast and desaturate accents so dense status data stays calm. */
:root[data-theme="dark"] .ft-widget {
  --bg-page: color-mix(in srgb, var(--wb-surface) 90%, var(--wb-paper) 10%);
  --surface: color-mix(in srgb, var(--wb-paper) 86%, var(--wb-surface) 14%);
  --surface-subtle: color-mix(in srgb, var(--wb-surface-deep) 70%, var(--wb-surface) 30%);
  --surface-hover: color-mix(in srgb, var(--wb-surface-deep) 64%, var(--wb-paper) 36%);
  --surface-active: color-mix(in srgb, var(--wb-surface-deep) 52%, var(--wb-paper) 48%);
  --text-primary: color-mix(in srgb, var(--wb-ink) 82%, var(--wb-paper) 18%);
  --text-secondary: color-mix(in srgb, var(--wb-ink-soft) 82%, var(--wb-paper) 18%);
  --text-muted: color-mix(in srgb, var(--wb-muted) 90%, var(--wb-paper) 10%);
  --text-faint: color-mix(in srgb, var(--wb-muted-light) 88%, var(--wb-paper) 12%);
  --link: color-mix(in srgb, var(--wb-accent) 82%, var(--wb-paper) 18%);
  --link-hover: color-mix(in srgb, var(--wb-accent-strong) 82%, var(--wb-paper) 18%);
  --tone-ok-fg: color-mix(in srgb, var(--wb-success) 78%, var(--wb-paper) 22%);
  --tone-ok-bg: color-mix(in srgb, var(--wb-success-pale) 78%, var(--bg-page) 22%);
  --tone-pending-fg: color-mix(in srgb, var(--wb-warning) 78%, var(--wb-paper) 22%);
  --tone-pending-bg: color-mix(in srgb, var(--wb-warning-pale) 78%, var(--bg-page) 22%);
  --tone-failed-fg: color-mix(in srgb, var(--wb-danger) 78%, var(--wb-paper) 22%);
  --tone-failed-bg: color-mix(in srgb, var(--wb-danger-pale) 78%, var(--bg-page) 22%);
  --tone-muted-fg: var(--text-secondary);
  --tone-muted-bg: color-mix(in srgb, var(--surface-subtle) 76%, var(--bg-page) 24%);
}
:root[data-theme="dark"] .ft-widget .feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 88%, var(--bg-page) 12%);
  --feature-inset: color-mix(in srgb, var(--feature-surface) 85%, var(--bg-page) 15%);
}

/* Feature Card */
.feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 97%, var(--text-primary));
  --feature-inset: color-mix(in srgb, var(--feature-surface) 96%, var(--text-primary));
  background: var(--feature-surface);
  border: 0;
  border-radius: var(--radius-lg);
  box-shadow: none;
  overflow: hidden;
}
.feature-card:hover {
  box-shadow: none;
}
.card-header {
  padding: 24px 24px 18px;
  background: transparent;
  border: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card-header-main { flex: 1; min-width: 0; }
.feature-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.feature-title {
  font-size: 16px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.25px;
  margin: 0;
}
.badge-overall {
  font-size: 11px;
  font-weight: 550;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  line-height: 1.45;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
}
.badge-overall.ok {
  color: var(--tone-ok-fg);
  background: var(--tone-ok-bg);
}
.badge-overall.pending {
  color: var(--tone-pending-fg);
  background: var(--tone-pending-bg);
}
.badge-overall.muted {
  color: var(--tone-muted-fg);
  background: var(--tone-muted-bg);
}

.feature-summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  line-height: 1.65;
  max-width: 960px;
}
.feature-meta-bar {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-dot {
  color: var(--text-faint);
  font-size: 10px;
}
.feature-meta-bar b {
  color: var(--text-secondary);
  font-weight: 550;
}
.btn-doc-toggle {
  font-size: 11px;
  color: var(--link);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.btn-doc-toggle:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

/* Matrix Table Grid */
.table-scroll { overflow-x: auto; padding-bottom: 8px; }
.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: left;
}
.matrix-table thead th {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 12px 24px 8px;
  background: transparent;
  border: 0;
  letter-spacing: 0.3px;
}
.matrix-table th.col-project { width: 25%; }
.matrix-table th.col-env {
  width: 25%;
  border: 0;
}
.env-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 650;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.env-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.env-dot.dev { background: var(--link); }
.env-dot.pre { background: var(--tone-pending-fg); }
.env-dot.prod { background: var(--tone-ok-fg); }

.matrix-table tbody tr {
  border: 0;
  transition: background-color 0.12s ease;
}
.matrix-table tbody tr:last-child { border-bottom: none; }
.matrix-table tbody tr:hover { background-color: var(--feature-inset); }
.matrix-table td {
  padding: 20px 24px;
  vertical-align: top;
}
.project-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.project-name-link {
  font-size: 13px;
  font-weight: 650;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.project-name-link svg {
  opacity: 0.5;
  transition: opacity 0.15s;
}
.project-name-link:hover svg { opacity: 1; }
.project-repo-path {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  word-break: break-all;
}
.branch-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.branch-tag {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--surface-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 0;
}
.project-execution-link {
  align-self: flex-start;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--link);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.project-execution-link:hover {
  color: var(--link-hover);
  text-decoration: underline;
}
.matrix-table td.cell-env {
  border: 0;
}

/* Pipeline Stages — one segmented chip per step
   (status verdict and source links share a single ButtonGroup) */
.stage-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stage-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
}
.stage-name {
  width: 24px;
  flex: 0 0 24px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 550;
}
.stage-chip {
  display: inline-flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 2px;
  white-space: nowrap;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  overflow: hidden;
  line-height: 1;
  box-shadow: none;
}
.chip-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--tone-muted-fg);
  background: var(--surface-subtle);
  border: 0;
  user-select: none;
}
.chip-status.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); }
.chip-status.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); }
.chip-status.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); }
.chip-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 20px;
  padding: 0 5px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--link);
  text-decoration: none;
  border: 0;
  transition: background 0.12s ease, color 0.12s ease;
}
.chip-link:hover {
  background: var(--surface-hover);
  color: var(--link-hover);
}
.chip-link.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); font-weight: 650; }
.chip-link.tone-ok:hover { background: var(--tone-ok-bg); }
.chip-link.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); font-weight: 700; }
.chip-link.tone-failed:hover { background: var(--tone-failed-bg); }
.chip-link.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); font-weight: 600; }
.chip-link.tone-pending:hover { background: var(--tone-pending-bg); }
.chip-link.tone-muted { color: var(--wb-muted); background: var(--surface-subtle); font-weight: 500; }
.chip-link.tone-muted:hover { background: var(--surface-active); }
.stage-chip > :last-child {
  border: 0;
}

.empty-links-box {
  padding: 22px 24px;
  background: var(--surface-subtle);
  border: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.empty-links-box svg { color: var(--text-faint); }
.doc-panel {
  padding: 18px 22px;
  background: var(--surface-subtle);
  border: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.65;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
.empty-feed {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--surface);
  border: 0;
  border-radius: var(--radius-lg);
}

/* A tapered rule separates summaries: thin at both ends, thicker in the middle. */
.feature-card-compact + .feature-card-compact::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  margin: 7px 0;
  background: var(--text-faint);
  opacity: .22;
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%);
}
.compact-feature-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.compact-feature-title-row .feature-title {
  flex: 1 1 auto;
}
.compact .feature-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}
.compact-feature-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-top: 5px;
}
.compact-feature-meta .badge-overall {
  flex: 0 0 auto;
  min-height: 24px;
  padding: 0 8px;
  line-height: 1;
  white-space: nowrap;
}
.compact .feature-summary,
.compact-feature-meta .feature-summary {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--text-muted);
  margin-top: 0;
  display: block;
  line-height: 1.4;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.compact .navbar-actions { width: auto; margin-left: auto; flex-shrink: 0; }
.compact-more { margin-top: 6px; font-size: 11px; line-height: 1.4; color: var(--text-muted); }
.compact-footer {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 10px;
  color: var(--text-faint);
  padding-top: 8px;
  margin-top: auto;
}
.compact-footer a { white-space: nowrap; }
.compact-footer-status {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  gap: 8px;
  white-space: nowrap;
}
.compact-diagnostic { color: var(--text-muted); }
.compact-ledger-status { color: var(--text-faint); }
.compact-ledger-status.is-warning { color: var(--tone-pending-fg); }
.compact-ledger-status.is-failed { color: var(--tone-failed-fg); }
.compact-footer-actions {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 10px;
}
.btn-compact-execution {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--link);
  font: inherit;
  font-weight: 550;
  cursor: pointer;
  white-space: nowrap;
}
.btn-compact-execution:hover { color: var(--link-hover); text-decoration: underline; }
.btn-compact-feature-execution {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--text-faint);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.btn-compact-feature-execution:hover {
  color: var(--link);
  background: var(--surface-subtle);
}
.navigation-error {
  color: var(--tone-failed-fg);
  overflow-wrap: anywhere;
}
.expanded-navigation-error {
  max-width: 1360px;
  margin: -8px auto 12px;
  font-size: 11px;
}
/* Write-blocked / action-failed notices: same recessed surface as other inline panels. */
.alert-box {
  max-width: 1360px;
  margin: 0 auto 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--tone-failed-bg);
  color: var(--tone-failed-fg);
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.alert-list {
  margin: 6px 0 0;
  padding-left: 18px;
}
.alert-list code {
  font-family: var(--font-mono);
  font-size: 11px;
}
.alert-hint {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
}
.archive-alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.alert-dismiss {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 15px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}
.badge-auto-archived {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.btn-compact-refresh {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; flex-shrink: 0; padding: 0;
  border: 0; border-radius: 8px; background: var(--surface-subtle);
  color: var(--text-muted); cursor: pointer;
}
.btn-compact-refresh:hover { background: var(--surface-hover); color: var(--text-primary); }
.refresh-spin.is-spinning { animation: ft-spin 1s linear infinite; }
@keyframes ft-spin { to { transform: rotate(360deg); } }
.ft-widget :is(button, a, input):focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
.ft-widget button:disabled { cursor: wait; opacity: .55; }
.ft-widget .sync-box { white-space: nowrap; flex-shrink: 0; }
.matrix-table tbody tr:nth-child(even) { background: var(--feature-inset); }
.feature-card .doc-panel, .feature-card .empty-links-box { background: var(--feature-inset); }
.ft-candidates{display:grid;gap:8px;margin-bottom:14px}.ft-candidate,.ft-adoption-record{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 11px;border:1px solid var(--wb-muted-light);border-radius:8px;font-size:12px}.ft-candidate span:nth-child(2){color:var(--text-muted)}.ft-candidate [role=alert],.ft-adoption-record [role=alert]{color:var(--wb-danger);width:100%}.ft-adoption-record{margin-top:9px}.ft-adoption-record .btn-nav{margin-left:auto}
.stage-chip { max-width: 100%; }
.chip-link { overflow-wrap: anywhere; white-space: normal; line-height: 1.4; }
.chip-link:hover { text-decoration: underline; }
.expanded .navbar { background: var(--bg-page); }
.expanded .navbar-actions { flex-wrap: wrap; }
.expanded .search-box { flex: 1 1 180px; }
@media(max-width:680px){
  .ft-widget.expanded{padding:12px 12px 20px}
  .expanded .navbar-inner,.expanded .navbar-actions{gap:10px;flex-wrap:wrap}
  .expanded .navbar-actions{width:100%;min-width:0}
  .expanded .search-box{width:100%;min-width:0;flex:1 1 100%}
  .expanded .segmented-control{flex-wrap:nowrap;max-width:100%}
  .expanded .segmented-control button{flex-shrink:0;min-height:36px}
  .expanded .card-header{padding:18px 16px;gap:10px;flex-direction:column;align-items:stretch}
  .expanded .card-header-actions{flex-wrap:wrap;justify-content:flex-start}
  .expanded .copy-feedback{flex:0 1 100%;max-width:100%}
  .expanded .feature-title-row{align-items:flex-start;gap:8px}
  .expanded .table-scroll{overscroll-behavior-x:contain}
  .expanded .btn-nav{white-space:nowrap;flex-shrink:0;min-height:36px}
}
@media(prefers-reduced-motion:reduce){
  .ft-widget *, .ft-widget *::before { animation:none !important; transition:none !important; }
}
`;
