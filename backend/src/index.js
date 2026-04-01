import express from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoute.js";
import sessionRoutes from "./routes/sessionRoute.js";
import errorHandler from "./midleware/errorHandler.js";

const app = express();
// Clerk middleware for authentication.it gives access to req.auth
app.use(clerkMiddleware());
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration to allow requests from the client URL
app.use(cors({ origin: ENV.CLIENT_URL || "*", credentials: true }));
// Inngest setup for handling functions and events
app.use("/api/inngest", serve({ client: inngest, functions }));

// Test route
app.get("/hello", (req, res) => {
  res.send("Welcome to the API");
});
// API routes
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve frontend in production
const _dirname = path.resolve();
//make our app ready for development and production
if (ENV.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(_dirname, "../frontend/dist")));
  // Anything(route) that doesn't match the above, send back index.html
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
  });
}

export const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
