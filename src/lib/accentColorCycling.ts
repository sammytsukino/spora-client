export const ACCENT_COLOR_CYCLING_ENABLED = true;

const ACCENT_HUE_SPEED = 30;
const ACCENT_HUE_RANGE: [number, number] = [60, 180];

let rafId: number | null = null;
let startTime = 0;

function hsl(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function tick() {
  if (!ACCENT_COLOR_CYCLING_ENABLED) return;
  const time = (performance.now() - startTime) * 0.001;
  const [minH, maxH] = ACCENT_HUE_RANGE;
  const range = maxH - minH;
  const hue = minH + ((time * ACCENT_HUE_SPEED) % range);
  const color = hsl(hue, 95, 64);
  document.documentElement.style.setProperty("--spora-accent-secondary", color);
  rafId = requestAnimationFrame(tick);
}

export function initAccentColorCycling() {
  if (rafId != null) return;
  startTime = performance.now();
  if (ACCENT_COLOR_CYCLING_ENABLED) {
    rafId = requestAnimationFrame(tick);
  } else {
    document.documentElement.style.removeProperty("--spora-accent-secondary");
    document.documentElement.style.removeProperty("--spora-accent");
  }
}
