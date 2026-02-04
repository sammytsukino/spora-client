import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";

export default function Background() {
  return (
    <div className="w-full overflow-x-hidden">
      <BubbleBackground interactive={true} className="absolute inset-0" />
    </div>
  )
}