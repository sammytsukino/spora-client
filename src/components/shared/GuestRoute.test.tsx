import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import GuestRoute from "./GuestRoute"
import { TOKEN_KEY } from "@/lib/auth"

describe("GuestRoute", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders children when no token", () => {
    render(
      <MemoryRouter initialEntries={["/in"]}>
        <Routes>
          <Route
            path="/in"
            element={
              <GuestRoute>
                <p>Guest only</p>
              </GuestRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText("Guest only")).toBeInTheDocument()
  })

  it("redirects when token exists", () => {
    localStorage.setItem(TOKEN_KEY, "tok")
    render(
      <MemoryRouter initialEntries={["/in"]}>
        <Routes>
          <Route path="/profile" element={<p>Profile</p>} />
          <Route
            path="/in"
            element={
              <GuestRoute>
                <p>Guest only</p>
              </GuestRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })
})
