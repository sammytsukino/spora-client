import PixelTrail from "./pixel-trail";
import GooeySvgFilter from "./gooey-svg-filter";
import useScreenSize from "@/hooks/use-screen-size";
import useDetectBrowser from "@/hooks/use-detect-browser";

export default function HeroSection() {
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === "Safari";
  const pixelColors = [
    "#B1E200",
    "#DE00EA",
    "#E8D700",
    "#00E000",
    "#00C0ED",
    "#7A00EF",
  ];

  return (
    <section className="relative w-full min-h-0 flex-1 overflow-hidden bg-[var(--spora-primary)] text-[var(--spora-primary-light)]">
      <GooeySvgFilter id="gooey-filter-hero" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? "none" : "url(#gooey-filter-hero)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 60 : 80}
          fadeDuration={0}
          delay={1500}
          colors={pixelColors}
          pixelClassName="opacity-100 mix-blend-screen"
          className="w-full h-full"
          colorDarken={2}
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <img
          src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1770388115/SPORA-LACE-TRANSPARENT-MINI_hzwlvt.webp"
          alt="Spora lace mark"
          className="w-[min(78vw,1400px)] max-h-[70vh] object-contain pointer-events-none"
        />
      </div>

      <div className="absolute left-6 right-6 top-6 md:left-12 md:right-12 lg:left-16 lg:right-16 z-20 flex items-center justify-between pointer-events-none">
        <div className="font-supply-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-70">
          SPORA
        </div>
        <div className="hidden md:flex font-supply-mono text-[10px] md:text-xs uppercase tracking-[0.3em] gap-6">
          <span>[01] GARDEN</span>
          <span>|</span>
          <span>[02] GREENHOUSE</span>
          <span>|</span>
          <span>[03] LABORATORY</span>
        </div>
        <button
          type="button"
          className="pointer-events-auto border border-[var(--spora-primary-light)] px-3 py-1 text-[10px] md:text-xs font-supply-mono uppercase tracking-[0.3em]"
        >
          SIGN IN
        </button>
      </div>

      <div className="absolute left-6 bottom-[27px] md:left-12 lg:left-16 z-20 max-w-[260px] md:max-w-[360px] pointer-events-none hidden md:block">
        <div className="flex flex-col gap-2 text-[11px] sm:text-sm md:text-base lg:text-base font-supply-mono leading-relaxed">
 

          <div>
            Generative art for everyone. A canvas made of the smallest thing we
            share: plain, simple text.
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-[27px] md:right-12 lg:right-16 z-20 max-w-[260px] md:max-w-[360px] pointer-events-none hidden md:block">
        <div className="flex flex-col gap-2 text-[11px] sm:text-sm md:text-base lg:text-base font-supply-mono leading-relaxed text-right">

          <div>
            Parametric reading of your words, blooming into singular works that
            live, branch, and grow.
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[27px] z-20 flex justify-center text-[10px] md:text-xs font-supply-mono opacity-70 pointer-events-none hidden md:flex">
        EST 2026, SPORA ©
      </div>
    </section>
  );
}
