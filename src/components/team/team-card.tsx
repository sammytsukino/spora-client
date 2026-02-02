import type { TeamMember } from '@/data/team-data';

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <article className="group bg-[#E9E9E9] p-6 md:p-8 flex flex-col border-2 border-black hover:bg-lime-300 transition-colors duration-200">
      {member.image && (
        <div className="w-full aspect-square mb-6 border-2 border-black overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
      )}

      <h3 className="font-bizud-mincho-bold text-3xl md:text-4xl leading-tight mb-2">
        {member.name}
      </h3>

      <p className="font-jetbrains-mono text-xs uppercase tracking-wider mb-4 opacity-75">
        {member.role}
      </p>

      <p className="font-jetbrains-mono text-sm mb-6 flex-grow">
        {member.bio}
      </p>

      {member.social && (
        <div className="border-t border-black pt-4 flex gap-4">
          {member.social.twitter && (
            <a 
              href={`https://twitter.com/${member.social.twitter.replace('@', '')}`}
              className="font-jetbrains-mono text-xs hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {member.social.twitter}
            </a>
          )}
          {member.social.github && (
            <a 
              href={`https://github.com/${member.social.github}`}
              className="font-jetbrains-mono text-xs hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {member.social.linkedin && (
            <a 
              href={member.social.linkedin}
              className="font-jetbrains-mono text-xs hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}
    </article>
  );
}
