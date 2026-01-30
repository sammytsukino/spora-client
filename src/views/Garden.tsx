import { useEffect, useState, useCallback } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import PageTitle from "@/components/ui/page-title";
import FloraCard from "@/components/garden/flora-card";
import FooterAlter from "@/components/home/footer-alter";

const floraImages = [
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532656/img-18_djc6db.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-17_e6uarr.png",
];

// Generate 36 cards by cycling through the available images
const allCards = Array.from({ length: 36 }, (_, i) => ({
  image: floraImages[i % floraImages.length],
  title: "Estoy solo",
  subtitle: "Lloro porque no siento nada, y ahora...",
  author: "@FranBarreno",
  generation: "Gen0",
}));

const INITIAL_CARDS = 6;
const CARDS_PER_LOAD = 3;

export default function Garden() {
  const [visibleCards, setVisibleCards] = useState(INITIAL_CARDS);

  const loadMoreCards = useCallback(() => {
    if (visibleCards < allCards.length) {
      setVisibleCards((prev) => Math.min(prev + CARDS_PER_LOAD, allCards.length));
    }
  }, [visibleCards]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Load more when user is near the bottom (200px threshold)
      if (scrollTop + windowHeight >= docHeight - 200) {
        loadMoreCards();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreCards]);

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9] flex flex-col">
      <TransparentNavbar showScrollBackground />

      {/* Hero Section - Full viewport with 3x2 grid */}
      <section className="h-screen flex flex-col pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(01)GARDEN"
          title={`Open Floras\nready to be\ncut`}
          className="shrink-0"
        />

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 md:grid-rows-2 lg:grid-rows-2 gap-10">
          {allCards.slice(0, INITIAL_CARDS).map((card, index) => (
            <FloraCard
              key={`initial-${index}`}
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
              author={card.author}
              generation={card.generation}
              flexible
            />
          ))}
        </div>
      </section>

      {/* Gallery Section - Loads more on scroll */}
      {visibleCards > INITIAL_CARDS && (
        <section className="px-6 md:px-12 lg:px-16 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ gridAutoRows: 'calc((100vh - 5rem - 12rem - 1rem - 1.5rem) / 2)' }}>
            {allCards.slice(INITIAL_CARDS, visibleCards).map((card, index) => (
              <FloraCard
                key={`extra-${index}`}
                image={card.image}
                title={card.title}
                subtitle={card.subtitle}
                author={card.author}
                generation={card.generation}
                flexible
              />
            ))}
          </div>
        </section>
      )}

      <FooterAlter />
    </div>
  )
}
