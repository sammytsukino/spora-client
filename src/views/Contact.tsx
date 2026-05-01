import { useState, type ChangeEvent } from "react";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import MainButton from "@/components/ui/MainButton";
import UnderlineField from "@/components/ui/UnderlineField";
import Section from "@/components/layout/Section";

const FORM_BACKGROUND_VIDEO_URL =
  "https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4";

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
          <video
            className="fixed inset-0 h-full w-full object-cover"
            src={FORM_BACKGROUND_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 shrink-0 h-16 sm:h-20" aria-hidden />
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-[1000px] px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 bg-spora-primary-light border border-spora-primary">
            <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 md:gap-16">
              <div className="min-w-0 sm:min-w-[200px] shrink-0">
                <h1 className="text-2xl sm:text-3xl text-spora-primary font-bold leading-tight mb-2 font-bizud-mincho-bold">
                  Get in touch
                </h1>
                <p className="text-lead-sm font-supply-mono leading-relaxed text-spora-primary">
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        placeholder="e.g. Dawn"
                      />
                      <UnderlineField
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="e.g. dawn@example.com"
                      />
                      <UnderlineField
                        label="Subject"
                        value={subject}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                        placeholder="e.g. Partnership inquiry"
                      />
                    </div>
                    <UnderlineField
                      label="Message"
                      as="textarea"
                      value={message}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                      placeholder="Your message..."
                      fillParent
                    />
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                    <p className="text-sm font-supply-mono text-spora-primary">
                      We typically respond within 2–3 business days.
                    </p>
                    <MainButton
                      type="submit"
                      variant="compact"
                      size="sm"
                      className="w-full sm:w-auto border-spora-primary text-spora-primary hover:bg-spora-primary hover:text-spora-primary-light"
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
          <FooterAlter className="px-4 sm:px-6 md:px-12 lg:px-16" />
        </div>
      </Section>
    </div>
  );
}
