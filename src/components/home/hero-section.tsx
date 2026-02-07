import CyclingLogo from './cycling-logo';
//import Grainient from '@/components/Grainient';
import { sporaLogos } from '@/data/logo-data';
import { MeshGradient } from '@paper-design/shaders-react';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-0 flex-1 flex flex-col md:flex-row overflow-hidden">
      <div className="relative w-full md:w-[20vw] min-w-0 bg-[var(--spora-primary-lightest)] px-5 sm:px-6 md:pl-12 md:pr-0 lg:pl-16">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--spora-accent)] opacity-60 hidden md:block" />

        <div className="relative z-10 pt-16 pb-5 sm:pt-16 sm:pb-6 md:py-0 md:absolute md:bottom-0 md:left-12 lg:left-16 md:pb-6 lg:pb-8" style={{ width: '100%' }}>
          <div className="mb-4 sm:mb-5 md:mb-8 lg:mb-16 hidden sm:flex items-center gap-4 sm:gap-6 md:gap-10 w-full">
            <div className="font-bizud-mincho text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
              not revolutionary
            </div>
            <div className="h-px bg-[var(--spora-primary)] flex-1 min-w-[24px]" />
            <div className="font-bizud-mincho text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--spora-primary)] leading-tight whitespace-nowrap">
              but evolutionary
            </div>
          </div>

          <div className="block leading-none mt-2 sm:mt-3 md:mt-4">
            <CyclingLogo
              logos={sporaLogos}
              width="100%"
              height="auto"
              aspectRatio="10 / 3"
              cycleDuration={0.5}
              overlapDuration={0.07}
              className="leading-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full md:w-[80vw] min-h-[48vh] md:min-h-0">
        <MeshGradient
          speed={1}
          scale={1}
          distortion={0.8}
          swirl={0.1}
          colors={['#CAFF50', '#FF64FF', '#F4EF40', '#52FF5A', '#00DCFF', '#DD4AFF', '#EDEDED']}
          style={{ height: '100%', width: '100%' }}
        />

        <div className="absolute inset-0 p-5 sm:p-6 md:p-0">
          <div className="md:absolute md:right-12 lg:right-16 md:top-20 lg:top-24 md:text-right">
            <p className="font-supply-mono text-sm sm:text-[15px] md:text-base lg:text-[16px] leading-relaxed text-[var(--spora-primary)] max-w-[40ch] md:max-w-[44ch] md:ml-auto">
              Generative art for everyone. A canvas for the smallest thing we share: our words. Words blooming into singular works that live, branch, and grow.
            </p>
          </div>

          <div className="mt-4 md:mt-0 md:absolute md:right-12 lg:right-16 md:bottom-6 lg:bottom-8 md:text-right">
            <button
              type="button"
              className="font-supply-mono text-sm sm:text-[15px] md:text-base lg:text-[16px] text-[var(--spora-primary)] hover:underline hover:cursor-pointer"
            >
              next flora →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
