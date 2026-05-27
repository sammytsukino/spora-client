import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import FloraLink from "./FloraLink"
import { readFloraPreview, type FloraPreview } from "@/lib/floraPreviewCache"

const samplePreview: FloraPreview = {
  id: "flora123",
  generation: "GEN_0",
  image: "https://example.com/t.png",
  title: "Bloom",
  excerpt: "Preview excerpt",
  author: "@grower",
  seed: "#ABC123",
}

describe("FloraLink", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders a new-tab link", () => {
    render(
      <MemoryRouter>
        <FloraLink to="/flora/flora123">Open flora</FloraLink>
      </MemoryRouter>
    )

    const link = screen.getByRole("link", { name: "Open flora" })
    expect(link).toHaveAttribute("href", "/flora/flora123")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("stashes preview data on click", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <FloraLink to="/flora/flora123" state={{ flora: samplePreview }}>
          Open flora
        </FloraLink>
      </MemoryRouter>
    )

    await user.click(screen.getByRole("link", { name: "Open flora" }))
    expect(readFloraPreview("flora123")).toEqual(samplePreview)
  })
})
