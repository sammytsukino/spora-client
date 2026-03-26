import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import EmptyState from "./EmptyState"

describe("EmptyState", () => {
  it("renders title and optional description", () => {
    render(<EmptyState title="Empty" description="No items" />)
    expect(screen.getByRole("heading", { name: /empty/i })).toBeInTheDocument()
    expect(screen.getByText("No items")).toBeInTheDocument()
  })

  it("fires action onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <EmptyState
        title="T"
        action={{ label: "Add one", onClick }}
      />
    )
    await user.click(screen.getByRole("button", { name: /add one/i }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
