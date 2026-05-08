import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"

const signIn = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth")
  return {
    ...actual,
    signIn,
  }
})

import SignInForm from "./SignInForm"
import { ROUTES } from "@/constants/routes"

function renderSignIn(initialPath = "/signin", state?: object) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
      <Routes>
        <Route path={ROUTES.SIGN_IN} element={<SignInForm />} />
        <Route path={ROUTES.GARDEN} element={<p>Garden</p>} />
        <Route path={ROUTES.PROFILE} element={<p>Profile page</p>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  signIn.mockReset()
})

describe("SignInForm", () => {
  it("submits and navigates to garden on success", async () => {
    const user = userEvent.setup()
    signIn.mockResolvedValue(undefined)
    renderSignIn()

    await user.type(screen.getByLabelText(/username/i), "u1")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(signIn).toHaveBeenCalledWith("u1", "password1")
    expect(await screen.findByText("Garden")).toBeInTheDocument()
  })

  it("navigates to prior route from location state when safe", async () => {
    const user = userEvent.setup()
    signIn.mockResolvedValue(undefined)
    renderSignIn(ROUTES.SIGN_IN, {
      from: { pathname: ROUTES.PROFILE, search: "", hash: "", state: null },
    })

    await user.type(screen.getByLabelText(/username/i), "u1")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText("Profile page")).toBeInTheDocument()
  })

  it("shows server error string when sign-in fails", async () => {
    const user = userEvent.setup()
    signIn.mockRejectedValue({
      response: { data: { error: "Server says no." } },
    })
    renderSignIn()

    await user.type(screen.getByLabelText(/username/i), "u")
    await user.type(screen.getByLabelText(/^password$/i), "p")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText("Server says no.")).toBeInTheDocument()
  })

  it("shows generic credentials message when error payload lacks detail", async () => {
    const user = userEvent.setup()
    signIn.mockRejectedValue({ response: { data: {} } })
    renderSignIn()

    await user.type(screen.getByLabelText(/username/i), "u")
    await user.type(screen.getByLabelText(/^password$/i), "p")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(
      await screen.findByText(/invalid credentials or server error/i)
    ).toBeInTheDocument()
  })

  it("shows post-signup message from location state", async () => {
    renderSignIn(ROUTES.SIGN_IN, {
      message: "Welcome back.",
    })
    expect(screen.getByText("Welcome back.")).toBeInTheDocument()
  })

  it("disables submit while submitting", async () => {
    const user = userEvent.setup()
    let resolveSignIn: () => void = () => {}
    signIn.mockImplementation(
      () =>
        new Promise<void>((r) => {
          resolveSignIn = r
        })
    )
    renderSignIn()

    await user.type(screen.getByLabelText(/username/i), "u")
    await user.type(screen.getByLabelText(/^password$/i), "p")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled()
    await act(async () => {
      resolveSignIn()
    })
  })
})
