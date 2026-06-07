import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import PageTitle from "@/components/ui/PageTitle";
import FooterAlter from "@/components/layout/FooterAlter";
import { getFollowers, type FollowUser } from "@/lib/followApi";
import { getUserByUsername } from "@/lib/usersApi";
import { ROUTES, profilePath } from "@/constants/routes";
import { resolveProfileAvatarUrl } from "@/data/profile-data";

export default function ProfileFollowers() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      navigate(ROUTES.PROFILE, { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const publicUser = await getUserByUsername(username);
        const followers = await getFollowers(publicUser.id);
        if (cancelled) return;
        setUsers(followers);
      } catch {
        if (!cancelled) setError("Could not load followers.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username, navigate]);

  if (!username) return null;

  return (
    <div className="w-full overflow-x-hidden bg-spora-primary-light min-h-screen">
      <TransparentNavbar showScrollBackground />
      <section className="pt-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(05)"
          title={`@${username.toUpperCase()}'S FOLLOWERS`}
          className="mb-8"
        />
        {loading ? (
          <p className="font-supply-mono text-sm text-spora-primary">Loading…</p>
        ) : error ? (
          <p className="font-supply-mono text-sm text-rose-500">{error}</p>
        ) : users.length === 0 ? (
          <p className="font-supply-mono text-sm text-spora-primary opacity-80">
            No followers yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => navigate(profilePath(u.username))}
                  className="flex items-center gap-4 w-full text-left p-3 border border-spora-primary bg-transparent hover:bg-spora-primary/5 transition-colors"
                >
                  <img
                    src={resolveProfileAvatarUrl(u.avatar)}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-spora-primary"
                  />
                  <div>
                    <p className="font-supply-mono font-bold text-spora-primary">
                      @{u.username}
                    </p>
                    {u.displayName && (
                      <p className="font-supply-mono text-xs text-spora-primary/80">
                        {u.displayName}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <FooterAlter />
    </div>
  );
}
