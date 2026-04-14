import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Flag, X } from "lucide-react";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import { floraImages } from "@/data/flora-data";
import { getFlora, type ApiFlora } from "@/lib/floras";
import { extractMorphology } from "@/lib/morphology";
import { isLabFullAccessible, getStoredToken, getStoredUser } from "@/lib/auth";
import { createReport, type ReportCategory } from "@/lib/reports-api";
import { navigateFloraViewBack, type FloraViewLocationState } from "@/lib/floraViewBack";
import SporaImageLoader from "@/components/shared/SporaImageLoader";

interface FloraLocationState extends FloraViewLocationState {
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory>("other");
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

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
        .map((item) => (typeof item === "string" ? item : item.username))
        .filter((value): value is string => Boolean(value))
        .map(ensureHandle);

      const labState = flora.generative?.labState as { lineageUsernames?: string[]; lineageFloraIds?: string[] } | undefined;
      const lineageUsernames = labState?.lineageUsernames;
      const lineageFloraIds = labState?.lineageFloraIds;
      const fromLabState = Array.isArray(lineageUsernames)
        ? lineageUsernames.map(ensureHandle)
        : [];

      let allHandles: string[];
      if (fromLabState.length > 0) {
        allHandles = fromLabState;
      } else if (coAuthorHandles.length > 0) {
        allHandles = [...coAuthorHandles, author];
      } else {
        allHandles = [author];
      }

      const rootFloraId = flora.lineage?.rootFloraId
        ? String(flora.lineage.rootFloraId)
        : undefined;
      const parentFloraId = flora.lineage?.parentFloraId
        ? String(flora.lineage.parentFloraId)
        : undefined;
      const isCutting = Boolean(flora.lineage?.parentFloraId || flora.lineage?.rootFloraId);

      const lineageItems: { handle: string; floraId?: string }[] = allHandles.map(
        (handle, i) => {
          let floraId: string | undefined;
          if (Array.isArray(lineageFloraIds) && i < lineageFloraIds.length) {
            floraId = lineageFloraIds[i];
          } else if ((isCutting || allHandles.length === 1) && i === allHandles.length - 1) {
            floraId = flora._id;
          } else if (i === 0 && rootFloraId) {
            floraId = rootFloraId;
          } else if (i === allHandles.length - 1 && parentFloraId && allHandles.length === 2) {
            floraId = parentFloraId;
          } else if (i === 0 && parentFloraId && !rootFloraId) {
            floraId = parentFloraId;
          } else if (allHandles.length > 2 && i === allHandles.length - 2 && parentFloraId) {
            floraId = parentFloraId;
          }
          return { handle, floraId: floraId ? String(floraId) : undefined };
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
        lineageItems: [{ handle: state.flora.author, floraId: state.flora.id }],
        status: "blossoming",
      };
    }

