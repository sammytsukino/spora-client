import CyclingLogo from './cycling-logo';
import ImageTrail from './image-trail';
import { sporaLogos } from '@/data/logo-data';

export default function HeroSection() {
  return (
    <>
      <div className="absolute inset-0 z-10">
        <ImageTrail />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center gap-20 w-full h-full pointer-events-none">
        <p className="font-bizud-mincho-bold text-base sm:text-lg md:text-xl tracking-wide mb-2">
          not revolutionary
        </p>

        <CyclingLogo
          logos={sporaLogos}
          width="50vw"
          height="10vw"
          cycleDuration={0.2}
        />

        <p className="font-bizud-mincho-bold text-base sm:text-lg md:text-xl tracking-wide mt-2">
          but evolutionary
        </p>
      </div>
    </>
  );
}
