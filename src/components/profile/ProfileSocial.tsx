import { floraPath } from "@/constants/routes";
import { openFloraInNewTab } from "@/lib/openFloraInNewTab";
import {
  resolveProfileAvatarUrl,
  type ProfileSocialData,
  type ProfileSocialInteraction,
} from "@/data/profile-data";

interface ProfileSocialProps {
  social: ProfileSocialData;
  showFollowCounts?: boolean;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onInteractionClick?: (interaction: ProfileSocialInteraction) => void;
}

const actionLabels: Record<ProfileSocialInteraction["action"], string> = {
  cutting: "made a Cutting of",
  view: "viewed",
  share: "shared",
  created: "created",
  updated: "updated",
};

export default function ProfileSocial({
  social,
  showFollowCounts = true,
  onFollowersClick,
  onFollowingClick,
  onInteractionClick,
}: ProfileSocialProps) {
  const { followersCount, followingCount, recentInteractions } = social;

  const handleItemClick = (item: ProfileSocialInteraction) => {
    if (onInteractionClick) {
      onInteractionClick(item);
    } else if (item.floraId && (item.action === "created" || item.action === "updated")) {
      openFloraInNewTab(floraPath(item.floraId));
    }
  };

  const displayTarget = (item: ProfileSocialInteraction) =>
    item.floraTitle || item.floraId || "";

  return (
    <section className="border border-spora-primary bg-spora-primary-light p-6">
      <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
        Recent activity
      </h2>
      {showFollowCounts && (
        <div className="flex gap-6 mb-6">
          <button
            type="button"
            onClick={onFollowersClick}
            className="font-supply-mono text-sm border border-spora-primary px-4 py-2 hover:bg-spora-primary hover:text-lime-300 transition-colors"
          >
            <span className="font-bold">{followersCount}</span>
            <span className="ml-2 opacity-90">followers</span>
          </button>
          <button
            type="button"
            onClick={onFollowingClick}
            className="font-supply-mono text-sm border border-spora-primary px-4 py-2 hover:bg-spora-primary hover:text-lime-300 transition-colors"
          >
            <span className="font-bold">{followingCount}</span>
            <span className="ml-2 opacity-90">following</span>
          </button>
        </div>
      )}
      {recentInteractions.length > 0 ? (
        <ul className="space-y-2">
          {recentInteractions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-3 w-full text-left font-supply-mono text-[11px] p-2 border border-spora-primary hover:bg-lime-300 transition-colors"
              >
                {item.avatar && (
                  <img
                    src={resolveProfileAvatarUrl(item.avatar)}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-spora-primary shrink-0"
                  />
                )}
                <span>
                  <span className="font-medium">{item.username}</span>{" "}
                  {actionLabels[item.action]}
                  {displayTarget(item) && (
                    <span className="opacity-90"> «{displayTarget(item)}»</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-supply-mono text-[11px] opacity-70 italic">
          No recent activity
        </p>
      )}
    </section>
  );
}
