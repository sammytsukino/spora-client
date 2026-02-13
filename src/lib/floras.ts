import { api } from "./api";

export interface ApiFlora {
  _id: string;
  title: string;
  text: string;
  authorId?: string;
  authorUsername?: string;
  status?: "blossoming" | "sealed" | "hidden";
  lineage?: {
    generation?: number;
  };
  generative?: {
    soilId?: string;
    soilName?: string;
    labState?: Record<string, unknown>;
  };
  publishedAt?: string;
  sealedAt?: string;
}

export async function listFloras(params?: {
  status?: string;
  authorId?: string;
  generation?: number;
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
