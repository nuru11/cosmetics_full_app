import axios from "axios";
import { logout } from "../utils/auth";

const defaultBase =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL.trim()
    : "http://localhost:3000/api";

const api = axios.create({
  baseURL: defaultBase.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      logout();
      const path = window.location.pathname;
      if (path !== "/signin") {
        window.location.assign("/signin");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
