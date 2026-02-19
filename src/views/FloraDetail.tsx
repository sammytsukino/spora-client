import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import FooterAlter from "@/components/home/FooterAlter";
import { floraImages } from "@/data/flora-data";
import { getFlora, type ApiFlora } from "@/lib/floras";
import { extractMorphology } from "@/lib/morphology";

interface FloraLocationState {
  flora?: {
    id: string;
    generation: string;
    image: string;
    title: string;
    excerpt: string;
    author: string;
    seed: string;
  };
}

function formatGeneration(value?: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `GEN_${safe}`;
}

function formatSeed(flora: ApiFlora) {
  const seedSource = flora.generative?.soilId || flora.generative?.soilName || flora._id;
  return `#${seedSource.slice(-6).toUpperCase()}`;
}

export default function FloraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FloraLocationState | null;

  const [flora, setFlora] = useState<ApiFlora | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isActive = true;
    setIsLoading(true);
    setError(null);

    getFlora(id)
      .then((data) => {
        if (!isActive) return;
        setFlora(data);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Could not load flora.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  const derived = useMemo(() => {
    if (flora) {
      const author = flora.authorUsername
        ? flora.authorUsername.startsWith("@")
          ? flora.authorUsername
          : `@${flora.authorUsername}`
        : "@Anonymous";

      return {
        id: flora._id,
        title: flora.title,
        author,
        seed: formatSeed(flora),
        generation: formatGeneration(flora.lineage?.generation),
        image: flora.thumbnailUrl ?? floraImages[Math.abs(flora._id.charCodeAt(0)) % floraImages.length],
        text: flora.text,
        lineageUsernames: [
          ...(flora.coAuthors || [])
            .map((item) => item.username)
            .filter((value): value is string => Boolean(value)),
          author,
        ],
      };
    }

    if (state?.flora) {
      return {
        id: state.flora.id,
        title: state.flora.title,
        author: state.flora.author,
        seed: state.flora.seed,
        generation: state.flora.generation,
        image: state.flora.image,
        text: state.flora.excerpt,
        lineageUsernames: [state.flora.author],
      };
    }

    return null;
  }, [flora, state?.flora]);

  const baseText = derived?.text ?? "";

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");

    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  const text = baseText.trim();
  const words =
    text.length > 0
      ? text.split(/\s+/).filter((w) => w.length > 0)
      : ([] as string[]);
  const wordCount = words.length;
  const charCount = baseText.length;
  const lineCount = baseText.length > 0 ? baseText.split(/\n/).length : 1;
  const avgWordsPerLine =
    lineCount > 0 ? Math.round((wordCount / lineCount) * 10) / 10 : wordCount;

  const seedHex = (derived?.seed ?? "").replace("#", "").slice(0, 6);


  const morph = useMemo(() => extractMorphology(text), [text]);


  const labState = flora?.generative?.labState as {
    geometry?: { scale?: number };
    wind?: { strength?: number };
    chaos?: {
      jitter?: number;
      scrambleForce?: number;
      pulse?: { active?: boolean; strength?: number };
    };
  } | undefined;

  const lineageHandles = derived?.lineageUsernames?.length
    ? derived.lineageUsernames
    : ["@Anonymous"];

  if (isLoading && !derived) {
    return (
      <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
        <TransparentNavbar showScrollBackground />
        <main className="pt-24 pb-10 px-6 md:px-12 lg:px-16">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em]">
            Loading flora...
          </p>
        </main>
        <FooterAlter />
      </div>
    );
  }

  if (error || !derived) {
    return (
      <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
        <TransparentNavbar showScrollBackground />
        <main className="pt-24 pb-10 px-6 md:px-12 lg:px-16">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em]">
            Could not load this flora.
          </p>
        </main>
        <FooterAlter />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <main className="pt-20 pb-8 px-6 md:px-12 lg:px-16">
        <section className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-2 font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline"
          >
            <span className="text-lg">←</span>
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const url = `/laboratory?floraId=${encodeURIComponent(derived.id)}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="mb-4 font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline"
          >
            <span>Open in {flora?.status === "sealed" ? "greenhouse" : "laboratory"}</span>
          </button>

          <div className="bg-[#262626] text-[#E9E9E9] border-2 border-[#262626] px-6 py-4 md:py-5">
            <h1 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-none mb-2">
              {derived.title}
            </h1>
            <p className="font-supply-mono text-[11px] sm:text-xs">
              by{" "}
              <span className="font-semibold">
                {derived.author}
              </span>{" "}
              | ID {derived.id} | {derived.generation}
            </p>
          </div>
        </section>

        <section className="border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="grid lg:grid-cols-[1.15fr,1.85fr]">
            <article className="border-r-2 border-b-2 border-[#262626] p-4 md:p-6 flex flex-col gap-4">
              <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] flex items-center justify-between font-supply-mono text-[11px] uppercase tracking-[0.25em]">
                <span>FLORA</span>
                <span className="text-[9px] opacity-80">
                  SEED {derived.seed}
                </span>
              </div>

              <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4 md:p-5 font-supply-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap">
                {baseText}
              </div>
            </article>

            <section className="border-r-2 border-b-2 border-[#262626] relative">
              <div
                className="w-full h-full bg-[#E9E9E9]"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={derived.image}
                  alt={derived.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(80%) contrast(120%)" }}
                />
              </div>

              <div className="absolute bottom-4 right-4 bg-[#E3E3E3] border border-[#262626] px-4 py-3 font-supply-mono text-[10px] sm:text-xs text-[#262626]">
                <p>SOIL: {derived.seed}</p>
                <p>GEN: {derived.generation}</p>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
            <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] font-supply-mono text-[11px] uppercase tracking-[0.25em] mb-3">
              GENERATION STATS
            </div>

            <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4 grid gap-4 sm:grid-cols-3 font-supply-mono text-[10px] sm:text-xs">
              <div className="space-y-1">
                <p>
                  WORDS: <span className="text-[#262626]">{wordCount}</span>
                </p>
                <p>
                  CHARS: <span className="text-[#262626]">{charCount}</span>
                </p>
                <p>
                  LINES: <span className="text-[#262626]">{lineCount}</span>
                </p>
                <p>
                  WORDS/LINE:{" "}
                  <span className="text-[#262626]">{avgWordsPerLine}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  SEED HASH:{" "}
                  <span className="text-[#262626]">{seedHex.toUpperCase()}</span>
                </p>
                <p>
                  UNIT: <span className="text-[#262626]">{derived.id}</span>
                </p>
                <p>
                  GEN: <span className="text-[#262626]">{derived.generation}</span>
                </p>
                <p>
                  MOOD:{" "}
                  <span className="text-[#262626]">
                    {(morph?.dominantMood ?? "neutral").toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
            <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] font-supply-mono text-[11px] uppercase tracking-[0.25em] mb-3">
              MORPHOLOGY_ANALYSIS
            </div>

            <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 font-supply-mono text-[10px] sm:text-xs">
              <div className="flex justify-between">
                <span className="opacity-70">SENTIMENT_FORCE</span>
                <span className="text-[#262626]">
                  {morph?.sentimentStrength != null
                    ? String(morph.sentimentStrength)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">ENTROPY_INDEX</span>
                <span className="text-[#262626]">
                  {morph?.entropy != null
                    ? morph.entropy.toFixed(3)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">VOCALIC_DENSITY</span>
                <span className="text-[#262626]">
                  {morph?.vowelDensity != null
                    ? morph.vowelDensity.toFixed(3)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">SIBILANCE_LVL</span>
                <span className="text-[#262626]">
                  {morph?.sibilanceIndex != null
                    ? morph.sibilanceIndex.toFixed(3)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">RHYTHM_DELTA</span>
                <span className="text-[#262626]">
                  {morph?.avgLengthDelta != null
                    ? morph.avgLengthDelta.toFixed(2)
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
            <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] font-supply-mono text-[11px] uppercase tracking-[0.25em] mb-3">
              MAPPED_PARAMETERS
            </div>

            <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 font-supply-mono text-[10px] sm:text-xs">
              <div className="flex justify-between">
                <span className="opacity-70">GEOM_SCALE</span>
                <span className="text-[#262626]">
                  {labState?.geometry?.scale != null
                    ? labState.geometry.scale.toFixed(2)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">WIND_FORCE</span>
                <span className="text-[#262626]">
                  {labState?.wind?.strength != null
                    ? labState.wind.strength.toFixed(2)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">CHAOS_JITTER</span>
                <span className="text-[#262626]">
                  {labState?.chaos?.jitter != null
                    ? labState.chaos.jitter.toFixed(2)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">SCRAMBLE_DNA</span>
                <span className="text-[#262626]">
                  {labState?.chaos?.scrambleForce != null
                    ? labState.chaos.scrambleForce.toFixed(2)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">PULSE_WAVE</span>
                <span className="text-[#262626]">
                  {labState?.chaos?.pulse?.active &&
                  labState?.chaos?.pulse?.strength != null
                    ? labState.chaos.pulse.strength.toFixed(2)
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
            <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] font-supply-mono text-[11px] uppercase tracking-[0.25em] mb-3">
              LINEAGE
            </div>

            <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4">
              <div className="flex flex-wrap gap-2 font-supply-mono text-[11px] sm:text-xs">
                {lineageHandles.map((handle) => (
                  <span
                    key={handle}
                    className="px-3 py-1 border border-[#262626] bg-[#262626] text-[#E9E9E9]"
                  >
                    {handle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterAlter />
    </div>
  );
}

