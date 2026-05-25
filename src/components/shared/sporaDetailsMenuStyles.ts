export type SporaDetailsMenuPlacement = "up" | "down";

export type SporaDetailsMenuTone = "light" | "dark";

export const readerChromeSummary: Record<SporaDetailsMenuTone, string> = {
  light:
    "border border-spora-primary bg-spora-primary/5 px-3 py-2 hover:bg-spora-primary/7 hover:no-underline",
  dark: "border border-white/90 bg-white/5 px-3 py-2 hover:bg-white/7 hover:no-underline",
};

export const readerChromePanel: Record<SporaDetailsMenuTone, string> = {
  light:
    "border border-spora-primary bg-spora-primary/5 hover:bg-spora-primary/7 backdrop-blur-md px-3 py-3 shadow-none",
  dark: "border border-white/90 bg-white/5 hover:bg-white/7 backdrop-blur-md px-3 py-3 shadow-none",
};

export function readerChromeButtonClass(tone: SporaDetailsMenuTone): string {
  return readerChromeSummary[tone];
}
