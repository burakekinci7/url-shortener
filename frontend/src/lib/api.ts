import axios, { AxiosError } from "axios";
import { getToken, useAuthStore } from "./auth-store";
import type { AuthResponse, ShortUrl, UrlStats } from "../types";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5287";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { clearAuth } = useAuthStore.getState();
      const hadToken = !!getToken();
      clearAuth();
      if (hadToken && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(err: unknown, fallback = "Request failed"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; title?: string; errors?: Record<string, string[]> }
      | undefined;
    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (Array.isArray(first) && first.length > 0) return first[0];
    }
    if (err.message) return err.message;
  }
  return fallback;
}

export async function createShortUrl(payload: {
  originalUrl: string;
  expiresAt?: string | null;
}): Promise<ShortUrl> {
  const { data } = await api.post<ShortUrl>("/api/urls", payload);
  return data;
}

export async function listUrls(): Promise<ShortUrl[]> {
  const { data } = await api.get<ShortUrl[]>("/api/urls");
  return data;
}

export async function getUrl(id: string): Promise<ShortUrl> {
  const { data } = await api.get<ShortUrl>(`/api/urls/${id}`);
  return data;
}

export async function getUrlStats(id: string): Promise<UrlStats> {
  const { data } = await api.get<UrlStats>(`/api/urls/${id}/stats`);
  return data;
}

export async function deleteUrl(id: string): Promise<void> {
  await api.delete(`/api/urls/${id}`);
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", { email, password });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return data;
}
