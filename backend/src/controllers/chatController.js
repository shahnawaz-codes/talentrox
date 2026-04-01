import { chatClient } from "../lib/stream.js";

export const generateToken = (req, res, next) => {
  try {
    const { clerkId, name, imageUrl } = req.user;
    // Generate Stream token for the user based on their Clerk ID not database ID because we used Clerk ID in Stream
    const token = chatClient.createToken(clerkId);
    res.json({
      token,
      user: { userId: clerkId, userName: name, userImage: imageUrl },
    });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    next(error);
  }
};
