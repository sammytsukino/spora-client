import FloraLink from "@/components/shared/FloraLink";
import type { FloraItem } from "@/data/flora-data";

interface GreenhouseFloraCardProps {
  flora: FloraItem;
  authorUsername?: string;
  to?: string;
  linkState?: unknown;
  onClick?: () => void;
}

export default function GreenhouseFloraCard({ flora, to, linkState, onClick }: GreenhouseFloraCardProps) {
  const cardClassName =
    "group bg-spora-primary-light p-4 md:p-5 flex flex-col relative transition-colors duration-fast ease-spora-out cursor-pointer hover:bg-spora-accent-secondary border border-spora-primary focus-visible:ring-2 focus-visible:ring-spora-primary focus-visible:ring-offset-2 no-underline text-inherit";

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-4">
        <span className="font-supply-mono text-[10px]">{flora.id}</span>
        <span className="font-supply-mono text-[9px] border border-spora-primary px-1.5 py-0.5 uppercase">
          {flora.generation}
        </span>
      </div>
      <div
        className="mb-3 overflow-hidden border border-spora-primary relative"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute inset-0 bg-spora-primary-light animate-pulse" />
        <img
          src={flora.image}
          alt={flora.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-image ease-spora-out z-10"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onLoad={(event) => {
            const placeholderElement = event.currentTarget.parentElement?.querySelector(".animate-pulse");
            if (placeholderElement) (placeholderElement as HTMLElement).style.display = "none";
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>
      <h3 className="font-bizud-mincho-bold text-lg md:text-xl leading-tight mb-1 text-spora-primary line-clamp-1">
        {flora.title}
      </h3>
      <p className="font-supply-mono text-[9px] md:text-[10px] italic opacity-90 line-clamp-2 mb-1">
        "{flora.excerpt}"
      </p>
      <div className="flex justify-between font-supply-mono text-[9px] md:text-[10px] opacity-75 mt-1">
        <span>{flora.author}</span>
        <span>{flora.seed}</span>
      </div>
    </>
  );

  if (to) {
    return (
      <FloraLink
        to={to}
        state={linkState}
        className={cardClassName}
        aria-label={`Open flora ${flora.title}`}
      >
        {cardContent}
      </FloraLink>
    );
  }

  return (
    <article
      className={cardClassName}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open flora ${flora.title}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {cardContent}
    </article>
  );
}
