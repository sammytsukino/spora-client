import { describe, it, expect } from "vitest"
import {
  mapMeToProfileUser,
  mapApiFloraToProfileItem,
  mapFlorasToMetrics,
  fileToBase64,
} from "./profileApi"
import type { MeUser, ApiFlora } from "./profileApi"

const me: MeUser = {
  id: "1",
  username: "grower",
  email: "g@e.com",
  role: "cultivator",
  accountStatus: "active",
}

describe("mapMeToProfileUser", () => {
  it("counts originals and cuttings by generation", () => {
    const floras: ApiFlora[] = [
      { _id: "a", title: "A", text: "t", lineage: { generation: 0 } },
      { _id: "b", title: "B", text: "t", lineage: { generation: 1 } },
    ]
    const u = mapMeToProfileUser(me, floras)
    expect(u.florasCount).toBe(2)
    expect(u.originalsCount).toBe(1)
    expect(u.cuttingsCount).toBe(1)
    expect(u.username).toBe("@grower")
  })
})

describe("mapApiFloraToProfileItem", () => {
  it("uses sentiment label in seed when present", () => {
    const f: ApiFlora = {
      _id: "id123456",
      title: "T",
      text: "short",
      authorUsername: "a",
      generative: { seed: { sentiment: { label: "calm" } } },
    }
    const item = mapApiFloraToProfileItem(f, "fallback")
    expect(item.seed).toBe("#CALM")
    expect(item.author).toBe("@a")
  })

  it("maps anonymized author", () => {
    const f: ApiFlora = {
      _id: "x",
      title: "T",
      text: "t",
      isAuthorAnonymized: true,
    }
    const item = mapApiFloraToProfileItem(f, "f")
    expect(item.author).toBe("Anonymous")
  })
})

describe("fileToBase64", () => {
  it("resolves data URL for image file", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "x.png", {
      type: "image/png",
    })
    const b64 = await fileToBase64(file)
    expect(b64.startsWith("data:image/png;base64,")).toBe(true)
  })
})

describe("mapFlorasToMetrics", () => {
  it("sums stats", () => {
    const floras: ApiFlora[] = [
      { _id: "1", title: "", text: "", stats: { views: 2, cuttingsTaken: 1, downloads: 3 } },
      { _id: "2", title: "", text: "", stats: { views: 1 } },
    ]
    expect(mapFlorasToMetrics(floras)).toEqual({
      totalViews: 3,
      totalCuttings: 1,
      totalShares: 3,
    })
  })
})
