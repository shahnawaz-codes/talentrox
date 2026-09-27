import { axiosInstance } from "../lib/axios";

export const interviewApi = {
  startSession: async (problemId, config = {}) => {
    const response = await axiosInstance.post("/interview/start", { problemId }, config);
    return response.data;
  },

  getSession: async (sessionId, config = {}) => {
    const response = await axiosInstance.get(`/interview/${sessionId}`, config);
    return response.data;
  },

  submitCode: async (sessionId, { code, language, problemStatement }, config = {}) => {
    const response = await axiosInstance.post(
      `/interview/${sessionId}/submit-code`,
      {
        code,
        language,
        problemStatement,
      },
      config
    );
    return response.data;
  },

  submitAnswer: async (sessionId, { answer, problemStatement }, config = {}) => {
    const response = await axiosInstance.post(
      `/interview/${sessionId}/answer`,
      {
        answer,
        problemStatement,
      },
      config
    );
    return response.data;
  },

  endSession: async (sessionId, { problemStatement } = {}, config = {}) => {
    const response = await axiosInstance.post(
      `/interview/${sessionId}/end`,
      {
        problemStatement,
      },
      config
    );
    return response.data;
  },
};

export default interviewApi;
