import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get },
}))

import { getUserByUsername } from "./usersApi"

beforeEach(() => {
  get.mockReset()
})

describe("getUserByUsername", () => {
  it("strips @ and encodes username", async () => {
    get.mockResolvedValueOnce({
      data: {
        id: "1",
        username: "u",
        followersCount: 0,
        followingCount: 0,
      },
    })
    const u = await getUserByUsername("@@alice")
    expect(get).toHaveBeenCalledWith("/users/by-username/alice")
    expect(u.username).toBe("u")
  })
})
