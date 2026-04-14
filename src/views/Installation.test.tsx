import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

const tutorial = vi.hoisted(() => ({ done: true }))

vi.mock("@/components/laboratory/LabTutorialOverlay", () => ({
  default: () => <div data-testid="lab-tutorial">tutorial</div>,
  getLabTutorialDone: () => tutorial.done,
}))

import Installation from "./Installation"

describe("Installation", () => {
  beforeEach(() => {
    tutorial.done = true
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
    expect(src).toContain("apiBase=")
  })

  it("renders tutorial overlay when lab tutorial not done", async () => {
    tutorial.done = false
    render(
      <MemoryRouter initialEntries={["/installation"]}>
        <Routes>
          <Route path="/installation" element={<Installation />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByTestId("lab-tutorial")).toBeInTheDocument()
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
