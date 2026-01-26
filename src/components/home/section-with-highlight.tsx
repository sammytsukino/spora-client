import { useRef } from 'react'
import TextHighlighter, { type TextHighlighterRef } from '@/components/fancy/text/text-highlighter'

interface SectionWithHighlightProps {
  children: React.ReactNode
  highlightColor?: string
  className?: string
}

export default function SectionWithHighlight({
  children,
  highlightColor = "hsl(25, 90%, 80%)",
  className = "bg-neutral-800 flex items-center justify-center h-full",
}: SectionWithHighlightProps) {
  const highlightRef = useRef<TextHighlighterRef>(null)

  const handleMouseEnter = () => {
    highlightRef.current?.animate()
  }

  const handleMouseLeave = () => {
    highlightRef.current?.reset()
  }

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TextHighlighter
        ref={highlightRef}
        triggerType="ref"
        highlightColor={highlightColor}
      >
        {children}
      </TextHighlighter>
    </div>
  )
}
