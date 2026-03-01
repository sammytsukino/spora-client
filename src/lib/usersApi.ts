import { api } from "./api";

export interface PublicUser {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  stats?: {
    florasCreated?: number;
    cuttingsTaken?: number;
    totalFloras?: number;
  };
}

export async function getUserByUsername(username: string): Promise<PublicUser> {
  const normalized = String(username).trim().replace(/^@+/, "");
  const { data } = await api.get<PublicUser>(`/users/by-username/${encodeURIComponent(normalized)}`);
  return data;
}
