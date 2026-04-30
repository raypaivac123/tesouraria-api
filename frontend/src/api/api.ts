import axios from "axios";

const fallbackBaseURL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://tesouraria-h4zl.onrender.com";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? fallbackBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
