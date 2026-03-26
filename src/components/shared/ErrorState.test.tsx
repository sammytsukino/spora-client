import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ErrorState from "./ErrorState"

describe("ErrorState", () => {
  it("renders title and message", () => {
    render(<ErrorState title="Oops" message="Something failed" />)
    expect(screen.getByRole("heading", { name: /oops/i })).toBeInTheDocument()
    expect(screen.getByText("Something failed")).toBeInTheDocument()
  })

  it("calls onRetry when try again clicked", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <ErrorState title="E" message="M" onRetry={onRetry} />
    )
    await user.click(screen.getByRole("button", { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
