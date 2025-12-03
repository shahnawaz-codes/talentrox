import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  INNGEST_API_KEY: process.env.INNGEST_API_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};
