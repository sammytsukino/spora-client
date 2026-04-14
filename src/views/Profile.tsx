import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import ProfileSocial from "@/components/profile/ProfileSocial";
import ProfileDangerZone from "@/components/profile/ProfileDangerZone";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import FilterTabs from "@/components/shared/FilterTabs";
import FloraCard from "@/components/flora/FloraCard";
import {
  profileGalleryFilters,
  defaultProfileUser,
  defaultProfileMetrics,
  defaultProfileSocial,
  defaultProfileDangerZone,
  getDefaultProfileFloras,
  type ProfileUser,
  type ProfileFloraItem,
  type ProfileMetricsData,
  type ProfileSocialData,
  type ProfileDangerZoneConfig,
  type ProfileSocialInteraction,
} from "@/data/profile-data";
import { getStoredToken, logout } from "@/lib/auth";
import { fetchProfileData, unsignMyAccount } from "@/lib/profileApi";
import { ROUTES, floraPath, profileFollowersPath, profileFollowingPath } from "@/constants/routes";
import { readerNavState } from "@/lib/floraViewBack";

export interface ProfileViewProps {
  user?: ProfileUser;
  userFloras?: ProfileFloraItem[];
  metrics?: ProfileMetricsData;
  social?: ProfileSocialData;
  dangerZone?: Partial<ProfileDangerZoneConfig>;
  onEdit?: () => void;
  onUnsign?: () => void;
  onCardClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onInteractionClick?: (interaction: ProfileSocialInteraction) => void;
}

export default function Profile({
  user: propUser,
  userFloras: propFloras,
  metrics: propMetrics,
  social: propSocial,
  dangerZone,
  onEdit,
  onUnsign,
  onCardClick,
  onFollowersClick,
  onFollowingClick,
  onInteractionClick,
}: ProfileViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>(profileGalleryFilters[0]);
  const [user, setUser] = useState<ProfileUser>(defaultProfileUser);
  const [userFloras, setUserFloras] = useState<ProfileFloraItem[]>(getDefaultProfileFloras());
  const [metrics, setMetrics] = useState<ProfileMetricsData>(defaultProfileMetrics);
  const [social, setSocial] = useState<ProfileSocialData>(defaultProfileSocial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [unsigning, setUnsigning] = useState(false);

  const loadProfile = async () => {
    const data = await fetchProfileData();
    setUser(data.user);
    setUserFloras(data.floras);
    setMetrics(data.metrics);
    setSocial(data.social);
  };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate(ROUTES.SIGN_IN, { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfileData();
        if (!cancelled) {
          setUser(data.user);
          setUserFloras(data.floras);
          setMetrics(data.metrics);
          setSocial(data.social);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e && typeof e === "object" && "response" in e
            ? (e as { response?: { status?: number } }).response?.status === 401
              ? "Session expired"
              : "Error loading profile"
            : "Error loading profile";
          setError(msg);
          if ((e as { response?: { status?: number } }).response?.status === 401) {
            navigate(ROUTES.SIGN_IN, { replace: true });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const effectiveUser = propUser ?? user;
  const effectiveFloras = propFloras ?? userFloras;
  const effectiveMetrics = propMetrics ?? metrics;
  const effectiveSocial = propSocial ?? social;

  const filteredFloras =
    activeFilter === "SHOW ALL"
      ? effectiveFloras
      : effectiveFloras.filter((f) => f.status === activeFilter);

  const dangerZoneConfig = { ...defaultProfileDangerZone, ...dangerZone };

  const handleUnsign = async () => {
    try {
      setUnsigning(true);
      await unsignMyAccount();
      await logout();
      navigate(ROUTES.SIGN_IN, { replace: true });
    } catch (e) {
      setUnsigning(false);
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { status?: number; data?: { message?: string } } }).response?.data?.message ||
            (e as { response?: { status?: number } }).response?.status === 401
            ? "Session expired"
            : "Could not unsign"
          : "Could not unsign";
      setError(msg);
    }
  };

  const handleCardClick = (floraId: string) => {
    if (onCardClick) {
      onCardClick();
    } else {
      navigate(floraPath(floraId), {
        state: readerNavState(location.pathname, location.search),
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden bg-spora-primary-light min-h-screen flex items-center justify-center">
        <TransparentNavbar showScrollBackground />
        <p className="font-supply-mono text-sm uppercase">Loading profile…</p>
      </div>
    );
  }

  if (error && !getStoredToken()) {
    return null;
  }

  if (error) {
    return (
      <div className="w-full overflow-x-hidden bg-spora-primary-light min-h-screen">
        <TransparentNavbar showScrollBackground />
        <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
          <p className="font-supply-mono text-sm text-rose-500 uppercase">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-spora-primary-light">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
        <ProfileHeader
          user={effectiveUser}
          followersCount={effectiveSocial.followersCount}
          followingCount={effectiveSocial.followingCount}
          onEdit={onEdit ?? (() => setEditOpen(true))}
          onFollowersClick={
            onFollowersClick ??
            (() => navigate(profileFollowersPath(String(effectiveUser.username))))
          }
          onFollowingClick={
            onFollowingClick ??
            (() => navigate(profileFollowingPath(String(effectiveUser.username))))
          }
        />
        {editOpen && (
          <ProfileEditModal
            user={effectiveUser}
            onClose={() => setEditOpen(false)}
            onSaved={loadProfile}
          />
        )}

        <div className="mt-6">
          <ProfileMetrics metrics={effectiveMetrics} />
        </div>

        <div className="mt-10">
          <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="shrink-0 font-supply-mono text-sm font-bold uppercase">
              My Floras
            </h2>
            <div className="flex w-full min-w-0 justify-end sm:w-auto">
              <FilterTabs
                filters={[...profileGalleryFilters]}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>
          <div>
            <main className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
              {filteredFloras.map((flora) => (
                <FloraCard
                  key={flora.id}
                  id={flora.id}
                  generation={flora.generation}
                  image={flora.image}
                  title={flora.title}
                  excerpt={flora.excerpt}
                  author={flora.author}
                  seed={flora.seed}
                  onClick={() => handleCardClick(flora.id)}
                />
              ))}
            </main>
          </div>
        </div>

        <div className="mt-10">
          <ProfileSocial
            social={effectiveSocial}
            showFollowCounts={false}
            onInteractionClick={onInteractionClick}
          />
        </div>

        <div className="mt-10">
          <ProfileDangerZone
            {...dangerZoneConfig}
            confirmationWord={effectiveUser.username}
            onUnsign={onUnsign ?? handleUnsign}
            unsigning={unsigning}
          />
        </div>
      </section>

      <FooterAlter />
    </div>
  );
}
