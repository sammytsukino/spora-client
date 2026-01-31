import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function SignIn() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1 flex items-center justify-center">
        {/* ========================================
            SIGN IN PAGE
            - Authentication form
            - Brand elements
            ======================================== */}
        {/* TODO: SignIn form content */}
      </main>

      <FooterAlter />
    </div>
  )
}
