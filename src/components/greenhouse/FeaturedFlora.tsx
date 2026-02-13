import type { FloraItem } from "@/data/flora-data";

interface FeaturedFloraProps {
  flora: FloraItem;
  onClick?: () => void;
}

export default function FeaturedFlora({ flora, onClick }: FeaturedFloraProps) {
  return (
    <section 
      className="group bg-[var(--spora-primary-light)] p-6 md:p-8 lg:p-10 flex flex-col relative transition-colors duration-300 cursor-pointer hover:bg-[var(--spora-accent-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2 border-r-2 border-b-2 border-[var(--spora-primary)]"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="absolute top-6 right-6 z-20 bg-[var(--spora-primary)] text-[var(--spora-accent-secondary)] font-supply-mono text-[9px] md:text-xs px-2.5 py-1 uppercase tracking-[0.18em]">
        S-TIER // FEATURED
      </div>
      <div
        className="w-full overflow-hidden mb-6 border-2 border-[var(--spora-primary)] relative"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute inset-0 bg-[var(--spora-primary-light)] animate-pulse" />
        <img
          src={flora.image}
          alt={flora.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out relative z-10"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onLoad={(e) => {
            const img = e.currentTarget;
            const placeholder = img.parentElement?.querySelector('.animate-pulse') as HTMLElement | null;
            if (placeholder) {
              placeholder.style.display = 'none';
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        />
      </div>
      <div>
        <h2 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-[0.9] uppercase tracking-tight mb-3 text-[var(--spora-primary)] line-clamp-1">
          {flora.title}
        </h2>
        <p className="font-supply-mono text-[11px] md:text-xs italic opacity-90 line-clamp-2 mb-3 text-[var(--spora-primary)]">
          "{flora.excerpt}"
        </p>
        <div className="grid grid-cols-3 border-t-2 border-[var(--spora-primary)] pt-2 font-supply-mono text-[10px] md:text-xs text-[var(--spora-primary)]">
          <span>ID: {flora.id}</span>
          <span>GEN: {flora.generation}</span>
          <span>SEED: {flora.seed}</span>
        </div>
      </div>
    </section>
  );
}
