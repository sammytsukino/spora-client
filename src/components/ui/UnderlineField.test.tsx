import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UnderlineField from "./UnderlineField"

describe("UnderlineField", () => {
  it("associates label with input", () => {
    render(
      <UnderlineField label="Email" value="" onChange={vi.fn()} />
    )
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("calls onChange when typing", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<UnderlineField label="Name" value="" onChange={onChange} />)
    await user.type(screen.getByLabelText("Name"), "Ada")
    expect(onChange).toHaveBeenCalled()
  })
})
