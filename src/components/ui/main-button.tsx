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
    "inline-flex items-center justify-center bg-transparent transition-colors font-supply-mono font-bold cursor-pointer"

  const variantStyles: Record<NonNullable<MainButtonProps["variant"]>, string> = {
    default: "border border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-stone-200",
    compact: "border-2 border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-stone-200",
    navbar:
      "border-2 border-stone-200 text-stone-200 hover:bg-stone-200 hover:text-[#262626]",
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
