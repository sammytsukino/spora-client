import CyclingLogo from './cycling-logo';
//import Grainient from '@/components/Grainient';
import { sporaLogos } from '@/data/logo-data';
import { MeshGradient } from '@paper-design/shaders-react';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-0 flex-1 flex overflow-hidden">
      <div className="relative w-[20vw] min-w-0 bg-[var(--spora-primary-lightest)] pl-6 md:pl-12 lg:pl-16">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--spora-accent)] opacity-60" />

        <div
          className="absolute bottom-0 left-6 md:left-12 lg:left-16 z-10 pb-4 md:pb-6 lg:pb-8"
          style={{ width: 'clamp(10rem, 40vw, 60rem)' }}
        >
          <div className="mb-4 flex items-center gap-3 w-full">
            <div className="font-bizud-mincho text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
              not revolutionary
            </div>
            <div className="h-px bg-[var(--spora-primary)] flex-1 min-w-[40px]" />
            <div className="font-bizud-mincho text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
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
      <MeshGradient speed={1} scale={1} distortion={0.8} swirl={0.1} colors={['#CAFF50', '#FF64FF', '#F4EF40', '#52FF5A', '#00DCFF', '#DD4AFF', '#EDEDED']} style={{ height: '100%', width: '100%' }}
      />
      </div>
    </div>
  );
}
