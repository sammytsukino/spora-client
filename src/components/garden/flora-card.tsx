interface FloraCardProps {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
  onClick?: () => void;
}

export default function FloraCard({
  id,
  generation,
  image,
  title,
  excerpt,
  author,
  seed,
  onClick,
}: FloraCardProps) {
  return (
    <article 
      className="flora-card bg-[#E9E9E9] flex flex-col relative overflow-hidden transition-all duration-200 cursor-pointer hover:bg-lime-300 active:scale-[0.98] group border-r-2 border-b-2 border-black"
      style={{ aspectRatio: '4/5' }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start p-6 pb-4">
        <span className="font-jetbrains-mono text-xs font-medium">{id}</span>
        <span className="font-jetbrains-mono text-[10px] border-2 border-black px-2 py-0.5">
          {generation}
        </span>
      </div>

      {/* Image Container */}
      <div className="flex-1 mx-6 mb-4 relative overflow-hidden border-2 border-black">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          style={{
            filter: 'grayscale(100%) contrast(120%)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'grayscale(0%) contrast(110%)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'grayscale(100%) contrast(120%)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex flex-col gap-2">
        <h2 className="font-bizud-mincho-bold text-[28px] leading-none uppercase tracking-tight">
          {title}
        </h2>
        <p className="font-jetbrains-mono text-[11px] italic opacity-100 line-clamp-2">
          "{excerpt}..."
        </p>
        <div className="flex justify-between font-jetbrains-mono text-[11px] opacity-100 mt-1">
          <span>{author}</span>
          <span>SEED: {seed}</span>
        </div>
      </div>
    </article>
  );
}
