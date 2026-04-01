import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
let client = null;
export const initializeStreamClient = async (user, token) => {
  if (!client) {
    client = new StreamVideoClient({
      apiKey,
      token,
      user,
    });
  }
  return client;
};

export const disconnectStreamClient = async () => {
  if (client) {
    await client.disconnectUser();
    client = null;
  }
};
