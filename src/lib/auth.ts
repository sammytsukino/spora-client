import { api } from "./api";

export const TOKEN_KEY = "spora_token";
export const USER_KEY = "spora_user";

/** Easter egg: cultivators unlock lab/full via /laboratory/full/grow (acrostic in HeroSection) */
export const LAB_FULL_SECRET = "grow";
export const LAB_FULL_UNLOCK_KEY = "spora_lab_full_unlocked";

export function isLabFullUnlocked(): boolean {
  return localStorage.getItem(LAB_FULL_UNLOCK_KEY) === "1";
}

/** Admins always have lab full access; cultivators need to unlock via Easter egg */
export function isLabFullAccessible(): boolean {
  const user = getStoredUser();
  return user?.role === "admin" || isLabFullUnlocked();
}

export function setLabFullUnlocked(): void {
  localStorage.setItem(LAB_FULL_UNLOCK_KEY, "1");
}

export interface AuthUser {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  email: string;
  role: "cultivator" | "admin";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function saveSession(session: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function updateStoredUser(updates: Partial<AuthUser>) {
  const current = getStoredUser();
  if (!current) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...updates }));
}

export async function signIn(username: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/signin", {
    username,
    password,
  });
  saveSession(data);
  return data;
}

export async function signUp(payload: {
  username: string;
  displayName: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
  saveSession(data);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}
