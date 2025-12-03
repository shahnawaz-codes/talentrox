import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream API key and secret must be provided");
}
// Initialize Stream Chat client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Function to create a Stream user
export const upsertStreamUser = async (user) => {
  try {
    await chatClient.upsertUser(user);
    console.log("Stream user upserted successfully");
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully");
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};
