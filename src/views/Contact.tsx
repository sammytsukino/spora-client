import TransparentNavbar from "@/components/home/TransparentNavbar";
import FooterAlter from "@/components/home/FooterAlter";

export default function Contact() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}

