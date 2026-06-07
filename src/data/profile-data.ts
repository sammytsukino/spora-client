import { cldImage } from "@/lib/cloudinary";
import { generateFloraData, type FloraItem } from "./flora-data";

const DEFAULT_PROFILE_AVATAR_BASE =
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1775567135/DEFAULT_awejhp.png";

export const DEFAULT_PROFILE_AVATAR_URL = cldImage(
  DEFAULT_PROFILE_AVATAR_BASE,
  "icon"
);

export function resolveProfileAvatarUrl(avatar?: string | null): string {
  if (!avatar) return DEFAULT_PROFILE_AVATAR_URL;
  return cldImage(avatar, "icon");
}

export interface ProfileUser {
  avatar: string;
  username: string;
  fullName: string;
  bio: string;
  florasCount: number;
  originalsCount: number;
  cuttingsCount: number;
}

export type ProfileFloraStatus = "Blossoming" | "Sealed" | "Hidden";

export interface ProfileFloraItem extends FloraItem {
  status?: ProfileFloraStatus;
}

export interface ProfileDangerZoneConfig {
  title: string;
  description: string;
  buttonLabel: string;
  forbiddenAuthorNote: string;
}

export interface ProfileMetricsData {
  totalViews: number;
  totalCuttings: number;
  totalShares: number;
}

export interface ProfileSocialInteraction {
  id: string;
  avatar?: string;
  username: string;
  action: "cutting" | "view" | "share" | "created" | "updated";
  floraId?: string;
  floraTitle?: string;
  date?: string;
}

export interface ProfileSocialData {
  followersCount: number;
  followingCount: number;
  recentInteractions: ProfileSocialInteraction[];
}

export const profileGalleryFilters = ["SHOW ALL", "Blossoming", "Sealed", "Hidden"] as const;

export type ProfileGalleryFilter = (typeof profileGalleryFilters)[number];

export const defaultProfileDangerZone: ProfileDangerZoneConfig = {
  title: "Danger zone",
  description: "Want to unsign your Floras?",
  buttonLabel: "Unsign your Floras",
  forbiddenAuthorNote: "Your works will be preserved as [forbidden_author]",
};

export const defaultProfileMetrics: ProfileMetricsData = {
  totalViews: 2847,
  totalCuttings: 31,
  totalShares: 12,
};

export const defaultProfileSocial: ProfileSocialData = {
  followersCount: 0,
  followingCount: 0,
  recentInteractions: [],
};

export const defaultProfileUser: ProfileUser = {
  avatar: DEFAULT_PROFILE_AVATAR_URL,
  username: "@Reinyourheart",
  fullName: "Naoi Rei",
  bio: "Rebel in your heart",
  florasCount: 12,
  originalsCount: 8,
  cuttingsCount: 4,
};

export function getDefaultProfileFloras(): ProfileFloraItem[] {
  const statuses: ProfileFloraStatus[] = ["Blossoming", "Sealed", "Hidden"];
  return generateFloraData(7).map((f, i) => ({
    ...f,
    status: statuses[i % statuses.length],
  }));
}
