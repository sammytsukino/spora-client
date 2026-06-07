import { api } from "./api";
import { cldAvatar, cldImage } from "./cloudinary";
import {
  DEFAULT_PROFILE_AVATAR_URL,
  type ProfileUser,
  type ProfileFloraItem,
  type ProfileMetricsData,
  type ProfileSocialData,
  type ProfileSocialInteraction,
  type ProfileFloraStatus,
} from "@/data/profile-data";

const FLORA_EXCERPT_MAX_LENGTH = 80;
const SEED_LABEL_LENGTH = 6;
const RECENT_ACTIVITY_MAX_ITEMS = 15;
const ACTIVITY_UPDATE_THRESHOLD_MS = 60 * 1000;
const PROFILE_ITEM_FALLBACK_IMAGE_URL =
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png";

export interface MeUser {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  email: string;
  role: string;
  accountStatus: string;
  stats?: {
    florasCreated: number;
    cuttingsTaken: number;
    totalFloras: number;
  };
}

export interface ApiFlora {
  _id: string;
  title: string;
  text: string;
  authorUsername?: string;
  isAuthorAnonymized?: boolean;
  status?: string;
  lineage?: { generation?: number };
  thumbnailUrl?: string;
  generative?: { seed?: { sentiment?: { label?: string } } };
  stats?: { views?: number; cuttingsTaken?: number; downloads?: number };
  createdAt?: string;
  updatedAt?: string;
}

function statusToProfileStatus(status?: string): ProfileFloraStatus | undefined {
  if (!status) return undefined;
  const map: Record<string, ProfileFloraStatus> = {
    blossoming: "Blossoming",
    sealed: "Sealed",
    hidden: "Hidden",
  };
  return map[status] ?? "Blossoming";
}

export function mapMeToProfileUser(me: MeUser, floras: ApiFlora[]): ProfileUser {
  const originals = floras.filter((f) => (f.lineage?.generation ?? 0) === 0);
  const cuttings = floras.filter((f) => (f.lineage?.generation ?? 0) > 0);
  return {
    avatar: cldAvatar(me.avatar || DEFAULT_PROFILE_AVATAR_URL),
    username: me.username.startsWith("@") ? me.username : `@${me.username}`,
    fullName: me.displayName || me.username,
    bio: me.bio || "",
    florasCount: floras.length,
    originalsCount: originals.length,
    cuttingsCount: cuttings.length,
  };
}

export function mapApiFloraToProfileItem(flora: ApiFlora, fallbackUsername: string): ProfileFloraItem {
  const gen = flora.lineage?.generation ?? 0;
  const excerpt =
    flora.text?.length > FLORA_EXCERPT_MAX_LENGTH
      ? flora.text.slice(0, FLORA_EXCERPT_MAX_LENGTH) + "…"
      : flora.text || "";
  const author = flora.isAuthorAnonymized
    ? "Anonymous"
    : `@${flora.authorUsername || fallbackUsername}`;
  const seed = flora.generative?.seed?.sentiment?.label
    ? `#${flora.generative.seed.sentiment.label.slice(0, SEED_LABEL_LENGTH).toUpperCase()}`
    : `#${String(flora._id).slice(-SEED_LABEL_LENGTH).toUpperCase()}`;
  return {
    id: flora._id,
    generation: `GEN_${gen}`,
    image: cldImage(
      flora.thumbnailUrl || PROFILE_ITEM_FALLBACK_IMAGE_URL,
      "thumbnail"
    ),
    title: flora.title,
    excerpt,
    author,
    seed,
    status: statusToProfileStatus(flora.status),
  };
}

function buildRecentActivityFromFloras(
  floras: ApiFlora[],
  userAvatar: string
): ProfileSocialInteraction[] {
  const activities: ProfileSocialInteraction[] = [];
  for (const f of floras) {
    const created = f.createdAt ? new Date(f.createdAt).getTime() : 0;
    const updated = f.updatedAt ? new Date(f.updatedAt).getTime() : 0;
    const wasUpdated = updated > created + ACTIVITY_UPDATE_THRESHOLD_MS;
    activities.push({
      id: wasUpdated ? `updated-${f._id}` : `created-${f._id}`,
      avatar: userAvatar,
      username: "You",
      action: wasUpdated ? "updated" : "created",
      floraId: f._id,
      floraTitle: f.title,
      date: wasUpdated ? f.updatedAt : (f.createdAt ?? undefined),
    });
  }
  activities.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
  return activities.slice(0, RECENT_ACTIVITY_MAX_ITEMS);
}

export function mapFlorasToMetrics(floras: ApiFlora[]): ProfileMetricsData {
  let totalViews = 0;
  let totalCuttings = 0;
  let totalShares = 0;
  for (const f of floras) {
    totalViews += f.stats?.views ?? 0;
    totalCuttings += f.stats?.cuttingsTaken ?? 0;
    totalShares += f.stats?.downloads ?? 0;
  }
  return { totalViews, totalCuttings, totalShares };
}

export async function fetchProfileData(): Promise<{
  user: ProfileUser;
  floras: ProfileFloraItem[];
  metrics: ProfileMetricsData;
  social: ProfileSocialData;
}> {
  const meRes = await api.get<MeUser>("/auth/me");
  const me = meRes.data;
  const userId = String(me.id ?? "");
  const florasRes = await api.get<ApiFlora[]>("/floras", { params: { authorId: userId } });
  const floras = florasRes.data ?? [];
  const user = mapMeToProfileUser(me, floras);
  const profileFloras = floras.map((f) => mapApiFloraToProfileItem(f, me.username));
  const metrics = mapFlorasToMetrics(floras);
  const userAvatar = cldAvatar(me.avatar || DEFAULT_PROFILE_AVATAR_URL);
  const recentInteractions = buildRecentActivityFromFloras(floras, userAvatar);
  const social: ProfileSocialData = {
    followersCount: me.followersCount ?? 0,
    followingCount: me.followingCount ?? 0,
    recentInteractions,
  };
  return { user, floras: profileFloras, metrics, social };
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatar?: string;
  avatarData?: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<MeUser> {
  const { data } = await api.patch<MeUser>("/auth/me", payload);
  return data;
}

export async function unsignMyAccount(): Promise<{ florasAnonymized?: number }> {
  const { data } = await api.post<{ florasAnonymized?: number }>("/auth/me/unsign");
  return data;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string" && result.startsWith("data:")) {
        resolve(result);
      } else {
        reject(new Error("Invalid file format"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
