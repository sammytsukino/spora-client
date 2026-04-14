import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <details className="group border border-spora-primary bg-spora-primary-light">
      <summary className="cursor-pointer list-none px-4 py-3 sm:px-6 sm:py-4 font-supply-mono text-sm font-bold uppercase tracking-wide flex items-center justify-between gap-4 select-none [&::-webkit-details-marker]:hidden hover:bg-spora-primary/5 transition-colors">
        <span>{title}</span>
        <ChevronDown
          className="size-4 shrink-0 text-spora-primary transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="border-t border-spora-primary px-4 pb-6 pt-4 sm:px-6">
        <p className="font-supply-mono text-[11px] mb-4">{description}</p>
        <p className="font-supply-mono text-[11px] opacity-90 mb-4">
          {forbiddenAuthorNote}
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label htmlFor="unsign-confirm" className="block font-supply-mono text-[11px] mb-1 uppercase">
              Type <span className="font-bold text-rose-500">{expected || "your username"}</span> to confirm
            </label>
            <input
              id="unsign-confirm"
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="your username"
              className="w-full font-supply-mono text-[11px] px-3 py-2 border border-spora-primary bg-transparent focus:outline-none focus:border-rose-500"
              autoComplete="off"
              disabled={unsigning}
            />
          </div>
          <button
            type="button"
            onClick={() => canSubmit && onUnsign?.()}
            disabled={!canSubmit}
            className="font-supply-mono text-caption-sm px-4 py-2 border border-rose-500 text-rose-500 bg-spora-primary-light uppercase w-fit hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-spora-primary-light disabled:hover:text-rose-500"
          >
            {unsigning ? "Processing…" : buttonLabel}
          </button>
        </div>
      </div>
    </details>
  );
}
