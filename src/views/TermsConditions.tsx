import { useEffect } from "react";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import PageTitle from "@/components/ui/PageTitle";
import { BubbleBackground } from "@/components/backgrounds/BubbleBackground";

const termsBubbleColors = {
  first: "180,210,170",
  second: "200,220,185",
  third: "163,230,53",
  fourth: "190,215,175",
  fifth: "210,225,195", 
  sixth: "175,205,165", 
};

export default function TermsConditions() {
  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.documentElement.classList.add("hide-scrollbar");
    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0">
        <BubbleBackground
          className="w-full h-full"
          interactive={false}
          colors={termsBubbleColors}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <TransparentNavbar showScrollBackground />

        <main className="flex-1 pt-20 pb-16 px-6 md:px-12 lg:px-16 flex">
          <div className="max-w-2xl w-full">
        <PageTitle
          supertitle="(04) LEGAL"
          title="TERMS & CONDITIONS"
          description="Terms of use, data protection, and your rights on SPORA."
          className="mb-12"
        />

        <div className="space-y-10 font-supply-mono text-sm text-[#262626]">
          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using SPORA, you agree to be bound by these Terms & Conditions.
              If you do not agree with any part of these terms, you must not use the platform.
              We reserve the right to modify these terms at any time; continued use constitutes
              acceptance of such changes.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              2. Use of the Platform
            </h2>
            <p className="leading-relaxed mb-4">
              SPORA is a platform for creating, sharing, and evolving generative artworks we call Floras.
              You may browse public content, create your own Floras in the Laboratory, take Cuttings
              from Blossoming Floras, and participate in the community. You agree to use the platform
              in a lawful manner and respect the rights of other users.
            </p>
            <p className="leading-relaxed">
              You must be at least 13 years of age to use SPORA. By creating an account, you confirm
              that you meet this requirement and that the information you provide is accurate.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              3. Account Responsibility
            </h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to notify us immediately of any unauthorized access. You are liable for all
              activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              4. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              You retain ownership of the content you create on SPORA. By publishing a Flora, you
              grant SPORA a non-exclusive license to host, display, and promote your work within the
              platform. Derivative works (Cuttings) maintain a connection to the original and must respect attribution as defined in our licensing guidelines.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              5. Data Protection & Privacy
            </h2>
            <p className="leading-relaxed mb-4">
              We collect only the data necessary to operate the platform: account information (username,
              email for confirmation), content you create, and usage statistics. We do not sell your
              personal data to third parties.
            </p>
            <p className="leading-relaxed mb-4">
              <strong>Unsign (Withdraw Signature / Anonymization):</strong> You may choose to unsign your Floras
              at any time from your profile settings. When you unsign a Flora:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-2 mb-4">
              <li>The Flora remains visible and accessible on the platform.</li>
              <li>Your authorship is removed; the work is attributed to <em>Forgotten Author</em>.</li>
              <li>This process is irreversible. You cannot reclaim authorship once unsigned.</li>
              <li>Cuttings derived from your Flora will continue to show their Lineage, but your
                identity will not be associated with the original.</li>
            </ul>
            <p className="leading-relaxed">
              This feature allows you to disassociate your identity from your work while preserving
              the cultural and artistic contribution of the Flora within the SPORA ecosystem.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              SPORA is provided “as is” without warranties of any kind. We are not liable for any
              indirect, incidental, or consequential damages arising from your use of the platform.
              Our total liability shall not exceed any amounts paid by you to SPORA, if applicable.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              7. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We may update these terms periodically. Material changes will be communicated via the
              platform or your registered email. Continued use after such notice constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-bizud-mincho-bold text-lg border-b border-[var(--spora-primary)] pb-2 mb-4">
              8. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about these Terms & Conditions or data protection, please contact us through
              the Contact section.
            </p>
          </section>
        </div>
          </div>
        </main>

        <div className="relative z-10">
          <FooterAlter />
        </div>
      </div>
    </div>
  );
}
