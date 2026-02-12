import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import PageTitle from "@/components/ui/PageTitle";
import FooterAlter from "@/components/home/FooterAlter";
import FilterTabs from "@/components/common/FilterTabs";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import EmptyState from "@/components/common/EmptyState";
import FeaturedFlora from "@/components/greenhouse/FeaturedFlora";
import GreenhouseFloraCard from "@/components/greenhouse/GreenhouseFloraCard";
import { generateFloraData, floraFilters, ITEMS_PER_PAGE, type FloraItem } from "@/data/flora-data";

const allFloras = generateFloraData(48);

export default function Greenhouse() {
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

  const visibleFloras = filteredFloras.slice(0, visibleCount);
  const [featured, ...restFloras] = visibleFloras;
  const sideFloras = restFloras.slice(0, 2);
  const remainingFloras = restFloras.slice(2);

  const handleCardClick = (flora: FloraItem) => {
    navigate(`/flora/${encodeURIComponent(flora.id)}`, {
      state: { flora },
    });
  };

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
        <PageTitle
          supertitle="(02)GREENHOUSE"
          title="DISCOVER TIMELESS ARTWORKS"
          description="Explore our curated collection of sealed flora, each piece a unique digital organism."
          className="mb-6"
        />

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
            <main>
              {featured && (
                <div className="grid lg:grid-cols-[2fr_1fr]">
                  <FeaturedFlora flora={featured} onClick={() => handleCardClick(featured)} />

                  <aside className="grid lg:grid-rows-2 md:grid-cols-2 lg:grid-cols-1">
                    {sideFloras.map((flora) => (
                      <GreenhouseFloraCard
                        key={flora.id}
                        flora={flora}
                        onClick={() => handleCardClick(flora)}
                      />
                    ))}
                  </aside>
                </div>
              )}

              {remainingFloras.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                  {remainingFloras.map((flora) => (
                    <GreenhouseFloraCard
                      key={flora.id}
                      flora={flora}
                      onClick={() => handleCardClick(flora)}
                    />
                  ))}
                </div>
              )}
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
