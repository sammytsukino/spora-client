import React from "react"
import { cn } from "@/lib/utils"

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "compact" | "navbar"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function MainButton({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: MainButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center bg-transparent transition-all duration-200 font-supply-mono font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"

  const variantStyles: Record<NonNullable<MainButtonProps["variant"]>, string> = {
    default: "border border-[var(--spora-primary)] text-[var(--spora-primary)] hover:bg-[var(--spora-primary)] hover:text-[var(--spora-text-secondary)] focus-visible:ring-[var(--spora-primary)]",
    compact: "border-2 border-[var(--spora-primary)] text-[var(--spora-primary)] hover:bg-[var(--spora-primary)] hover:text-[var(--spora-text-secondary)] focus-visible:ring-[var(--spora-primary)]",
    navbar:
      "border-2 border-[var(--spora-text-secondary)] text-[var(--spora-text-secondary)] hover:bg-[var(--spora-text-secondary)] hover:text-[var(--spora-primary)] focus-visible:ring-[var(--spora-text-secondary)]",
  }

  const sizeStyles: Record<NonNullable<MainButtonProps["size"]>, string> = {
    sm: "px-5 py-1 text-[10px] sm:text-xs tracking-[0.3em] uppercase",
    md: "px-6 py-2.5 text-sm sm:text-base",
    lg: "px-8 py-3 text-base md:text-lg",
  }

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
