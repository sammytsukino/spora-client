import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { readerNavState, navigateFloraViewBack } from "./floraViewBack"
import { ROUTES } from "@/constants/routes"

const realHistory = window.history

function mockHistoryState(state: unknown) {
  Object.defineProperty(window, "history", {
    configurable: true,
    value: {
      ...realHistory,
      state,
    },
  })
}

describe("readerNavState", () => {
  it("combines pathname and search", () => {
    expect(readerNavState("/flora/x", "?tab=1")).toEqual({
      readerReturnTo: "/flora/x?tab=1",
    })
  })
})

describe("navigateFloraViewBack", () => {
  const navigate = vi.fn()

  beforeEach(() => {
    navigate.mockClear()
    mockHistoryState(null)
  })

  afterEach(() => {
    Object.defineProperty(window, "history", {
      configurable: true,
      value: realHistory,
    })
  })

  it("navigates to explicit readerReturnTo when valid", () => {
    navigateFloraViewBack(navigate, "/flora/current", {
      readerReturnTo: "/greenhouse",
    })
    expect(navigate).toHaveBeenCalledWith("/greenhouse")
  })

  it("ignores readerReturnTo equal to current path", () => {
    mockHistoryState({ idx: 0 })
    navigateFloraViewBack(navigate, "/flora/x", { readerReturnTo: "/flora/x" })
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
  })

  it("ignores non-root readerReturnTo", () => {
    mockHistoryState({ idx: 0 })
    navigateFloraViewBack(navigate, "/flora/x", { readerReturnTo: "//evil" })
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
  })

  it("uses history back when idx > 0", () => {
    mockHistoryState({ idx: 2 })
    navigateFloraViewBack(navigate, "/flora/x", {})
    expect(navigate).toHaveBeenCalledWith(-1)
  })

  it("falls back to home when no state and idx 0", () => {
    mockHistoryState({ idx: 0 })
    navigateFloraViewBack(navigate, "/flora/x", {})
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
  })
})
