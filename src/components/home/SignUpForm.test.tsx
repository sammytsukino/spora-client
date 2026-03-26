import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"

const signUp = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth")
  return {
    ...actual,
    signUp,
  }
})

import SignUpForm from "./SignUpForm"
import { ROUTES } from "@/constants/routes"

function renderSignUp() {
  return render(
    <MemoryRouter initialEntries={[ROUTES.SIGN_UP]}>
      <Routes>
        <Route path={ROUTES.SIGN_UP} element={<SignUpForm />} />
        <Route path={ROUTES.SIGN_IN} element={<p>Sign in page</p>} />
        <Route path="/garden" element={<p>Garden</p>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  signUp.mockReset()
})

describe("SignUpForm", () => {
  it("shows validation error for short username", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "ab")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.type(screen.getByLabelText(/confirm password/i), "password1")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      screen.getByText(/username must be at least 3 characters/i)
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "user1")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.type(screen.getByLabelText(/confirm password/i), "password2")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("submits and navigates to sign in when email sent", async () => {
    const user = userEvent.setup()
    signUp.mockResolvedValue({ emailSent: true })
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "user1")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.type(screen.getByLabelText(/confirm password/i), "password1")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(signUp).toHaveBeenCalledWith({
      username: "user1",
      displayName: "N",
      email: "n@e.com",
      password: "password1",
    })
    expect(await screen.findByText("Sign in page")).toBeInTheDocument()
  })
})
