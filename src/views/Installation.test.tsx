import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Installation from "./Installation"

vi.mock("@/components/laboratory/LabTutorialOverlay", () => ({
  default: () => null,
  getLabTutorialDone: () => true,
}))

describe("Installation", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders iframe pointed at Installation.html with query params", async () => {
    render(
      <MemoryRouter initialEntries={["/installation?floraId=fid-1&from=x"]}>
        <Routes>
          <Route path="/installation" element={<Installation />} />
        </Routes>
      </MemoryRouter>
    )

    const iframe = await screen.findByTitle(/bouquet generativo installation/i)
    const src = iframe.getAttribute("src") ?? ""
    expect(src.startsWith("/Installation.html")).toBe(true)
    expect(src).toContain("floraId=fid-1")
    expect(src).not.toContain("from=")
  })

  it("includes full=1 when fullLab", async () => {
    render(
      <MemoryRouter initialEntries={["/installation"]}>
        <Routes>
          <Route path="/installation" element={<Installation fullLab />} />
        </Routes>
      </MemoryRouter>
    )

    const iframe = await screen.findByTitle(/bouquet generativo installation/i)
    expect(iframe.getAttribute("src")).toContain("full=1")
  })
})
