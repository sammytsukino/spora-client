import PixelTrail from './pixel-trail';
import GooeySvgFilter from './gooey-svg-filter';
import useScreenSize from '@/hooks/use-screen-size';
import useDetectBrowser from '@/hooks/use-detect-browser';

interface DeclarativeSectionProps {
  text: string;
}

  const pixelColors = [
    "#B1E200",
    "#DE00EA",
    "#E8D700",
    "#00E000",
    "#00C0ED",
    "#7A00EF",
  ];


export default function DeclarativeSection({ text }: DeclarativeSectionProps) {
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === "Safari";

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#262626]">

      <GooeySvgFilter id="gooey-filter-hero" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? "none" : "url(#gooey-filter-hero)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 40 : 60}
          fadeDuration={0}
          delay={1500}
          colors={pixelColors}
          pixelClassName="opacity-100 mix-blend-screen"
          className="w-full h-full"
          colorDarken={2}
        />
      </div>


      <div className="relative z-10 px-20 h-full flex items-start pt-8 pointer-events-none">
        <p className="font-bizud-mincho text-stone-200 -ml-23 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight pointer-events-none">
          {text}
        </p>
      </div>
    </div>
  );
}
