// frontend/src/lib/api/client.ts
import axios from "axios";
import { config as appConfig } from "@/lib/config";

const apiClient = axios.create({
  baseURL: appConfig.backend_url,
  withCredentials: true, // Crucial for HttpOnly cookies
});

// Response Interceptor for Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Trigger the refresh endpoint on your backend
        await axios.post(
          `${appConfig.backend_url}/users/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request with the new session cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user is truly logged out
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
