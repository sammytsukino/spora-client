import PixelTrail from './PixelTrail';
import GooeySvgFilter from './GooeySvgFilter';
import useScreenSize from '@/hooks/use-screen-size';
import useDetectBrowser from '@/hooks/use-detect-browser';

interface DeclarativeSectionProps {
  text: string;
  imageSrc?: string;
  imageAlt?: string;
}

  const pixelColors = [
    "#B1E200",
    "#DE00EA",
    "#E8D700",
    "#00E000",
    "#00C0ED",
    "#7A00EF",
  ];


export default function DeclarativeSection({
  text,
  imageSrc,
  imageAlt = '',
}: DeclarativeSectionProps) {
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === "Safari";

  return (
    <div
      className={
        imageSrc
          ? 'relative w-full overflow-visible bg-[#262626] min-h-0 sm:min-h-[52vh] lg:min-h-[58vh]'
          : 'relative w-full overflow-visible bg-[#262626] min-h-0 sm:min-h-[65vh] lg:min-h-[80vh]'
      }
    >

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
        <div
          className={
            imageSrc
              ? 'px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 lg:pt-16 pb-12 sm:pb-14 lg:pb-16'
              : 'px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 lg:pt-16 pb-10 sm:pb-0'
          }
        >
          <p className="font-bizud-mincho text-stone-200 text-2xl leading-snug sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl xl:text-7xl w-full max-w-full [overflow-wrap:break-word]">
            {text}
          </p>
          {imageSrc ? (
            <div className="mt-6 sm:mt-8 lg:mt-10 flex w-full justify-end pointer-events-none">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-auto w-full max-w-full object-contain object-center sm:max-w-[min(100%,60vw)] sm:object-right select-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}
        </div>
        {imageSrc ? null : (
          <div className="flex-1 min-h-0 sm:min-h-[22vh] md:min-h-[36vh]" />
        )}
      </div>
    </div>
  );
}
