import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export const initializeStreamClient = (user, token) => {
  return new StreamVideoClient({ apiKey, token, user });
};

export const disconnectStreamClient = async (client) => {
  if (client) {
    await client.disconnectUser();
  }
};