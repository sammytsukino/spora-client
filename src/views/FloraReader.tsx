import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import { floraImages } from "@/data/flora-data";
import { getFlora, type ApiFlora } from "@/lib/floras";
import { isLabFullAccessible } from "@/lib/auth";
import { useImageLuminance } from "@/hooks/useImageLuminance";
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

function formatSeed(flora: ApiFlora) {
  const seedSource = flora.generative?.soilId || flora.generative?.soilName || flora._id;
  return `#${seedSource.slice(-6).toUpperCase()}`;
}

function formatGeneration(value?: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `GEN_${safe}`;
}

function ensureHandle(username: string) {
  return username.startsWith("@") ? username : `@${username}`;
}

export default function FloraReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FloraLocationState | null;

  const [flora, setFlora] = useState<ApiFlora | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isActive = true;
    queueMicrotask(() => {
      setIsLoading(true);
      setError(null);
    });

    getFlora(id)
      .then((data) => {
        if (!isActive) return;
        setFlora(data);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Could not load Flora.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  const derived = (() => {
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
          if (i === 0 && rootFloraId) floraId = rootFloraId;
          else if (
            i === coAuthorHandles.length - 1 &&
            coAuthorHandles.length > 1 &&
            parentFloraId
          )
            floraId = parentFloraId;
          else if (coAuthorHandles.length === 1 && i === 0 && parentFloraId && !rootFloraId)
            floraId = parentFloraId;
          return { handle, floraId };
        }
      );

      return {
        id: flora._id,
        title: flora.title,
        author,
        seed: formatSeed(flora),
        generation: formatGeneration(flora.lineage?.generation),
        image:
          flora.thumbnailUrl ??
          floraImages[Math.abs(flora._id.charCodeAt(0)) % floraImages.length],
        text: flora.text ?? "",
        lineageItems: lineageItems.length ? lineageItems : [{ handle: author, floraId: flora._id }],
        status: flora.status ?? "blossoming",
      };
    }

    if (state?.flora) {
      return {
        id: state.flora.id,
        title: state.flora.title,
        author: state.flora.author,
        seed: state.flora.seed,
        generation: "GEN_0",
        image: state.flora.image,
        text: state.flora.excerpt ?? "",
        lineageItems: [{ handle: state.flora.author, floraId: state.flora.id }],
        status: "blossoming",
      };
    }

    return null;
  })();

  const theme = useImageLuminance(derived?.image);
  const isLightBg = theme === "light"; // null = still loading, default to dark (white text)
  const textColorClass = isLightBg ? "text-[#262626]" : "text-white";
  const textShadowStyle =
    !isLightBg ? { textShadow: "0 1px 2px rgba(0,0,0,0.5)" } : undefined;

  const baseText = derived?.text ?? "";
  const text = baseText.trim();
  const words = text.length > 0 ? text.split(/\s+/).filter((w) => w.length > 0) : [];
  const wordCount = words.length;
  const charCount = baseText.length;
  const lineCount = baseText.length > 0 ? baseText.split(/\n/).length : 1;
  const avgWordsPerLine =
    lineCount > 0 ? Math.round((wordCount / lineCount) * 10) / 10 : wordCount;
  const seedHex = (derived?.seed ?? "").replace("#", "").slice(0, 6);
  const morph = extractMorphology(baseText);
  const labState = flora?.generative?.labState as {
    geometry?: { scale?: number };
    wind?: { strength?: number };
    chaos?: { jitter?: number; scrambleForce?: number; pulse?: { active?: boolean; strength?: number } };
  } | undefined;

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");

    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  if (isLoading && !derived) {
    return (
      <div className="fixed inset-0 bg-[#E9E9E9]">
        <TransparentNavbar showScrollBackground />
        <main className="flex min-h-screen items-center justify-center pt-24 px-6">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em] text-[#262626]">
            Loading...
          </p>
        </main>
      </div>
    );
  }

  if (error || !derived) {
    return (
      <div className="fixed inset-0 bg-[#E9E9E9]">
        <TransparentNavbar showScrollBackground />
        <main className="flex min-h-screen items-center justify-center pt-24 px-6">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em] text-[#262626]">
            Could not load this Flora.
          </p>
        </main>
      </div>
    );
  }


  const installationSrc = `/Installation.html?floraId=${encodeURIComponent(derived.id)}&reader=1`;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <iframe
          src={installationSrc}
          title="Flora visualization"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          aria-hidden
        />
      </div>

      <TransparentNavbar showScrollBackground useLightText={!isLightBg} />

      {/* z1: text overlay */}
      <main className="relative z-10 flex h-screen flex-col overflow-hidden pt-20 pb-24 px-6 md:px-12 lg:px-16">
        <div className="flex flex-1 min-h-0 gap-6 md:gap-10">
          <div className="flex flex-col flex-1 min-w-0 min-h-0">
            <div className="mb-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline cursor-pointer ${textColorClass}`}
                style={textShadowStyle}
              >
                <span className="text-lg">←</span>
                <span>Back</span>
              </button>
            </div>

            <article
              className={`flex flex-col max-w-[90vw] md:max-w-[45ch] flex-1 min-h-0 ${textColorClass}`}
            >
              <header className="mb-4">
                <h1
                  className="font-bizud-mincho-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-1"
                  style={textShadowStyle}
                >
                  {derived.title}
                </h1>
                <p
                  className="font-supply-mono text-[10px] sm:text-xs opacity-90"
                  style={textShadowStyle}
                >
                  {derived.author} · {derived.seed}
                </p>
              </header>

              <div
                className="flora-reader-scroll font-bizud-mincho text-[15px] sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap flex-1 min-h-0 pr-2"
                style={textShadowStyle}
              >
                {text || (
                  <span className="opacity-70 italic">No text in this flora.</span>
                )}
              </div>
            </article>

            {/* CTA or sealed mark */}
            <div className="mt-8">
              {derived.status === "blossoming" ? (
                <button
                  type="button"
                  onClick={() => {
                    const labPath = isLabFullAccessible() ? "/laboratory/full" : "/laboratory";
                    const url = `${labPath}?floraId=${encodeURIComponent(derived.id)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  className="font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase py-3 px-4 border cursor-pointer hover:underline"
                  style={{
                    borderColor: isLightBg ? "#262626" : "white",
                    color: isLightBg ? "#262626" : "white",
                  }}
                >
                  Make a Cutting · Cuttings allowed
                </button>
              ) : derived.status === "sealed" ? (
                <span
                  className={`font-supply-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 px-3 border ${
                    isLightBg
                      ? "border-[#262626] text-[#262626]"
                      : "border-white/60 text-white/90"
                  }`}
                  style={textShadowStyle}
                >
                  Sealed
                </span>
              ) : null}
            </div>
          </div>

          {/* Right column: Details button + content */}
          <div className="flex flex-col items-end shrink-0">
            <button
              type="button"
              onClick={() => setShowDetailsPanel((v) => !v)}
              className={`font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:underline cursor-pointer mb-2 ${textColorClass}`}
              style={textShadowStyle}
            >
              {showDetailsPanel ? "Hide details" : "Details"}
            </button>
            {showDetailsPanel && (
              <div
                className={`flora-reader-scroll w-full min-w-[220px] max-w-[280px] font-supply-mono text-[10px] sm:text-xs space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto ${textColorClass}`}
                style={textShadowStyle}
              >
                <section>
                  <div className="uppercase tracking-widest mb-2 opacity-70">
                    Lineage
                  </div>
                  <div className="flex flex-wrap items-center gap-0">
                    {derived.lineageItems.map((item, i) => (
                      <span key={`${item.handle}-${i}`} className="flex items-center">
                        {item.floraId ? (
                          <Link
                            to={`/flora/${encodeURIComponent(item.floraId)}`}
                            className={`px-2 py-1 border transition-colors cursor-pointer no-underline hover:opacity-80 ${
                              isLightBg
                                ? "border-[#262626] bg-[#262626] text-[#E9E9E9] hover:bg-[#E9E9E9] hover:text-[#262626]"
                                : "border-white bg-white/20 text-white hover:bg-white hover:text-[#262626]"
                            }`}
                            title="View flora"
                          >
                            {item.handle}
                          </Link>
                        ) : (
                          <span
                            className={`px-2 py-1 border ${
                              isLightBg ? "border-[#262626] bg-[#262626]/20 text-[#262626]" : "border-white/60 bg-white/10 text-white"
                            }`}
                          >
                            {item.handle}
                          </span>
                        )}
                        {i < derived.lineageItems.length - 1 && (
                          <span
                            className={`w-3 h-px mx-0.5 shrink-0 ${isLightBg ? "bg-[#262626]" : "bg-white/60"}`}
                            aria-hidden
                          />
                        )}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="uppercase tracking-widest mb-2 opacity-70">
                    Analysis
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 opacity-90">
                      <div className="opacity-70 mb-0.5">Generation</div>
                      <div className="flex justify-between">
                        <span className="opacity-70">WORDS</span>
                        <span>{wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">CHARS</span>
                        <span>{charCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">GEN</span>
                        <span>{derived.generation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">MOOD</span>
                        <span>{(morph?.dominantMood ?? "neutral").toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-90">
                      <div className="opacity-70 mb-0.5">Morphology</div>
                      <div className="flex justify-between">
                        <span className="opacity-70">SENTIMENT</span>
                        <span>{morph?.sentimentStrength != null ? morph.sentimentStrength : "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">ENTROPY</span>
                        <span>{morph?.entropy != null ? morph.entropy.toFixed(3) : "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">VOCALIC</span>
                        <span>{morph?.vowelDensity != null ? morph.vowelDensity.toFixed(3) : "-"}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-90">
                      <div className="opacity-70 mb-0.5">Parameters</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="opacity-70">GEOM</span>
                        <span>{labState?.geometry?.scale != null ? labState.geometry.scale.toFixed(2) : "-"}</span>
                        <span className="opacity-70">WIND</span>
                        <span>{labState?.wind?.strength != null ? labState.wind.strength.toFixed(2) : "-"}</span>
                        <span className="opacity-70">CHAOS</span>
                        <span>{labState?.chaos?.jitter != null ? labState.chaos.jitter.toFixed(2) : "-"}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
