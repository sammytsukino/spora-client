import { TextHighlighter } from "../fancy/text/text-highlighter";

export default function VideoTextSection() {
  return (
    <div className="w-full h-full bg-neutral-800 flex flex-row">
      {/* Sección izquierda: Video */}
      <div className="w-1/2 h-full relative overflow-hidden">
        <video
          className="w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
        >
          {/* Aquí puedes agregar las fuentes del video */}
          <source src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1769447110/FLORA-SCAN_kgj7ht.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      {/* Sección derecha: Texto */}
      <div className="w-1/2 h-full flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-12">
        <div className="space-y-6 md:space-y-8">
          <p className="text-neutral-200 font-bizud-mincho-bold text-base md:text-xl lg:text-2x1 leading-relaxed">
            <TextHighlighter highlightColor="#f140b4"><span className="font-bold">flo·ra</span> | /ˈflɔːrə/ | <span className="italic">noun</span></TextHighlighter>
          </p>

          

          <div className="space-y-4 md:space-y-6 text-justify">
            <p className="text-neutral-200 font-jetbrains-mono text-sm md:text-base lg:text-lg leading-relaxed">
              <span className="font-bold">1.</span> The collective plant life of a particular region, habitat, or geological period. "the flora of the rainforest includes thousands of species"
            </p>

            <p className="text-neutral-200 font-jetbrains-mono text-sm md:text-base lg:text-lg leading-relaxed">
              <span className="font-bold">2.</span> A systematic treatise or catalog describing the plants of a region.
            </p>

            <p className="text-neutral-200 font-jetbrains-mono text-sm md:text-base lg:text-lg leading-relaxed">
              <span className="font-bold">3.</span> [SPORA] A digital work born from text; a unique visual organism generated through algorithmic transformation of written language.
            </p>

            <p className="text-neutral-200 font-jetbrains-mono text-sm md:text-base lg:text-lg leading-relaxed mt-4">
              Each flora contains the complete textual DNA of its lineage and blooms into an unrepeatable visual form.
            </p>

            <p className="text-neutral-200 font-bizud-mincho-bold text-lg md:text-base lg:text-lg leading-relaxed italic">
              "her flora evolved through three generations of cuttings"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
