import { Reveal } from "./motion-primitives";
import { FeatureGrid } from "./feature-grid";
import { LaptopMock } from "./laptop-mock";

export function BeyondGrammar() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-[120px] bg-surface overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <h2 className="font-display text-[32px] leading-[1.2] md:text-[48px] md:leading-[1.2] text-on-surface mb-6">
                Beyond Grammar.
                <br />
                <span className="italic text-primary">Mastering Presence.</span>
              </h2>
              <p className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant mb-12 max-w-lg">
                Vocabulary is just the start. We help you master the nuances
                that command a room.
              </p>
            </Reveal>

            <FeatureGrid />
          </div>

          <div className="md:col-span-6 mt-16 md:mt-0 relative">
            <LaptopMock />
          </div>
        </div>
      </div>
    </section>
  );
}
