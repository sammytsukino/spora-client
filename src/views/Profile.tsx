import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getStoredToken, clearSession } from "@/lib/auth";
import { fetchProfileData, unsignMyAccount } from "@/lib/profileApi";

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
      navigate("/signin", { replace: true });
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
            navigate("/signin", { replace: true });
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
      clearSession();
      navigate("/signin", { replace: true });
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
      navigate(`/flora/${encodeURIComponent(floraId)}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden bg-[#E9E9E9] min-h-screen flex items-center justify-center">
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
      <div className="w-full overflow-x-hidden bg-[#E9E9E9] min-h-screen">
        <TransparentNavbar showScrollBackground />
        <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
          <p className="font-supply-mono text-sm text-red-600 uppercase">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
        <ProfileHeader
          user={effectiveUser}
          followersCount={effectiveSocial.followersCount}
          followingCount={effectiveSocial.followingCount}
          onEdit={onEdit ?? (() => setEditOpen(true))}
          onFollowersClick={
            onFollowersClick ??
            (() => navigate(`/profile/${String(effectiveUser.username).replace(/^@/, "")}/followers`))
          }
          onFollowingClick={
            onFollowingClick ??
            (() => navigate(`/profile/${String(effectiveUser.username).replace(/^@/, "")}/following`))
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
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-supply-mono font-bold text-sm uppercase">
              My Floras
            </h2>
            <FilterTabs
              filters={[...profileGalleryFilters]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
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
