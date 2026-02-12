import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import FooterAlter from "@/components/home/FooterAlter";
import { generateFloraData, type FloraItem } from "@/data/flora-data";

interface FloraLocationState {
  flora?: FloraItem;
}

export default function FloraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FloraLocationState | null;

  const allFloras = generateFloraData(48);
  const fallbackFlora = allFloras[0];
  const flora =
    state?.flora ?? allFloras.find((item) => item.id === id) ?? fallbackFlora;

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");

    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  const baseText = flora.excerpt ?? "";
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

  const seedHex = flora.seed.replace("#", "").slice(0, 6);
  const seedInt = parseInt(seedHex, 16) || 0;
  const normSeed = seedInt / 0xffffff;

  const sentimentIndex = normSeed;
  const sentimentLabel =
    sentimentIndex < 0.33
      ? "MELANCHOLIC"
      : sentimentIndex < 0.66
      ? "NEUTRAL"
      : "BRIGHT";

  const rhythmIndex =
    avgWordsPerLine <= 6 ? "STACCATO" : avgWordsPerLine <= 12 ? "BALANCED" : "FLOWING";

  const structureLabel =
    lineCount <= 3
      ? "FRAGMENTED"
      : lineCount <= 6
      ? "FREE VERSE"
      : "DENSE STANZAS";

  const noiseLevel = Math.round((0.3 + normSeed * 0.5) * 100) / 100;
  const paletteLabel = sentimentIndex < 0.5 ? "COOL-LEANING" : "WARM-LEANING";

  const lineageHandles = [
    "@FranBarreno",
    "@SporaLab",
    "@GenArtist",
    "@FloraGen",
    flora.author,
  ];

  const detailText = `${flora.excerpt}

This flora was generated from a unique text input. Its morphology is influenced by sentiment, rhythm, and structural patterns in the original words. Variations can branch from this unit while keeping a shared lineage through its soil and generation metadata.`;

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

          <div className="bg-[#262626] text-[#E9E9E9] border-2 border-[#262626] px-6 py-4 md:py-5">
            <h1 className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl leading-none mb-2">
              {flora.title}
            </h1>
            <p className="font-supply-mono text-[11px] sm:text-xs">
              by{" "}
              <span className="font-semibold">
                {flora.author}
              </span>{" "}
              | ID {flora.id} | {flora.generation}
            </p>
          </div>
        </section>

        <section className="border-l-2 border-t-2 border-[#262626] bg-[#E9E9E9]">
          <div className="grid lg:grid-cols-[1.15fr,1.85fr]">
            <article className="border-r-2 border-b-2 border-[#262626] p-4 md:p-6 flex flex-col gap-4">
              <div className="bg-[#262626] text-[#E9E9E9] px-4 py-2 border border-[#262626] flex items-center justify-between font-supply-mono text-[11px] uppercase tracking-[0.25em]">
                <span>FLORA</span>
                <span className="text-[9px] opacity-80">
                  SEED {flora.seed}
                </span>
              </div>

              <div className="border-2 border-[#262626] bg-[#E9E9E9] p-4 md:p-5 font-supply-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap">
                {detailText}
              </div>
            </article>

            <section className="border-r-2 border-b-2 border-[#262626] relative">
              <div
                className="w-full h-full bg-[#E9E9E9]"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={flora.image}
                  alt={flora.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(80%) contrast(120%)" }}
                />
              </div>

              <div className="absolute bottom-4 right-4 bg-[#E3E3E3] border border-[#262626] px-4 py-3 font-supply-mono text-[10px] sm:text-xs text-[#262626]">
                <p>SOIL: {flora.seed}</p>
                <p>GEN: {flora.generation}</p>
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
                  SENTIMENT:{" "}
                  <span className="text-[#262626]">{sentimentLabel}</span>
                </p>
                <p>
                  RHYTHM:{" "}
                  <span className="text-[#262626]">{rhythmIndex}</span>
                </p>
                <p>
                  STRUCTURE:{" "}
                  <span className="text-[#262626]">{structureLabel}</span>
                </p>
                <p>
                  NOISE LEVEL:{" "}
                  <span className="text-[#262626]">{noiseLevel}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  PALETTE:{" "}
                  <span className="text-[#262626]">{paletteLabel}</span>
                </p>
                <p>
                  SEED HASH:{" "}
                  <span className="text-[#262626]">{seedHex.toUpperCase()}</span>
                </p>
                <p>
                  UNIT: <span className="text-[#262626]">{flora.id}</span>
                </p>
                <p>
                  GEN: <span className="text-[#262626]">{flora.generation}</span>
                </p>
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

