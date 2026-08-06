import { Lock, Rocket, Sparkles, Users } from "lucide-react";
import { Reveal } from "./reveal";

const PERKS = [
  { icon: Sparkles, title: "Be the first", description: "Get early access when we launch." },
  { icon: Rocket, title: "Exclusive perks", description: "Early adopters get special benefits." },
  { icon: Users, title: "Shape the product", description: "Your feedback helps us build it better." },
  { icon: Lock, title: "Invite-only launch", description: "Limited spots for our first users." },
];

export function WhyWaitlist() {
  return (
    <section className="bg-ink py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl tracking-tight text-cream sm:text-4xl">
            Why join the <span className="text-amber italic">waitlist?</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 0.08} className="flex flex-col items-center text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-ink-line bg-ink-soft">
                <Icon className="size-5 text-amber" strokeWidth={1.75} />
              </span>
              <h3 className="text-sm font-medium text-cream">{title}</h3>
              <p className="mt-1 text-xs leading-snug text-text-dim">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
