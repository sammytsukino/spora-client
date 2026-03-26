import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MainButton from "./MainButton"

describe("MainButton", () => {
  it("renders label", () => {
    render(<MainButton>Save</MainButton>)
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<MainButton onClick={onClick}>Go</MainButton>)
    await user.click(screen.getByRole("button", { name: /go/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <MainButton onClick={onClick} disabled>
        Go
      </MainButton>
    )
    await user.click(screen.getByRole("button", { name: /go/i }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
