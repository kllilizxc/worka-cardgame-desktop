import {branchState,featureArchived,ciRunState,targetDeploymentState} from "./branch-state.js";

export function projectTracker(data: any, candidates: any[]) {
  const nextState = {
    serverUrl: data.serverUrl,
    status: data.runtimeError ? "error" as const : "running" as const,
    totalCount: data.features.length,
    activeCount: data.features.filter((f: any) => !featureArchived(f)).length,
    archivedCount: data.features.filter((f: any) => featureArchived(f)).length,
    // Surface per-record parse errors; unrelated records remain writable.
    errors: Array.isArray(data.errors)
      ? data.errors.map((e: any) => ({ file: String(e?.file ?? ""), error: String(e?.error ?? "") }))
      : [],
    features: data.features.map((f: any) => {
      const explicitlyArchived = f.archived === true;
      const isArchived = featureArchived(f);
      // Keep an explicitly recorded execution target when the tracker provides
      // one; historical records intentionally fall back to the desk list.
      const execution = f.execution && typeof f.execution === "object"
        ? {
            ...(typeof f.execution.noteId === "string" ? { noteId: f.execution.noteId } : {}),
            ...(typeof f.execution.delegationId === "string" ? { delegationId: f.execution.delegationId } : {}),
          }
        : undefined;
      let totalPrs = 0;
      let mergedPrs = 0;
      (f.links || []).forEach((l: any) => {
        (l.prs || []).forEach((p: any) => {
          if (p.observation?.data?.state === "closed") return;
          totalPrs++;
          if (p.observation?.data?.state === "merged") mergedPrs++;
        });
      });

      const links = (f.links || []).map((link: any) => {
        const repoNameShort = link.repoName ? link.repoName.split("/").pop() : link.repo;
        const allPrItems = (link.prs || []).map((p: any) => {
          const state = p.observation?.data?.state;
          const base = p.observation?.data?.base || p.baseHint || "未知分支";
          const title = p.observation?.data?.title;
          const status = state === "merged" ? "已合并" : state || "未知";
          return {
            branch: base,
            number: p.number,
            url: p.url,
            label: `#${p.number}`,
            state,
            title: title ? `${title} (${status})` : `PR #${p.number} (${status})`,
          };
        });
        const branches: Record<string, any> = {};
        for (const branch of ["dev", "pre", "main"]) {
          const s = branchState(link, branch);
          // PR segments — always the real PR number, toned by that PR's own state
          const prItems = s.prs.map((p: any) => {
            const state = p.observation?.data?.state;
            const tone = !p.observation?.data ? "muted" : state === "merged" ? "ok" : state === "closed" ? "failed" : "pending";
            return {
              number: p.number,
              url: p.url,
              label: `#${p.number}`,
              state,
              title: `${p.observation?.data?.title || `PR #${p.number}`} (${state === "merged" ? "已合并" : state || "未知"})`,
              tone
            };
          });

          // CI segments — a single run collapses to an external-link arrow
          const runs: any[] = [...new Map(s.ciRuns.map((r: any) => [r.url, r])).values()];
          let ciItems: any[] = [];
          if (runs.length === 1) {
            const runState = ciRunState(runs[0]);
            const tone = runState === "success" ? "ok" : runState === "failed" ? "failed" : runState === "running" ? "pending" : "muted";
            ciItems = [{ url: runs[0].url, label: "↗", title: `${runs[0].spec} (${runs[0].status || ""})`, tone }];
          } else if (runs.length > 1) {
            ciItems = runs.map((r: any, i: number) => {
              const runState = ciRunState(r);
              const tone = runState === "success" ? "ok" : runState === "failed" ? "failed" : runState === "running" ? "pending" : "muted";
              return {
                url: r.url,
                label: String(i + 1),
                title: `${r.spec || "流水线"} (${r.status || ""})`,
                tone
              };
            });
          } else if (link.ciProjectUrl) {
            ciItems = [{ url: link.ciProjectUrl, label: "↗", title: "GitHub Actions" }];
          }

          // Deployment segments — a single service collapses to an external-link arrow
          const targets: any[] = [...new Map(s.targets.map((d: any) => [d.deploymentUrl, d])).values()];
          let deploymentItems: any[] = [];
          if (targets.length === 1) {
            const tState = targetDeploymentState(targets[0], s.prs);
            deploymentItems = [{ url: targets[0].deploymentUrl, label: "↗", title: `${targets[0].service} (${tState.desc})`, tone: tState.tone }];
          } else if (targets.length > 1) {
            deploymentItems = targets.map((d: any, i: number) => {
              const tState = targetDeploymentState(d, s.prs);
              return {
                url: d.deploymentUrl,
                label: String(i + 1),
                title: `${d.cluster || ""} / ${d.service || ""} (${tState.desc})`,
                tone: tState.tone
              };
            });
          }

          branches[branch] = {
            branch: s.branch,
            merge: s.merge,
            ci: s.ci,
            deploy: s.deploy,
            prs: prItems,
            ciLinks: ciItems,
            deploymentLinks: deploymentItems
          };
        }

        return {
          repo: link.repo,
          repoName: link.repoName || link.repo,
          repoNameShort,
          url: link.url,
          trackingLabel: link.trackingLabel,
          mappingIssue: link.mappingIssue,
          branches: link.branches || [],
          allPrs: allPrItems,
          envBranches: branches
        };
      });

      return {
        id: f.id,
        title: f.title,
        summary: f.summary,
        next: f.next,
        body: f.body,
        createdAt: f.createdAt,
        archived: isArchived,
        // Auto-archived records are archived only because their delivery state is
        // complete; clearing the flag cannot restore them, so the view must not
        // offer a manual restore for them.
        autoArchived: isArchived && !explicitlyArchived,
        totalPrs,
        mergedPrs,
        links,
        ...(execution && Object.keys(execution).length > 0 ? { execution } : {}),
        gameCandidates: candidates.filter((candidate: any) => candidate.featureId === f.id),
      };
    })
  };

  return nextState;
}
