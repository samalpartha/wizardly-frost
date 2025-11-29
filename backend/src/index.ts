import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";
import { analysisRouter } from "./routes/analysis";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/analysis", analysisRouter);

app.get("/", (_req, res) => {
  res.send("AURA backend is running.");
});

app.listen(env.PORT, () => {
  console.log(`AURA backend listening on http://localhost:${env.PORT}`);
});
