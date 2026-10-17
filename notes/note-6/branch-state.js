const environments = { dev: 'dev', pre: 'pre-prod', main: 'prod' };
export function branchState(link, slot) {
  if (link.trackingLabel) {
    const state = {label: link.trackingLabel, tone: 'muted'};
    return {branch: slot, merge: state, ci: state, deploy: state, prs: [], targets: [], ciRuns: []};
  }
  const environment = environments[slot];
  const branch = link.environmentBranches?.[environment] ?? slot;
  const allPrs = link.prs.filter(p => (p.observation?.data?.base || p.baseHint) === branch);
  const prs = allPrs.filter(p => p.observation?.data?.state !== 'closed' || p.observation.error);
  const closedOnly = allPrs.length > 0 && prs.length === 0;
  const targets = link.deployments.filter(d => d.environment === environment);
  const unresolved = link.prs.some(p => !p.observation?.data);
  let merge = { label: unresolved ? '未知' : '未登记 PR', tone: 'muted' };
  if (prs.length) {
    if (prs.some(p => !p.observation?.data)) merge = { label: '待查询', tone: 'muted' };
    else if (prs.some(p => p.observation.error)) merge = prs.every(p => p.observation.data.state === 'merged') ? { label: '已合并', tone: 'ok', stale: true } : { label: '待更新', tone: 'muted', stale: true };
    else {
      const n = prs.filter(p => p.observation.data.state === 'merged').length;
      merge = n === prs.length ? { label: '已合并', tone: 'ok' } : { label: n ? '部分合并' : '未合并', tone: 'pending' };
    }
  }
  if (closedOnly) merge = { label: '已关闭', tone: 'failed' };
  // A repo with no deployment surface at all is registered prOnly; that is a
  // complete mapping, not a missing one, so it must not read as 待配置映射.
  const prOnly = link.prOnly === true;
  let deploy = { label: targets.length ? '未知' : prOnly ? '仅 PR' : '待配置映射', tone: 'muted' };
  if (targets.length && targets.every(d => d.observation?.data && !d.observation.error)) {
    const rolling = targets.some(d => d.observation.data.rows.some(r => r.status === 'Deploying'));
    const pairs = prs.flatMap(p => targets.map(d => p.relations.find(r => r.target === d.id)));
    const active = targets.every(d => { const rows = d.observation.data.rows.filter(r => r.status === 'PRIMARY'); return rows.length === 1 && rows[0].running > 0; });
    if (rolling && pairs.some(r => r?.kind === 'included')) deploy = { label: '部署中', tone: 'pending' };
    else if (merge.label === '已合并' && !merge.stale && pairs.length && pairs.every(r => r?.kind === 'included') && active) deploy = { label: '已部署', tone: 'ok' };
    else if (merge.label === '已合并' && !merge.stale && prs.length && !rolling) {
      const included = targets.filter(d => {
        const current = d.observation.data.rows.filter(r => r.status === 'PRIMARY');
        return current.length === 1 && current[0].running > 0 && prs.every(p => p.relations.find(r => r.target === d.id)?.kind === 'included');
      }).length;
      if (included > 0 && included < targets.length) deploy = { label: `部分部署 ${included}/${targets.length}`, tone: 'pending' };
      else if (active && pairs.length && pairs.every(r => r?.comparison === 'behind')) deploy = { label: '待部署', tone: 'pending' };
      else if (pairs.some(r => r?.kind === 'unproven')) deploy = { label: '未证实', tone: 'pending' };
    }
  }
  if (targets.length && !prs.length && !unresolved) deploy = { label: '缺少 PR', tone: 'muted' };
  else if (targets.length && merge.label === '未合并') deploy = { label: '待合并', tone: 'muted' };
  else if (deploy.label === '未知' && targets.length && merge.label === '已合并' && !merge.stale && targets.every(d => d.observation?.data && !d.observation.error) && targets.some(d => d.observation.data.rows.some(r => r.status === 'PRIMARY' && !r.commit))) deploy = { label: '缺少源码', tone: 'muted' };
  // A branch can contain delivered work and additional open PRs. Evaluate the
  // merged subset without claiming that the entire feature has been deployed.
  const mergedPrs = prs.filter(p => p.observation?.data?.state === 'merged');
  const hasOpen = prs.some(p => p.observation?.data?.state === 'open');
  if (targets.length && hasOpen && !prs.some(p => !p.observation?.data || p.observation.error)) {
    if (!mergedPrs.length) deploy = { label: '待合并', tone: 'muted' };
    else {
      const delivered = targets.every(d => targetDeploymentState(d, mergedPrs).tone === 'ok');
      deploy = delivered
        ? { label: '已合并部分已部署 · 仍有待合并', tone: 'pending' }
        : { label: '仍有待合并 · 已合并部分' + branchState({ ...link, prs: mergedPrs }, slot).deploy.label, tone: 'pending' };
    }
  }
  let ci = { label: '未登记 PR', tone: 'muted' };
  const ciRuns = mergedPrs.flatMap(p => p.ci?.data?.runs ?? []);
  if (prs.length) {
    if (prs.some(p => !p.observation?.data || p.observation.error)) ci = { label: '待核实', tone: 'muted' };
    else if (!mergedPrs.length) ci = { label: '待合并', tone: 'muted' };
    else if (!link.ciBranches?.includes(branch)) ci = { label: '待配置映射', tone: 'muted' };
    else if (mergedPrs.some(p => p.ci?.error)) ci = { label: '查询失败', tone: 'pending', stale: ciRuns.length > 0 };
    else if (mergedPrs.some(p => !p.ci?.data)) ci = { label: '待查询', tone: 'muted' };
    else {
      const states = ciRuns.map(r => ciRunState(r));
      if (states.includes('failed')) ci = { label: '构建失败', tone: 'failed' };
      else if (states.includes('running')) ci = { label: '构建中', tone: 'pending' };
      else if (states.length && states.every(s => s === 'success')) ci = { label: '构建成功', tone: 'ok' };
      else if (states.length && states.every(s => s === 'missing')) ci = { label: '无构建记录', tone: 'muted' };
      else if (states.includes('success') && states.includes('missing')) ci = { label: '部分构建', tone: 'pending' };
      else ci = { label: '未知状态', tone: 'muted' };
    }
  }
  if (hasOpen && mergedPrs.length) ci = { ...ci, tone: ci.tone === 'ok' ? 'pending' : ci.tone };
  if (closedOnly) {
    ci = { label: '已关闭', tone: 'muted', hidden: true };
    deploy = { label: '已关闭', tone: 'muted', hidden: true };
  }
  return { branch, merge, ci, ciRuns, deploy, prs: allPrs, targets: closedOnly ? [] : targets };

}

