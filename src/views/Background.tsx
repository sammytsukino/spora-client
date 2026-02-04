//import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
//import Grainient from "@/components/Grainient";
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
//import Section from "@/components/Section";

export default function Background() {
  return (
    <div className="w-full overflow-x-hidden">

{/*
<Grainient 
  color1={['#f5f3ed', '#f5f3ed', '#f5f3ed', '#f5f3ed', '#f5f3ed']}
  color2={['#dd4aff', '#dd4aff', '#00dcff', '#ff64ff', '#bbf451']}
  color3={['#00dcff', '#f4ef40', '#bbf451', '#00dcff', '#ff64ff']}
  timeSpeed={1.45}
  colorBalance={0}
  warpStrength={1}
  warpFrequency={5}
  warpSpeed={2}
  warpAmplitude={50}
  blendAngle={0}
  blendSoftness={0.05}
  rotationAmount={500}
  noiseScale={2}
  grainAmount={0.1}
  grainScale={2}
  grainAnimated={false}
  contrast={1.5}
  gamma={1}
  saturation={1}
  centerX={0}
  centerY={0}
  zoom={0.9}
/>*/}

<BubbleBackground interactive={true} className="absolute inset-0" />
  
    </div>
  )
}