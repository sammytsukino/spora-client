export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: "Fran Barreno",
    role: "Founder & Creative Director",
    bio: "Generative artist exploring the intersection of language, emotion, and visual form.",
    social: {
      twitter: "@FranBarreno",
    }
  },
  {
    name: "SPORA Lab",
    role: "Research & Development",
    bio: "Experimental team pushing the boundaries of generative art and AI-driven creativity.",
  },
  {
    name: "Gen Artist",
    role: "Lead Algorithm Designer",
    bio: "Specializing in sentiment analysis and procedural generation techniques.",
  },
  {
    name: "Flora Gen",
    role: "Community Manager",
    bio: "Building bridges between artists and collectors in the generative art space.",
  },
];
