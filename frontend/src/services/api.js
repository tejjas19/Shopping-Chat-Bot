import axios from "axios";

const resolveApiBaseUrl = () => {
  const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
  const configuredUrl = env.VITE_API_URL?.trim();

  if (configuredUrl && !/your-project-name|placeholder/i.test(configuredUrl)) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }

    return origin;
  }

  return "http://localhost:5000";
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api`,
  headers: { "Content-Type": "application/json" },
});

export default api;
