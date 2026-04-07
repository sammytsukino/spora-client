import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import PageTitle from "@/components/ui/PageTitle";
import FooterAlter from "@/components/layout/FooterAlter";
import GalleryFeedFilters, {
  type GalleryFeedScope,
} from "@/components/shared/GalleryFeedFilters";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import FeaturedFlora from "@/components/flora/FeaturedFlora";
import GreenhouseFloraCard from "@/components/flora/GreenhouseFloraCard";
import { floraFilters, ITEMS_PER_PAGE, floraImages } from "@/data/flora-data";
import { listFloras, type ApiFlora } from "@/lib/floras";
import { getStoredToken } from "@/lib/auth";
import { floraPath } from "@/constants/routes";
import { readerNavState } from "@/lib/floraViewBack";

interface UiFlora {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
  authorUsername?: string;
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
    image: flora.thumbnailUrl ?? floraImages[index % floraImages.length],
    title: flora.title,
    excerpt: flora.text?.slice(0, 140) || "",
    author,
    seed: formatSeed(flora),
    authorUsername: flora.isAuthorAnonymized ? undefined : flora.authorUsername,
  };
}

export default function Greenhouse() {
  const [searchParams] = useSearchParams();
  const authorId = searchParams.get("authorId") ?? undefined;
  const authorLabel = searchParams.get("username") ?? undefined;
  const isLoggedIn = !!getStoredToken();
  const showFollowingOption = isLoggedIn && !authorId;

  const [feedScope, setFeedScope] = useState<GalleryFeedScope>("all");
  const [activeGeneration, setActiveGeneration] = useState<string>(floraFilters[0]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [floras, setFloras] = useState<UiFlora[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const useFollowingFilter = feedScope === "following";

  useEffect(() => {
    if (!isLoggedIn) setFeedScope("all");
  }, [isLoggedIn]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [feedScope, activeGeneration, authorId]);

  useEffect(() => {
    if (useFollowingFilter && !isLoggedIn) return;
    let isActive = true;
    setIsLoading(true);
    setError(null);
    setVisibleCount(ITEMS_PER_PAGE);

    const params: Parameters<typeof listFloras>[0] = { status: "sealed" };
    if (authorId) params.authorId = authorId;
    if (useFollowingFilter && !authorId) params.followingOnly = true;

    listFloras(params)
      .then((data) => {
        if (!isActive) return;
        setFloras(data.map(mapFlora));
      })
      .catch((e) => {
        if (!isActive) return;
        if (e?.response?.status === 401) setError("Sign in to see Floras from people you follow.");
        else setError("Could not load Floras.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => { isActive = false; };
  }, [authorId, useFollowingFilter, isLoggedIn]);

  const filteredFloras = useMemo(() => {
    if (activeGeneration === "All Units") return floras;
    return floras.filter((flora) => flora.generation === activeGeneration);
  }, [activeGeneration, floras]);

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

  const handleCardClick = (flora: UiFlora) => {
    navigate(floraPath(flora.id), {
      state: { flora, ...readerNavState(location.pathname, location.search) },
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
    <div className="w-full overflow-x-hidden bg-spora-primary-light">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(02)GREENHOUSE"
          title={authorId ? `FLORAS BY ${authorLabel ?? "USER"}` : "SEALED FLORAS"}
          description={
            authorId
              ? "Sealed Floras by this Cultivator."
              : "The exhibition space for Sealed Floras—completed and finalized creations."
          }
          className="mb-8"
        />

        <div className="mb-8 w-full">
          <GalleryFeedFilters
            showFollowingOption={showFollowingOption}
            feedScope={feedScope}
            onFeedScopeChange={setFeedScope}
            generationFilters={floraFilters}
            activeGeneration={activeGeneration}
            onGenerationChange={setActiveGeneration}
          />
        </div>

        <div>
          {isLoading && floras.length === 0 ? (
            <LoadingIndicator
              current={0}
              total={1}
              message="LOADING SEALED FLORAS..."
            />
          ) : error ? (
            <EmptyState
              title="Could not load Floras"
              description={error}
            />
          ) : visibleFloras.length === 0 ? (
            <EmptyState
              title={
                useFollowingFilter && !authorId
                  ? "No Floras from people you follow"
                  : "No Flora found"
              }
              description={
                useFollowingFilter && !authorId
                  ? "Follow cultivators from the Garden or Greenhouse to fill your feed."
                  : "Try adjusting your filters to see more results."
              }
            />
          ) : (
            <main className="flex flex-col gap-6">
              {featured && (
                <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                      <FeaturedFlora flora={featured} onClick={() => handleCardClick(featured)} />

                  <aside className="grid lg:grid-rows-2 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {sideFloras.map((flora) => (
                      <GreenhouseFloraCard
                        key={flora.id}
                        flora={flora}
                        authorUsername={flora.authorUsername}
                        onClick={() => handleCardClick(flora)}
                      />
                    ))}
                  </aside>
                </div>
              )}

              {remainingFloras.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {remainingFloras.map((flora) => (
                    <GreenhouseFloraCard
                      key={flora.id}
                      flora={flora}
                      authorUsername={flora.authorUsername}
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
