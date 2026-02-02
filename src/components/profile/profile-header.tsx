import { Users, UserPlus } from "lucide-react";
import type { ProfileUser } from "@/data/profile-data";
import MainButton from "@/components/ui/main-button";

interface ProfileHeaderProps {
  user: ProfileUser;
  followersCount?: number;
  followingCount?: number;
  onEdit?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export default function ProfileHeader({
  user,
  followersCount,
  followingCount,
  onEdit,
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) {
  const {
    avatar,
    username,
    fullName,
    bio,
    florasCount,
    originalsCount,
    cuttingsCount,
  } = user;

  const showSocial =
    followersCount !== undefined && followingCount !== undefined;

  return (
    <header className="border-2 border-[#262626] bg-[#E9E9E9] p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
      <img
        src={avatar}
        alt={fullName}
        className="w-24 h-24 rounded-full object-cover border-2 border-[#262626] shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-supply-mono text-lg font-bold">{username}</p>
        <p className="font-supply-mono text-sm text-[#262626]/80">{fullName}</p>
        <p className="font-supply-mono text-sm italic mt-1">{bio}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-supply-mono text-[11px] opacity-90">
          <span>
            {florasCount} Floras · {originalsCount} originals · {cuttingsCount} cuttings
          </span>
          {showSocial && (
            <>
              <span className="opacity-50">·</span>
              <span className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onFollowersClick}
                  className="inline-flex items-center gap-1.5 hover:underline focus:underline"
                >
                  <Users className="size-3.5 shrink-0" aria-hidden />
                  <strong>{followersCount}</strong> followers
                </button>
                <button
                  type="button"
                  onClick={onFollowingClick}
                  className="inline-flex items-center gap-1.5 hover:underline focus:underline"
                >
                  <UserPlus className="size-3.5 shrink-0" aria-hidden />
                  <strong>{followingCount}</strong> following
                </button>
              </span>
            </>
          )}
        </div>
      </div>
      {onEdit && (
        <MainButton variant="compact" size="sm" onClick={onEdit} className="shrink-0">
          EDIT
        </MainButton>
      )}
    </header>
  );
}
