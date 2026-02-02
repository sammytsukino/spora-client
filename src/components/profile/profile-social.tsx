import type { ProfileSocialData, ProfileSocialInteraction } from "@/data/profile-data";

interface ProfileSocialProps {
  social: ProfileSocialData;
  showFollowCounts?: boolean;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onInteractionClick?: (interaction: ProfileSocialInteraction) => void;
}

const actionLabels: Record<ProfileSocialInteraction["action"], string> = {
  cutting: "made a cutting of",
  view: "viewed",
  share: "shared",
};

export default function ProfileSocial({
  social,
  showFollowCounts = true,
  onFollowersClick,
  onFollowingClick,
  onInteractionClick,
}: ProfileSocialProps) {
  const { followersCount, followingCount, recentInteractions } = social;

  return (
    <section className="border-2 border-black bg-[#E9E9E9] p-6">
      <h2 className="font-jetbrains-mono font-bold text-sm uppercase mb-4">
        Recent activity
      </h2>
      {showFollowCounts && (
        <div className="flex gap-6 mb-6">
          <button
            type="button"
            onClick={onFollowersClick}
            className="font-jetbrains-mono text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-lime-300 transition-colors"
          >
            <span className="font-bold">{followersCount}</span>
            <span className="ml-2 opacity-90">followers</span>
          </button>
          <button
            type="button"
            onClick={onFollowingClick}
            className="font-jetbrains-mono text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-lime-300 transition-colors"
          >
            <span className="font-bold">{followingCount}</span>
            <span className="ml-2 opacity-90">following</span>
          </button>
        </div>
      )}
      {recentInteractions.length > 0 && (
        <ul className="space-y-2">
            {recentInteractions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onInteractionClick?.(item)}
                  className="flex items-center gap-3 w-full text-left font-jetbrains-mono text-[11px] p-2 border-2 border-black hover:bg-lime-300 transition-colors"
                >
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border-2 border-black shrink-0"
                  />
                  <span>
                    <span className="font-medium">{item.username}</span>
                    {" "}
                    {actionLabels[item.action]}
                    {item.floraId && (
                      <span className="opacity-90"> {item.floraId}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
