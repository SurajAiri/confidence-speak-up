import Image from "next/image";
import { Reveal } from "./motion-primitives";
import { QuoteCards } from "./quote-cards";

export function ProblemSection() {
  return (
    <section className="relative bg-surface overflow-hidden">
      {/* Photo stage — a generous, viewport-scaled height (not a strict
          lock to the source photo's own aspect ratio) so the section
          gets real room to breathe like the reference composition,
          while object-position keeps the same crop anchor point we
          measured from the source photo (~4% from the top). On mobile
          the photo is dimmed so the stacked copy stays legible. */}
      <div className="relative w-full h-[560px] sm:h-[640px] md:h-[82vh] md:min-h-[680px] md:max-h-[860px]">
        <Image
          src="/assets/problem_bg.webp"
          alt=""
          fill
          className="object-cover object-[center_10%] opacity-[0.16] md:opacity-100"
          sizes="100vw"
          priority={false}
        />

        {/* Left-to-right fade so the copy column sits on solid, legible
            ground — darker and reaching further right than a subtle
            vignette so text has real contrast, matching the reference's
            near-black left panel. Desktop only: on mobile the photo is
            already dimmed via opacity above. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(19,19,19,1) 0%, rgba(19,19,19,0.98) 34%, rgba(19,19,19,0.82) 46%, rgba(19,19,19,0.35) 58%, rgba(19,19,19,0.15) 70%, rgba(19,19,19,0.32) 100%)",
          }}
        />
        {/* Gentle top/bottom vignette so the section reads as a
            deliberate frame, not a raw photo crop. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(19,19,19,0.45) 0%, rgba(19,19,19,0) 16%, rgba(19,19,19,0) 80%, rgba(19,19,19,0.55) 100%)",
          }}
        />
        {/* Mobile: flat scrim over the dimmed photo for guaranteed
            text contrast at any crop the browser picks. */}
        <div className="absolute inset-0 bg-surface/60 md:hidden" />

        {/* Copy */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1280px] w-full mx-auto px-5 md:px-20">
            <Reveal className="max-w-[500px]">
              <span className="font-sans text-xs font-semibold text-primary tracking-[0.15em] uppercase mb-5 block">
                The Problem
              </span>
              <h2 className="font-display text-[32px] leading-[1.18] sm:text-[40px] md:text-[44px] lg:text-[50px] md:leading-[1.18] text-on-surface mb-6">
                You don&apos;t just need better English. You need better{" "}
                <span className="italic text-primary">communication.</span>
              </h2>
              <p className="font-sans text-[15px] md:text-base leading-relaxed text-on-surface-variant max-w-[380px]">
                Grammar won&apos;t help you in interviews, client calls or on
                stage. We go beyond grammar to help you sound clear,
                confident, and influential.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Quote bubbles, pinned to the figure — hidden below md where
            there isn't room to lay them out without colliding with the
            copy or the photo's subject. */}
        <div className="hidden md:block absolute inset-0">
          <div className="max-w-[1280px] h-full mx-auto px-5 md:px-20 relative">
            <QuoteCards />
          </div>
        </div>
      </div>
    </section>
  );
}
