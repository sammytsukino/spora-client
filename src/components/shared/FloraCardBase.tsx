import { useEffect, useMemo, useState } from "react";
import FloraLink from "@/components/shared/FloraLink";
import { floraImages } from "@/data/flora-data";
import { cldImage } from "@/lib/cloudinary";

interface FloraCardBaseProps {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
  authorUsername?: string;
  to?: string;
  linkState?: unknown;
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
  to,
  linkState,
  onClick,
  variant = 'garden',
}: FloraCardBaseProps) {
  const isGarden = variant === 'garden';
  const cardClassName = `group bg-spora-primary-light flex flex-col relative transition-all duration-fast ease-spora-out cursor-pointer hover:bg-spora-accent-secondary focus-visible:ring-2 focus-visible:ring-spora-primary focus-visible:ring-offset-2 ${
    isGarden ? 'active:scale-[0.98]' : ''
  } border border-spora-primary no-underline text-inherit`;
  const [imgSrc, setImgSrc] = useState(() => cldImage(image, "thumbnail"));
  const [loadAttempt, setLoadAttempt] = useState(0);
  const fallbackImage = useMemo(() => {
    const key = `${id}:${title}`;
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return floraImages[Math.abs(hash) % floraImages.length];
  }, [id, title]);

  useEffect(() => {
    setImgSrc(cldImage(image, "thumbnail"));
    setLoadAttempt(0);
  }, [image]);

  const cardContent = (
    <>
      <div className={`flex justify-between items-start ${isGarden ? 'p-6 pb-4' : 'p-4 md:p-5 mb-4'}`}>
        <span className={`font-supply-mono ${isGarden ? 'text-xs font-medium' : 'text-[10px]'}`}>
          {id}
        </span>
        <span
          className={`font-supply-mono border border-spora-primary uppercase ${
            isGarden
              ? 'text-[10px] px-2 py-0.5'
              : 'text-[9px] px-1.5 py-0.5'
          }`}
        >
          {generation}
        </span>
      </div>

      <div
        className={`relative overflow-hidden border border-spora-primary ${
          isGarden ? 'flex-1 mx-6 mb-4' : 'mb-3'
        }`}
        style={{ aspectRatio: '4/5' }}
      >
        <div className="absolute inset-0 bg-spora-primary-light animate-pulse" />
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-image ease-spora-out z-10"
          style={{
            filter: 'grayscale(100%) contrast(120%)',
          }}
          onLoad={(event) => {
            const imageElement = event.currentTarget;
            const placeholderElement = imageElement.parentElement?.querySelector('.animate-pulse') as HTMLElement | null;
            if (placeholderElement) {
              placeholderElement.style.display = 'none';
            }
          }}
          onError={(event) => {
            const imageElement = event.currentTarget;
            const placeholderElement = imageElement.parentElement?.querySelector('.animate-pulse') as HTMLElement | null;
            if (loadAttempt === 0) {
              setLoadAttempt(1);
              const retryJoiner = image.includes('?') ? '&' : '?';
              setImgSrc(`${image}${retryJoiner}retry=${Date.now()}`);
              return;
            }
            if (loadAttempt === 1 && fallbackImage && imgSrc !== cldImage(fallbackImage, "thumbnail")) {
              setLoadAttempt(2);
              setImgSrc(cldImage(fallbackImage, "thumbnail"));
              return;
            }
            if (placeholderElement) {
              placeholderElement.style.display = 'none';
            }
            imageElement.style.opacity = '0';
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

      <div className={`flex flex-col gap-2 ${isGarden ? 'px-6 pb-6' : 'p-0'}`}>
        <h2
          className={`font-bizud-mincho-bold leading-none tracking-tight text-spora-primary line-clamp-1 ${
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
    </>
  );

  if (to) {
    return (
      <FloraLink
        to={to}
        state={linkState}
        className={cardClassName}
        style={{ aspectRatio: '4/5' }}
        aria-label={`Open flora ${title}`}
      >
        {cardContent}
      </FloraLink>
    );
  }

  return (
    <article
      className={cardClassName}
      style={{ aspectRatio: '4/5' }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open flora ${title}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {cardContent}
    </article>
  );
}
