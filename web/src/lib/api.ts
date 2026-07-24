import axios from "axios";
import { getDeviceId } from "./deviceId";
import { getApiBaseUrl } from "./utils";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Client-Device-Id"] = getDeviceId();
  return config;
});

export default api;

export class ApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiException";
  }
}
