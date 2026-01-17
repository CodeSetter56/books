// frontend/src/lib/api/client.ts
import axios from "axios";
import { config as appConfig } from "@/lib/config";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: appConfig.backend_url,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle Token Refresh (Silent)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If this is a login attempt, DON'T try to refresh, just show the error
      if (originalRequest.url?.includes("/login")) {
        const loginMsg = error.response?.data?.message || "Invalid credentials";
        toast.error(loginMsg);
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await axios.post(
          `${appConfig.backend_url}/users/refresh`,
          {},
          { withCredentials: true }
        );
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle All Other Errors
    // Ensure we are drilling down into response.data.message
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    // Only show toast if it's not a 401 we are currently refreshing
    if (
      error.response?.status !== 401 ||
      originalRequest.url?.includes("/login")
    ) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
