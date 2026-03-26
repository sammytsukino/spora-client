import { describe, it, expect, vi, beforeEach } from "vitest"
import type { AdminMetricsData } from "@/data/admin-data"

const JsPDF = vi.hoisted(() => vi.fn())

vi.mock("jspdf", () => ({
  jsPDF: JsPDF,
}))

vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}))

import { exportMetricsToPdf } from "./admin-pdf-export"

beforeEach(() => {
  JsPDF.mockReset()
  const save = vi.fn()
  JsPDF.mockImplementation(() => ({
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
    getNumberOfPages: vi.fn(() => 1),
    setPage: vi.fn(),
    getTextWidth: vi.fn(() => 10),
    save,
  }))
})

describe("exportMetricsToPdf", () => {
  it("constructs jsPDF and calls save", () => {
    const metrics: AdminMetricsData = {
      totalUsers: 1,
      totalFloras: 2,
      totalBlossoming: 1,
      totalSealed: 1,
      totalHidden: 0,
      pendingReports: 0,
      flaggedContent: 0,
    }
    exportMetricsToPdf(metrics)
    expect(JsPDF).toHaveBeenCalled()
    const instance = JsPDF.mock.results[0]?.value as { save: ReturnType<typeof vi.fn> }
    expect(instance.save).toHaveBeenCalled()
  })
})
