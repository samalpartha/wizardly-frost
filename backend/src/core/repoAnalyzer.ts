export interface FileSummary {
  path: string;
  language: string;
  linesOfCode: number;
}

export interface RepoSnapshot {
  repoUrl: string;
  branch: string;
  files: FileSummary[];
}

/**
 * Mock analyzer – returns a fake snapshot so all agents can run.
 */
export async function analyzeRepoFromUrl(
  repoUrl: string,
  branch = "main"
): Promise<RepoSnapshot> {
  return {
    repoUrl,
    branch,
    files: [
      { path: "src/api/user.ts", language: "TypeScript", linesOfCode: 120 },
      { path: "src/api/auth.ts", language: "TypeScript", linesOfCode: 210 },
      { path: "src/components/Button.tsx", language: "TSX", linesOfCode: 60 },
    ],
  };
}