export function ciRunState(run) {
  if (run.status === 'missing') return 'missing';
  const result = String(run.result || '').toUpperCase();
  if (['FAILURE', 'FAILED', 'ERROR', 'ABORTED', 'CANCELLED', 'CANCELED'].includes(result) || ['failed', 'failure', 'error', 'aborted', 'cancelled', 'canceled'].includes(run.status)) return 'failed';
  if (['started', 'in-progress', 'pending', 'queued', 'running', 'created'].includes(run.status)) return 'running';
  if (run.status === 'complete' && result === 'SUCCESS') return 'success';
  return 'unknown';
}

export function targetDeploymentState(target, prs) {
  prs = prs.filter(p => p.observation?.data?.state !== 'closed' || p.observation.error);
  if (prs.some(p => !p.observation?.data || p.observation.error)) return { tone: 'muted', desc: '待核实' };
  if (prs.some(p => p.observation.data.state === 'open')) {
    const merged = prs.filter(p => p.observation.data.state === 'merged');
    if (!merged.length) return { tone: 'muted', desc: '待合并' };
    const state = targetDeploymentState(target, merged);
    return { tone: state.tone === 'ok' ? 'pending' : state.tone, desc: '已合并部分' + state.desc + ' · 仍有待合并' };
  }
  if (!target.observation?.data || target.observation.error) {
    return { tone: 'muted', desc: '未知' };
  }
  const rolling = target.observation.data.rows.some(r => r.status === 'Deploying');
  const current = target.observation.data.rows.filter(r => r.status === 'PRIMARY');
  const active = current.length === 1 && current[0].running > 0;
  const allIncluded = prs.length > 0 && prs.every(p => p.relations?.find(r => r.target === target.id)?.kind === 'included');
  const anyBehind = prs.some(p => p.relations?.find(r => r.target === target.id)?.comparison === 'behind');

  if (rolling && allIncluded) return { tone: 'pending', desc: '部署中' };
  if (allIncluded && active) return { tone: 'ok', desc: '已部署' };
  if (anyBehind) return { tone: 'pending', desc: '待部署' };
  if (prs.some(p => p.relations?.find(r => r.target === target.id)?.kind === 'unproven')) return { tone: 'pending', desc: '未证实' };
  return { tone: 'muted', desc: '未知' };
}

// Automatic archiving is a live view; retain polling so regressions become visible.
export function featureArchived(feature) {
  if (feature.archived) return true;
  return feature.links.length > 0 && feature.links.every(link =>
    link.prs.some(p => p.observation?.data?.state === 'merged') && link.prs.filter(p => p.observation?.data?.state !== 'closed' || p.observation.error).every(p => p.observation?.data?.state === 'merged' && !p.observation.error && Object.entries(environments).some(([slot, env]) => (link.environmentBranches?.[env] ?? slot) === p.observation.data.base)) &&
    Object.keys(environments).every(branch => branchState(link, branch).deploy.tone === 'ok')
  );
}
