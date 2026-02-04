import MainButton from '@/components/ui/main-button';

interface QuoteSectionProps {
  quote: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function QuoteSection({ quote, buttonText, onButtonClick }: QuoteSectionProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--spora-primary)]">
      <div className="relative z-10 h-full flex flex-col items-end justify-end px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
        <p className="font-bizud-mincho text-[var(--spora-text-secondary)] max-w-6xl text-right text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed pointer-events-none mb-8 md:mb-12">
          "{quote}"
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
