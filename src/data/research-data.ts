export interface ResearchProject {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  date: string;
}

export const researchProjects: ResearchProject[] = [
  {
    id: "RP-001",
    title: "Sentiment-Driven Morphology",
    category: "Algorithm Research",
    description: "Exploring how emotional content in text can influence the structural patterns of generated flora.",
    status: "active",
    date: "2026"
  },
  {
    id: "RP-002",
    title: "Generational Branching Systems",
    category: "Evolutionary Design",
    description: "Developing mechanisms for derivative works to maintain genetic connections to their source material.",
    status: "active",
    date: "2026"
  },
  {
    id: "RP-003",
    title: "Shared Soil Protocol",
    category: "Blockchain Integration",
    description: "Creating on-chain systems for tracking flora lineage and preserving artistic heritage.",
    status: "upcoming",
    date: "2026"
  },
  {
    id: "RP-004",
    title: "Rhythm & Pattern Recognition",
    category: "Natural Language Processing",
    description: "Analyzing linguistic rhythm and its translation into visual pattern generation.",
    status: "completed",
    date: "2025"
  },
];

export const researchCategories = [
  'All Projects',
  'Algorithm Research',
  'Evolutionary Design',
  'Blockchain Integration',
  'Natural Language Processing',
] as const;
