import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"

const getFlora = vi.hoisted(() => vi.fn())

vi.mock("@/lib/floras", () => ({
  getFlora,
}))

vi.mock("@/hooks/useImageLuminance", () => ({
  useImageLuminance: () => "light" as const,
}))

vi.mock("@/components/layout/TransparentNavbar", () => ({
  default: function TransparentNavbarStub() {
    return <nav aria-label="Main">Nav</nav>
  },
}))

vi.mock("@/components/shared/SporaDetailsMenu", () => ({
  default: () => null,
}))

import FloraReader from "./FloraReader"

const sampleFlora = {
  _id: "flora123",
  title: "Bloom",
  text: "Words here for the reader view.",
  authorUsername: "grower",
  thumbnailUrl: "https://example.com/t.png",
  lineage: { generation: 0 },
}

beforeEach(() => {
  getFlora.mockReset()
  getFlora.mockResolvedValue(sampleFlora)
})

function renderAtFlora(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/flora/${id}`]}>
      <Routes>
        <Route path="/flora/:id" element={<FloraReader />} />
        <Route path="/" element={<p>Home screen</p>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("FloraReader", () => {
  it("shows loading then renders iframe src for installation", async () => {
    renderAtFlora("flora123")

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      const iframe = screen.getByTitle(/flora visualization/i)
      expect(iframe.getAttribute("src")).toContain("/Installation.html")
      expect(iframe.getAttribute("src")).toContain(encodeURIComponent("flora123"))
      expect(iframe.getAttribute("src")).toContain("reader=1")
    })
  })

  it("shows error when Flora fetch fails", async () => {
    getFlora.mockRejectedValueOnce(new Error("nope"))
    renderAtFlora("missing")

    expect(
      await screen.findByText(/could not load this flora/i)
    ).toBeInTheDocument()
  })

  it("Back navigates home when history idx is 0", async () => {
    const user = userEvent.setup()
    renderAtFlora("flora123")

    await waitFor(() => {
      expect(screen.getByTitle(/flora visualization/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /back/i }))
    expect(await screen.findByText("Home screen")).toBeInTheDocument()
  })

  it("handles reader-ready postMessage without throwing", async () => {
    renderAtFlora("flora123")

    await waitFor(() => {
      expect(screen.getByTitle(/flora visualization/i)).toBeInTheDocument()
    })

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "spora:reader-ready" },
          origin: window.location.origin,
        })
      )
    })
  })
})
