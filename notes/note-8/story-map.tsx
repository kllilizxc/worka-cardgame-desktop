import type {StoryReport} from "./story-model";

export function StoryMap({ report, compact = false, selectedNode, onSelect }: {
    report: StoryReport;
    compact?: boolean;
    selectedNode?: string;
    onSelect(id: string): Promise<void>;
}) {
    const nodes = report.nodes.slice(0, compact ? 6 : 100);
    const ids = new Set(nodes.map(node => node.id));
    const depths = new Map<string, number>();
    const queue = ids.has(report.entry) ? [report.entry] : nodes.length ? [nodes[0].id] : [];
    if (queue.length)
        depths.set(queue[0], 0);
    for (let index = 0; index < queue.length; index++) {
        for (const edge of report.edges.filter(edge => edge.from === queue[index] && ids.has(edge.to))) {
            if (!depths.has(edge.to)) {
                depths.set(edge.to, Math.min((depths.get(queue[index]) ?? 0) + 1, compact ? 3 : 10));
                queue.push(edge.to);
            }
        }
    }
    const lastDepth = Math.max(0, ...depths.values()) + 1;
    const rows = new Map<number, number>();
    const positions = new Map(nodes.map(node => {
        const depth = depths.get(node.id) ?? lastDepth, row = rows.get(depth) ?? 0;
        rows.set(depth, row + 1);
        return [node.id, { x: 82 + depth * 164, y: 26 + row * 48 }] as const;
    }));
    const width = Math.max(164, ...Array.from(positions.values()).map(point => point.x + 82));
    const height = Math.max(52, ...Array.from(positions.values()).map(point => point.y + 26));
    return <svg className="cg-story-map" role="group" aria-label="剧情分支图" viewBox={`0 0 ${width} ${height}`} style={compact ? undefined : { display: 'block', width: Math.max(560, width), height: Math.max(160, height), maxWidth: 'none' }}>
    <style>{`.cg-story-map text{fill:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px}.cg-story-node{cursor:pointer}.cg-story-node:focus-visible{outline:none}.cg-story-node:focus-visible .cg-story-shape,.cg-story-node:hover .cg-story-shape{stroke:var(--wb-accent);stroke-width:2}`}</style>
    {report.edges.filter(edge => positions.has(edge.from) && positions.has(edge.to)).map(edge => {
            const from = positions.get(edge.from)!, to = positions.get(edge.to)!;
            return <g key={edge.id}><title>{edge.text}{edge.conditional ? ' · 有条件' : ''}</title><path d={`M ${from.x + 66} ${from.y} C ${from.x + 100} ${from.y}, ${to.x - 100} ${to.y}, ${to.x - 66} ${to.y}`} fill="none" stroke={edge.conditional ? 'var(--wb-warning)' : 'var(--wb-muted-light)'} strokeWidth="1.5"/><path d={`M ${to.x - 72} ${to.y - 3} L ${to.x - 66} ${to.y} L ${to.x - 72} ${to.y + 3}`} fill="none" stroke={edge.conditional ? 'var(--wb-warning)' : 'var(--wb-muted-light)'} strokeWidth="1.5"/></g>;
        })}
    {nodes.map(node => {
            const point = positions.get(node.id)!;
            const terminal = report.terminalIds.includes(node.id);
            return <g key={node.id} className="cg-story-node" role="button" tabIndex={0} aria-label={`查看节点 ${node.title}`} aria-pressed={selectedNode === node.id} transform={`translate(${point.x},${point.y})`} onClick={() => void onSelect(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                void onSelect(node.id);
            } }}>
        <title>{node.title}{terminal ? ' · 终点' : node.id === report.entry ? ' · 入口' : ''}</title>
        <rect className="cg-story-shape" x="-66" y="-17" width="132" height="34" rx={terminal ? 17 : 6} fill={selectedNode === node.id ? 'var(--wb-accent-pale)' : terminal ? 'var(--wb-success-pale)' : 'var(--wb-surface-deep)'} stroke={selectedNode === node.id ? 'var(--wb-accent)' : 'transparent'}/>
        <text textAnchor="middle" dominantBaseline="central">{node.title.length > 8 ? `${node.title.slice(0, 7)}…` : node.title}</text>
      </g>;
        })}
  </svg>;
}
