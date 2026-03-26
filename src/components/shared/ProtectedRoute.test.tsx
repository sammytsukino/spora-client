import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { TOKEN_KEY } from "@/lib/auth"

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("redirects to sign up when no token", () => {
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/signup" element={<p>Sign up page</p>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <p>Secret</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText("Sign up page")).toBeInTheDocument()
  })

  it("renders children when token present", () => {
    localStorage.setItem(TOKEN_KEY, "tok")
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <p>Secret</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText("Secret")).toBeInTheDocument()
  })
})
