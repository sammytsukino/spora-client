export default function VideoTextSection() {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto relative overflow-hidden">
        <video
          className="w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1769447110/FLORA-SCAN_kgj7ht.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-6 md:px-10 lg:px-16 py-8 md:py-12 space-y-6">
        <div className="space-y-4 md:space-y-6">
          <p className="text-stone-200 font-bizud-mincho-bold text-xs md:text-sm lg:text-base leading-relaxed">
            <span className="font-bold">flo·ra</span> | /ˈflɔːrə/ | <span className="italic">noun</span>
          </p>

          

          <div className="space-y-3 md:space-y-4 text-justify wrap-break-word">
            <p className="text-stone-200 font-supply-mono text-[10px] md:text-xs lg:text-sm leading-relaxed">
              <span className="font-bold">1.</span> The collective plant life of a particular region, habitat, or geological period. "the flora of the rainforest includes thousands of species"
            </p>

            <p className="text-stone-200 font-supply-mono text-[10px] md:text-xs lg:text-sm leading-relaxed">
              <span className="font-bold">2.</span> A systematic treatise or catalog describing the plants of a region.
            </p>

            <p className="text-stone-200 font-supply-mono text-[10px] md:text-xs lg:text-sm leading-relaxed">
              <span className="font-bold">3.</span> [SPORA] A digital work born from text; a unique visual organism generated through algorithmic transformation of written language.
            </p>

            <p className="text-stone-200 font-supply-mono text-[10px] md:text-xs lg:text-sm leading-relaxed mt-3">
              Each flora contains the complete textual DNA of its lineage and blooms into an unrepeatable visual form.
            </p>

            <p className="text-stone-200 font-bizud-mincho-bold text-xs md:text-sm lg:text-base leading-relaxed italic">
              "her flora evolved through three generations of cuttings"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
