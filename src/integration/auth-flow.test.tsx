import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"

const signIn = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth")
  return {
    ...actual,
    signIn,
  }
})

import SignInForm from "@/components/home/SignInForm"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import { ROUTES } from "@/constants/routes"
import { TOKEN_KEY } from "@/lib/auth"
import { SIMPLE_LOGIN_FIXTURE } from "@/test-utils/passwordFixtures"

beforeEach(() => {
  localStorage.clear()
  signIn.mockReset()
})

describe("auth flow (integration-style)", () => {
  it("sign-in then access protected garden", async () => {
    const user = userEvent.setup()
    signIn.mockImplementation(async () => {
      localStorage.setItem(TOKEN_KEY, "session-token")
    })

    const { unmount } = render(
      <MemoryRouter initialEntries={[ROUTES.SIGN_IN]}>
        <Routes>
          <Route path={ROUTES.SIGN_IN} element={<SignInForm />} />
          <Route
            path={ROUTES.GARDEN}
            element={
              <ProtectedRoute>
                <p>Greenhouse gate</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/username/i), "cultivator")
    await user.type(screen.getByLabelText(/^password$/i), SIMPLE_LOGIN_FIXTURE)
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText("Greenhouse gate")).toBeInTheDocument()
    unmount()
  })
})
