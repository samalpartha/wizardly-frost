import { RepoSnapshot } from "../core/repoAnalyzer";

export interface RegressionRisk {
  module: string;
  riskScore: number; // 0 - 1
  rationale: string;
}

export async function runRegressionAgent(
  snapshot: RepoSnapshot
): Promise<RegressionRisk[]> {
  return snapshot.files.map((file) => {
    const isAuth = file.path.toLowerCase().includes("auth");
    const base = Math.min(1, file.linesOfCode / 500);
    const riskScore = isAuth ? Math.min(1, base + 0.25) : base;

    return {
      module: file.path,
      riskScore,
      rationale: isAuth
        ? "Authentication logic is typically high-risk; consider extra tests."
        : "Risk estimated from file size and inferred complexity.",
    };
  });
}
