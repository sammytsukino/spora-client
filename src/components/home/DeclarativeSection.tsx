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
          ? 'relative w-full overflow-visible bg-spora-primary min-h-0 sm:min-h-[52vh] lg:min-h-[58vh]'
          : 'relative w-full overflow-visible bg-spora-primary min-h-0 sm:min-h-[65vh] lg:min-h-[80vh]'
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
              ? 'px-6 sm:px-10 lg:px-20 pt-20 sm:pt-14 lg:pt-18 pb-12 sm:pb-14 lg:pb-20'
              : 'px-6 sm:px-10 lg:px-20 pt-20 sm:pt-14 lg:pt-18 pb-12 sm:pb-14 lg:pb-20'
          }
        >
          <p className="font-bizud-mincho text-stone-200 w-full max-w-full text-[clamp(3rem,1.1rem+3.9vw,11rem)] leading-[0.95] tracking-tighter">
            {text}
          </p>
          {imageSrc ? (
            <div className="mt-6 sm:mt-8 lg:mt-10 flex w-full justify-end pointer-events-none pb-10">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-auto w-full max-w-full object-contain object-center sm:max-w-[min(100%,50vw)] sm:object-right select-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
