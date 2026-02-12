import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import PageTitle from "@/components/ui/PageTitle";
import FooterAlter from "@/components/home/FooterAlter";
import FloraCard from "@/components/garden/FloraCard";
import FilterTabs from "@/components/common/FilterTabs";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import EmptyState from "@/components/common/EmptyState";
import { generateFloraData, floraFilters, ITEMS_PER_PAGE, type FloraItem } from "@/data/flora-data";

const allFloras = generateFloraData(48);

export default function Garden() {
  const [activeFilter, setActiveFilter] = useState('All Units');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const navigate = useNavigate();

  const filteredFloras = activeFilter === 'All Units'
    ? allFloras
    : allFloras.filter(flora => flora.generation === activeFilter);

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

      if (scrollTop + windowHeight >= docHeight - 300) {
        loadMoreCards();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreCards]);

  const handleCardClick = (flora: FloraItem) => {
    navigate(`/flora/${encodeURIComponent(flora.id)}`, {
      state: { flora },
    });
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
    <div className="w-full overflow-x-hidden bg-[var(--spora-primary-light)]">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <div className="mb-6">
          <PageTitle
            supertitle="(01)GARDEN"
            title="OPEN FLORAS READY TO BE CUT"
            description="Create your own versions of these flora. Tweak them to your liking and create new ones."
          />
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="w-full border-b-2 border-[var(--spora-primary)]" />
          </div>

          <div className="flex items-center justify-end">
            <FilterTabs 
              filters={floraFilters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        <div className="border-l-2 border-t-2 border-[var(--spora-primary)]">
          {visibleFloras.length === 0 ? (
            <EmptyState
              title="No flora found"
              description="Try adjusting your filters to see more results."
            />
          ) : (
            <main className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-0">
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
                  onClick={() => handleCardClick(flora)}
                />
              ))}
            </main>
          )}
        </div>

        {visibleCount < filteredFloras.length && (
          <LoadingIndicator 
            current={visibleCount}
            total={filteredFloras.length}
          />
        )}
      </section>

      <FooterAlter />
    </div>
  );
}
