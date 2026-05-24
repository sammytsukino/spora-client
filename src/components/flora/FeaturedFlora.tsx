import { Link } from "react-router-dom";
import type { FloraItem } from "@/data/flora-data";

interface FeaturedFloraProps {
  flora: FloraItem;
  to?: string;
  linkState?: unknown;
  onClick?: () => void;
}

export default function FeaturedFlora({ flora, to, linkState, onClick }: FeaturedFloraProps) {
  const cardClassName =
    "group bg-spora-primary-light p-6 md:p-8 lg:p-10 flex flex-col relative transition-colors duration-300 cursor-pointer hover:bg-spora-accent-secondary focus-visible:ring-2 focus-visible:ring-spora-primary focus-visible:ring-offset-2 border border-spora-primary no-underline text-inherit";

  const cardContent = (
    <>
      <div className="absolute top-6 right-6 z-20 bg-spora-primary text-spora-accent-secondary font-supply-mono text-[9px] md:text-xs px-2.5 py-1 uppercase tracking-[0.18em]">
        S-TIER // FEATURED
      </div>
      <div
        className="w-full overflow-hidden mb-6 border border-spora-primary relative"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute inset-0 bg-spora-primary-light animate-pulse" />
        <img
          src={flora.image}
          alt={flora.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onLoad={(event) => {
            const imageElement = event.currentTarget;
            const placeholderElement = imageElement.parentElement?.querySelector('.animate-pulse') as HTMLElement | null;
            if (placeholderElement) {
              placeholderElement.style.display = 'none';
            }
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)"
          }}
        />
      </div>
      <div>
        <h2 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-[0.9] tracking-tight mb-3 text-spora-primary line-clamp-1">
          {flora.title}
        </h2>
        <p className="font-supply-mono text-[11px] md:text-xs italic opacity-90 line-clamp-2 mb-3 text-spora-primary">
          "{flora.excerpt}"
        </p>
        <div className="grid grid-cols-3 border-t border-spora-primary pt-2 font-supply-mono text-[10px] md:text-xs text-spora-primary">
          <span>ID: {flora.id}</span>
          <span>GEN: {flora.generation}</span>
          <span>SEED: {flora.seed}</span>
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        state={linkState}
        className={cardClassName}
        aria-label={`Open flora ${flora.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <section
      className={cardClassName}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open flora ${flora.title}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {cardContent}
    </section>
  );
}
