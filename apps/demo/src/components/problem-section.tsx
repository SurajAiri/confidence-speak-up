import { Reveal } from "./motion-primitives";
import { QuoteCards } from "./quote-cards";

export function ProblemSection() {
  return (
    <section className="py-24 md:py-[120px] bg-surface overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Reveal className="pr-0 md:pr-12">
            <h2 className="font-display text-[32px] leading-[1.2] md:text-[48px] md:leading-[1.2] text-on-surface mb-6">
              You don&apos;t just need better English. You need better{" "}
              <span className="italic text-primary">communication.</span>
            </h2>
            <p className="font-sans text-base leading-relaxed text-on-surface-variant max-w-md">
              Grammar won&apos;t help you in interviews, client calls or
              stage. We do more — we help you sound confident, clear and
              influential.
            </p>
          </Reveal>

          <QuoteCards />
        </div>
      </div>
    </section>
  );
}
