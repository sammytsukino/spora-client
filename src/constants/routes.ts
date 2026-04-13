
export const ROUTES = {
  HOME: "/",
  HOME_LEGACY: "/home",
  GARDEN: "/garden",
  GREENHOUSE: "/greenhouse",
  LABORATORY: "/laboratory",
  LABORATORY_FULL: "/laboratory/full",
  INSTALLATION: "/installation",
  TEAM: "/team",
  TERMS: "/terms",
  RESEARCH: "/research",
  CONTACT: "/contact",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  VERIFY_EMAIL: "/verify-email",
  PROFILE: "/profile",
  ADMIN: "/admin",
  BACKGROUND: "/background",
  LICENSING: "/licensing",
  GROW: "/grow",
  FLORA: "/flora",
} as const;

export type AppPath =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | ReturnType<typeof floraPath>
  | ReturnType<typeof floraDetailsPath>
  | ReturnType<typeof profilePath>
  | ReturnType<typeof profileFollowersPath>
  | ReturnType<typeof profileFollowingPath>
  | ReturnType<typeof greenhouseWithAuthorQuery>;

export function floraPath(id: string): string {
  return `${ROUTES.FLORA}/${encodeURIComponent(id)}`;
}

export function floraDetailsPath(id: string): string {
  return `${ROUTES.FLORA}/${encodeURIComponent(id)}/details`;
}

export function profilePath(username: string): string {
  const u = String(username).replace(/^@/, "");
  return `${ROUTES.PROFILE}/${encodeURIComponent(u)}`;
}

export function profileFollowersPath(username: string): string {
  return `${profilePath(username)}/followers`;
}

export function profileFollowingPath(username: string): string {
  return `${profilePath(username)}/following`;
}

export function greenhouseWithAuthorQuery(authorId: string, username?: string): string {
  const params = new URLSearchParams({ authorId });
  if (username) params.set("username", username);
  return `${ROUTES.GREENHOUSE}?${params.toString()}`;
}


export function laboratoryFullFromGrow(): string {
  return `${ROUTES.LABORATORY_FULL}?from=grow`;
}
