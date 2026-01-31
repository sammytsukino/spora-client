import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function Laboratory() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
        {/* ========================================
            LABORATORY PAGE
            - Flora creation interface
            - Text input
            - Generative preview
            - Minting/saving options
            ======================================== */}
        {/* TODO: Laboratory content */}
      </main>

      <FooterAlter />
    </div>
  )
}
