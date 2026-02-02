import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";

import Section from "@/components/Section";

export default function Background() {
  return (
    <div className="w-full overflow-x-hidden">


      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between"
      >
        <BubbleBackground
          interactive
          className="fixed inset-0 pointer-events-none z-0 w-screen h-screen"
        />

      </Section>
    </div>
  )
}