import { useState, useEffect } from "react";
import { follow, unfollow, checkFollowStatus } from "@/lib/followApi";

interface FollowButtonProps {
  userId: string;
  onFollowChange?: (following: boolean) => void;
  className?: string;
}

export default function FollowButton({ userId, onFollowChange, className = "" }: FollowButtonProps) {
  const [following, setFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    checkFollowStatus(userId)
      .then((v) => {
        if (!cancelled) setFollowing(v);
      })
      .catch(() => {
        if (!cancelled) setFollowing(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const handleClick = async () => {
    if (following === null || loading) return;
    setLoading(true);
    try {
      if (following) {
        await unfollow(userId);
        setFollowing(false);
        onFollowChange?.(false);
      } else {
        await follow(userId);
        setFollowing(true);
        onFollowChange?.(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (following === null) {
    return (
      <span className={`font-supply-mono text-xs uppercase opacity-50 ${className}`}>
        …
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`font-supply-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 border border-[var(--spora-primary)] transition-colors disabled:opacity-50 ${className} ${
        following
          ? "bg-[var(--spora-primary)] text-[var(--spora-primary-light)] hover:bg-[#1c1c1c]"
          : "bg-transparent text-[var(--spora-primary)] hover:bg-[var(--spora-primary)]/10"
      }`}
    >
      {loading ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}
