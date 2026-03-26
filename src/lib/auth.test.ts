import { describe, it, expect, beforeEach, vi } from "vitest"

const post = vi.hoisted(() => vi.fn())
const get = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: {
    post,
    get,
  },
  API_BASE_URL: "http://localhost:4000/api",
}))

import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  saveSession,
  clearSession,
  getStoredUser,
  getStoredToken,
  updateStoredUser,
  signIn,
  signUp,
  refreshAccessToken,
  verifyEmail,
  fetchMe,
  resendVerificationEmail,
} from "./auth"
import type { AuthResponse, AuthUser } from "./auth"

const sampleUser: AuthUser = {
  id: "u1",
  username: "grower",
  email: "g@example.com",
  role: "cultivator",
}

beforeEach(() => {
  localStorage.clear()
  post.mockReset()
  get.mockReset()
})

describe("session storage helpers", () => {
  it("saveSession persists token and user", () => {
    const session: AuthResponse = {
      token: "access",
      refreshToken: "refresh",
      user: sampleUser,
    }
    saveSession(session)
    expect(localStorage.getItem(TOKEN_KEY)).toBe("access")
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh")
    expect(getStoredUser()).toEqual(sampleUser)
    expect(getStoredToken()).toBe("access")
  })

  it("getStoredUser returns null for invalid JSON", () => {
    localStorage.setItem(USER_KEY, "{not-json")
    expect(getStoredUser()).toBeNull()
  })

  it("clearSession removes keys", () => {
    saveSession({ token: "t", user: sampleUser })
    clearSession()
    expect(getStoredToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
  })

  it("updateStoredUser merges into existing user", () => {
    saveSession({ token: "t", user: sampleUser })
    updateStoredUser({ displayName: "New" })
    expect(getStoredUser()?.displayName).toBe("New")
  })

  it("updateStoredUser no-ops without stored user", () => {
    updateStoredUser({ displayName: "X" })
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })
})

describe("auth API wrappers", () => {
  it("signIn posts credentials and saves session", async () => {
    const data: AuthResponse = {
      token: "tok",
      refreshToken: "ref",
      user: sampleUser,
    }
    post.mockResolvedValueOnce({ data })

    const out = await signIn("grower", "secret")
    expect(post).toHaveBeenCalledWith("/auth/signin", {
      username: "grower",
      password: "secret",
    })
    expect(out).toEqual(data)
    expect(getStoredToken()).toBe("tok")
  })

  it("signUp saves session when token and user returned", async () => {
    post.mockResolvedValueOnce({
      data: { token: "t", user: sampleUser },
    })
    await signUp({
      username: "a",
      displayName: "A",
      email: "a@a.com",
      password: "password12",
    })
    expect(getStoredToken()).toBe("t")
  })

  it("refreshAccessToken returns null when no refresh token", async () => {
    const out = await refreshAccessToken()
    expect(out).toBeNull()
    expect(post).not.toHaveBeenCalled()
  })

  it("refreshAccessToken returns null on failure", async () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, "bad")
    post.mockRejectedValueOnce(new Error("network"))
    const out = await refreshAccessToken()
    expect(out).toBeNull()
  })

  it("verifyEmail posts token and saves session", async () => {
    const data: AuthResponse = {
      token: "t",
      user: sampleUser,
    }
    post.mockResolvedValueOnce({ data })
    const out = await verifyEmail("  tok  ")
    expect(post).toHaveBeenCalledWith("/auth/verify-email", { token: "tok" })
    expect(out).toEqual(data)
    expect(getStoredToken()).toBe("t")
  })

  it("fetchMe GET /auth/me", async () => {
    get.mockResolvedValueOnce({ data: sampleUser })
    const me = await fetchMe()
    expect(get).toHaveBeenCalledWith("/auth/me")
    expect(me).toEqual(sampleUser)
  })

  it("resendVerificationEmail posts email", async () => {
    post.mockResolvedValueOnce({ data: { message: "sent" } })
    const r = await resendVerificationEmail("a@b.com")
    expect(post).toHaveBeenCalledWith("/auth/resend-verification", {
      email: "a@b.com",
    })
    expect(r.message).toBe("sent")
  })
})
