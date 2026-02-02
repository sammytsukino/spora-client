import { cn } from "@/lib/utils";

interface PageTitleProps {
  supertitle: string;
  title: string;
  description?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function PageTitle({ 
  supertitle, 
  title, 
  description, 
  className,
  theme = 'light' 
}: PageTitleProps) {
  const textColors = theme === 'dark' 
    ? 'text-stone-200' 
    : 'text-[#262626]';
  
  const descriptionColor = theme === 'dark'
    ? 'text-stone-200'
    : 'text-[#262626]';

  return (
    <div className={cn("w-full", className)}>
      <span className={cn("font-supply-mono text-xs sm:text-sm tracking-widest uppercase block mb-2", textColors)}>
        {supertitle}
      </span>
      <div className={cn("flex items-center gap-8", description ? "justify-between" : "")}>
        <h1 className={cn("font-bizud-mincho-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] whitespace-pre-line", textColors)}>
          {title}
        </h1>
        {description && (
          <p className={cn("font-bizud-mincho text-sm md:text-base text-right max-w-xs md:max-w-sm leading-snug shrink-0", descriptionColor)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
