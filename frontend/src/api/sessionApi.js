import { axiosInstance } from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/session", data);
    return response.data;
  },
  getActiveSessions: async () => {
    const response = await axiosInstance.get("/session/active");
    return response.data;
  },
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/session/my-recent");
    return response.data;
  },
  getSessionById: async (sessionId) => {
    const response = await axiosInstance.get(`/session/${sessionId}`);
    return response.data?.session;
  },
  joinSession: async (sessionId) => {
    const response = await axiosInstance.post(`/session/${sessionId}/join`);
    return response.data;
  },
  endSession: async (sessionId) => {
    const response = await axiosInstance.post(`/session/${sessionId}/end`);
    return response.data;
  },
};

export const generateToken = async () => {
  const response = await axiosInstance.get("/chat/stream-token");
  return response.data;
};
