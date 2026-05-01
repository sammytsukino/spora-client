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

/** Vitest-only mock password (not production credentials). */
const MOCK_PW_OK = "__vitest_fixture_signup_password_a__"
const MOCK_PW_OTHER = "__vitest_fixture_signup_password_b__"

function renderSignUp() {
  return render(
    <MemoryRouter initialEntries={[ROUTES.SIGN_UP]}>
      <Routes>
        <Route path={ROUTES.SIGN_UP} element={<SignUpForm />} />
        <Route path={ROUTES.SIGN_IN} element={<p>Sign in page</p>} />
        <Route path={ROUTES.GARDEN} element={<p>Garden</p>} />
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
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
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
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OTHER)
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
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(signUp).toHaveBeenCalledWith({
      username: "user1",
      displayName: "N",
      email: "n@e.com",
      password: MOCK_PW_OK,
    })
    expect(await screen.findByText("Sign in page")).toBeInTheDocument()
  })

  it("rejects usernames with invalid characters", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "bad*name")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      screen.getByText(/letters, numbers, and underscores/i)
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("rejects passwords shorter than 8 characters", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "goodname")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), "short")
    await user.type(screen.getByLabelText(/confirm password/i), "short")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      screen.getByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("navigates to garden when token and user returned", async () => {
    const user = userEvent.setup()
    signUp.mockResolvedValue({
      emailSent: false,
      token: "t",
      user: { id: "1" },
    })
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "user1")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(await screen.findByText("Garden")).toBeInTheDocument()
  })

  it("navigates to sign in without message when signup returns empty result", async () => {
    const user = userEvent.setup()
    signUp.mockResolvedValue({ emailSent: false })
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "user1")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(await screen.findByText("Sign in page")).toBeInTheDocument()
  })

  it("shows generic error when signup throws", async () => {
    const user = userEvent.setup()
    signUp.mockRejectedValue(new Error("network"))
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "user1")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), MOCK_PW_OK)
    await user.type(screen.getByLabelText(/confirm password/i), MOCK_PW_OK)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      await screen.findByText(/could not create account/i)
    ).toBeInTheDocument()
  })
})
