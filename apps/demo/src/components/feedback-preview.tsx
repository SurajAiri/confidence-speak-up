import Image from "next/image";
import { Reveal } from "./reveal";

export function FeedbackPreview() {
  return (
    <section id="how-it-works" className="bg-ink py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="mb-3 text-sm font-medium text-amber">Coming soon</p>
            <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-cream sm:text-[2.75rem]">
              A sneak peek at your <span className="text-amber italic">future</span> feedback.
            </h2>
            <p className="mt-5 max-w-sm text-text-muted">
              Every session gives you clarity on what to improve and how to
              say it better.
            </p>
            <a
              href="#waitlist"
              className="mt-8 inline-block rounded-full bg-amber px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber-soft"
            >
              Coming soon
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-ink-line/70 bg-ink-soft shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
              {/* macOS-style window chrome */}
              <div className="flex items-center gap-1.5 border-b border-ink-line/70 px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>

              <div className="relative aspect-[1477/825] w-full">
                <Image
                  src="/demo.webp"
                  alt="Preview of the Voxem dashboard showing session feedback, an overall score, and a breakdown of confidence, clarity, fluency, and structure"
                  fill
                  sizes="(min-width: 1024px) 660px, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
