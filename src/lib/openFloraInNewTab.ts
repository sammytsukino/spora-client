export function openFloraInNewTab(path: string): void {
  const link = document.createElement("a");
  link.href = path;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
