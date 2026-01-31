import FloraCardEditorial from './flora-card-editorial'

export default function FloraMarqueeEditorial() {
  const specimens = [
    { id: 'A832', gen: '001', title: 'Helix Primordial', seed: '#A832F1', visualType: 'circles' as const, bgColor: 'acid' as const },
    { id: 'C2F4', gen: '002', title: 'Vertex Cascade', seed: '#C2F4D8', visualType: 'cross' as const, bgColor: 'black' as const },
    { id: '890B', gen: '003', title: 'Neural Bloom', seed: '#890B23', visualType: 'grid' as const, bgColor: 'default' as const },
    { id: 'D088', gen: '004', title: 'Spore Matrix', seed: '#D088FF', visualType: 'diamond' as const, bgColor: 'acid' as const },
    { id: '42FD', gen: '005', title: 'Fractal Seed', seed: '#42FD9A', visualType: 'spiral' as const, bgColor: 'black' as const },
    { id: 'E7A1', gen: '006', title: 'Mycelium Web', seed: '#E7A1C3', visualType: 'waves' as const, bgColor: 'default' as const },
  ]

  return (
    <div className="py-12 overflow-hidden bg-[#D8D8D8] border-b border-[#0A0A0A]">
      <div className="flex gap-6 animate-marquee-infinite" style={{ width: 'max-content' }}>
        {/* Duplicar 4 veces para crear un loop infinito suave */}
        {[...specimens, ...specimens, ...specimens, ...specimens].map((item, idx) => (
          <FloraCardEditorial
            key={idx}
            id={item.id}
            gen={item.gen}
            title={item.title}
            seed={item.seed}
            visualType={item.visualType}
            bgColor={item.bgColor}
          />
        ))}
      </div>
    </div>
  )
}
