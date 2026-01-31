import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function Research() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
        {/* ========================================
            RESEARCH PAGE
            - Documentation
            - Technical papers
            - Algorithm explanations
            ======================================== */}
        {/* TODO: Research content */}
      </main>

      <FooterAlter />
    </div>
  )
}
