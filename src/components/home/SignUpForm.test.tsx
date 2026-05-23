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
import {
  STRONG_FIXTURE,
  STRONG_FIXTURE_ALT,
  TOO_SHORT_FIXTURE,
  NO_UPPER_FIXTURE,
  NO_SPECIAL_FIXTURE,
} from "@/test/passwordFixtures"

function renderSignUp() {
  return render(
    <MemoryRouter initialEntries={[ROUTES.SIGN_UP]}>
      <Routes>
        <Route path={ROUTES.SIGN_UP} element={<SignUpForm />} />
        <Route path={ROUTES.SIGN_IN} element={<p>Sign in page</p>} />
        <Route path={ROUTES.LABORATORY} element={<p>Laboratory</p>} />
      </Routes>
    </MemoryRouter>
  )
}

async function fillValidFields(
  user: ReturnType<typeof userEvent.setup>,
  password = STRONG_FIXTURE
) {
  await user.type(screen.getByLabelText(/^username/i), "user1")
  await user.type(screen.getByLabelText(/^name/i), "N")
  await user.type(screen.getByLabelText(/^email/i), "n@e.com")
  await user.type(screen.getByLabelText(/^password$/i), password)
  await user.type(screen.getByLabelText(/confirm password/i), password)
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
    await user.type(screen.getByLabelText(/^password$/i), STRONG_FIXTURE)
    await user.type(screen.getByLabelText(/confirm password/i), STRONG_FIXTURE)
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
    await user.type(screen.getByLabelText(/^password$/i), STRONG_FIXTURE)
    await user.type(
      screen.getByLabelText(/confirm password/i),
      STRONG_FIXTURE_ALT
    )
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("rejects passwords without a special character", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await fillValidFields(user, NO_SPECIAL_FIXTURE)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByRole("alert").textContent).toMatch(/special character/i)
    expect(signUp).not.toHaveBeenCalled()
  })

  it("rejects passwords shorter than 8 characters", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await fillValidFields(user, TOO_SHORT_FIXTURE)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      screen.getByText(/at least 8 characters/i)
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("rejects passwords without an uppercase letter", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await fillValidFields(user, NO_UPPER_FIXTURE)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByText(/uppercase/i)).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("submits a strong password and navigates to the laboratory when token returned", async () => {
    const user = userEvent.setup()
    signUp.mockResolvedValue({
      token: "t",
      user: { id: "1" },
    })
    renderSignUp()

    await fillValidFields(user)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(signUp).toHaveBeenCalledWith({
      username: "user1",
      displayName: "N",
      email: "n@e.com",
      password: STRONG_FIXTURE,
      website: "",
    })
    expect(await screen.findByText("Laboratory")).toBeInTheDocument()
  })

  it("rejects usernames with invalid characters", async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText(/^username/i), "bad*name")
    await user.type(screen.getByLabelText(/^name/i), "N")
    await user.type(screen.getByLabelText(/^email/i), "n@e.com")
    await user.type(screen.getByLabelText(/^password$/i), STRONG_FIXTURE)
    await user.type(screen.getByLabelText(/confirm password/i), STRONG_FIXTURE)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      screen.getByText(/letters, numbers, and underscores/i)
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it("shows API error message when signup is rejected by the server", async () => {
    const user = userEvent.setup()
    signUp.mockRejectedValue({
      response: { data: { error: "Email already in use." } },
    })
    renderSignUp()

    await fillValidFields(user)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      await screen.findByText(/email already in use/i)
    ).toBeInTheDocument()
  })

  it("shows generic error when signup throws without response payload", async () => {
    const user = userEvent.setup()
    signUp.mockRejectedValue(new Error("network"))
    renderSignUp()

    await fillValidFields(user)
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(
      await screen.findByText(/could not create account/i)
    ).toBeInTheDocument()
  })
})
