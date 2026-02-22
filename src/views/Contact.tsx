import { useState } from "react";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import FooterAlter from "@/components/home/FooterAlter";
import MainButton from "@/components/ui/MainButton";
import Section from "@/components/Section";
import { Mail, X, Instagram } from "lucide-react";

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
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-24 min-h-0">
          <div className="w-full max-w-[640px] px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 bg-[#E9E9E9] border border-[var(--spora-primary)]">
            <h1 className="text-2xl sm:text-3xl text-[#262626] font-bold text-center mb-2 font-bizud-mincho-bold">
              Get in touch
            </h1>
            <p className="text-center text-[#262626] mb-10 font-supply-mono text-sm sm:text-base leading-relaxed">
              Questions, feedback, or partnership ideas? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
              <div>
                <label className="block text-sm font-supply-mono mb-2 text-[#262626]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono text-[#262626] placeholder:text-[#262626]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-supply-mono mb-2 text-[#262626]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono text-[#262626] placeholder:text-[#262626]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-supply-mono mb-2 text-[#262626]">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono text-[#262626] placeholder:text-[#262626]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-supply-mono mb-2 text-[#262626]">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder=""
                  className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono text-[#262626] placeholder:text-[#262626]/50 resize-none"
                />
              </div>
              <MainButton
                type="submit"
                className="w-full h-11 sm:h-12 border border-[#262626]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SENDING..." : "SEND"}
              </MainButton>
            </form>

            <p className="text-center mt-8 font-supply-mono text-sm text-[#262626]">
              We typically respond within 2–3 business days.
            </p>

            <div className="mt-10 pt-8 border-t border-[var(--spora-primary)]">
              <p className="text-center font-supply-mono text-sm text-[#262626] mb-4 opacity-75">
                Other ways to reach us
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="mailto:hello@spora.example"
                  className="flex items-center gap-2 font-supply-mono text-sm text-[#262626] hover:underline"
                  aria-label="Email"
                >
                  <Mail size={18} strokeWidth={2} />
                  hello@spora.example
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 font-supply-mono text-sm text-[#262626] hover:underline"
                  aria-label="X (Twitter)"
                >
                  <X size={18} strokeWidth={2} />
                  @spora
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 font-supply-mono text-sm text-[#262626] hover:underline"
                  aria-label="Instagram"
                >
                  <Instagram size={18} strokeWidth={2} />
                  @spora
                </a>
              </div>
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
