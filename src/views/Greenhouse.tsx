import { useState, useEffect, useCallback } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import PageTitle from "@/components/ui/page-title";
import FooterAlter from "@/components/home/footer-alter";

const floraImages = [
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532656/img-18_djc6db.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-17_e6uarr.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-16_gf9k7x.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-15_wpwz9h.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-14_gbx118.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-13_qncmyd.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532651/img-12_swbm8v.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-11_la2ekj.png",
];

const excerpts = [
  'Lloro porque no siento nada, y ahora además de triste me siento un farsante',
  'En el silencio encuentro voces que nunca existieron',
  'Las palabras se desvanecen como humo entre mis dedos',
  'Cada letra es una semilla que germina en la oscuridad',
  'La soledad no es estar solo, es sentirse vacío',
  'Mis pensamientos son fractales que se repiten infinitamente',
  'El eco de tu ausencia resuena en cada rincón',
  'Construyo mundos con palabras que nadie leerá',
  'La melancolía tiene el color de la lluvia en noviembre',
  'Soy un algoritmo buscando el sentido en el caos',
  'Las heridas del alma no sangran, pero duelen igual',
  'En cada verso planto un jardín de emociones muertas',
];

const allFloras = Array.from({ length: 48 }, (_, i) => ({
  id: `FLR/${String(i + 1).padStart(3, '0')}`,
  generation: i < 16 ? 'GEN_0' : i < 32 ? 'GEN_1' : 'GEN_2',
  image: floraImages[i % floraImages.length],
  title: ['VOID ECHO', 'NEURAL FERN', 'PIXEL BLOOM', 'DATA MOSS', 'CODE SPORE', 'BYTE LOTUS'][i % 6],
  excerpt: excerpts[i % excerpts.length],
  author: '@' + ['FranBarreno', 'SporaLab', 'GenArtist', 'FloraGen'][i % 4],
  seed: `#${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
}));

type FloraItem = (typeof allFloras)[number];

function FeaturedFlora({ flora }: { flora: FloraItem }) {
  return (
    <section className="group bg-[#E9E9E9] p-6 md:p-8 lg:p-10 flex flex-col relative transition-colors duration-300 cursor-pointer hover:bg-lime-300 border-r-2 border-b-2 border-black">
      <div className="absolute top-6 right-6 z-5 bg-black text-lime-300 font-jetbrains-mono text-[9px] md:text-xs px-2.5 py-1 uppercase tracking-[0.18em]">
        S-TIER // FEATURED
      </div>
      <div
        className="w-full overflow-hidden mb-6 border-2 border-black"
        style={{ aspectRatio: "4 / 5" }}
      >
        <img
          src={flora.image}
          alt={flora.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "grayscale(0%) contrast(110%)"
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "grayscale(100%) contrast(120%)"
            e.currentTarget.style.transform = "scale(1)"
          }}
        />
      </div>
      <div>
        <h2 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-[0.9] uppercase tracking-tight mb-3 text-neutral-900">
          {flora.title}
        </h2>
        <p className="font-jetbrains-mono text-[11px] md:text-xs italic opacity-90 line-clamp-2 mb-3">
          "{flora.excerpt}"
        </p>
        <div className="grid grid-cols-3 border-t border-black pt-2 font-jetbrains-mono text-[10px] md:text-xs">
          <span>ID: {flora.id}</span>
          <span>GEN: {flora.generation}</span>
          <span>SEED: {flora.seed}</span>
        </div>
      </div>
    </section>
  );
}

function GreenhouseFloraCard({ flora }: { flora: FloraItem }) {
  return (
    <article className="group bg-[#E9E9E9] p-4 md:p-5 flex flex-col relative transition-colors duration-200 cursor-pointer hover:bg-lime-300 border-r-2 border-b-2 border-black">
      <div className="flex justify-between items-start mb-4">
        <span className="font-jetbrains-mono text-[10px]">{flora.id}</span>
        <span className="font-jetbrains-mono text-[9px] border-2 border-black px-1.5 py-0.5 uppercase">
          {flora.generation}
        </span>
      </div>
      <div
        className="mb-3 overflow-hidden border-2 border-black"
        style={{ aspectRatio: "4 / 5" }}
      >
        <img
          src={flora.image}
          alt={flora.title}
          className="w-full h-full object-cover transition-all duration-600 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          style={{
            filter: "grayscale(100%) contrast(120%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "grayscale(0%) contrast(110%)"
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "grayscale(100%) contrast(120%)"
            e.currentTarget.style.transform = "scale(1)"
          }}
        />
      </div>
      <h3 className="font-bizud-mincho-bold text-lg md:text-xl leading-tight uppercase mb-1 text-neutral-900">
        {flora.title}
      </h3>
      <p className="font-jetbrains-mono text-[9px] md:text-[10px] italic opacity-90 line-clamp-2 mb-1">
        "{flora.excerpt}"
      </p>
      <div className="flex justify-between font-jetbrains-mono text-[9px] md:text-[10px] opacity-75 mt-1">
        <span>{flora.author}</span>
        <span>{flora.seed}</span>
      </div>
    </article>
  );
}

const filters = ['All Units', 'GEN_0', 'GEN_1', 'GEN_2'];
const ITEMS_PER_PAGE = 12;

export default function Greenhouse() {
  const [activeFilter, setActiveFilter] = useState('All Units');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filtrar las floras según el filtro activo
  const filteredFloras = activeFilter === 'All Units'
    ? allFloras
    : allFloras.filter(flora => flora.generation === activeFilter);

  // Cargar más cards al hacer scroll
  const loadMoreCards = useCallback(() => {
    if (visibleCount < filteredFloras.length) {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredFloras.length));
    }
  }, [visibleCount, filteredFloras.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Cargar más cuando el usuario está cerca del final (300px antes)
      if (scrollTop + windowHeight >= docHeight - 300) {
        loadMoreCards();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreCards]);

  const visibleFloras = filteredFloras.slice(0, visibleCount);
  const [featured, ...restFloras] = visibleFloras;
  const sideFloras = restFloras.slice(0, 2);
  const remainingFloras = restFloras.slice(2);

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      {/* Header Section */}
      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(02)GREENHOUSE"
          title="DISCOVER TIMELESS ARTWORKS"
          description="Explore our curated collection of sealed flora, each piece a unique digital organism."
          className="mb-6"
        />

        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Línea negra a todo el ancho hacia la izquierda */}
          <div className="flex-1">
            <div className="w-full border-b-2 border-black" />
          </div>

          {/* Botones de paginación / filtro */}
          <div className="flex items-center justify-end">
            <div className="filter-tabs flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`font-jetbrains-mono text-[11px] px-3 py-1 border-2 border-black uppercase transition-colors ${activeFilter === filter
                      ? 'bg-black text-lime-300'
                      : 'bg-transparent text-black hover:bg-black/10'
                    }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured + gallery grid inspirado en el layout dado */}
        <div className="border-l-2 border-t-2 border-black">
          <main>
            {/* Fila principal: featured + dos secundarias */}
            {featured && (
              <div className="grid lg:grid-cols-[2fr_1fr]">
                <FeaturedFlora flora={featured} />

                <aside className="grid lg:grid-rows-2 md:grid-cols-2 lg:grid-cols-1">
                  {sideFloras.map((flora) => (
                    <GreenhouseFloraCard key={flora.id} flora={flora} />
                  ))}
                </aside>
              </div>
            )}

            {/* Resto de floras en grid */}
            {remainingFloras.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4">
                {remainingFloras.map((flora) => (
                  <GreenhouseFloraCard key={flora.id} flora={flora} />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Loading indicator */}
        {visibleCount < filteredFloras.length && (
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-2 font-jetbrains-mono text-xs text-gray-500">
              <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse" />
              LOADING MORE... ({visibleCount} / {filteredFloras.length})
            </div>
          </div>
        )}
      </section>

      {/* Floating Action Button 
      <button
        className="fixed bottom-10 right-10 w-10 h-10 bg-black text-lime-300  flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>*/}

      <FooterAlter />
    </div>
  );
}
