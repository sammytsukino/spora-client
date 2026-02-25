import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import PageTitle from "@/components/ui/PageTitle";

export default function Licensing() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle=""
          title="MORE INFO ABOUT LICENSING"
          description="Licensing and usage terms for content created on SPORA."
          className="mb-12"
        />

        <div className="max-w-2xl space-y-6 font-supply-mono text-sm text-[#262626]">
          <p>
            Content created on SPORA may be subject to specific licensing terms.
            Please refer to our full terms of service and licensing documentation
            for detailed information about usage, attribution, and commercial rights.
          </p>
          <p>
            For inquiries about licensing, please contact us through the contact section.
          </p>
        </div>
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  );
}
