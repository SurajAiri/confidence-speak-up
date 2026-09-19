import Image from "next/image";
import { Reveal } from "./motion-primitives";
import { QuoteCards, QuoteList } from "./quote-cards";

/**
 * Two layouts, chosen by breakpoint, instead of one layout stretched to fit:
 *
 *  >= lg  "Poster": a stage with a LOCKED 9:4 aspect ratio. Photo, gradients,
 *         copy and bubbles all live inside it and scale together as one unit.
 *         The photo crop can't change, so the bubbles can't drift off the man.
 *
 *  <  lg  "Stacked": copy, then photo, then the quotes as normal cards.
 *         No absolute positioning, so there is nothing to misalign.
 *
 * To change where the switch happens, swap `lg:` for `xl:` (or `md:`) in the
 * three places marked SWITCH.
 */

function ProblemCopy() {
  return (
    <>
      <span className="font-sans text-xs font-semibold text-primary tracking-[0.15em] uppercase mb-5 block">
        The Problem
      </span>
      <h2
        className="font-display text-on-surface mb-6"
        // Fluid but capped: 32px on phones, ~50px at 1440, 58px max.
        style={{ fontSize: "clamp(32px, 3.45vw, 58px)", lineHeight: 1.18 }}
      >
        You don&apos;t just need better English. You need better{" "}
        <span className="italic text-primary">communication.</span>
      </h2>
      <p className="font-sans text-[15px] lg:text-[clamp(14px,1.12vw,18px)] leading-relaxed text-on-surface-variant max-w-[420px] lg:max-w-[min(27vw,420px)]">
        Grammar won&apos;t help you in interviews, client calls or on stage. We
        go beyond grammar to help you sound clear, confident, and influential.
      </p>
    </>
  );
}

export function ProblemSection() {
  return (
    <section className="relative bg-surface overflow-hidden">
      {/* ───────────── POSTER (SWITCH: lg:block) ───────────── */}
      <div className="hidden lg:block">
        {/* aspect-[9/4] is the whole trick. Height is derived from width, never
            from the viewport, so the stage keeps the same proportions at every
            size. If you'd rather match your photo exactly, use its real ratio
            here (then re-run /calibrator once). */}
        <div className="relative mx-auto w-full max-w-[1680px] aspect-[9/4]">
          <Image
            src="/assets/problem_bg.webp"
            alt=""
            fill
            className="object-cover object-[center_10%]"
            sizes="(min-width: 1680px) 1680px, 100vw"
            priority={false}
          />

          {/* Left-to-right fade so the copy sits on solid ground. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(19,19,19,1) 0%, rgba(19,19,19,0.98) 34%, rgba(19,19,19,0.82) 46%, rgba(19,19,19,0.35) 58%, rgba(19,19,19,0.15) 70%, rgba(19,19,19,0.32) 100%)",
            }}
          />
          {/* Top/bottom vignette. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(19,19,19,0.45) 0%, rgba(19,19,19,0) 16%, rgba(19,19,19,0) 80%, rgba(19,19,19,0.55) 100%)",
            }}
          />
          {/* Soft right edge so the photo melts into the page on screens
              wider than the 1680px stage cap. */}
          <div className="absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-surface to-transparent" />

          {/* Copy. Outer div does the centering; Reveal (framer) sits inside so
              its transform doesn't fight the -translate-y-1/2. */}
          <div className="absolute left-[9%] top-1/2 w-[36%] -translate-y-1/2">
            <Reveal>
              <ProblemCopy />
            </Reveal>
          </div>

          <QuoteCards />
        </div>
      </div>

      {/* ───────────── STACKED (SWITCH: lg:hidden) ───────────── */}
      <div className="lg:hidden">
        <div className="px-5 sm:px-10 pt-16 sm:pt-20">
          <Reveal className="max-w-[560px]">
            <ProblemCopy />
          </Reveal>
        </div>

        <div className="relative mt-10 w-full aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src="/assets/problem_bg.webp"
            alt=""
            fill
            // Nudge the first number to keep the man in frame on narrow crops.
            className="object-cover object-[58%_10%]"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/10 to-surface" />
        </div>

        {/* Pulled up over the faded bottom of the photo. */}
        <div className="relative -mt-16 sm:-mt-24 px-5 sm:px-10 pb-16 sm:pb-20">
          <QuoteList />
        </div>
      </div>
    </section>
  );
}
