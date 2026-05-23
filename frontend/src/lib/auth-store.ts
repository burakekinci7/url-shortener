import { create } from "zustand";
import type { AuthUser } from "../types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const TOKEN_KEY = "us_token";
const USER_KEY = "us_user";

function loadInitial(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

const initial = loadInitial();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
