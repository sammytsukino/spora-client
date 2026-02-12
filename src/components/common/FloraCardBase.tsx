interface FloraCardBaseProps {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
  onClick?: () => void;
  variant?: 'garden' | 'greenhouse';
}

export default function FloraCardBase({
  id,
  generation,
  image,
  title,
  excerpt,
  author,
  seed,
  onClick,
  variant = 'garden',
}: FloraCardBaseProps) {
  const isGarden = variant === 'garden';

  return (
    <article
      className={`group bg-[var(--spora-primary-light)] flex flex-col relative transition-all duration-200 cursor-pointer hover:bg-[var(--spora-accent-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2 ${
        isGarden ? 'active:scale-[0.98]' : ''
      } border-r-2 border-b-2 border-[var(--spora-primary)]`}
      style={{ aspectRatio: '4/5' }}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={`flex justify-between items-start ${isGarden ? 'p-6 pb-4' : 'p-4 md:p-5 mb-4'}`}>
        <span className={`font-supply-mono ${isGarden ? 'text-xs font-medium' : 'text-[10px]'}`}>
          {id}
        </span>
        <span
          className={`font-supply-mono border-2 border-[var(--spora-primary)] uppercase ${
            isGarden
              ? 'text-[10px] px-2 py-0.5'
              : 'text-[9px] px-1.5 py-0.5'
          }`}
        >
          {generation}
        </span>
      </div>

      <div
        className={`relative overflow-hidden border-2 border-[var(--spora-primary)] ${
          isGarden ? 'flex-1 mx-6 mb-4' : 'mb-3'
        }`}
        style={{ aspectRatio: '4/5' }}
      >
        <div className="absolute inset-0 bg-[var(--spora-primary-light)] animate-pulse" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] relative z-10"
          style={{
            filter: 'grayscale(100%) contrast(120%)',
          }}
          onLoad={(e) => {
            const img = e.currentTarget;
            const placeholder = img.parentElement?.querySelector('.animate-pulse') as HTMLElement | null;
            if (placeholder) {
              placeholder.style.display = 'none';
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

      <div className={`flex flex-col gap-2 ${isGarden ? 'px-6 pb-6' : 'p-0'}`}>
        <h2
          className={`font-bizud-mincho-bold leading-none uppercase tracking-tight text-[var(--spora-primary)] ${
            isGarden
              ? 'text-[28px]'
              : 'text-lg md:text-xl mb-1'
          }`}
        >
          {title}
        </h2>
        <p
          className={`font-supply-mono italic line-clamp-2 ${
            isGarden
              ? 'text-[11px] opacity-100'
              : 'text-[9px] md:text-[10px] opacity-90 mb-1'
          }`}
        >
{`"${excerpt}${isGarden ? '...' : ''}"`}
        </p>
        <div
          className={`flex justify-between font-supply-mono mt-1 ${
            isGarden
              ? 'text-[11px] opacity-100'
              : 'text-[9px] md:text-[10px] opacity-75'
          }`}
        >
          <span>{author}</span>
          <span>{isGarden ? `SEED: ${seed}` : seed}</span>
        </div>
      </div>
    </article>
  );
}
