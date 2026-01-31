import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function Team() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
        {/* ========================================
            TEAM PAGE
            - Team members
            - Roles and bios
            - Social links
            ======================================== */}
        {/* TODO: Team content */}
      </main>

      <FooterAlter />
    </div>
  )
}
