import { useState } from "react"
import { cn } from "@/lib/utils"

interface FaqItem {
  id: string
  question: string
  answer: string
  meta: string
}

const faqData: FaqItem[] = [
  {
    id: "01",
    question: "What is SPORA?",
    answer: "SPORA is a collaborative platform that transforms text into generative art. Each creation becomes a unique flora whose visual characteristics are shaped by the sentiment, rhythm, and structural patterns of the words used to create it.",
    meta: "PLATFORM / CONCEPT"
  },
  {
    id: "02",
    question: "How does text become art?",
    answer: "Our algorithms analyze the semantic content, emotional tone, and linguistic patterns of your text. These parameters drive generative processes that produce unique visual representations—living digital flora that embody the essence of your words.",
    meta: "PROCESS / ALGORITHM"
  },
  {
    id: "03",
    question: "What is the shared soil?",
    answer: "The shared soil is our collective creative space where all flora coexist. When you create derivative works, they maintain connections to their source while developing their own unique characteristics, creating an ever-growing ecosystem of interconnected art.",
    meta: "ECOSYSTEM / COMMUNITY"
  },
  {
    id: "04",
    question: "Can I collaborate with others?",
    answer: "Yes! SPORA is built for collaboration. You can branch from existing flora to create derivatives, contribute to collective pieces, and participate in community-driven generative projects. Every interaction enriches the shared soil.",
    meta: "COLLABORATION / SOCIAL"
  },
]

interface FaqsProps {
  className?: string
}

export default function Faqs({ className }: FaqsProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[300px_1fr] border-b-2 border-neutral-800 bg-lime-400 text-neutral-800",
        className
      )}
    >
      {/* Sidebar */}
      <aside className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-neutral-800">
        <div className="mb-6">
          <span className="font-jetbrains-mono text-[10px] opacity-60 block mb-2 tracking-widest">
            KNOWLEDGE BASE
          </span>
          <h2 className="font-bizud-mincho text-3xl md:text-4xl font-extrabold leading-[0.9] tracking-tight uppercase">
            FREQ<br />ASKED<br />QUEST
          </h2>
        </div>
        <p className="font-bizud-mincho text-sm leading-relaxed opacity-80">
          Everything you need to know about creating generative flora from text and participating in the SPORA ecosystem.
        </p>
        <div className="mt-8 font-jetbrains-mono text-[10px] leading-relaxed opacity-50">
          SPORA_PROTOCOL: ACTIVE
          <br />
          FLORA_COUNT: GROWING
        </div>
      </aside>

      {/* FAQ List */}
      <div className="flex flex-col">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border-b-2 border-neutral-800 last:border-b-0"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className={cn(
                "w-full flex items-center gap-4 md:gap-8 px-6 py-5 md:px-8 md:py-6 text-left transition-colors duration-200 cursor-pointer",
                "hover:bg-neutral-800/10",
                openId === faq.id && "bg-neutral-800/10"
              )}
            >
              <span className="font-jetbrains-mono text-xs md:text-sm opacity-60 w-8">
                {faq.id}
              </span>
              <span className="font-bizud-mincho flex-1 font-semibold text-sm md:text-base tracking-wide">
                {faq.question}
              </span>
              <span className="font-jetbrains-mono text-[10px] md:text-xs opacity-50 tracking-wider hidden sm:block">
                {faq.meta}
              </span>
              <span
                className={cn(
                  "ml-4 transition-transform duration-300 font-jetbrains-mono",
                  openId === faq.id && "rotate-45"
                )}
              >
                +
              </span>
            </button>

            {/* Answer - animated collapse */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-6 md:px-8 pb-6 pl-14 md:pl-20">
                <p className="font-bizud-mincho text-sm md:text-base leading-relaxed opacity-80">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
