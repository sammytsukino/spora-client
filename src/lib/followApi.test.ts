import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())
const del = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get, post, delete: del },
}))

import {
  follow,
  unfollow,
  getFollowingIds,
  checkFollowStatus,
  getFollowers,
  getFollowing,
} from "./followApi"

beforeEach(() => {
  get.mockReset()
  post.mockReset()
  del.mockReset()
})

describe("followApi", () => {
  it("follow posts user id path", async () => {
    post.mockResolvedValueOnce({})
    await follow("uid")
    expect(post).toHaveBeenCalledWith("/follows/uid")
  })

  it("unfollow deletes user id path", async () => {
    del.mockResolvedValueOnce({})
    await unfollow("uid")
    expect(del).toHaveBeenCalledWith("/follows/uid")
  })

  it("getFollowingIds returns array from API", async () => {
    get.mockResolvedValueOnce({ data: { followingIds: ["a", "b"] } })
    const ids = await getFollowingIds()
    expect(ids).toEqual(["a", "b"])
  })

  it("getFollowingIds defaults missing array", async () => {
    get.mockResolvedValueOnce({ data: {} })
    const ids = await getFollowingIds()
    expect(ids).toEqual([])
  })

  it("checkFollowStatus returns boolean", async () => {
    get.mockResolvedValueOnce({ data: { following: true } })
    expect(await checkFollowStatus("u")).toBe(true)
  })

  it("getFollowers encodes user id", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await getFollowers("u/1", 5, 10)
    expect(get).toHaveBeenCalledWith("/users/u%2F1/followers", {
      params: { limit: 5, skip: 10 },
    })
  })

  it("getFollowing encodes user id", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await getFollowing("x")
    expect(get).toHaveBeenCalledWith("/users/x/following", {
      params: { limit: 50, skip: 0 },
    })
  })
})
