import { api } from "./api";

/** Present on POST/PATCH /floras responses when the server ran lexical screening. */
export interface ContentScreening {
  flagged: boolean;
  matchCount: number;
  titleHits?: number;
  textHits?: number;
  matchedTerms?: string[];
}

export interface ApiFlora {
  _id: string;
  shortId?: string;
  title: string;
  text: string;
  authorId?: string;
  authorUsername?: string;
  isAuthorAnonymized?: boolean;
  author?: { username?: string; displayName?: string };
  coAuthors?: Array<{
    username?: string;
    generation?: number;
    contributedAt?: string;
    isAnonymized?: boolean;
  }>;
  status?: "blossoming" | "sealed" | "hidden";
  lineage?: {
    generation?: number;
    parentFloraId?: string;
    rootFloraId?: string;
  };
  generative?: {
    soilId?: string;
    soilName?: string;
    labState?: Record<string, unknown>;
  };
  publishedAt?: string;
  sealedAt?: string;
  thumbnailUrl?: string;
  contentScreening?: ContentScreening;
}

export async function listFloras(params?: {
  status?: string;
  authorId?: string;
  generation?: number;
  followingOnly?: boolean;
  limit?: number;
  skip?: number;
}) {
  const { data } = await api.get<ApiFlora[]>("/floras", { params });
  return data;
}

export async function getFlora(id: string) {
  const { data } = await api.get<ApiFlora>(`/floras/${id}`);
  return data;
}

export async function createFlora(payload: {
  title: string;
  text: string;
  status?: "blossoming" | "sealed" | "hidden";
  lineage?: { generation?: number; childrenCount?: number };
  generative?: Record<string, unknown>;
  license?: Record<string, unknown>;
}) {
  const { data } = await api.post<ApiFlora>("/floras", payload);
  return data;
}
