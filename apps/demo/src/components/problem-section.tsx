import Image from "next/image";
import { Reveal } from "./motion-primitives";
import { QuoteCards } from "./quote-cards";

export function ProblemSection() {
  return (
    <section className="relative py-24 md:py-[140px] bg-surface overflow-hidden">
      {/* Background photo — visible behind the quote bubbles on desktop;
          dimmed to near-black on mobile so the stacked copy stays legible. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/problem_bg.webp"
          alt=""
          fill
          className="object-cover object-[75%_center] opacity-[0.14] md:opacity-100"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(19,19,19,0.97) 0%, rgba(19,19,19,0.92) 24%, rgba(19,19,19,0.45) 46%, rgba(19,19,19,0.05) 62%, rgba(19,19,19,0.3) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(19,19,19,0.5) 0%, rgba(19,19,19,0) 18%, rgba(19,19,19,0) 78%, rgba(19,19,19,0.6) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-surface/85 md:hidden" />
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Reveal className="pr-0 md:pr-8">
            <span className="font-sans text-xs font-semibold text-primary tracking-[0.15em] uppercase mb-4 block">
              The Problem
            </span>
            <h2 className="font-display text-[32px] leading-[1.2] md:text-[48px] md:leading-[1.2] text-on-surface mb-6">
              You don&apos;t just need better English. You need better{" "}
              <span className="italic text-primary">communication.</span>
            </h2>
            <p className="font-sans text-base leading-relaxed text-on-surface-variant max-w-md">
              Grammar won&apos;t help you in interviews, client calls or on
              stage. We go beyond grammar to help you sound clear, confident,
              and influential.
            </p>
          </Reveal>

          {/* Right column: reserves space so the copy stays put on mobile;
              the actual photo is the section's full-bleed background. */}
          <div className="relative h-[380px] md:h-[520px]">
            <QuoteCards />
          </div>
        </div>
      </div>
    </section>
  );
}
