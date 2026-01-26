import React from "react"
import { cn } from "@/lib/utils"

interface DeclarativeTextProps {
  children: React.ReactNode
  className?: string
  textColor?: string
  style?: React.CSSProperties
}

export default function DeclarativeText({
  children,
  className,
  textColor = "text-neutral-200",
  style,
}: DeclarativeTextProps) {
  return (
    <p
      className={cn(
        "font-bizud-mincho  -ml-23 -mr-23",
        textColor,
        className
      )}
      style={style}
    >
      {children}
    </p>
  )
}
