import React from "react"
import { cn } from "@/lib/utils"

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "compact" // compact para navbar (más pequeño, uppercase)
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
  const baseStyles = "border bg-transparent transition-colors font-jetbrains-mono"
  
  const variantStyles = {
    default: "border-black hover:bg-black hover:text-white",
    compact: "border-2 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200",
  }

  const sizeStyles = {
    sm: variant === "compact" 
      ? "px-5 py-1 text-[10px] sm:text-xs tracking-[0.3em] uppercase"
      : "px-4 py-2 text-sm sm:text-base",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
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
