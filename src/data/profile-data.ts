import { generateFloraData, type FloraItem } from "./flora-data";

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
  avatar: string;
  username: string;
  action: "cutting" | "view" | "share";
  floraId?: string;
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
  followersCount: 128,
  followingCount: 64,
  recentInteractions: [
    {
      id: "1",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      username: "@FranBarreno",
      action: "cutting",
      floraId: "FLR/001",
    },
    {
      id: "2",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      username: "@SporaLab",
      action: "view",
      floraId: "FLR/003",
    },
    {
      id: "3",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
      username: "@GenArtist",
      action: "share",
      floraId: "FLR/002",
    },
  ],
};

export const defaultProfileUser: ProfileUser = {
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
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
