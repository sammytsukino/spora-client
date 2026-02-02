import { useState } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileMetrics from "@/components/profile/profile-metrics";
import ProfileSocial from "@/components/profile/profile-social";
import ProfileDangerZone from "@/components/profile/profile-danger-zone";
import FilterTabs from "@/components/common/filter-tabs";
import FloraCard from "@/components/garden/flora-card";
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
  user = defaultProfileUser,
  userFloras = getDefaultProfileFloras(),
  metrics = defaultProfileMetrics,
  social = defaultProfileSocial,
  dangerZone,
  onEdit,
  onUnsign,
  onCardClick,
  onFollowersClick,
  onFollowingClick,
  onInteractionClick,
}: ProfileViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>(profileGalleryFilters[0]);

  const filteredFloras =
    activeFilter === "SHOW ALL"
      ? userFloras
      : userFloras.filter((f) => f.status === activeFilter);

  const dangerZoneConfig = { ...defaultProfileDangerZone, ...dangerZone };

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <ProfileHeader
          user={user}
          followersCount={social.followersCount}
          followingCount={social.followingCount}
          onEdit={onEdit}
          onFollowersClick={onFollowersClick}
          onFollowingClick={onFollowingClick}
        />

        <div className="mt-4">
          <ProfileMetrics metrics={metrics} />
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="font-jetbrains-mono font-bold text-sm uppercase">
              My Floras
            </h2>
            <FilterTabs
              filters={[...profileGalleryFilters]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="border-l-2 border-t-2 border-black">
            <main className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
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
                  onClick={onCardClick}
                />
              ))}
            </main>
          </div>
        </div>

        <div className="mt-8">
          <ProfileSocial
            social={social}
            showFollowCounts={false}
            onInteractionClick={onInteractionClick}
          />
        </div>

        <div className="mt-8">
          <ProfileDangerZone
            {...dangerZoneConfig}
            onUnsign={onUnsign}
          />
        </div>
      </section>

      <FooterAlter />
    </div>
  );
}
