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
    <section className="relative w-full min-h-0 flex-1 overflow-hidden bg-(--spora-primary) text-(--spora-primary-light)">
      <GooeySvgFilter id="gooey-filter-hero" strength={5} />

        <div
          className="absolute bottom-0 left-6 md:left-12 lg:left-16 z-10 pb-4 md:pb-6 lg:pb-8"
          style={{ width: 'max(10rem, 50vw)' }}
        >
          <div className="mb-20 flex items-center gap-3 w-full">
            <div className="font-bizud-mincho text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
              not revolutionary
            </div>
            <div className="h-px bg-[var(--spora-primary)] flex-1 min-w-[40px]" />
            <div className="font-bizud-mincho text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
              but evolutionary
            </div>
          </div>

          <div className="block leading-none">
            <CyclingLogo
              logos={sporaLogos}
              width="100%"
              height="auto"
              aspectRatio="10 / 3"
              cycleDuration={0.2}
              className="leading-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-[80vw]">
        <MeshGradient
          speed={1}
          scale={1}
          distortion={0.8}
          swirl={0.1}
          colors={['#CAFF50', '#FF64FF', '#F4EF40', '#52FF5A', '#00DCFF', '#DD4AFF', '#EDEDED']}
          style={{ height: '100%', width: '100%' }}
        />

        <div className="absolute right-6 md:right-12 lg:right-16 top-16 md:top-20 lg:top-24 text-right">
          <p className="font-supply-mono text-sm md:text-base lg:text-[16px] leading-relaxed text-[var(--spora-primary)] max-w-[44ch] ml-auto">
            Generative art for everyone. A canvas for the smallest thing we share: our words. Words blooming into singular works that live, branch, and grow. </p>
        </div>

        <div className="absolute right-6 md:right-12 lg:right-16 bottom-4 md:bottom-6 lg:bottom-8 text-right">
          <button
            type="button"
            className="font-supply-mono text-sm md:text-base lg:text-[16px] text-[var(--spora-primary)] hover:underline"
          >
            next flora →
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6.75 z-20 flex justify-center text-[10px] md:text-xs font-supply-mono opacity-70 pointer-events-none">
        EST 2026, SPORA ©
      </div>
    </section>
  );
}
