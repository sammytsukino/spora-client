import MainButton from '@/components/ui/MainButton';

interface QuoteSectionProps {
  quote: string;
  author: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function QuoteSection({ quote, author, buttonText, onButtonClick }: QuoteSectionProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--spora-primary)]">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 h-full w-full md:w-3/5 object-cover"
      >
        <source
          src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770915860/Comp_1_z4w4gi.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute left-0 top-0 h-full w-full md:w-3/5 bg-(--spora-primary)/75 md:bg-transparent pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col md:items-end items-center md:justify-start justify-center px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
        <p className="font-bizud-mincho text-[var(--spora-text-secondary)] max-w-6xl md:text-right text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed pointer-events-none mb-4 md:mb-8">
          {quote}"
        </p>

        <p className="font-supply-mono italic text-[var(--spora-text-secondary)] md:text-right text-center text-sm md:text-base mb-6 md:mb-12 pointer-events-none">
          {author}
        </p>

        <div className="pointer-events-auto">
          <MainButton
            variant="navbar"
            size="sm"
            type="button"
            onClick={onButtonClick}
          >
            {buttonText}
          </MainButton>
        </div>
      </div>
    </div>
  );
}
