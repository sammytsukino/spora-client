import CyclingLogo from './cycling-logo';
import Grainient from '@/components/Grainient';
import { sporaLogos } from '@/data/logo-data';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-0 flex-1 flex overflow-hidden">
      <div className="relative w-[20vw] min-w-0 bg-[#e6e6e6] pl-6 md:pl-12 lg:pl-16">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#ff6b4a] opacity-60" />

        <div
          className="absolute bottom-0 left-6 md:left-12 lg:left-16 z-10 pb-4 md:pb-6 lg:pb-8"
          style={{ width: 'clamp(10rem, 40vw, 60rem)' }}
        >
          <div className="mb-3 flex items-center gap-2 w-full">
            <div className="font-bizud-mincho text-base md:text-lg lg:text-xl text-[#262626] leading-none whitespace-nowrap">
              not revolutionary
            </div>
            <div className="h-px bg-[#262626] flex-1 min-w-[40px]" />
            <div className="font-bizud-mincho text-base md:text-lg lg:text-xl text-[#262626] leading-none whitespace-nowrap">
              but evolutionary
            </div>
          </div>

          <div className="block leading-none" style={{ height: 'min(45vh, 420px)' }}>
            <CyclingLogo
              logos={sporaLogos}
              width="100%"
              height="100%"
              cycleDuration={0.2}
              className="leading-none h-full w-full"
            />
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-[80vw]">
        <Grainient
          color1={['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3']}
          color2={['#dd4aff', '#dd4aff', '#00dcff', '#f4ef40', '#ff64ff', '#52ff5a']}
          color3={['#00dcff', '#f4ef40', '#52ff5a', '#52ff5a', '#00dcff', '#ff64ff']}
          timeSpeed={3}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={1.5}
          warpAmplitude={40}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={400}
          noiseScale={2}
          grainAmount={0.12}
          grainScale={2}
          grainAnimated={false}
          contrast={1.6}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
    </div>
  );
}
