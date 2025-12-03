import { requireAuth } from "@clerk/express";
import { User } from "../model/User.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = req.auth;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Check if user exists in the database
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectedRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
