import PixelTrail from './pixel-trail';
import GooeySvgFilter from './gooey-svg-filter';
import useScreenSize from '@/hooks/use-screen-size';
import useDetectBrowser from '@/hooks/use-detect-browser';

export default function HeroSection() {
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === 'Safari';

  return (
    <section className="relative w-full min-h-0 flex-1 overflow-hidden bg-[var(--spora-primary)] text-[var(--spora-primary-light)]">
      <GooeySvgFilter id="gooey-filter-hero" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? 'none' : 'url(#gooey-filter-hero)' }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan('md') ? 60 : 80}
          fadeDuration={0}
          delay={1500}
          pixelClassName="opacity-100 mix-blend-screen [background:radial-gradient(circle,#c6ff00_0%,#ff00f0_100%)]"
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <img
          src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1770373851/SPORA-LACE-TRANSPARENT_xby3av.png"
          alt="Spora lace mark"
          className="w-[min(78vw,920px)] max-h-[70vh] object-contain pointer-events-none"
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

      <div className="absolute left-6 bottom-6 md:left-12 md:bottom-10 lg:left-16 lg:bottom-12 z-20 max-w-[260px] md:max-w-[360px] text-sm md:text-lg font-supply-mono leading-relaxed pointer-events-none">
        Generative art for everyone. A canvas made of the smallest thing we share:
        plain text.
      </div>

      <div className="absolute right-6 bottom-6 md:right-12 md:bottom-10 lg:right-16 lg:bottom-12 z-20 max-w-[260px] md:max-w-[360px] text-sm md:text-lg font-supply-mono leading-relaxed text-right pointer-events-none">
        Parametric reading of your words, blooming into singular works that live,
        branch, and grow.
      </div>

      <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center text-[10px] md:text-xs font-supply-mono opacity-70 pointer-events-none">
        © 2026, SPORA
      </div>
    </section>
  );
}
