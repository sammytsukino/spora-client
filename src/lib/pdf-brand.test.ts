import { describe, it, expect, vi } from "vitest"
import type { jsPDF } from "jspdf"
import {
  drawPdfHeader,
  drawSectionLabel,
  drawKeyValue,
  drawRatioBar,
  applyFooters,
} from "./pdf-brand"

function createMockDoc() {
  return {
    setFillColor: vi.fn(),
    rect: vi.fn(),
    setTextColor: vi.fn(),
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    line: vi.fn(),
    splitTextToSize: vi.fn((t: string) => [t]),
    getNumberOfPages: vi.fn(() => 2),
    setPage: vi.fn(),
    getTextWidth: vi.fn(() => 20),
  } as unknown as jsPDF
}

describe("pdf-brand helpers", () => {
  it("drawPdfHeader returns y below header block", () => {
    const doc = createMockDoc()
    const y = drawPdfHeader(doc, "Title")
    expect(y).toBeGreaterThan(0)
    expect(doc.setFont).toHaveBeenCalled()
  })

  it("drawSectionLabel advances y", () => {
    const doc = createMockDoc()
    const y2 = drawSectionLabel(doc, 40, "Section")
    expect(y2).toBe(46)
  })

  it("drawKeyValue uses splitTextToSize", () => {
    const doc = createMockDoc()
    const y2 = drawKeyValue(doc, 50, "K", "long value")
    expect(doc.splitTextToSize).toHaveBeenCalled()
    expect(y2).toBeGreaterThan(50)
  })

  it("drawRatioBar clamps ratio", () => {
    const doc = createMockDoc()
    drawRatioBar(doc, 10, 10, 40, 4, 2)
    drawRatioBar(doc, 10, 10, 40, 4, -1)
    expect(doc.rect).toHaveBeenCalled()
  })

  it("applyFooters iterates pages", () => {
    const doc = createMockDoc()
    applyFooters(doc)
    expect(doc.setPage).toHaveBeenCalled()
  })
})
