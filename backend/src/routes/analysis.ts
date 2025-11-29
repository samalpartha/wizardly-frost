import { Router } from "express";
import { analyzeRepoFromUrl } from "../core/repoAnalyzer";
import { runCodeReviewAgent } from "../agents/codeReviewAgent";
import { runTestGeneratorAgent } from "../agents/testGeneratorAgent";
import { runRegressionAgent } from "../agents/regressionAgent";

export const analysisRouter = Router();

/**
 * POST /analysis/run
 * body: { repoUrl: string, branch?: string }
 */
analysisRouter.post("/run", async (req, res) => {
  const { repoUrl, branch } = req.body ?? {};
  if (!repoUrl) {
    return res.status(400).json({ error: "repoUrl is required" });
  }

  try {
    const snapshot = await analyzeRepoFromUrl(repoUrl, branch);
    const [reviews, tests, risks] = await Promise.all([
      runCodeReviewAgent(snapshot),
      runTestGeneratorAgent(snapshot),
      runRegressionAgent(snapshot),
    ]);

    res.json({
      snapshot,
      reviews,
      tests,
      risks,
    });
  } catch (err) {
    console.error("[analysis] error:", err);
    res.status(500).json({ error: "Internal error running analysis" });
  }
});
