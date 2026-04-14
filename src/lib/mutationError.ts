import { isAxiosError } from "axios";

export function getMutationErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const data = e.response?.data as { error?: string } | undefined;
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
    if (e.response?.status) {
      return `Request failed (${e.response.status})`;
    }
    return e.message || "Request failed";
  }
  if (e instanceof Error && e.message.trim()) return e.message;
  return "Something went wrong";
}
