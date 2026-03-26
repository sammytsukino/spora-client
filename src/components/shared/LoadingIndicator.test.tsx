import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import LoadingIndicator from "./LoadingIndicator"

describe("LoadingIndicator", () => {
  it("shows message and progress fraction", () => {
    render(<LoadingIndicator current={2} total={8} message="LOADING" />)
    expect(screen.getByText("LOADING")).toBeInTheDocument()
    expect(screen.getByText("2 / 8")).toBeInTheDocument()
  })

  it("uses default message", () => {
    render(<LoadingIndicator current={0} total={1} />)
    expect(screen.getByText("LOADING MORE...")).toBeInTheDocument()
  })
})
