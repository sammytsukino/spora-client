import PixelTrail from './PixelTrail';
import GooeySvgFilter from './GooeySvgFilter';
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
    <div className="relative w-full overflow-visible bg-[#262626] min-h-0 sm:min-h-[65vh] lg:min-h-[80vh]">

      <GooeySvgFilter id="gooey-filter-hero" strength={5} />

      <div
        className="absolute inset-0 z-0 overflow-hidden"
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


      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 lg:pt-16 pb-10 sm:pb-0">
          <p className="font-bizud-mincho text-stone-200 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight w-full max-w-full break-words">
            {text}
          </p>
        </div>
        <div className="flex-1 min-h-0 sm:min-h-[22vh] md:min-h-[36vh]" />
      </div>
    </div>
  );
}
