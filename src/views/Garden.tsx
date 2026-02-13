import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import PageTitle from "@/components/ui/PageTitle";
import FooterAlter from "@/components/home/FooterAlter";
import FloraCard from "@/components/garden/FloraCard";
import FilterTabs from "@/components/common/FilterTabs";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import EmptyState from "@/components/common/EmptyState";
import { floraFilters, ITEMS_PER_PAGE, floraImages } from "@/data/flora-data";
import { listFloras, type ApiFlora } from "@/lib/floras";

interface UiFlora {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
}

function formatGeneration(value?: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `GEN_${safe}`;
}

function formatSeed(flora: ApiFlora) {
  const seedSource = flora.generative?.soilId || flora.generative?.soilName || flora._id;
  return `#${seedSource.slice(-6).toUpperCase()}`;
}

function mapFlora(flora: ApiFlora, index: number): UiFlora {
  const author = flora.authorUsername
    ? flora.authorUsername.startsWith("@")
      ? flora.authorUsername
      : `@${flora.authorUsername}`
    : "@Anonymous";

  return {
    id: flora._id,
    generation: formatGeneration(flora.lineage?.generation),
    image: floraImages[index % floraImages.length],
    title: flora.title,
    excerpt: flora.text?.slice(0, 140) || "",
    author,
    seed: formatSeed(flora),
  };
}

export default function Garden() {
  const [activeFilter, setActiveFilter] = useState('All Units');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [floras, setFloras] = useState<UiFlora[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);

    listFloras({ status: "blossoming" })
      .then((data) => {
        if (!isActive) return;
        setFloras(data.map(mapFlora));
      })
      .catch(() => {
        if (!isActive) return;
        setError("Could not load floras.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredFloras = useMemo(() => {
    return activeFilter === 'All Units'
      ? floras
      : floras.filter(flora => flora.generation === activeFilter);
  }, [activeFilter, floras]);

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

  const handleCardClick = (flora: UiFlora) => {
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
          {isLoading && floras.length === 0 ? (
            <LoadingIndicator
              current={0}
              total={1}
              message="LOADING FLORAS..."
            />
          ) : error ? (
            <EmptyState
              title="Could not load floras"
              description={error}
            />
          ) : visibleFloras.length === 0 ? (
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
