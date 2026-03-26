import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConfirmModal from "./ConfirmModal"

describe("ConfirmModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ConfirmModal
        open={false}
        title="T"
        description="D"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it("calls onConfirm when confirm clicked", async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmModal
        open
        title="Delete?"
        description="Sure?"
        confirmLabel="YES"
        cancelLabel="NO"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    )
    await user.click(screen.getByRole("button", { name: /^yes$/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("calls onCancel when cancel clicked", async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        open
        title="T"
        description="D"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )
    await user.click(screen.getByRole("button", { name: /^cancel$/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("Escape invokes onCancel", async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        open
        title="T"
        description="D"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )
    await user.keyboard("{Escape}")
    expect(onCancel).toHaveBeenCalled()
  })
})
