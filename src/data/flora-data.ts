export const floraImages = [
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532656/img-18_djc6db.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-17_e6uarr.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-16_gf9k7x.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-15_wpwz9h.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-14_gbx118.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-13_qncmyd.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532651/img-12_swbm8v.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-11_la2ekj.png",
];

export const floraExcerpts = [
  'Lloro porque no siento nada, y ahora además de triste me siento un farsante',
  'En el silencio encuentro voces que nunca existieron',
  'Las palabras se desvanecen como humo entre mis dedos',
  'Cada letra es una semilla que germina en la oscuridad',
  'La soledad no es estar solo, es sentirse vacío',
  'Mis pensamientos son fractales que se repiten infinitamente',
  'El eco de tu ausencia resuena en cada rincón',
  'Construyo mundos con palabras que nadie leerá',
  'La melancolía tiene el color de la lluvia en noviembre',
  'Soy un algoritmo buscando el sentido en el caos',
  'Las heridas del alma no sangran, pero duelen igual',
  'En cada verso planto un jardín de emociones muertas',
];

export const floraTitles = [
  'VOID ECHO',
  'NEURAL FERN',
  'PIXEL BLOOM',
  'DATA MOSS',
  'CODE SPORE',
  'BYTE LOTUS',
];

export const floraAuthors = [
  '@FranBarreno',
  '@SporaLab',
  '@GenArtist',
  '@FloraGen',
];

export const generations = ['GEN_0', 'GEN_1', 'GEN_2'] as const;

export type Generation = typeof generations[number];

export interface FloraItem {
  id: string;
  generation: Generation;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
}

export const generateFloraData = (count: number = 48): FloraItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `FLR/${String(i + 1).padStart(3, '0')}`,
    generation: i < 16 ? 'GEN_0' : i < 32 ? 'GEN_1' : 'GEN_2',
    image: floraImages[i % floraImages.length],
    title: floraTitles[i % floraTitles.length],
    excerpt: floraExcerpts[i % floraExcerpts.length],
    author: floraAuthors[i % floraAuthors.length],
    seed: `#${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
  }));
};

export const floraFilters = ['All Units', 'GEN_0', 'GEN_1', 'GEN_2'] as const;

export const ITEMS_PER_PAGE = 12;
