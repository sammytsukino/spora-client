import React from "react"
import { cn } from "@/lib/utils"

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "compact" | "navbar" // compact/navbar solo cambian colores/bordes, no tamaños
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
  // estilos base compartidos
  const baseStyles =
    "inline-flex items-center justify-center bg-transparent transition-colors font-jetbrains-mono cursor-pointer"

  // estilos por variante
  const variantStyles: Record<NonNullable<MainButtonProps["variant"]>, string> = {
    default: "border border-black text-neutral-900 hover:bg-black hover:text-white",
    compact: "border-2 border-neutral-800 text-neutral-900 hover:bg-neutral-800 hover:text-neutral-200",
    navbar:
      "border-2 border-neutral-300 text-neutral-300 hover:bg-neutral-200 hover:text-neutral-800",
  }

  // tamaños unificados: mismos paddings/tipografías para todos los variants
  const sizeStyles: Record<NonNullable<MainButtonProps["size"]>, string> = {
    // referencia: botón compacto de home.tsx (VIEW ALL, CREATE YOUR OWN)
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
