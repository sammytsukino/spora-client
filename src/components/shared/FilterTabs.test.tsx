import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FilterTabs from "./FilterTabs"

describe("FilterTabs", () => {
  it("calls onFilterChange with filter name", async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const filters = ["All Units", "GEN_1"] as const
    render(
      <FilterTabs
        filters={[...filters]}
        activeFilter="All Units"
        onFilterChange={onFilterChange}
      />
    )
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBe(2)
    await user.click(buttons[1]!)
    expect(onFilterChange).toHaveBeenCalledWith("GEN_1")
  })
})
