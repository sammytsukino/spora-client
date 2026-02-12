import type { FloraItem } from "@/data/flora-data";

interface GreenhouseFloraCardProps {
  flora: FloraItem;
  onClick?: () => void;
}

export default function GreenhouseFloraCard({ flora, onClick }: GreenhouseFloraCardProps) {
  return (
    <article
      className="group bg-[var(--spora-primary-light)] p-4 md:p-5 flex flex-col relative transition-colors duration-200 cursor-pointer hover:bg-[var(--spora-accent-secondary)] border-r-2 border-b-2 border-[var(--spora-primary)] focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-supply-mono text-[10px]">{flora.id}</span>
        <span className="font-supply-mono text-[9px] border-2 border-[var(--spora-primary)] px-1.5 py-0.5 uppercase">
          {flora.generation}
        </span>
      </div>
      <div
        className="mb-3 overflow-hidden border-2 border-[var(--spora-primary)] relative"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute inset-0 bg-[var(--spora-primary-light)] animate-pulse" />
        <img
          src={flora.image}
          alt={flora.title}
          className="w-full h-full object-cover transition-all duration-600 ease-[cubic-bezier(0.165,0.84,0.44,1)] relative z-10"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onLoad={(e) => {
            const placeholder = e.currentTarget.parentElement?.querySelector(".animate-pulse");
            if (placeholder) (placeholder as HTMLElement).style.display = "none";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>
      <h3 className="font-bizud-mincho-bold text-lg md:text-xl leading-tight uppercase mb-1 text-[var(--spora-primary)]">
        {flora.title}
      </h3>
      <p className="font-supply-mono text-[9px] md:text-[10px] italic opacity-90 line-clamp-2 mb-1">
        "{flora.excerpt}"
      </p>
      <div className="flex justify-between font-supply-mono text-[9px] md:text-[10px] opacity-75 mt-1">
        <span>{flora.author}</span>
        <span>{flora.seed}</span>
      </div>
    </article>
  );
}
