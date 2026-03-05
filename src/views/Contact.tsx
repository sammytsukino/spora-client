import { useState } from "react";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import MainButton from "@/components/ui/MainButton";
import UnderlineField from "@/components/ui/UnderlineField";
import Section from "@/components/layout/Section";
import { BubbleBackground } from "@/components/backgrounds/BubbleBackground";

const bubbleColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '82,255,90',
  fifth: '244,239,64',
  sixth: '255,100,255',
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between min-h-dvh"
      >
        <div className="fixed inset-0 w-full h-full z-0">
          <BubbleBackground className="absolute inset-0 w-full h-full" colors={bubbleColors} interactive />
        </div>
        {/* <div className="fixed inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4"
              type="video/mp4"
            />
          </video>
        </div> */}

        <div className="relative z-10 shrink-0 h-16 sm:h-20" aria-hidden />
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-[1000px] px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 bg-[#E9E9E9] border border-[var(--spora-primary)]">
            <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 md:gap-16">
              <div className="min-w-0 sm:min-w-[200px] shrink-0">
                <h1 className="text-2xl sm:text-3xl text-[#262626] font-bold leading-tight mb-2 font-bizud-mincho-bold">
                  Get in touch
                </h1>
                <p className="text-[14px] font-supply-mono leading-relaxed text-[#262626]">
                  Questions, feedback,
                  <br />
                  or partnership ideas?
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 min-w-0">
                <div className="flex flex-col gap-6 sm:gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                    <div className="flex flex-col gap-6 sm:gap-8">
                      <UnderlineField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dawn"
                      />
                      <UnderlineField
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. dawn@example.com"
                      />
                      <UnderlineField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Partnership inquiry"
                      />
                    </div>
                    <UnderlineField
                      label="Message"
                      as="textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message..."
                      fillParent
                    />
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                    <p className="text-sm font-supply-mono text-[#262626]">
                      We typically respond within 2–3 business days.
                    </p>
                    <MainButton
                      type="submit"
                      variant="compact"
                      size="sm"
                      className="w-full sm:w-auto border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-[#E9E9E9]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "SENDING..." : "SEND"}
                    </MainButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <FooterAlter />
        </div>
      </Section>
    </div>
  );
}
