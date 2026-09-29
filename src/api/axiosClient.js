import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
if (rawBaseUrl.startsWith("http") && !rawBaseUrl.replace(/\/+$/, "").endsWith("/api")) {
  rawBaseUrl = rawBaseUrl.replace(/\/+$/, "") + "/api";
}
const API_BASE_URL = rawBaseUrl;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
