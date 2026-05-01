import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import FloraCard from "@/components/flora/FloraCard";
import FilterTabs from "@/components/shared/FilterTabs";
import FollowButton from "@/components/profile/FollowButton";
import { getUserByUsername, type PublicUser } from "@/lib/usersApi";
import { listFloras, type ApiFlora } from "@/lib/floras";
import { api } from "@/lib/api";
import { floraFilters, floraImages, ITEMS_PER_PAGE } from "@/data/flora-data";
import { getStoredToken } from "@/lib/auth";
import { ROUTES, floraPath, profileFollowersPath, profileFollowingPath } from "@/constants/routes";
import { readerNavState } from "@/lib/floraViewBack";
import MainButton from "@/components/ui/MainButton";
import { DEFAULT_PROFILE_AVATAR_URL } from "@/data/profile-data";

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
  return `GEN_${Number.isFinite(value) ? value : 0}`;
}

function formatSeed(flora: ApiFlora) {
  const seedSource = flora.generative?.soilId || flora.generative?.soilName || flora._id;
  return `#${String(seedSource).slice(-6).toUpperCase()}`;
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
  };
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [followDelta, setFollowDelta] = useState(0);
  const [floras, setFloras] = useState<UiFlora[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("SHOW ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const isLoggedIn = !!getStoredToken();

  useEffect(() => {
    if (!username) {
      navigate(ROUTES.PROFILE, { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getStoredToken();
        const [publicUser, meRes] = await Promise.all([
          getUserByUsername(username),
          token ? api.get<{ id: string }>("/auth/me").catch(() => null) : null,
        ]);
        if (cancelled) return;
        if (meRes?.data?.id === publicUser.id) {
          navigate(ROUTES.PROFILE, { replace: true });
          return;
        }
        setUser(publicUser);
        const florasData = await listFloras({ authorId: publicUser.id });
        if (!cancelled) setFloras(florasData.map(mapFlora));
      } catch {
        if (!cancelled) setError("Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username, navigate]);

  const filteredFloras =
    activeFilter === "SHOW ALL"
      ? floras
      : floras.filter((f) => f.generation === activeFilter);
  const visibleFloras = filteredFloras.slice(0, visibleCount);

  const handleCardClick = (flora: UiFlora) => {
    navigate(floraPath(flora.id), {
      state: { flora, ...readerNavState(location.pathname, location.search) },
    });
  };

  if (!username) return null;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main id="main-content" className="pt-24 px-6">
          <p className="font-supply-mono text-sm text-spora-primary">Loading…</p>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full min-h-screen bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main id="main-content" className="pt-24 px-6">
          <p className="font-supply-mono text-sm text-rose-500">{error || "User not found."}</p>
        </main>
      </div>
    );
  }

  const statusFilters = ["SHOW ALL", ...floraFilters.slice(1)];

  return (
    <div className="w-full overflow-x-hidden bg-spora-primary-light">
      <TransparentNavbar showScrollBackground />
      <main id="main-content" className="pt-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
        <h1 className="sr-only">Profile of {user.username}</h1>
        <header className="border border-spora-primary bg-spora-primary-light p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <img
            src={user.avatar || DEFAULT_PROFILE_AVATAR_URL}
            alt={user.displayName || user.username}
            className="w-24 h-24 rounded-full object-cover border border-spora-primary shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-supply-mono text-lg font-bold">@{user.username}</p>
            <p className="font-supply-mono text-sm text-spora-text-primary/80">{user.displayName || user.username}</p>
            {user.bio && <p className="font-supply-mono text-sm italic mt-1">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 font-supply-mono text-[11px] opacity-90">
              <span>{floras.length} Floras</span>
              <span className="opacity-50">·</span>
              <button
                type="button"
                onClick={() => navigate(profileFollowersPath(username))}
                className="hover:underline focus:underline"
              >
                <strong>{user.followersCount + followDelta}</strong> followers
              </button>
              <span className="opacity-50">·</span>
              <button
                type="button"
                onClick={() => navigate(profileFollowingPath(username))}
                className="hover:underline focus:underline"
              >
                <strong>{user.followingCount}</strong> following
              </button>
            </div>
          </div>
          {isLoggedIn && (
            <FollowButton
              userId={user.id}
              onFollowChange={(following) => setFollowDelta(following ? 1 : -1)}
            />
          )}
        </header>

        <div className="mt-6">
          <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="shrink-0 font-supply-mono text-sm font-bold uppercase">Floras</h2>
            <div className="flex w-full min-w-0 justify-end sm:w-auto">
              <FilterTabs
                filters={statusFilters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>
          {floras.length === 0 ? (
            <p className="font-supply-mono text-sm text-spora-primary opacity-80">
              No Floras yet.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
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
                  authorUsername={user.username}
                  onClick={() => handleCardClick(flora)}
                />
              ))}
            </div>
          )}
          {visibleCount < filteredFloras.length && (
            <MainButton
              type="button"
              variant="compact"
              size="sm"
              className="mt-6"
              onClick={() => setVisibleCount((v) => Math.min(v + ITEMS_PER_PAGE, filteredFloras.length))}
            >
              Load more
            </MainButton>
          )}
        </div>
      </main>
      <FooterAlter />
    </div>
  );
}
