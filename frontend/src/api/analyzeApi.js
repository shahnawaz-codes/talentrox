import { axiosInstance } from "../lib/axios";

export const analyzeApi = {
  analyzeCode: async ({ code, language, problemStatement }) => {
    const response = await axiosInstance.post("/analyze-code", {
      code,
      language,
      problemStatement,
    });
    return response.data;
  },
};

export default analyzeApi;
