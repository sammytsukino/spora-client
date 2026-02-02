import type { ResearchProject } from '@/data/research-data';

interface ResearchCardProps {
  project: ResearchProject;
}

export default function ResearchCard({ project }: ResearchCardProps) {
  const statusColors = {
    active: 'bg-lime-300 text-black',
    completed: 'bg-neutral-700 text-neutral-300',
    upcoming: 'bg-black text-lime-300',
  };

  return (
    <article className="group bg-[#E9E9E9] p-6 flex flex-col border-2 border-black hover:bg-lime-300 transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <span className="font-jetbrains-mono text-xs opacity-75">{project.id}</span>
        <span className={`font-jetbrains-mono text-[10px] px-2 py-1 uppercase ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <h3 className="font-bizud-mincho-bold text-2xl md:text-3xl leading-tight mb-3">
        {project.title}
      </h3>

      <p className="font-jetbrains-mono text-xs mb-4 flex-grow">
        {project.description}
      </p>

      <div className="border-t border-black pt-3 mt-auto">
        <div className="flex justify-between items-center font-jetbrains-mono text-[10px]">
          <span className="uppercase opacity-75">{project.category}</span>
          <span>{project.date}</span>
        </div>
      </div>
    </article>
  );
}
