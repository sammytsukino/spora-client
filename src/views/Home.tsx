import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../index.css";
import { ROUTES } from "@/constants/routes";
import { useFloraThumbnails } from "@/hooks/useFloraThumbnails";
import MarqueeAlongSvgPath from "../components/home/MarqueeAlongSvgPath";
import VideoTextSection from "../components/home/VideoTextSection";
import SimpleMarquee from "../components/home/SimpleMarquee";
import MainButton from "../components/ui/MainButton";
import FooterMain from "../components/layout/FooterMain";
import Section from "@/components/layout/Section";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import DeclarativeSection from "@/components/home/DeclarativeSection";
import QuoteSection from "@/components/home/QuoteSection";
import { FORM_BACKGROUND_VIDEO_URL } from "@/constants/media";
import { cldVideo } from "@/lib/cloudinary";

const HOME_FOOTER_VIDEO_URL = cldVideo(FORM_BACKGROUND_VIDEO_URL, { silent: true });

export default function Home() {
  const navigate = useNavigate();
  const { items: floraThumbnails } = useFloraThumbnails(50);

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");

    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden ">
      <Navbar position="fixed" showScrollProgress />
      <main id="main-content">
        <h1 className="sr-only">SPORA Home</h1>
        <Section
          variant="hero"
          containerized={false}
          className="relative overflow-hidden flex flex-col min-h-0 p-0 m-0"
        >
          <HeroSection />
        </Section>

        <Section
          variant="flush"
          containerized={false}
          className="items-stretch justify-start"
        >
          <DeclarativeSection text="SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique Flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil." />
        </Section>

        <Section
          variant="flush"
          containerized={false}
          className="items-stretch"
        >
          <MarqueeAlongSvgPath showText={true} items={floraThumbnails} />
        </Section>

        <Section
          variant="large"
          containerized={false}
          className="bg-spora-primary items-stretch max-md:h-auto!"
        >
          <VideoTextSection />
        </Section>

        <Section variant="compact" containerized={false}>
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8">
              <h2 className="text-xl sm:text-lg md:text-2xl font-supply-mono">
                Featured Floras →
              </h2>
              <MainButton
                variant="compact"
                size="sm"
                type="button"
                onClick={() => navigate(ROUTES.GARDEN)}
              >
                VIEW ALL
              </MainButton>
            </div>

            <div className="flex-1 overflow-hidden">
              <SimpleMarquee items={floraThumbnails} />
            </div>
          </div>
        </Section>

        <Section
          variant="large"
          containerized={false}
          className="items-stretch justify-start"
        >
          <QuoteSection
            quote="I am fighting in desperation against things I cannot see—things that come from another world, where my body seems to be the doorway..."
            author="Fran Barreno"
            buttonText="CREATE YOUR OWN"
            onButtonClick={() => navigate(ROUTES.LABORATORY)}
          />
        </Section>

        <Section
          variant="compact"
          containerized={false}
          className="relative overflow-hidden"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HOME_FOOTER_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="relative z-10">
            <FooterMain />
          </div>
        </Section>
      </main>
    </div>
  );
}
