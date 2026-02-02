import { useState, useEffect, useCallback } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import PageTitle from "@/components/ui/page-title";
import FooterAlter from "@/components/home/footer-alter";
import FloraCard from "@/components/garden/flora-card";

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

const filters = ['All Units', 'GEN_0', 'GEN_1', 'GEN_2'];
const ITEMS_PER_PAGE = 12;

export default function Garden() {
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

  const handleCardClick = () => {
    // Card click interaction
  };

  const visibleFloras = filteredFloras.slice(0, visibleCount);

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
        <div className="mb-6">
          <PageTitle
            supertitle="(01)GARDEN"
            title="OPEN FLORAS READY TO BE CUT"
            description="Create your own versions of these flora. Tweak them to your liking and create new ones."
          />
        </div>

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

        {/* Flora Grid con auto-fill y wrapper con borde negro */}
        <div className="border-l-2 border-t-2 border-black">
          <main className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
            {visibleFloras.map((flora) => (
              <FloraCard
                key={flora.id}
                id={flora.id}
                generation={flora.generation}
                image={flora.image}
                title={flora.title}
                excerpt={flora.excerpt}
                author={flora.author}
                seed={flora.seed}
                onClick={handleCardClick}
              />
            ))}
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
