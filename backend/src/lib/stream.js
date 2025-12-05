import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream API key and secret must be provided");
}
// will be used for chat functionalities
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
// will be used for video call signaling
export const streamClient = new StreamClient(apiKey, apiSecret);

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
