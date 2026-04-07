import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  clearSession,
} from "./auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
type QueuedRequest = {
  request: InternalAxiosRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let refreshSubscribers: QueuedRequest[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(({ request, resolve }) => {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${token}`;
    resolve(api(request));
  });
  refreshSubscribers = [];
}

function onRefreshFailed(reason: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(reason));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config;
    if (
      err.response?.status !== 401 ||
      !originalRequest ||
      (originalRequest as typeof originalRequest & { _retry?: boolean })._retry
    ) {
      return Promise.reject(err);
    }
    const isRefreshEndpoint =
      typeof originalRequest.url === "string" &&
      originalRequest.url.includes("/auth/refresh");
    if (isRefreshEndpoint) {
      clearSession();
      return Promise.reject(err);
    }
    const legacyRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({
          request: originalRequest,
          resolve,
          reject,
        });
      });
    }
    isRefreshing = true;
    (originalRequest as typeof originalRequest & { _retry?: boolean })._retry =
      true;
    try {
      const refreshClient = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
      });
      const { data } = await refreshClient.post<{
        token: string;
        refreshToken?: string;
        user: object;
      }>("/auth/refresh", legacyRefresh ? { refreshToken: legacyRefresh } : {});
      localStorage.setItem(TOKEN_KEY, data.token);
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      onRefreshed(data.token);
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api(originalRequest);
    } catch (refreshErr) {
      clearSession();
      onRefreshFailed(refreshErr);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
