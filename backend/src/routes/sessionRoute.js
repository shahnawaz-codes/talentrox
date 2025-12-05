import express from "express";
import { protectedRoute } from "../midleware/protectedRoute.js";
import {
  createSession,
  endSessionById,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSessionById,
} from "../controllers/sessionController.js";

const sessionRoutes = express.Router();

sessionRoutes.post("/", protectedRoute, createSession);
sessionRoutes.get("/active", protectedRoute, getActiveSessions);
sessionRoutes.get("/my-recent", protectedRoute, getMyRecentSessions);

sessionRoutes.get("/:sessionId", protectedRoute, getSessionById);
sessionRoutes.post("/:sessionId/join", protectedRoute, joinSessionById);
sessionRoutes.post("/:sessionId/end", protectedRoute, endSessionById);

export default sessionRoutes;
