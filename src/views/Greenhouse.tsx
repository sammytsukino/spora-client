import { useEffect, useState, useCallback } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";
import FloraCardMaxi from "@/components/greenhouse/flora-card-maxi";
import FloraCardMini from "@/components/greenhouse/flora-card-mini";
import PageTitle from "@/components/ui/page-title";

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
  title: "Her kind",
  author: "@AnneSexton",
  date: "21/11/2025",
}));

const INITIAL_CARDS = 6;
const CARDS_PER_LOAD = 6;

export default function Greenhouse() {
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
    <div className="w-full overflow-x-hidden flex flex-col bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      {/* Hero Section - Full viewport */}
      <section className="h-screen flex flex-col justify-between gap-10 pt-20 px-6 md:px-12 lg:px-16">
        {/* Featured Flora - Maxi Card with Page Title overlay */}
        <div className="relative flex-1 min-h-0">
          {/* Page Title overlay */}
          <PageTitle
            supertitle="(02)GREENHOUSE"
            title={`Discover\ntimeless\nartworks`}
            className="absolute top-6 left-6 z-10 mb-0"
          />
          {/* Flora of the Week badge */}
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769773842/Group_108_camvi9.svg"
            alt="Flora of the Week"
            className="absolute top-6 right-6 z-10 w-24 md:w-32 lg:w-36"
          />
          <FloraCardMaxi
            image={floraImages[0]}
            title="Her kind"
            author="@AnneSexton"
            date="21/11/2025"
            className="h-full"
          />
        </div>

        {/* Initial Mini Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 shrink-0 pb-10">
          {allCards.slice(0, INITIAL_CARDS).map((card, index) => (
            <FloraCardMini
              key={`initial-${index}`}
              image={card.image}
              title={card.title}
              author={card.author}
              date={card.date}
            />
          ))}
        </div>
      </section>

      {/* Gallery Section - Loads more on scroll */}
      {visibleCards > INITIAL_CARDS && (
        <section className="px-6 lg:px-16 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
            {allCards.slice(INITIAL_CARDS, visibleCards).map((card, index) => (
              <FloraCardMini
                key={`extra-${index}`}
                image={card.image}
                title={card.title}
                author={card.author}
                date={card.date}
              />
            ))}
          </div>
        </section>
      )}

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}
