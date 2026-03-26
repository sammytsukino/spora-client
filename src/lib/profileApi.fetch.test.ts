import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())
const patch = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get, patch, post },
}))

import { fetchProfileData, updateProfile, unsignMyAccount } from "./profileApi"

beforeEach(() => {
  get.mockReset()
  patch.mockReset()
  post.mockReset()
})

describe("fetchProfileData", () => {
  it("loads me then floras for author", async () => {
    get.mockResolvedValueOnce({
      data: {
        id: "u1",
        username: "me",
        email: "m@e.com",
        role: "cultivator",
        accountStatus: "active",
        followersCount: 0,
        followingCount: 0,
      },
    })
    get.mockResolvedValueOnce({
      data: [
        {
          _id: "f1",
          title: "F",
          text: "text",
          lineage: { generation: 0 },
        },
      ],
    })

    const out = await fetchProfileData()

    expect(get).toHaveBeenNthCalledWith(1, "/auth/me")
    expect(get).toHaveBeenNthCalledWith(2, "/floras", {
      params: { authorId: "u1" },
    })
    expect(out.user.florasCount).toBe(1)
    expect(out.floras.length).toBe(1)
  })

  it("updateProfile PATCH /auth/me", async () => {
    patch.mockResolvedValueOnce({
      data: {
        id: "1",
        username: "me",
        email: "m@e.com",
        role: "cultivator",
        accountStatus: "active",
      },
    })
    const me = await updateProfile({ displayName: "New" })
    expect(patch).toHaveBeenCalledWith("/auth/me", { displayName: "New" })
    expect(me.username).toBe("me")
  })

  it("unsignMyAccount POST /auth/me/unsign", async () => {
    post.mockResolvedValueOnce({ data: { florasAnonymized: 3 } })
    const out = await unsignMyAccount()
    expect(post).toHaveBeenCalledWith("/auth/me/unsign")
    expect(out.florasAnonymized).toBe(3)
  })
})
