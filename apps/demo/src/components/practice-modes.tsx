import { MessageSquare, Swords, User, BookOpen } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./reveal";

const MODES = [
  {
    image: "/prompt.webp",
    icon: MessageSquare,
    title: "Quick Prompt",
    description: "Answer a question and speak naturally.",
  },
  {
    image: "/read.webp",
    icon: BookOpen,
    title: "Read & Explain",
    description: "Read, absorb, and speak your take.",
  },
  {
    image: "/interview.webp",
    icon: User,
    title: "Interview Simulator",
    description: "Practice interviews with confidence.",
  },
  {
    image: "/debate.webp",
    icon: Swords,
    title: "Debate Arena",
    description: "Argue, defend, and think on your feet.",
  },
];

export function PracticeModes() {
  return (
    <section id="practice" className="bg-ink py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl tracking-tight text-cream sm:text-[2.75rem]">
            Practice like <span className="text-amber italic">real life.</span>
          </h2>
          <p className="mt-3 text-text-muted">Choose a mode and start a conversation.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((mode, i) => (
            <Reveal key={mode.title} delay={i * 0.08}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-ink-line/60">
                <Image
                  src={mode.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-3 flex size-8 items-center justify-center rounded-full bg-ink-soft/90 backdrop-blur-sm">
                    <mode.icon className="size-4 text-amber" strokeWidth={2} />
                  </span>
                  <h3 className="font-display text-lg text-cream">{mode.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-text-muted">
                    {mode.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
