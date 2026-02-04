import CyclingLogo from './cycling-logo';
import Grainient from '@/components/Grainient';
import { sporaLogos } from '@/data/logo-data';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-0 flex-1 flex overflow-hidden">
      {/* Sección izquierda - 20vw con fondo #e6e6e6 */}
      <div className="relative w-[20vw] min-w-0 bg-[#e6e6e6] pl-6 md:pl-12 lg:pl-16">
        {/* Línea vertical delgada en el borde izquierdo */}


        {/* Contenedor pegado al fondo. Para cambiar tamaño: width (abajo), texto (text-base/lg/xl), logo (height en el div del CyclingLogo) */}
        <div
          className="absolute bottom-0 left-6 md:left-12 lg:left-16 z-10 pb-4 md:pb-6 lg:pb-8"
          style={{ width: 'clamp(10rem, 40vw, 60rem)' }}
        >
          {/* Texto arriba del logo — tamaño: text-base / text-lg / text-xl / text-2xl */}
          <div className="mb-3 flex items-center gap-2 w-full">
            <div className="font-bizud-mincho text-base md:text-lg lg:text-xl text-[#262626] leading-none whitespace-nowrap">
              not revolutionary
            </div>
            <div className="h-px bg-[#262626] flex-1 min-w-[40px]" />
            <div className="font-bizud-mincho text-base md:text-lg lg:text-xl text-[#262626] leading-none whitespace-nowrap">
              but evolutionary
            </div>
          </div>

          {/* CyclingLogo — tamaño: cambia height (ej. 45vh, 500px) */}
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

      {/* Sección derecha - 80vw con Grainient */}
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
