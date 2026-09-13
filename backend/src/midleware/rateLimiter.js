import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each user to 10 code analysis requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    keyGeneratorIpFallback: false,
  },
  keyGenerator: (req) => {
    // Rate limit per authenticated Clerk user, fallback to sanitized IP
    return req.user?.clerkId || req.user?._id?.toString() || ipKeyGenerator(req.ip);
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded. You can only analyze code 10 times per hour. Please try again later.",
    });
  },
});