    return null;
  })();

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


  const morph = extractMorphology(text);


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

  const lineageRows: typeof lineageItems[] = [];
  for (let i = 0; i < lineageItems.length; i += 2) {
    lineageRows.push(lineageItems.slice(i, i + 2));
  }

  const lineageDash = (
    <span
      className="flex w-4 sm:w-6 shrink-0 items-center justify-center self-stretch"
      aria-hidden
    >
      <span className="block h-px w-4 sm:w-6 bg-spora-primary" />
    </span>
  );

  const currentUser = getStoredUser();
  const authorId =
    flora?.authorId ??
    (flora?.author && typeof flora.author === "object" && "_id" in flora.author
      ? String((flora.author as { _id: string })._id)
      : null);
  const isAuthor = Boolean(
    currentUser?.id && authorId && authorId === currentUser.id
  );
  const canReport =
    Boolean(getStoredToken()) && !isAuthor && derived && flora;

  if (isLoading && !derived) {
    return (
      <div className="w-full overflow-x-hidden bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main className="flex min-h-[50vh] flex-col items-center justify-center pt-24 pb-10 px-6 md:px-12 lg:px-16">
          <SporaImageLoader />
        </main>
        <FooterAlter />
      </div>
    );
  }

  if (error || !derived) {
    return (
      <div className="w-full overflow-x-hidden bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main className="pt-24 pb-10 px-6 md:px-12 lg:px-16">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em]">
            Could not load this Flora.
          </p>
        </main>
        <FooterAlter />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-spora-primary-light">
      <TransparentNavbar showScrollBackground />

      <main className="pt-20 pb-12 md:pb-16 px-6 md:px-12 lg:px-16">
        <section className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigateFloraViewBack(navigate, location.pathname, state)}
                className="font-supply-mono text-caption-sm sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline cursor-pointer"
              >
                <span className="text-lg">←</span>
                <span>Back</span>
              </button>
              <Link
                to={`/flora/${encodeURIComponent(derived.id)}`}
                className="font-supply-mono text-caption-sm sm:text-xs tracking-[0.25em] uppercase hover:underline"
              >
                Read
              </Link>
            </div>
            {canReport && (
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(true);
                  setReportCategory("other");
                  setReportReason("");
                  setReportDescription("");
                  setReportSuccess(false);
                  setReportError(null);
                }}
                className="font-supply-mono text-caption-sm sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 px-3 py-1.5 border border-spora-primary hover:bg-spora-primary hover:text-spora-primary-light transition-colors cursor-pointer"
              >
                <Flag className="size-3.5" aria-hidden />
                Report
              </button>
            )}
          </div>

          <div className="bg-spora-primary text-spora-primary-light border border-spora-primary px-6 py-4 md:py-5">
            <h1 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-none mb-2">
              {derived.title}
            </h1>
            <p className="font-supply-mono text-caption-sm sm:text-xs">
              by{" "}
              <span className="font-semibold">
                {derived.author}
              </span>{" "}
              | ID {derived.id} | {derived.generation}
            </p>
          </div>
        </section>

        <section className="border border-[var(--spora-primary)] bg-spora-primary-light">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,520px)_1fr] lg:items-stretch">
            <section className="border border-[var(--spora-primary)] relative order-2 lg:order-1 flex flex-col min-h-0">
              <div className="w-full flex-1 min-h-[240px] lg:min-h-0 bg-spora-primary-light overflow-hidden">
                <img
                  src={derived.image}
                  alt={derived.title}
                  className="w-full h-full object-cover object-center"
                  style={{ filter: "grayscale(100%) contrast(120%)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const labPath = isLabFullAccessible() ? "/laboratory/full" : "/laboratory";
                  const url = `${labPath}?floraId=${encodeURIComponent(derived.id)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)] flex flex-col items-center gap-1 bg-spora-primary text-spora-primary-light font-supply-mono py-3 px-4 border border-spora-primary hover:bg-[var(--spora-accent-secondary)] hover:text-spora-primary hover:border-[var(--spora-accent-secondary)] transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm uppercase tracking-widest">
                  Open in Laboratory
                </span>
                <span className="text-caption-2xs sm:text-overline-xs font-bold leading-tight text-center opacity-90">
                  Full bloom in the Laboratory.
                  {derived.status === "blossoming" && " Cuttings allowed."}
                </span>
              </button>
            </section>

            <article className="border border-[var(--spora-primary)] p-4 md:p-6 flex flex-col gap-4 order-1 lg:order-2 ">
              <div className="bg-spora-primary text-spora-primary-light px-4 py-2 border border-spora-primary flex items-center justify-between font-supply-mono text-caption-sm uppercase tracking-[0.25em] ">
                <span>FLORA</span>
                <span className="text-caption-2xs opacity-80">
                  SEED {derived.seed}
                </span>
              </div>

              <div className="flora-text-scroll border border-[var(--spora-primary)] bg-spora-primary-light p-5 md:p-6 font-bizud-mincho text-[13px] sm:text-sm leading-loose tracking-wide whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                {baseText}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-6 border border-[var(--spora-primary)] bg-spora-primary-light">
          <div className="border border-[var(--spora-primary)] p-5 md:p-6">
            <div className="font-supply-mono text-overline-xs uppercase tracking-[0.2em] text-spora-primary/80 mb-3">
              Lineage
            </div>

            <div className="flex flex-col gap-y-2 min-w-0 font-supply-mono text-caption-sm sm:text-xs">
              {lineageRows.map((rowItems, rowIdx) => (
                <div
                  key={`lineage-row-${rowIdx}`}
                  className="flex flex-nowrap items-stretch gap-x-0.5 min-w-0 max-w-full"
                >
                  {rowIdx > 0 ? lineageDash : null}
                  {rowItems.map((item, j) => {
                    const i = rowIdx * 2 + j;
                    return (
                      <Fragment key={`${item.handle}-${i}`}>
                        <span className="flex min-w-0 shrink items-center">
                          {item.floraId ? (
                            <Link
                              to={`/flora/${encodeURIComponent(item.floraId)}`}
                              className="max-w-full truncate px-3 py-1 border border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-spora-primary-light hover:text-spora-primary transition-colors cursor-pointer no-underline"
                              title="View Flora"
                            >
                              {item.handle}
                            </Link>
                          ) : (() => {
                            const username = item.handle.replace(/^@+/, "");
                            if (
                              username &&
                              username !== "Anonymous" &&
                              !username.startsWith("[forbidden_author]")
                            ) {
                              return (
                                <Link
                                  to={`/profile/${encodeURIComponent(username)}`}
                                  className="max-w-full truncate px-3 py-1 border border-spora-primary bg-spora-primary/20 text-spora-primary hover:bg-spora-primary hover:text-spora-primary-light transition-colors cursor-pointer no-underline"
                                  title="View profile"
                                >
                                  {item.handle}
                                </Link>
                              );
                            }
                            return (
                              <span className="max-w-full truncate px-3 py-1 border border-spora-primary bg-spora-primary text-spora-primary-light">
                                {item.handle}
                              </span>
                            );
                          })()}
                        </span>
                        {j < rowItems.length - 1 ? lineageDash : null}
                      </Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 border border-[var(--spora-primary)] bg-spora-primary-light">
          <button
            type="button"
            onClick={() => setShowAnalysis((v) => !v)}
            className="w-full text-left border border-[var(--spora-primary)] px-4 py-2 font-supply-mono text-overline-xs uppercase tracking-widest text-spora-primary/70 hover:text-spora-primary hover:bg-spora-primary-lighter transition-colors"
          >
            {showAnalysis ? "− Hide analysis" : "+ Show analysis"}
          </button>

          {showAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="border border-[var(--spora-primary)] p-4 md:p-5 ">
              <div className="font-supply-mono text-caption-2xs uppercase tracking-widest text-spora-primary/60 mb-2">
                Generation stats
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-overline-xs sm:text-xs text-spora-primary/90">
                <div className="flex justify-between">
                  <span className="opacity-70">WORDS</span>
                  <span className="text-spora-primary">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">CHARS</span>
                  <span className="text-spora-primary">{charCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">LINES</span>
                  <span className="text-spora-primary">{lineCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">WORDS/LINE</span>
                  <span className="text-spora-primary">{avgWordsPerLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SEED HASH</span>
                  <span className="text-spora-primary">{seedHex.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">UNIT</span>
                  <span className="text-spora-primary">{derived.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">GEN</span>
                  <span className="text-spora-primary">{derived.generation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">MOOD</span>
                  <span className="text-spora-primary">
                    {(morph?.dominantMood ?? "neutral").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-[var(--spora-primary)] p-4 md:p-5 ">
              <div className="font-supply-mono text-caption-2xs uppercase tracking-widest text-spora-primary/60 mb-2">
                Morphology analysis
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-overline-xs sm:text-xs text-spora-primary/90">
                <div className="flex justify-between">
                  <span className="opacity-70">SENTIMENT_FORCE</span>
                  <span className="text-spora-primary">
                    {morph?.sentimentStrength != null
                      ? String(morph.sentimentStrength)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">ENTROPY_INDEX</span>
                  <span className="text-spora-primary">
                    {morph?.entropy != null
                      ? morph.entropy.toFixed(3)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">VOCALIC_DENSITY</span>
                  <span className="text-spora-primary">
                    {morph?.vowelDensity != null
                      ? morph.vowelDensity.toFixed(3)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SIBILANCE_LVL</span>
                  <span className="text-spora-primary">
                    {morph?.sibilanceIndex != null
                      ? morph.sibilanceIndex.toFixed(3)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">RHYTHM_DELTA</span>
                  <span className="text-spora-primary">
                    {morph?.avgLengthDelta != null
                      ? morph.avgLengthDelta.toFixed(2)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-[var(--spora-primary)] p-4 md:p-5 ">
              <div className="font-supply-mono text-caption-2xs uppercase tracking-widest text-spora-primary/60 mb-2">
                Mapped parameters
              </div>

              <div className="flex flex-col gap-1.5 font-supply-mono text-overline-xs sm:text-xs text-spora-primary/90">
                <div className="flex justify-between">
                  <span className="opacity-70">GEOM_SCALE</span>
                  <span className="text-spora-primary">
                    {labState?.geometry?.scale != null
                      ? labState.geometry.scale.toFixed(2)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">WIND_FORCE</span>
                  <span className="text-spora-primary">
                    {labState?.wind?.strength != null
                      ? labState.wind.strength.toFixed(2)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">CHAOS_JITTER</span>
                  <span className="text-spora-primary">
                    {labState?.chaos?.jitter != null
                      ? labState.chaos.jitter.toFixed(2)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SCRAMBLE_DNA</span>
                  <span className="text-spora-primary">
                    {labState?.chaos?.scrambleForce != null
                      ? labState.chaos.scrambleForce.toFixed(2)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">PULSE_WAVE</span>
                  <span className="text-spora-primary">
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

      {showReportModal && flora && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="w-full max-w-md border border-[var(--spora-primary)]  bg-spora-primary-light p-6 font-supply-mono">
            <div className="flex items-center justify-between mb-4">
              <h2
                id="report-modal-title"
                className="text-sm font-bold uppercase tracking-wider"
              >
                Report Flora
              </h2>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1 hover:bg-spora-primary/10 transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {reportSuccess ? (
              <p className="text-xs text-spora-primary/80 mb-4">
                Report submitted. Thank you for helping keep the community safe.
              </p>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!reportReason.trim()) return;
                  setReportSubmitting(true);
                  setReportError(null);
                  try {
                    await createReport(
                      flora._id,
                      reportCategory,
                      reportReason.trim(),
                      reportDescription.trim() || undefined
                    );
                    setReportSuccess(true);
                    setTimeout(() => setShowReportModal(false), 2000);
                  } catch (err) {
                    setReportError(
                      err instanceof Error ? err.message : "Failed to submit report"
                    );
                  } finally {
                    setReportSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="report-category"
                    className="block text-overline-xs uppercase tracking-wider mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="report-category"
                    value={reportCategory}
                    onChange={(e) =>
                      setReportCategory(e.target.value as ReportCategory)
                    }
                    className="w-full border border-[var(--spora-primary)] bg-white px-3 py-2 text-xs"
                  >
                    <option value="spam">Spam</option>
                    <option value="harassment">Harassment</option>
                    <option value="inappropriate">Inappropriate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="report-reason"
                    className="block text-overline-xs uppercase tracking-wider mb-1"
                  >
                    Reason (required, max 100 chars)
                  </label>
                  <input
                    id="report-reason"
                    type="text"
                    value={reportReason}
                    onChange={(e) =>
                      setReportReason(e.target.value.slice(0, 100))
                    }
                    maxLength={100}
                    required
                    className="w-full border border-[var(--spora-primary)] bg-white px-3 py-2 text-xs"
                    placeholder="Brief reason for this report"
                  />
                  <span className="text-caption-2xs opacity-70">
                    {reportReason.length}/100
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="report-description"
                    className="block text-overline-xs uppercase tracking-wider mb-1"
                  >
                    Additional details (optional, max 500 chars)
                  </label>
                  <textarea
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) =>
                      setReportDescription(e.target.value.slice(0, 500))
                    }
                    maxLength={500}
                    rows={3}
                    className="w-full border border-[var(--spora-primary)] bg-white px-3 py-2 text-xs resize-none"
                    placeholder="Any additional context"
                  />
                  <span className="text-caption-2xs opacity-70">
                    {reportDescription.length}/500
                  </span>
                </div>
                {reportError && (
                  <p className="text-overline-xs text-rose-500">{reportError}</p>
                )}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 border border-spora-primary hover:bg-spora-primary hover:text-spora-primary-light text-overline-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting || !reportReason.trim()}
                    className="px-3 py-1.5 border border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-spora-primary-hover text-overline-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reportSubmitting ? "Submitting…" : "Submit report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <FooterAlter />
    </div>
  );
}

