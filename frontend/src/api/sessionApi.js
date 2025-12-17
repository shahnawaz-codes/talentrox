import { axiosInstance } from "../lib/axios";

export const sessionApi = {
  createSession: async () => {
    const response = await axiosInstance.post("/session");
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
    return response.data;
  },
  joinSession: async (sessionId) => {
    const response = await axiosInstance.post(`/session/${sessionId}/join`);
    return response.data;
  },
  endSession: async (sessionId) => {
    const response = await axiosInstance.delete(`/session/${sessionId}`);
    return response.data;
  },
};

export const generateToken = async () => {
  const response = await axiosInstance.get("/chat/stream-token");
  return response.data;
};
