import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import { floraImages } from "@/data/flora-data";
import { getFlora, type ApiFlora } from "@/lib/floras";
import { isLabFullAccessible } from "@/lib/auth";
import { useImageLuminance } from "@/hooks/useImageLuminance";

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

export default function FloraReader() {
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

      return {
        id: flora._id,
        title: flora.title,
        author,
        seed: formatSeed(flora),
        image:
          flora.thumbnailUrl ??
          floraImages[Math.abs(flora._id.charCodeAt(0)) % floraImages.length],
        text: flora.text ?? "",
        status: flora.status ?? "blossoming",
      };
    }

    if (state?.flora) {
      return {
        id: state.flora.id,
        title: state.flora.title,
        author: state.flora.author,
        seed: state.flora.seed,
        image: state.flora.image,
        text: state.flora.excerpt ?? "",
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

  const baseText = derived.text.trim();

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

      {/* z1: text overlay top-left */}
      <main className="relative z-10 flex flex-col min-h-screen pt-20 pb-24 px-6 md:px-12 lg:px-16">
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
          <Link
            to={`/flora/${encodeURIComponent(derived.id)}/details`}
            className={`font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:underline ${textColorClass}`}
            style={textShadowStyle}
          >
            Details
          </Link>
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
            className={`flora-text-scroll font-bizud-mincho text-[15px] sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap flex-1 overflow-y-auto pr-2 ${
              !isLightBg ? "flora-text-scroll-light" : ""
            }`}
            style={textShadowStyle}
          >
            {baseText || (
              <span className="opacity-70 italic">No text in this flora.</span>
            )}
          </div>
        </article>

        {/* CTA: Make a Cutting */}
        <div className="mt-8">
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
            Make a Cutting
            {derived.status === "blossoming" && " · Cuttings allowed"}
          </button>
        </div>
      </main>
    </div>
  );
}
