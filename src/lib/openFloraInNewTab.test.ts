import { describe, it, expect, vi, afterEach } from "vitest"
import { openFloraInNewTab } from "./openFloraInNewTab"

describe("openFloraInNewTab", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("opens a new tab via a temporary anchor", () => {
    const click = vi.fn()
    const remove = vi.fn()
    const appendChild = vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      Object.assign(node as HTMLAnchorElement, { click, remove })
      return node
    })

    openFloraInNewTab("/flora/flora123")

    expect(appendChild).toHaveBeenCalledTimes(1)
    const link = appendChild.mock.calls[0][0] as HTMLAnchorElement
    expect(link.href).toContain("/flora/flora123")
    expect(link.target).toBe("_blank")
    expect(link.rel).toBe("noopener noreferrer")
    expect(click).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(1)
  })
})
