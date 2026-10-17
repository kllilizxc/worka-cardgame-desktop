export function branchState(link: any, branch: string): {
  branch: string;
  prs: any[];
  targets: any[];
  ciRuns: any[];
  merge: { label: string; tone: string; stale?: boolean };
  ci: { label: string; tone: string; stale?: boolean };
  deploy: { label: string; tone: string; stale?: boolean };
};

export function featureArchived(feature: any): boolean;
export function ciRunState(run: any): 'missing' | 'failed' | 'running' | 'success' | 'unknown';
export function targetDeploymentState(target: any, prs: any[]): { tone: string; desc: string };
