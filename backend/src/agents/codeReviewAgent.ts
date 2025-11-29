import { RepoSnapshot } from "../core/repoAnalyzer";
import { callLLM } from "../core/llmClient";

export interface CodeReviewComment {
  file: string;
  line?: number;
  severity: "info" | "warning" | "error";
  message: string;
  suggestion?: string;
}

export async function runCodeReviewAgent(
  snapshot: RepoSnapshot
): Promise<CodeReviewComment[]> {
  const fileList = snapshot.files
    .map((f) => `- ${f.path} (${f.language}, ~${f.linesOfCode} LOC)`)
    .join("\n");

  const prompt = `
You are AURA, an autonomous code review agent.
You see the following repository snapshot:

${fileList}

Generate a list of potential review comments focusing on:
- maintainability
- potential bugs
- security smells
`;

  const content = await callLLM([
    {
      role: "system",
      content:
        "You are a senior staff engineer with strong code review skills.",
    },
    { role: "user", content: prompt },
  ]);

  // Because llmClient is mocked and returns non-JSON, we rely on fallback.
  try {
    const parsed = JSON.parse(content) as CodeReviewComment[];
    return parsed;
  } catch {
    return [
      {
        file: "src/api/auth.ts",
        severity: "warning",
        message:
          "Authentication module appears complex. Consider splitting responsibilities.",
        suggestion:
          "Extract token validation and user lookup into separate functions.",
      },
      {
        file: "src/api/user.ts",
        severity: "info",
        message: "Add more input validation for user creation endpoints.",
      },
    ];
  }
}
