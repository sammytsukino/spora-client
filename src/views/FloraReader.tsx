import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import { getFlora, type ApiFlora } from "@/lib/floras";
import { isLabFullAccessible } from "@/lib/auth";
import { useImageLuminance } from "@/hooks/useImageLuminance";
import { extractMorphology } from "@/lib/morphology";
import {
  buildLineageItems,
  chunkLineageItems,
  formatGeneration,
  formatSeed,
  getFloraDisplayImage,
  resolveAuthorUsernameForProfile,
  resolveAuthorUsernameFromHandle,
  resolveFloraAuthor,
} from "@/lib/floraPresentation";
import { AudioLines, Camera, Layers, Shuffle, Volume2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { navigateFloraViewBack, type FloraViewLocationState } from "@/lib/floraViewBack";
import SporaDetailsMenu, {
  readerChromeButtonClass,
  type SporaDetailsMenuTone,
} from "@/components/shared/SporaDetailsMenu";
import ReaderTutorialOverlay from "@/components/reader/ReaderTutorialOverlay";
import { getReaderTutorialDone } from "@/components/reader/readerTutorialStorage";
import SporaImageLoader, {
  SPORA_IFRAME_LOADER_MIN_MS,
} from "@/components/shared/SporaImageLoader";

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

const VELLUM_HOVER_DELAY_MS = 1000;

export default function FloraReader() {
  const [ambiencePlaying, setAmbiencePlaying] = useState(false);
  const ambienceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = ambienceRef.current;
    if (!audio) return;
    if (ambiencePlaying) {
      audio.currentTime = 0;
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
    };
  }, [ambiencePlaying]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FloraLocationState | null;

  const [flora, setFlora] = useState<ApiFlora | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReaderTutorial, setShowReaderTutorial] = useState(false);
  const [windStrength, setWindStrength] = useState(0.5);
  const [vellumOn, setVellumOn] = useState(false);
  const [, setInstallationReady] = useState(false);
  const [minLoadTimeElapsed, setMinLoadTimeElapsed] = useState(false);
  const installationRef = useRef<HTMLIFrameElement>(null);
  const floraSectionRef = useRef<HTMLElement>(null);
  const cuttingsRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const readerOptionsRef = useRef<HTMLDivElement>(null);
  const vellumHoverEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vellumHoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement>(null);
  const ttsObjectUrlRef = useRef<string | null>(null);
  const [ttsPhase, setTtsPhase] = useState<
    "idle" | "loading" | "playing" | "paused" | "error"
  >("idle");
  const [ttsError, setTtsError] = useState<string | null>(null);

  const [ttsSpeed, setTtsSpeed] = useState(0.8);

  const clearVellumHoverTimers = useCallback(() => {
    if (vellumHoverEnterTimerRef.current) {
      clearTimeout(vellumHoverEnterTimerRef.current);
      vellumHoverEnterTimerRef.current = null;
    }
    if (vellumHoverLeaveTimerRef.current) {
      clearTimeout(vellumHoverLeaveTimerRef.current);
      vellumHoverLeaveTimerRef.current = null;
    }
  }, []);

  const handleFloraTextHoverEnter = useCallback(() => {
    if (vellumHoverLeaveTimerRef.current) {
      clearTimeout(vellumHoverLeaveTimerRef.current);
      vellumHoverLeaveTimerRef.current = null;
    }
    if (vellumHoverEnterTimerRef.current) return;
    vellumHoverEnterTimerRef.current = setTimeout(() => {
      vellumHoverEnterTimerRef.current = null;
      setVellumOn(true);
    }, VELLUM_HOVER_DELAY_MS);
  }, []);

  const handleFloraTextHoverLeave = useCallback(() => {
    if (vellumHoverEnterTimerRef.current) {
      clearTimeout(vellumHoverEnterTimerRef.current);
      vellumHoverEnterTimerRef.current = null;
    }
    if (vellumHoverLeaveTimerRef.current) return;
    vellumHoverLeaveTimerRef.current = setTimeout(() => {
      vellumHoverLeaveTimerRef.current = null;
      setVellumOn(false);
    }, VELLUM_HOVER_DELAY_MS);
  }, []);

  const releaseTtsResources = useCallback(() => {
    const a = ttsAudioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    if (ttsObjectUrlRef.current) {
      URL.revokeObjectURL(ttsObjectUrlRef.current);
      ttsObjectUrlRef.current = null;
    }
  }, []);

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
      const { author, authorName } = resolveFloraAuthor(flora);
      const lineageItems = buildLineageItems(flora, author);
      const authorUsername = resolveAuthorUsernameForProfile(author, authorName);

      return {
        id: flora._id,
        title: flora.title,
        author,
        authorUsername,
        seed: formatSeed(flora),
        generation: formatGeneration(flora.lineage?.generation),
        image: getFloraDisplayImage(flora),
        text: flora.text ?? "",
        lineageItems: lineageItems.length
          ? lineageItems
          : [{ handle: author, floraId: flora._id }],
        status: flora.status ?? "blossoming",
      };
    }

    if (state?.flora) {
      const stateAuthor = state.flora.author;
      const stateCanLink = resolveAuthorUsernameFromHandle(stateAuthor);
      return {
        id: state.flora.id,
        title: state.flora.title,
        author: state.flora.author,
        authorUsername: stateCanLink,
        seed: state.flora.seed,
        generation: state.flora.generation || "GEN_0",
        image: state.flora.image,
        text: state.flora.excerpt ?? "",
        lineageItems: [{ handle: state.flora.author, floraId: state.flora.id }],
        status: "blossoming",
      };
    }

    return null;
  })();

  const theme = useImageLuminance(derived?.image);
  const isLightBg = theme === "light";
  const textColorClass = isLightBg ? "text-spora-primary" : "text-white";
  const readerTone: SporaDetailsMenuTone = isLightBg ? "light" : "dark";
  const readerChromeBtn = readerChromeButtonClass(readerTone);
  const textShadowStyle =
    !isLightBg ? { textShadow: "0 1px 2px rgba(0,0,0,0.5)" } : undefined;

  const baseText = derived?.text ?? "";
  const text = baseText.trim();
  const words = text.length > 0 ? text.split(/\s+/).filter((w) => w.length > 0) : [];
  const wordCount = words.length;
  const charCount = baseText.length;
  const morph = extractMorphology(baseText);
  const labState = flora?.generative?.labState as {
    geometry?: { scale?: number };
    wind?: { strength?: number };
    chaos?: { jitter?: number; scrambleForce?: number; pulse?: { active?: boolean; strength?: number } };
  } | undefined;

  useEffect(() => () => releaseTtsResources(), [releaseTtsResources]);

  useEffect(() => {
    clearVellumHoverTimers();
    queueMicrotask(() => setVellumOn(false));
  }, [derived?.id, clearVellumHoverTimers]);

  useEffect(() => () => clearVellumHoverTimers(), [clearVellumHoverTimers]);

  useEffect(() => {
    releaseTtsResources();
    queueMicrotask(() => {
      setTtsPhase("idle");
      setTtsError(null);
    });
  }, [derived?.id, releaseTtsResources]);

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");

    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDesktopLike =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(min-width: 768px)").matches
        : false;
    if (!isDesktopLike) return;
    if (!getReaderTutorialDone()) {
      queueMicrotask(() => {
        setShowReaderTutorial(true);
      });
    }
  }, []);

  useEffect(() => {
    const detailsSummary = document.querySelector<HTMLElement>(
      "summary.reader-details-tutorial-anchor"
    );
    if (detailsSummary) detailsRef.current = detailsSummary;
  }, [minLoadTimeElapsed, derived?.id]);

  const sendToInstallation = (msg: { type: string; [k: string]: unknown }) => {
    installationRef.current?.contentWindow?.postMessage(msg, window.location.origin);
  };

  useEffect(() => {
    const sendWind = () => {
      sendToInstallation({ type: "spora:setWind", active: windStrength > 0, strength: windStrength });
    };
    const t = setTimeout(sendWind, 500);
    return () => clearTimeout(t);
  }, [windStrength]);

  useEffect(() => {
    queueMicrotask(() => {
      setInstallationReady(false);
      setMinLoadTimeElapsed(false);
    });
  }, [id]);

  useEffect(() => {
    if (!derived?.id) return;
    const t = setTimeout(() => setMinLoadTimeElapsed(true), SPORA_IFRAME_LOADER_MIN_MS);
    return () => clearTimeout(t);
  }, [derived?.id]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "spora:reader-ready") setInstallationReady(true);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleRegenerate = () => sendToInstallation({ type: "spora:regenerate" });
  const handleCaptureImage = () => sendToInstallation({ type: "spora:capture" });

  const canListen =
    Boolean(derived?.id) &&
    (Boolean((derived?.title || "").trim()) || text.length > 0);

  const handleTtsStop = () => {
    releaseTtsResources();
    setTtsPhase("idle");
    setTtsError(null);
  };

  const handleTtsSpeedChange = (next: number) => {
    setTtsSpeed(next);
    if (ttsObjectUrlRef.current) {
      ttsAudioRef.current?.pause();
      releaseTtsResources();
      setTtsPhase("idle");
      setTtsError(null);
    }
  };

  const handleTtsMain = async () => {
    if (!derived?.id || ttsPhase === "loading") return;

    if (ttsPhase === "playing") {
      ttsAudioRef.current?.pause();
      setTtsPhase("paused");
      return;
    }

    if (ttsPhase === "paused" && ttsObjectUrlRef.current) {
      const bg = ambienceRef.current;
      if (bg) {
        bg.pause();
        bg.currentTime = 0;
      }
      setAmbiencePlaying(false);
      try {
        await ttsAudioRef.current?.play();
        setTtsPhase("playing");
      } catch {
        setTtsError("Playback failed");
        setTtsPhase("error");
      }
      return;
    }

    setTtsError(null);
    setTtsPhase("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/reader/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floraId: derived.id, speed: ttsSpeed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setTtsError(typeof data.error === "string" ? data.error : "Could not load voice");
        setTtsPhase("error");
        return;
      }
      const blob = await res.blob();
      releaseTtsResources();
      const url = URL.createObjectURL(blob);
      ttsObjectUrlRef.current = url;
      const audio = ttsAudioRef.current;
      if (!audio) {
        URL.revokeObjectURL(url);
        ttsObjectUrlRef.current = null;
        setTtsPhase("error");
        setTtsError("Audio unavailable");
        return;
      }
      audio.src = url;
      const bg = ambienceRef.current;
      if (bg) {
        bg.pause();
        bg.currentTime = 0;
      }
      setAmbiencePlaying(false);
      await audio.play();
      setTtsPhase("playing");
    } catch {
      setTtsError("Network error");
      setTtsPhase("error");
    }
  };

  if (isLoading && !derived) {
    return (
      <div className="fixed inset-0 z-10050 bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main className="flex min-h-screen items-center justify-center pt-24 px-6">
          <SporaImageLoader />
        </main>
      </div>
    );
  }

  if (error || !derived) {
    return (
      <div className="fixed inset-0 bg-spora-primary-light">
        <TransparentNavbar showScrollBackground />
        <main className="flex min-h-screen items-center justify-center pt-24 px-6">
          <p className="font-supply-mono text-xs uppercase tracking-[0.25em] text-spora-primary">
            Could not load this Flora.
          </p>
        </main>
      </div>
    );
  }


  const installationSrc = `/Installation.html?floraId=${encodeURIComponent(derived.id)}&reader=1&apiBase=${encodeURIComponent(API_BASE_URL)}`;
  const canReveal = minLoadTimeElapsed;

  const lineageRows = chunkLineageItems(derived.lineageItems);

  const lineageDash = (
    <span
      className="flex w-3 shrink-0 items-center justify-center self-stretch"
      aria-hidden
    >
      <span
        className={`block h-px w-3 ${isLightBg ? "bg-spora-primary" : "bg-white/60"}`}
      />
    </span>
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-300 ${
          canReveal ? "opacity-100" : "opacity-0"
        }`}
      >
        <iframe
          ref={installationRef}
          src={installationSrc}
          title="Flora visualization"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          aria-hidden
          onLoad={() => sendToInstallation({ type: "spora:setWind", active: windStrength > 0, strength: windStrength })}
        />
      </div>

      <div
        className={`flora-reader-vellum z-5 ${
          isLightBg ? "flora-reader-vellum--paper" : "flora-reader-vellum--ink"
        }`}
        style={{ opacity: vellumOn && canReveal ? 1 : 0 }}
        aria-hidden
      />
      <div
        className="flora-reader-grain z-6"
        style={{ opacity: vellumOn && canReveal ? 0.5 : 0 }}
        aria-hidden
      />

      <div
        className={`fixed inset-0 z-10050 flex items-center justify-center bg-spora-primary-light transition-opacity duration-normal ${
          canReveal ? "opacity-0 pointer-events-none" : ""
        }`}
        aria-hidden
      >
        <SporaImageLoader />
      </div>

      <TransparentNavbar showScrollBackground useLightText={!isLightBg} />

      <main className="relative z-10 flex h-screen flex-col overflow-hidden pt-20 pb-24 px-6 md:px-12 lg:px-16">
        <div className="flex flex-1 min-h-0 gap-6 md:gap-10">
          <div className="flex flex-col flex-1 min-w-0 min-h-0">
            <div className="mb-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigateFloraViewBack(navigate, location.pathname, state)}
                className={`font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase flex items-center gap-2 hover:underline cursor-pointer ${textColorClass}`}
                style={textShadowStyle}
              >
                <span className="text-lg">←</span>
                <span>Back</span>
              </button>
            </div>

            <article
              ref={floraSectionRef}
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
                  {derived.authorUsername ? (
                    <Link
                      to={`/profile/${derived.authorUsername}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {derived.author}
                    </Link>
                  ) : (
                    derived.author
                  )}{" "}
                  · {derived.seed}
                </p>
              </header>

              <div
                className="flora-reader-scroll font-bizud-mincho-bold text-[15px] sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap flex-1 min-h-0 pr-2"
                style={textShadowStyle}
                onMouseEnter={handleFloraTextHoverEnter}
                onMouseLeave={handleFloraTextHoverLeave}
              >
                {text || (
                  <span className="opacity-70 italic">No text in this Flora.</span>
                )}
              </div>
            </article>

            <div className="mt-8">
              {derived.status === "blossoming" ? (
                <button
                  ref={(node) => {
                    cuttingsRef.current = node;
                  }}
                  type="button"
                  onClick={() => {
                    const labPath = isLabFullAccessible()
                      ? ROUTES.LABORATORY_FULL
                      : ROUTES.LABORATORY;
                    navigate(`${labPath}?floraId=${encodeURIComponent(derived.id)}`);
                  }}
                  className={`font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase cursor-pointer transition-colors ${readerChromeBtn} ${textColorClass}`}
                >
                  Make a Cutting · Cuttings allowed
                </button>
              ) : derived.status === "sealed" ? (
                <span
                  ref={(node) => {
                    cuttingsRef.current = node;
                  }}
                  className={`font-supply-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase ${readerChromeBtn} ${textColorClass}`}
                  style={textShadowStyle}
                >
                  Sealed
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 min-w-0">
            <SporaDetailsMenu
              label="Details"
              placement="down"
              align="end"
              tone={readerTone}
              className={`w-full min-w-[220px] max-w-[280px] ${textColorClass}`}
              summaryClassName="mb-0 reader-details-tutorial-anchor"
              summaryStyle={textShadowStyle}
              panelClassName="flora-reader-scroll max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 text-[10px] sm:text-xs"
              panelStyle={textShadowStyle}
              aria-label="Flora details and analysis"
            >
                <section className="pt-1 pb-2">
                  <div className="uppercase tracking-widest mb-2 opacity-70">
                    Lineage
                  </div>
                  <div className="flex flex-col gap-y-2 min-w-0">
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
                                    className={`max-w-full truncate px-2 py-1 border transition-colors cursor-pointer no-underline hover:opacity-80 ${
                                      isLightBg
                                        ? "border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-spora-primary-light hover:text-spora-primary"
                                        : "border-white bg-white/20 text-white hover:bg-white hover:text-spora-primary"
                                    }`}
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
                                        className={`max-w-full truncate px-2 py-1 border transition-colors cursor-pointer no-underline hover:opacity-80 ${
                                          isLightBg
                                            ? "border-spora-primary bg-spora-primary/20 text-spora-primary hover:bg-spora-primary hover:text-spora-primary-light"
                                            : "border-white/60 bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                        title="View profile"
                                      >
                                        {item.handle}
                                      </Link>
                                    );
                                  }
                                  return (
                                    <span
                                      className={`max-w-full truncate px-2 py-1 border ${
                                        isLightBg
                                          ? "border-spora-primary bg-spora-primary/20 text-spora-primary"
                                          : "border-white/60 bg-white/10 text-white"
                                      }`}
                                    >
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
            </SporaDetailsMenu>
          </div>
        </div>
      </main>

      <div
        ref={readerOptionsRef}
        className={`fixed bottom-24 right-6 md:right-12 lg:right-16 z-20 pointer-events-auto ${textColorClass}`}
        style={textShadowStyle}
      >
        <SporaDetailsMenu
          label="Reader options"
          placement="up"
          align="end"
          tone={readerTone}
          className={`w-full min-w-[220px] max-w-[280px] ${textColorClass}`}
          summaryClassName="mb-0"
          summaryStyle={textShadowStyle}
          panelStyle={textShadowStyle}
          panelClassName="flora-reader-scroll max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 text-[10px] sm:text-xs !items-start text-left"
          aria-label="Reader options: layout, wind, ambience, listen"
        >
          <div className="flex w-full flex-col items-start gap-2">
            <button
              type="button"
              onClick={handleRegenerate}
              className="flex w-full cursor-pointer items-center justify-start gap-2 border-0 bg-transparent px-0 py-1 text-left shadow-none transition-opacity hover:underline"
            >
              <Shuffle className="h-4 w-4 shrink-0" size={16} strokeWidth={2} aria-hidden />
              <span>Shuffle layout</span>
            </button>
            <button
              type="button"
              onClick={handleCaptureImage}
              className="flex w-full cursor-pointer items-center justify-start gap-2 border-0 bg-transparent px-0 py-1 text-left shadow-none transition-opacity hover:underline"
            >
              <Camera className="h-4 w-4 shrink-0" size={16} strokeWidth={2} aria-hidden />
              <span>Capture image</span>
            </button>
            <div className="flex w-full flex-col items-start gap-1">
              <label htmlFor="reader-wind" className="whitespace-nowrap opacity-80">
                Wind
              </label>
              <input
                id="reader-wind"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={windStrength}
                onChange={(e) => setWindStrength(parseFloat(e.target.value))}
                className="w-full max-w-[220px] cursor-pointer"
                style={{ accentColor: isLightBg ? "var(--spora-primary)" : "white" }}
              />
            </div>
            <button
              type="button"
              onClick={() => setAmbiencePlaying((v) => !v)}
              className="flex w-full items-center justify-start gap-2 border-0 bg-transparent px-0 py-1 text-left shadow-none no-underline transition-opacity hover:underline"
              aria-pressed={ambiencePlaying}
            >
              <AudioLines className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              <span>{ambiencePlaying ? "Pause ambience" : "Ambience"}</span>
            </button>
            <button
              type="button"
              onClick={() => setVellumOn((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-start gap-2 border-0 bg-transparent px-0 py-1 text-left shadow-none transition-opacity hover:underline"
              aria-pressed={vellumOn}
            >
              <Layers className="h-4 w-4 shrink-0" size={16} strokeWidth={2} aria-hidden />
              <span>{vellumOn ? "Vellum: on" : "Vellum: off"}</span>
            </button>
          </div>

          <div
            className="w-full min-w-0 self-stretch shrink-0 py-1 px-2"
            role="separator"
            aria-hidden
          >
            <span
              className={`block h-px w-full min-w-0 ${isLightBg ? "bg-spora-primary/30" : "bg-white/40"}`}
            />
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <span className="flex w-full items-center justify-start gap-1.5 text-[10px] normal-case tracking-normal opacity-80 sm:text-[11px]">
              <Volume2 className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              Listen
            </span>
            <div className="flex w-full flex-col items-start gap-1">
              <label htmlFor="reader-tts-speed" className="whitespace-nowrap opacity-80">
                Speed
              </label>
              <div className="flex w-full max-w-[220px] flex-wrap items-center justify-start gap-2">
                <input
                  id="reader-tts-speed"
                  type="range"
                  min={0.65}
                  max={1.35}
                  step={0.05}
                  value={ttsSpeed}
                  onChange={(e) => handleTtsSpeedChange(parseFloat(e.target.value))}
                  className="min-w-[100px] flex-1 cursor-pointer"
                  style={{ accentColor: isLightBg ? "var(--spora-primary)" : "white" }}
                />
                <span
                  className="min-w-10 shrink-0 text-[10px] tabular-nums normal-case opacity-80"
                  aria-live="polite"
                >
                  {ttsSpeed.toFixed(2)}×
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-start gap-3">
              <button
                type="button"
                onClick={() => void handleTtsMain()}
                disabled={!canListen || ttsPhase === "loading"}
                className="border-0 bg-transparent px-0 py-1 shadow-none transition-opacity hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                {ttsPhase === "loading"
                  ? "Generating…"
                  : ttsPhase === "playing"
                    ? "Pause"
                    : ttsPhase === "paused"
                      ? "Resume"
                      : "Play"}
              </button>
              <button
                type="button"
                onClick={handleTtsStop}
                disabled={ttsPhase === "idle"}
                className="border-0 bg-transparent px-0 py-1 shadow-none transition-opacity hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                Stop
              </button>
            </div>
            {ttsError && (
              <p
                className={`text-left text-[10px] font-medium leading-snug normal-case tracking-normal ${
                  isLightBg ? "text-rose-500" : "text-rose-300"
                }`}
              >
                {ttsError}
              </p>
            )}
          </div>
        </SporaDetailsMenu>

        <audio
          ref={ambienceRef}
          src="https://res.cloudinary.com/dqgiuadyw/video/upload/q_auto/f_auto/v1779559592/ambient_yoptg8.mp3"
          loop
          className="hidden"
        />
        <audio
          ref={ttsAudioRef}
          className="hidden"
          onEnded={() => {
            releaseTtsResources();
            setTtsPhase("idle");
          }}
        />
      </div>
      {showReaderTutorial && canReveal ? (
        <ReaderTutorialOverlay
          floraRef={floraSectionRef}
          detailsRef={detailsRef}
          cuttingsRef={cuttingsRef}
          optionsRef={readerOptionsRef}
          onClose={() => setShowReaderTutorial(false)}
        />
      ) : null}
    </div>
  );
}

