import TransparentNavbar from "@/components/home/transparent-navbar";
import PageTitle from "@/components/ui/page-title";
import FloraCard from "@/components/garden/flora-card";
import FooterAlter from "@/components/home/footer-alter";

const floraImages = [
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532656/img-18_djc6db.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-17_e6uarr.png",
];

export default function Garden() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#E9E9E9] flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16 flex-1">
        <PageTitle
          supertitle="(01)GARDEN"
          title={`Open Floras\nready to be\ncut`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floraImages.map((image, index) => (
            <FloraCard
              key={index}
              image={image}
              title="Estoy solo"
              subtitle="Lloro porque no siento nada, y ahora..."
              author="@FranBarreno"
              generation="Gen0"
            />
          ))}
        </div>
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}
