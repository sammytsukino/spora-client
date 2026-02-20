import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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

function ensureHandle(username: string): string {
  return username.startsWith("@") ? username : `@${username}`;
}

export default function FloraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FloraLocationState | null;

  const [flora, setFlora] = useState<ApiFlora | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

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
      const authorName =
        flora.authorUsername ??
        (typeof flora.author === "object" && flora.author && "username" in flora.author
          ? (flora.author as { username: string }).username
          : null);
      const author = authorName
        ? authorName.startsWith("@")
          ? authorName
          : `@${authorName}`
        : "@Anonymous";

      const coAuthorHandles = (flora.coAuthors || [])
        .map((item) => item.username)
        .filter((value): value is string => Boolean(value))
        .map(ensureHandle);
      const allHandles = [...coAuthorHandles, author];
      const rootFloraId = flora.lineage?.rootFloraId
        ? String(flora.lineage.rootFloraId)
        : undefined;
      const parentFloraId = flora.lineage?.parentFloraId
        ? String(flora.lineage.parentFloraId)
        : undefined;

      const lineageItems: { handle: string; floraId?: string }[] = allHandles.map(
        (handle, i) => {
          let floraId: string | undefined;
          if (i === 0 && rootFloraId) {
            floraId = rootFloraId;
          } else if (
            i === coAuthorHandles.length - 1 &&
            coAuthorHandles.length > 1 &&
            parentFloraId
          ) {
            floraId = parentFloraId;
          } else if (coAuthorHandles.length === 1 && i === 0 && parentFloraId && !rootFloraId) {
            floraId = parentFloraId;
          }
          return { handle, floraId };
        }
      );

      return {
        id: flora._id,
        title: flora.title,
        author,
        seed: formatSeed(flora),
        generation: formatGeneration(flora.lineage?.generation),
        image: flora.thumbnailUrl ?? floraImages[Math.abs(flora._id.charCodeAt(0)) % floraImages.length],
        text: flora.text,
        lineageItems,
        status: flora.status ?? "blossoming",
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
        lineageItems: [{ handle: state.flora.author }],
        status: "blossoming",
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

  const lineageItems = derived?.lineageItems?.length
    ? derived.lineageItems
    : [{ handle: "@Anonymous" }];

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
            className="mb-2 font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline cursor-pointer"
          >
            <span className="text-lg">←</span>
            <span>Back</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,520px)_1fr]">
            <section className="border-r-2 border-b-2 border-[#262626] relative order-2 lg:order-1">
              <div
                className="w-full bg-[#E9E9E9]"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={derived.image}
                  alt={derived.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(80%) contrast(120%)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const url = `/laboratory?floraId=${encodeURIComponent(derived.id)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)] flex flex-col items-center gap-1 bg-[#262626] text-[#E9E9E9] font-supply-mono py-3 px-4 border-2 border-[#262626] hover:bg-[#bbf451] hover:text-[#262626] hover:border-[#bbf451] transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm uppercase tracking-widest">
                  Open in laboratory
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold leading-tight text-center opacity-90">
                  Full bloom in the lab.
                  {derived.status === "blossoming" && " Cuttings allowed."}
                </span>
              </button>
            </section>

            <article className="border-r-2 border-b-2 border-[#262626] p-4 md:p-6 flex flex-col gap-4 order-1 lg:order-2">
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
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
            <div className="font-supply-mono text-[10px] uppercase tracking-[0.2em] text-[#262626]/80 mb-3">
              Lineage
            </div>

            <div className="flex flex-wrap items-center gap-0 font-supply-mono text-[11px] sm:text-xs">
              {lineageItems.map((item, i) => (
                <span key={`${item.handle}-${i}`} className="flex items-center">
                  {item.floraId ? (
                    <Link
                      to={`/flora/${encodeURIComponent(item.floraId)}`}
                      className="px-3 py-1 border border-[#262626] bg-[#262626] text-[#E9E9E9] hover:bg-[#E9E9E9] hover:text-[#262626] transition-colors cursor-pointer no-underline"
                      title="View original flora"
                    >
                      {item.handle}
                    </Link>
                  ) : (
                    <span className="px-3 py-1 border border-[#262626] bg-[#262626] text-[#E9E9E9]">
                      {item.handle}
                    </span>
                  )}
                  {i < lineageItems.length - 1 && (
                    <span
                      className="w-4 sm:w-6 h-px bg-[#262626] mx-1 shrink-0"
                      aria-hidden
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <button
            type="button"
            onClick={() => setShowAnalysis((v) => !v)}
            className="w-full text-left border-r-2 border-b-2 border-[#262626] px-4 py-2 font-supply-mono text-[10px] uppercase tracking-widest text-[#262626]/70 hover:text-[#262626] hover:bg-[#E3E3E3] transition-colors"
          >
            {showAnalysis ? "− Hide analysis" : "+ Show analysis"}
          </button>

          {showAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
              <div className="font-supply-mono text-[9px] uppercase tracking-widest text-[#262626]/60 mb-2">
                Generation stats
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-[10px] sm:text-xs text-[#262626]/90">
                <div className="flex justify-between">
                  <span className="opacity-70">WORDS</span>
                  <span className="text-[#262626]">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">CHARS</span>
                  <span className="text-[#262626]">{charCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">LINES</span>
                  <span className="text-[#262626]">{lineCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">WORDS/LINE</span>
                  <span className="text-[#262626]">{avgWordsPerLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SEED HASH</span>
                  <span className="text-[#262626]">{seedHex.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">UNIT</span>
                  <span className="text-[#262626]">{derived.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">GEN</span>
                  <span className="text-[#262626]">{derived.generation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">MOOD</span>
                  <span className="text-[#262626]">
                    {(morph?.dominantMood ?? "neutral").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
              <div className="font-supply-mono text-[9px] uppercase tracking-widest text-[#262626]/60 mb-2">
                Morphology analysis
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-[10px] sm:text-xs text-[#262626]/90">
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

            <div className="border-r-2 border-b-2 border-[#262626] p-4 md:p-5">
              <div className="font-supply-mono text-[9px] uppercase tracking-widest text-[#262626]/60 mb-2">
                Mapped parameters
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-[10px] sm:text-xs text-[#262626]/90">
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
          </div>
          )}
        </section>
      </main>

      <FooterAlter />
    </div>
  );
}

