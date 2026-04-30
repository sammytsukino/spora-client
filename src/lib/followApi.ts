import { api } from "./api";

const DEFAULT_PAGINATION_LIMIT = 50;
const DEFAULT_PAGINATION_SKIP = 0;

function buildUserFollowListPath(userId: string, listType: "followers" | "following"): string {
  return `/users/${encodeURIComponent(userId)}/${listType}`;
}

export async function follow(userId: string): Promise<void> {
  await api.post(`/follows/${userId}`);
}

export async function unfollow(userId: string): Promise<void> {
  await api.delete(`/follows/${userId}`);
}

export async function getFollowingIds(): Promise<string[]> {
  const { data } = await api.get<{ followingIds: string[] }>("/follows/me/following");
  return data.followingIds ?? [];
}

export async function checkFollowStatus(userId: string): Promise<boolean> {
  const { data } = await api.get<{ following: boolean }>(`/follows/${userId}/status`);
  return data.following;
}

export interface FollowUser {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export async function getFollowers(
  userId: string,
  limit = DEFAULT_PAGINATION_LIMIT,
  skip = DEFAULT_PAGINATION_SKIP
): Promise<FollowUser[]> {
  const { data } = await api.get<FollowUser[]>(buildUserFollowListPath(userId, "followers"), {
    params: { limit, skip },
  });
  return data ?? [];
}

export async function getFollowing(
  userId: string,
  limit = DEFAULT_PAGINATION_LIMIT,
  skip = DEFAULT_PAGINATION_SKIP
): Promise<FollowUser[]> {
  const { data } = await api.get<FollowUser[]>(buildUserFollowListPath(userId, "following"), {
    params: { limit, skip },
  });
  return data ?? [];
}
