import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LaboratoryNavbar from "@/components/laboratory/laboratory-navbar";
import Grainient from "@/components/Grainient";
import { floraImages } from "@/data/flora-data";
import TextInput from "@/components/laboratory/text-input";
import CyclingLogo from "@/components/home/cycling-logo";
import ConfirmModal from "@/components/common/confirm-modal";

const LAB_COLOR1 = ["#e3e3e3", "#e3e3e3", "#e3e3e3", "#e3e3e3", "#e3e3e3", "#e3e3e3"] as const;
const LAB_COLOR2 = ["#dd4aff", "#dd4aff", "#00dcff", "#f4ef40", "#ff64ff", "#52ff5a"] as const;
const LAB_COLOR3 = ["#00dcff", "#f4ef40", "#52ff5a", "#52ff5a", "#00dcff", "#ff64ff"] as const;

export default function Laboratory() {
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [tweaks, setTweaks] = useState("");
  const [generatedFlora, setGeneratedFlora] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState(
    () => Math.random().toString(16).substr(2, 6).toUpperCase()
  );
  const [generation, setGeneration] = useState(0);
  const [highContrast, setHighContrast] = useState(true);
  const [extraGrain, setExtraGrain] = useState(false);
  const [loopPreview, setLoopPreview] = useState(false);
  const [sidebarScrollProgress, setSidebarScrollProgress] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingExitPath, setPendingExitPath] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const wordCount =
    inputText.trim().length > 0
      ? inputText
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;
  const lineCount = inputText.length > 0 ? inputText.split(/\n/).length : 0;

  const handleGenerate = (destination?: "/garden" | "/greenhouse") => {
    if (inputText.trim().length < 10) {
      alert("Please enter at least 10 characters");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const randomImage =
        floraImages[Math.floor(Math.random() * floraImages.length)];
      setGeneratedFlora(randomImage);
      setIsGenerating(false);
      setGeneration((prev) => prev + 1);
      if (destination) {
        navigate(destination);
      }
    }, 1500);
  };

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const docHeight = scrollHeight - clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setSidebarScrollProgress(Math.max(0, Math.min(100, progress)));
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--spora-primary)]">
      <LaboratoryNavbar
        onNavigateRequest={(path) => {
          setPendingExitPath(path);
          setShowExitModal(true);
        }}
      />

      <aside className="fixed top-0 left-0 bottom-0 w-[20vw] min-w-[260px] max-w-sm bg-[var(--spora-primary-lighter)] text-[var(--spora-primary)] border-r-2 border-[var(--spora-primary)] z-20">
        <div
          ref={sidebarRef}
          className="h-full lab-scroll flex flex-col"
        >
          <div className="w-full h-[2px] bg-transparent">
            <div
              className="h-full transition-all duration-150 ease-out"
              style={{
                width: `${sidebarScrollProgress}%`,
                backgroundColor: "var(--spora-primary)",
              }}
            />
          </div>

          <div className="p-4 sm:p-6 flex flex-col gap-6">
            <div className="flex justify-center mb-2">
              <button
                type="button"
                onClick={() => {
                  setPendingExitPath("/home");
                  setShowExitModal(true);
                }}
                className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] cursor-pointer"
              >
                <CyclingLogo
                  logos={[
                    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready5_czorye.svg",
                    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready4_tnwrxb.svg",
                    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready3_wtlf0u.svg",
                    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready2_f5swhs.svg",
                    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready1_psvx4m.svg",
                  ]}
                  width="clamp(6rem, 10vw, 9rem)"
                  height="clamp(72px, 8vw, 120px)"
                  cycleDuration={0.25}
                />
              </button>
            </div>

            <section>
              <h2 className="font-supply-mono text-xs uppercase tracking-[0.3em] mb-2">
                TITLE
              </h2>
              <div className="border-2 border-[var(--spora-primary)] bg-[var(--spora-primary-lighter)] transition-colors duration-200 focus-within:border-[var(--spora-accent-secondary)]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent font-supply-mono text-sm text-[var(--spora-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--spora-accent-secondary)] focus-visible:ring-offset-2"
                  placeholder="Give your flora a name..."
                />
              </div>
            </section>

            <section className="flex flex-col">
              <h2 className="font-supply-mono text-xs uppercase tracking-[0.3em] mb-2">
                YOUR WORDS
              </h2>
              <TextInput
                value={inputText}
                onChange={setInputText}
                placeholder="Write something meaningful. Your words will become a unique flora..."
                maxLength={500}
              />
            </section>

            <section className="flex flex-col">
              <h2 className="font-supply-mono text-xs uppercase tracking-[0.3em] mb-2">
                TWEAKS
              </h2>
              <div className="border-2 border-[var(--spora-primary)] bg-[var(--spora-primary)]">
                <textarea
                  value={tweaks}
                  onChange={(e) => setTweaks(e.target.value)}
                  className="w-full h-32 p-4 font-supply-mono text-xs bg-[var(--spora-primary)] text-[var(--spora-text-secondary)] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spora-text-secondary)] placeholder:text-neutral-500"
                  placeholder="Optional notes, constraints, or style hints for your flora..."
                />
              </div>
            </section>

            <section>
              <h2 className="font-supply-mono text-xs uppercase tracking-[0.3em] mb-2">
                STATS
              </h2>
              <div className="border-2 border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-lighter)] font-supply-mono text-[10px] sm:text-xs px-3 py-2 space-y-1">
                <p>WORDS: <span className="text-stone-300">{wordCount}</span></p>
                <p>CHARS: <span className="text-stone-300">{inputText.length}</span></p>
                <p>LINES: <span className="text-stone-300">{lineCount}</span></p>
                <p>SEED: <span className="text-stone-300">#{seed}</span></p>
                <p>GEN: <span className="text-stone-300">{generation}</span></p>
              </div>
            </section>

            <section>
              <h2 className="font-supply-mono text-xs uppercase tracking-[0.3em] mb-2">
                RENDER CONTROLS
              </h2>
              <div className="border-2 border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-text-secondary)] font-supply-mono text-[10px] sm:text-xs px-3 py-3 space-y-3">
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>High contrast</span>
                  <input
                    type="checkbox"
                    className="accent-[var(--spora-primary-lighter)]"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Extra grain</span>
                  <input
                    type="checkbox"
                    className="accent-[var(--spora-primary-lighter)]"
                    checked={extraGrain}
                    onChange={(e) => setExtraGrain(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Loop preview</span>
                  <input
                    type="checkbox"
                    className="accent-[var(--spora-primary-lighter)]"
                    checked={loopPreview}
                    onChange={(e) => setLoopPreview(e.target.checked)}
                  />
                </label>
                <button
                  type="button"
                  className="w-full mt-1 border-2 border-[var(--spora-primary-lighter)] text-[var(--spora-primary-lighter)] py-1.5 hover:bg-[var(--spora-primary-lighter)] hover:text-[var(--spora-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--spora-primary-lighter)]"
                  onClick={() =>
                    setSeed(
                      Math.random().toString(16).substr(2, 6).toUpperCase()
                    )
                  }
                >
                  REROLL SEED
                </button>
              </div>
            </section>
          </div>

          <div className="p-4 sm:p-6 flex gap-2 border-t-2 border-[var(--spora-primary)] mt-4">
            <button
              type="button"
              className="flex-1 py-5 bg-[var(--spora-primary)] text-[var(--spora-text-secondary)] font-supply-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase border-2 border-[var(--spora-primary)] hover:bg-[#1c1c1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--spora-text-secondary)]"
              disabled={isGenerating || inputText.trim().length < 10}
              onClick={() => handleGenerate("/greenhouse")}
            >
              PUBLISH<br />SEALED
            </button>
            <button
              type="button"
              className="flex-1 py-5 bg-[var(--spora-primary-lighter)] text-[var(--spora-primary)] font-supply-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase border-2 border-[var(--spora-primary)] hover:bg-[#f5f5f5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)]"
              onClick={() => handleGenerate("/garden")}
              disabled={isGenerating || inputText.trim().length < 10}
            >
              PUBLISH<br />BLOSSOMING
            </button>
          </div>
        </div>
      </aside>

      <section className="fixed top-0 bottom-0 right-0 overflow-hidden z-10 left-[clamp(260px,20vw,24rem)]">
        <div className="absolute inset-0">
          <Grainient
            color1={LAB_COLOR1 as unknown as string[]}
            color2={LAB_COLOR2 as unknown as string[]}
            color3={LAB_COLOR3 as unknown as string[]}
            timeSpeed={0.4}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={1.5}
            warpAmplitude={40}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={400}
            noiseScale={2}
            grainAmount={extraGrain ? 0.2 : 0.12}
            grainScale={2}
            grainAnimated={loopPreview}
            contrast={highContrast ? 1.6 : 1.2}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center p-6 pt-16">
          {generatedFlora ? (
            <img
              src={generatedFlora}
              alt="Generated Flora"
              className="max-h-[70vh] w-auto border-2 border-[#262626] shadow-[0_0_0_4px_#e3e3e3]"
            />
          ) : (
            <div className="border-2 border-[#e3e3e3] bg-black backdrop-blur-sm px-6 py-4 font-supply-mono text-xs text-stone-200">
              TYPE YOUR WORDS ON THE LEFT AND PUBLISH BLOSSOMING TO GROW A NEW
              FLORA.
            </div>
          )}
        </div>

        <div className="absolute bottom-6 right-6 bg-[#e3e3e3] border-2 border-[#262626] px-4 py-3 font-supply-mono text-[10px] sm:text-xs text-[#262626]">
          <p>SOIL: LAB/ALPHA</p>
          <p>SENTIMENT: PENDING</p>
          <p>GEN: {generatedFlora ? `GEN_${generation}` : "—"}</p>
        </div>
      </section>

      {(() => {
        const label =
          pendingExitPath === "/garden"
            ? "GO TO GARDEN"
            : pendingExitPath === "/greenhouse"
            ? "GO TO GREENHOUSE"
            : pendingExitPath === "/laboratory"
            ? "STAY IN LAB"
            : "GO HOME";

        return (
          <ConfirmModal
            open={showExitModal}
            title="Leave the Laboratory?"
            description="If you leave the Laboratory you'll lose the current words, tweaks and generation settings for this flora."
            cancelLabel="STAY HERE"
            confirmLabel={label}
            onCancel={() => setShowExitModal(false)}
            onConfirm={() => {
              setShowExitModal(false);
              navigate(pendingExitPath ?? "/home");
            }}
          />
        );
      })()}

    </div>
  )
}
