import { Reveal } from "./motion-primitives";
import { PracticeModeCards } from "./practice-mode-cards";

export function PracticeModes() {
  return (
    <section
      id="practice"
      className="py-24 md:py-[120px] bg-surface-container-lowest"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 text-center mb-14 md:mb-16">
        <Reveal>
          <h2 className="font-display text-[28px] md:text-[32px] text-on-surface mb-2">
            Practice like{" "}
            <span className="italic text-primary">real life.</span>
          </h2>
          <p className="font-sans text-base text-on-surface-variant">
            Choose a mode and start a conversation.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <PracticeModeCards />
      </div>
    </section>
  );
}
