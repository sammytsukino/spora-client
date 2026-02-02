import { useState, useEffect } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";
import PageTitle from "@/components/ui/page-title";
import FloraGenerator from "@/components/laboratory/flora-generator";
import { floraImages } from "@/data/flora-data";

export default function Laboratory() {
  const [generatedFlora, setGeneratedFlora] = useState<string | null>(null);

  const handleGenerate = (_text: string) => {
    const randomImage = floraImages[Math.floor(Math.random() * floraImages.length)];
    setGeneratedFlora(randomImage);
  };

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-[#262626]">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(03)LABORATORY"
          title="CREATE YOUR OWN FLORA"
          description="Transform your words into generative art. Each text input creates a unique visual organism."
          className="mb-12"
          theme="dark"
        />

        <div className="max-w-6xl mx-auto">
          <FloraGenerator onGenerate={handleGenerate} />

          {generatedFlora && (
            <div className="mt-12 border-2 border-lime-300 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <img
                    src={generatedFlora}
                    alt="Generated Flora"
                    className="w-full max-w-md mx-auto border-2 border-[#262626]"
                  />
                </div>
                <div className="flex-1 text-stone-200">
                  <h3 className="font-bizud-mincho-bold text-3xl mb-4">
                    Your Flora is Ready
                  </h3>
                  <p className="font-supply-mono text-sm mb-6">
                    This unique flora has been generated based on the sentiment, rhythm, and structure of your text.
                  </p>
                  <div className="space-y-2 font-supply-mono text-xs">
                    <p>• ID: FLR/DEMO</p>
                    <p>• GENERATION: GEN_0</p>
                    <p>• SEED: #{Math.random().toString(16).substr(2, 6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}
