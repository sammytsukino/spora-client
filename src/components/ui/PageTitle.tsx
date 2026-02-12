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
    ? 'text-[var(--spora-text-secondary)]' 
    : 'text-[var(--spora-primary)]';
  
  const descriptionColor = theme === 'dark'
    ? 'text-[var(--spora-text-secondary)]'
    : 'text-[var(--spora-primary)]';

  return (
    <div className={cn("w-full", className)}>
      <span className={cn("font-supply-mono text-xs sm:text-sm tracking-[0.3em] uppercase block mb-4", textColors)}>
        {supertitle}
      </span>
      <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:gap-12", description ? "md:justify-between" : "")}>
        <h1 className={cn("font-bizud-mincho-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] whitespace-pre-line", textColors)}>
          {title}
        </h1>
        {description && (
          <p className={cn("font-bizud-mincho text-sm md:text-base text-left md:text-right max-w-full md:max-w-sm leading-relaxed", descriptionColor)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
