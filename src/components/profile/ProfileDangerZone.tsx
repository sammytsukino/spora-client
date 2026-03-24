import { useState } from "react";
import type { ProfileDangerZoneConfig } from "@/data/profile-data";

interface ProfileDangerZoneProps extends ProfileDangerZoneConfig {
  confirmationWord?: string;
  onUnsign?: () => void;
  unsigning?: boolean;
}

function normalizeUsername(u: string): string {
  return u.replace(/^@/, "").trim().toLowerCase();
}

export default function ProfileDangerZone({
  title,
  description,
  buttonLabel,
  forbiddenAuthorNote,
  confirmationWord,
  onUnsign,
  unsigning = false,
}: ProfileDangerZoneProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const expected = confirmationWord ? normalizeUsername(confirmationWord) : "";
  const isConfirmed = expected !== "" && normalizeUsername(confirmInput) === expected;
  const canSubmit = isConfirmed && !unsigning;

  return (
    <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
      <h2 className="font-supply-mono font-bold text-sm uppercase mb-2">
        {title}
      </h2>
      <p className="font-supply-mono text-[11px] mb-4">{description}</p>
      <p className="font-supply-mono text-[11px] opacity-90 mb-4">
        {forbiddenAuthorNote}
      </p>
      <div className="flex flex-col gap-4 max-w-md">
        <div>
          <label htmlFor="unsign-confirm" className="block font-supply-mono text-[11px] mb-1 uppercase">
            Type <span className="font-bold text-red-600">{expected || "your username"}</span> to confirm
          </label>
          <input
            id="unsign-confirm"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="your username"
            className="w-full font-supply-mono text-[11px] px-3 py-2 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-red-600"
            autoComplete="off"
            disabled={unsigning}
          />
        </div>
        <button
          type="button"
          onClick={() => canSubmit && onUnsign?.()}
          disabled={!canSubmit}
          className="font-supply-mono text-caption-sm px-4 py-2 border border-red-600 text-red-600 bg-spora-primary-light uppercase w-fit hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-spora-primary-light disabled:hover:text-red-600"
        >
          {unsigning ? "Processing…" : buttonLabel}
        </button>
      </div>
    </section>
  );
}
