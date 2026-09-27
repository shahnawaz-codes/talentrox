import express from "express";
import { protectedRoute } from "../midleware/protectedRoute.js";
import { interviewRateLimiter } from "../midleware/rateLimiter.js";
import {
  startInterviewSession,
  getInterviewSession,
  submitCodeForReview,
  submitAnswer,
  endInterviewSession,
} from "../controllers/interviewController.js";

const interviewRoutes = express.Router();

// All interview routes require Clerk authentication
interviewRoutes.use(protectedRoute);

interviewRoutes.post("/start", startInterviewSession);
interviewRoutes.get("/:sessionId", getInterviewSession);
interviewRoutes.post("/:sessionId/submit-code", interviewRateLimiter, submitCodeForReview);
interviewRoutes.post("/:sessionId/answer", interviewRateLimiter, submitAnswer);
interviewRoutes.post("/:sessionId/end", interviewRateLimiter, endInterviewSession);

export default interviewRoutes;
