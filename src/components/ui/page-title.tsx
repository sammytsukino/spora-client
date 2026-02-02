import { cn } from "@/lib/utils";

interface PageTitleProps {
  supertitle: string;
  title: string;
  className?: string;
}

export default function PageTitle({ supertitle, title, className }: PageTitleProps) {
  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <span className="font-jetbrains-mono text-xs sm:text-sm tracking-widest uppercase text-neutral-800">
        {supertitle}
      </span>
      <h1 className="font-bizud-mincho-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-neutral-800 whitespace-pre-line">
        {title}
      </h1>
    </div>
  );
}
