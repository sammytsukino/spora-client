import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function Contact() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
        {/* ========================================
            CONTACT PAGE
            - Contact form
            - Contact information
            - Social links
            ======================================== */}
        {/* TODO: Contact content */}
      </main>

      <FooterAlter />
    </div>
  )
}

