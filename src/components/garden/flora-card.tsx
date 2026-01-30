import { cn } from "@/lib/utils";
import MainButton from "../ui/main-button";

interface FloraCardProps {
  image: string;
  title: string;
  subtitle: string;
  author: string;
  generation: string;
  className?: string;
}

export default function FloraCard({
  image,
  title,
  subtitle,
  author,
  generation,
  className,
}: FloraCardProps) {
  return (
    <div className={cn("flex flex-col border-2 border-neutral-800 bg-neutral-100", className)}>
      {/* Image Area */}
      <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-neutral-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col justify-between flex-1 relative min-h-[160px]">
        {/* Search Icon (Top Right) */}
        <div className="absolute top-4 right-4">
          <svg width="30" height="30" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="17.3233" height="17" fill="#E9E9E9" stroke="#242424" strokeWidth="2"/>
            <g clipPath="url(#clip0_76_1033)">
              <path d="M11.5934 3.41025C9.24446 3.41025 7.33554 5.28724 7.33554 7.59684C7.33554 8.50044 7.63004 9.33427 8.12678 10.0181L7.66552 10.4716H6.80331L3.46802 13.7546L5.33436 15.5897L8.66966 12.3102V11.4625L9.13092 11.0089C9.82636 11.4973 10.6779 11.7869 11.5934 11.7869C13.9423 11.7869 15.8512 9.90993 15.8512 7.60033C15.8512 5.29072 13.9423 3.41025 11.5934 3.41025ZM11.5934 10.3914C10.0286 10.3914 8.75481 9.1389 8.75481 7.60033C8.75481 6.06175 10.0286 4.80927 11.5934 4.80927C13.1581 4.80927 14.4319 6.06175 14.4319 7.60033C14.4319 9.1389 13.1581 10.3914 11.5934 10.3914Z" fill="#242424"/>
            </g>
            <defs>
              <clipPath id="clip0_76_1033">
                <rect width="12.3867" height="12.1795" fill="white" transform="translate(3.46802 3.41025)"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="mr-8">
            <h3 className="font-bizud-mincho-bold text-2xl mb-2 text-neutral-800">{title}</h3>
            <p className="font-jetbrains-mono text-xs text-neutral-800 italic mb-6 line-clamp-2">
            {subtitle}
            </p>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col font-jetbrains-mono text-xs text-neutral-800 gap-1">
            <span>{author}</span>
            <span className="text-neutral-800">{generation}</span>
          </div>

          <MainButton
            variant="compact"
            size="sm"
            className="!px-3 !py-1 !text-[10px] !border-neutral-800 !text-neutral-800 hover:!bg-neutral-800 hover:!text-white"
          >
            TAKE CUTTING
          </MainButton>
        </div>
      </div>
    </div>
  );
}
