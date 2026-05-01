import { api } from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactMessage(payload: ContactPayload) {
  const { data } = await api.post<{ ok: boolean }>("/contact", payload);
  return data;
}
