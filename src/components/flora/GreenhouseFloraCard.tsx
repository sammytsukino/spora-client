import { Link } from "react-router-dom";
import type { FloraItem } from "@/data/flora-data";

interface GreenhouseFloraCardProps {
  flora: FloraItem;
  authorUsername?: string;
  onClick?: () => void;
}

export default function GreenhouseFloraCard({ flora, authorUsername, onClick }: GreenhouseFloraCardProps) {
  return (
    <article
      className="group bg-[var(--spora-primary-light)] p-4 md:p-5 flex flex-col relative transition-colors duration-fast ease-spora-out cursor-pointer hover:bg-[var(--spora-accent-secondary)] border border-[var(--spora-primary)] focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-supply-mono text-[10px]">{flora.id}</span>
        <span className="font-supply-mono text-[9px] border border-[var(--spora-primary)] px-1.5 py-0.5 uppercase">
          {flora.generation}
        </span>
      </div>
      <div
        className="mb-3 overflow-hidden border border-[var(--spora-primary)] relative"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute inset-0 bg-[var(--spora-primary-light)] animate-pulse" />
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
      <h3 className="font-bizud-mincho-bold text-lg md:text-xl leading-tight mb-1 text-[var(--spora-primary)] line-clamp-1">
        {flora.title}
      </h3>
      <p className="font-supply-mono text-[9px] md:text-[10px] italic opacity-90 line-clamp-2 mb-1">
        "{flora.excerpt}"
      </p>
      <div className="flex justify-between font-supply-mono text-[9px] md:text-[10px] opacity-75 mt-1">
        {authorUsername && flora.author !== "@Anonymous" ? (
          <Link to={`/profile/${authorUsername}`} className="hover:underline" onClick={(event) => event.stopPropagation()}>
            {flora.author}
          </Link>
        ) : (
          <span>{flora.author}</span>
        )}
        <span>{flora.seed}</span>
      </div>
    </article>
  );
}
