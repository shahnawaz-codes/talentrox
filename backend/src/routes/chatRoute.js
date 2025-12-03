import express from "express";
import { protectedRoute } from "../midleware/protectedRoute.js";
import { generateToken } from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.get("/stream-token", protectedRoute, generateToken);

export default chatRoutes;
