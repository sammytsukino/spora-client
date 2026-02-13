import { api } from "./api";

export const TOKEN_KEY = "spora_token";
export const USER_KEY = "spora_user";

export interface AuthUser {
  id: string;
  username: string;
  displayName?: string;
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

export async function signIn(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/signin", {
    email,
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
