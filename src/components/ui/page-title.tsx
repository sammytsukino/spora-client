import { cn } from "@/lib/utils";

interface PageTitleProps {
  supertitle: string;
  title: string;
  description?: string;
  className?: string;
}

export default function PageTitle({ supertitle, title, description, className }: PageTitleProps) {
  return (
    <div className={cn("w-full", className)}>
      <span className="font-jetbrains-mono text-xs sm:text-sm tracking-widest uppercase text-neutral-800 block mb-2">
        {supertitle}
      </span>
      <div className={cn("flex items-center gap-8", description ? "justify-between" : "")}>
        <h1 className="font-bizud-mincho-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-neutral-800 whitespace-pre-line">
          {title}
        </h1>
        {description && (
          <p className="font-bizud-mincho text-sm md:text-base text-right max-w-xs md:max-w-sm leading-snug text-neutral-700 shrink-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
