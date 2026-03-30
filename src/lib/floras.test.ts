import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get, post },
}))

import { listFloras, getFlora, createFlora } from "./floras"

beforeEach(() => {
  get.mockReset()
  post.mockReset()
})

describe("floras API", () => {
  it("listFloras requests with params", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await listFloras({ limit: 10, authorId: "a1" })
    expect(get).toHaveBeenCalledWith("/floras", {
      params: { limit: 10, authorId: "a1" },
    })
  })

  it("getFlora requests by id", async () => {
    get.mockResolvedValueOnce({ data: { _id: "x", title: "T", text: "" } })
    const f = await getFlora("x")
    expect(get).toHaveBeenCalledWith("/floras/x")
    expect(f._id).toBe("x")
  })

  it("createFlora posts payload", async () => {
    post.mockResolvedValueOnce({
      data: { _id: "n", title: "Hi", text: "Body" },
    })
    await createFlora({ title: "Hi", text: "Body" })
    expect(post).toHaveBeenCalledWith("/floras", {
      title: "Hi",
      text: "Body",
    })
  })

})
