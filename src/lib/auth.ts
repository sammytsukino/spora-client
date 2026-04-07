import { api } from "./api";

export const TOKEN_KEY = "spora_token";
export const REFRESH_TOKEN_KEY = "spora_refresh_token";
export const USER_KEY = "spora_user";

export const LAB_FULL_SECRET = "grow";

const LEGACY_LAB_FULL_KEY = "spora_lab_full_unlocked";
if (typeof localStorage !== "undefined") {
  localStorage.removeItem(LEGACY_LAB_FULL_KEY);
}

export function isLabFullAccessible(): boolean {
  const user = getStoredUser();
  return user?.role === "admin";
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
  refreshToken?: string;
  user: AuthUser;
}

export function saveSession(session: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, session.token);
  if (session.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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

export interface SignUpResponse {
  message?: string;
  emailSent?: boolean;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
}

export async function signUp(payload: {
  username: string;
  displayName: string;
  email: string;
  password: string;
}): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>("/auth/signup", payload);
  if (data.token && data.user) {
    saveSession({
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  }
  return data;
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/verify-email", {
    token: token.trim(),
  });
  saveSession(data);
  return data;
}

export async function resendVerificationEmail(
  email: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    "/auth/resend-verification",
    { email }
  );
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

export async function refreshAccessToken(): Promise<AuthResponse | null> {
  try {
    const legacy = getStoredRefreshToken();
    const { data } = await api.post<AuthResponse>(
      "/auth/refresh",
      legacy ? { refreshToken: legacy } : {}
    );
    saveSession(data);
    return data;
  } catch {
    return null;
  }
}

/** Clears httpOnly refresh cookie on the server; call on sign-out. */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    /* ignore network errors */
  }
  clearSession();
}
