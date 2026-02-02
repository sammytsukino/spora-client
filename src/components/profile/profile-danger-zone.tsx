import type { ProfileDangerZoneConfig } from "@/data/profile-data";

interface ProfileDangerZoneProps extends ProfileDangerZoneConfig {
  onUnsign?: () => void;
}

export default function ProfileDangerZone({
  title,
  description,
  buttonLabel,
  forbiddenAuthorNote,
  onUnsign,
}: ProfileDangerZoneProps) {
  return (
    <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
      <h2 className="font-supply-mono font-bold text-sm uppercase mb-2">
        {title}
      </h2>
      <p className="font-supply-mono text-[11px] mb-4">{description}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => onUnsign?.()}
          className="font-supply-mono text-[11px] px-4 py-2 border-2 border-red-600 text-red-600 bg-[#E9E9E9] uppercase hover:bg-red-600 hover:text-white transition-colors"
        >
          {buttonLabel}
        </button>
        <span className="font-supply-mono text-[11px] opacity-90">
          {forbiddenAuthorNote}
        </span>
      </div>
    </section>
  );
}
