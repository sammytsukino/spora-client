import type { FloraItem } from "@/data/flora-data";

interface FeaturedFloraProps {
  flora: FloraItem;
  onClick?: () => void;
}

export default function FeaturedFlora({ flora, onClick }: FeaturedFloraProps) {
  return (
    <section 
      className="group bg-[#E9E9E9] p-6 md:p-8 lg:p-10 flex flex-col relative transition-colors duration-300 cursor-pointer hover:bg-lime-300 border-r-2 border-b-2 border-[#262626]"
      onClick={onClick}
    >
      <div className="absolute top-6 right-6 z-5 bg-[#262626] text-lime-300 font-supply-mono text-[9px] md:text-xs px-2.5 py-1 uppercase tracking-[0.18em]">
        S-TIER // FEATURED
      </div>
      <div
        className="w-full overflow-hidden mb-6 border-2 border-[#262626]"
        style={{ aspectRatio: "4 / 5" }}
      >
        <img
          src={flora.image}
          alt={flora.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "grayscale(0%) contrast(110%)"
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "grayscale(100%) contrast(120%)"
            e.currentTarget.style.transform = "scale(1)"
          }}
        />
      </div>
      <div>
        <h2 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-[0.9] uppercase tracking-tight mb-3 text-[#262626]">
          {flora.title}
        </h2>
        <p className="font-supply-mono text-[11px] md:text-xs italic opacity-90 line-clamp-2 mb-3">
          "{flora.excerpt}"
        </p>
        <div className="grid grid-cols-3 border-t border-[#262626] pt-2 font-supply-mono text-[10px] md:text-xs">
          <span>ID: {flora.id}</span>
          <span>GEN: {flora.generation}</span>
          <span>SEED: {flora.seed}</span>
        </div>
      </div>
    </section>
  );
}
