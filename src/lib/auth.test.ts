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
  fetchMe,
} from "./auth"
import type { AuthResponse, AuthUser } from "./auth"
import {
  STRONG_FIXTURE,
  SIMPLE_LOGIN_FIXTURE,
} from "@/test-utils/passwordFixtures"

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

  it("saveSession clears legacy refresh when omitted", () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, "old")
    saveSession({ token: "access", user: sampleUser })
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull()
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

    const out = await signIn("grower", SIMPLE_LOGIN_FIXTURE)
    expect(post).toHaveBeenCalledWith("/auth/signin", {
      username: "grower",
      password: SIMPLE_LOGIN_FIXTURE,
    })
    expect(out).toEqual(data)
    expect(getStoredToken()).toBe("tok")
  })

  it("signUp posts payload and saves session when token returned", async () => {
    post.mockResolvedValueOnce({
      data: { token: "t", user: sampleUser },
    })
    await signUp({
      username: "a",
      displayName: "A",
      email: "a@a.com",
      password: STRONG_FIXTURE,
    })
    expect(post).toHaveBeenCalledWith("/auth/signup", {
      username: "a",
      displayName: "A",
      email: "a@a.com",
      password: STRONG_FIXTURE,
    })
    expect(getStoredToken()).toBe("t")
  })

  it("refreshAccessToken posts without body when no legacy refresh", async () => {
    post.mockResolvedValueOnce({
      data: { token: "new", user: sampleUser },
    })
    const out = await refreshAccessToken()
    expect(post).toHaveBeenCalledWith("/auth/refresh", {})
    expect(out?.token).toBe("new")
  })

  it("refreshAccessToken returns null on failure", async () => {
    post.mockRejectedValueOnce(new Error("network"))
    const out = await refreshAccessToken()
    expect(out).toBeNull()
  })

  it("fetchMe GET /auth/me", async () => {
    get.mockResolvedValueOnce({ data: sampleUser })
    const me = await fetchMe()
    expect(get).toHaveBeenCalledWith("/auth/me")
    expect(me).toEqual(sampleUser)
  })
})
