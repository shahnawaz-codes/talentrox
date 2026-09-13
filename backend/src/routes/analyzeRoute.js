import express from "express";
import { protectedRoute } from "../midleware/protectedRoute.js";
import { analyzeRateLimiter } from "../midleware/rateLimiter.js";
import { analyzeCodeWithGemini } from "../lib/gemini.js";

const analyzeRoutes = express.Router();

analyzeRoutes.post(
  "/",
  protectedRoute,
  analyzeRateLimiter,
  async (req, res, next) => {
    try {
      const { code, language, problemStatement } = req.body || {};

      if (!code || typeof code !== "string" || !code.trim()) {
        return res.status(400).json({ error: "Code content is required" });
      }

      if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "Language is required" });
      }

      if (!problemStatement || typeof problemStatement !== "string") {
        return res.status(400).json({ error: "Problem statement is required" });
      }

      const analysis = await analyzeCodeWithGemini({
        code,
        language,
        problemStatement,
      });

      return res.status(200).json(analysis);
    } catch (error) {
      console.error("Error in /api/analyze-code:", error.message);
      const statusCode = error.status || 500;
      return res.status(statusCode).json({
        error: error.message || "Failed to analyze code",
      });
    }
  }
);

export default analyzeRoutes;
