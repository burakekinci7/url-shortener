import { create } from "zustand";
import type { AuthUser } from "../types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

const TOKEN_KEY = "us_token";
const USER_KEY = "us_user";

function readStorage(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

// Read synchronously at module init so the very first render of any component
// (including <ProtectedRoute>) already has the correct auth state.
const initial = readStorage();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  hasHydrated: true,
  setAuth: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* ignore quota / disabled storage */
    }
    set({ token, user, hasHydrated: true });
  },
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    set({ token: null, user: null, hasHydrated: true });
  },
  // Optional re-sync (e.g. if storage was updated in another tab).
  hydrate: () => {
    const { token, user } = readStorage();
    set({ token, user, hasHydrated: true });
  },
}));

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
