import PixelTrail from './pixel-trail';
import GooeySvgFilter from './gooey-svg-filter';
import useScreenSize from '@/hooks/use-screen-size';
import useDetectBrowser from '@/hooks/use-detect-browser';

interface DeclarativeSectionProps {
  text: string;
}

export default function DeclarativeSection({ text }: DeclarativeSectionProps) {
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === "Safari";

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-800">
      <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? 'none' : 'url(#gooey-filter-declarative)' }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 24 : 60}
          fadeDuration={0}
          delay={2000}
          pixelClassName="[background:radial-gradient(circle,#c6ff00_0%,#ff00f0_100%)]"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 px-20 h-full flex items-start pt-8 pointer-events-none">
        <p className="font-bizud-mincho text-neutral-200 -ml-23 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight pointer-events-none">
          {text}
        </p>
      </div>
    </div>
  );
}
