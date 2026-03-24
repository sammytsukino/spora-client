import type { jsPDF } from "jspdf";


export const PDF_BRAND = {
  margin: 18,
  lineHeight: 5.5,
  colors: {
    
    primary: [38, 38, 38] as [number, number, number],
    
    accent: [187, 244, 81] as [number, number, number],
    
    accentWarm: [255, 107, 74] as [number, number, number],
    
    surface: [233, 233, 233] as [number, number, number],
    muted: [100, 100, 100] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
  },
} as const;

const { margin, colors } = PDF_BRAND;
const pageW = 210;
const pageH = 297;

export function drawPdfHeader(doc: jsPDF, documentTitle: string): number {
  doc.setFillColor(...colors.accent);
  doc.rect(0, 0, pageW, 5, "F");

  let y = margin + 2;
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SPORA", margin, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...colors.muted);
  doc.text("Admin · Confidential export", margin, y);

  y += 8;
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(documentTitle, margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...colors.muted);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

  y += 10;
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageW - margin, y);
  return y + 8;
}

export function drawSectionLabel(doc: jsPDF, y: number, label: string): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.primary);
  doc.text(label, margin, y);
  return y + 6;
}

export function drawKeyValue(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  maxTextWidth = pageW - margin * 2
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text(label, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.primary);
  const lines = doc.splitTextToSize(value, maxTextWidth - 42);
  doc.text(lines, margin + 40, y);
  return y + Math.max(5, lines.length * PDF_BRAND.lineHeight);
}


export function drawRatioBar(
  doc: jsPDF,
  x: number,
  y: number,
  widthMm: number,
  heightMm: number,
  ratio: number
): void {
  const r = Math.max(0, Math.min(1, ratio));
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.15);
  doc.rect(x, y, widthMm, heightMm);
  doc.setFillColor(...colors.accent);
  doc.rect(x, y, widthMm * r, heightMm, "F");
}

export function applyFooters(doc: jsPDF): void {
  const total = doc.getNumberOfPages();
  const footerY = pageH - 10;
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...colors.muted);
    doc.text(`SPORA · ${i} / ${total}`, margin, footerY);
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    doc.text(stamp, pageW - margin - doc.getTextWidth(stamp), footerY);
  }
}

export function finalizePdf(doc: jsPDF, filename: string): void {
  applyFooters(doc);
  doc.save(filename);
}
