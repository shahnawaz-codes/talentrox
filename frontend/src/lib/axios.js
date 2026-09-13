import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach Clerk JWT token to requests if available
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined" && window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn("Could not retrieve Clerk token for request", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

