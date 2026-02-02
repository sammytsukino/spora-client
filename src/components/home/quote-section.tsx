import MainButton from '@/components/ui/main-button';

interface QuoteSectionProps {
  quote: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function QuoteSection({ quote, buttonText, onButtonClick }: QuoteSectionProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-800">
      <div className="relative z-10 h-full flex flex-col items-end justify-start">
        <p className="font-bizud-mincho text-neutral-200 -mr-3 max-w-6xl flex text-right text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight pointer-events-none">
          "{quote}"
        </p>

        <div className="mt-12 pointer-events-auto pt-8 px-6 md:px-12 lg:px-16">
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
