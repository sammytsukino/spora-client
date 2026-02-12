import { useState, useEffect } from "react";
import TransparentNavbar from "@/components/home/TransparentNavbar";
import FooterAlter from "@/components/home/FooterAlter";
import PageTitle from "@/components/ui/PageTitle";
import FilterTabs from "@/components/common/FilterTabs";
import ResearchCard from "@/components/research/ResearchCard";
import { researchProjects, researchCategories } from "@/data/research-data";

export default function Research() {
  const [activeFilter, setActiveFilter] = useState('All Projects');

  const filteredProjects = activeFilter === 'All Projects'
    ? researchProjects
    : researchProjects.filter(project => project.category === activeFilter);

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(04)RESEARCH"
          title="EXPLORING THE FUTURE OF GENERATIVE ART"
          description="Our ongoing research into sentiment-driven design, evolutionary systems, and blockchain integration."
          className="mb-12"
        />

        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="w-full border-b-2 border-[#262626]" />
          </div>

          <div className="flex items-center justify-end">
            <FilterTabs 
              filters={researchCategories}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ResearchCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="font-supply-mono text-sm text-gray-500">
              No projects found in this category.
            </p>
          </div>
        )}
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}
