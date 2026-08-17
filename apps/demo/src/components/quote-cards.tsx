"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";
import { ThoughtTrail, type ThoughtTrailConfig } from "./thought-trail";
import { useStageSize } from "./use-stage-size";

/**
 * Each quote's `position` is unchanged (still the clamp()-based absolute
 * placement of the bubble itself). `trail` is new: it describes the arc of
 * small circles leading INTO that bubble.
 *
 * `trail.origin` / `trail.end` are authored as PERCENT of the stage
 * (the same relative box the quote bubbles live in — see ThoughtTrail),
 * so they scale correctly across breakpoints without hand-tuning clamp()
 * expressions the way `position` needs to. `trail.end` should be the
 * bubble's near corner (the point closest to the origin), not its center —
 * this is what the calibrator is for: drag it visually instead of guessing.
 *
 * These starting values are placeholders — open /calibrator to drag them
 * into place against the real photo/stage, then paste the generated
 * QUOTES array back in here.
 */
const QUOTES: {
  text: string;
  position: { left: string; top: string; width: string };
  emphasis?: boolean;
  delay: number;
  trail: ThoughtTrailConfig;
}[] = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    position: {
      left: "clamp(48%, 52vw, 52%)",
      top: "clamp(7%, 8vh, 10%)",
      width: "clamp(240px, 25vw, 360px)",
    },
    emphasis: true,
    delay: 0.1,
    trail: {
      origin: { x: 64.68, y: 34.04 },
      end: { x: 69.89, y: 23.71 },
      control: { bend: 0.3, skew: 0.97 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.05,
    },
  },
  {
    text: "I stumble, use 'umm...' too often.",
    position: {
      left: "clamp(66%, 74vw, 74%)",
      top: "clamp(21%, 24vh, 26%)",
      width: "clamp(220px, 22vw, 320px)",
    },
    delay: 0.25,
    trail: {
      origin: { x: 69.21, y: 41.17 },
      end: { x: 74.27, y: 36.16 },
      control: { bend: 0.119, skew: 0.96 },
      gap: 24,
      minRadius: 3,
      maxRadius: 7,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.2,
    },
  },
  {
    text: "I don't sound as confident as others.",
    position: {
      left: "clamp(64%, 71vw, 71%)",
      top: "clamp(40%, 44vh, 47%)",
      width: "clamp(220px, 21vw, 310px)",
    },
    delay: 0.4,
    trail: {
      origin: { x: 65.5, y: 54.67 },
      end: { x: 71.9, y: 55.04 },
      control: { bend: 0.22, skew: 0.5 },
      gap: 24,
      minRadius: 3,
      maxRadius: 7,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.35,
    },
  },
  {
    text: "I know the topic, but I can't explain it well.",
    position: {
      left: "clamp(58%, 66vw, 66%)",
      top: "clamp(59%, 64vh, 67%)",
      width: "clamp(240px, 25vw, 360px)",
    },
    emphasis: true,
    delay: 0.55,
    trail: {
      origin: { x: 58.43, y: 71.79 },
      end: { x: 66.53, y: 77.64 },
      control: { bend: 0.287, skew: 0.82 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.5,
    },
  },
];

export function QuoteCards() {
  const { ref, size } = useStageSize<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      {QUOTES.map((q) => (
        <ThoughtTrail
          key={`trail-${q.text}`}
          config={q.trail}
          stageWidth={size.width}
          stageHeight={size.height}
          className="text-primary"
        />
      ))}

      {QUOTES.map((q) => (
        <motion.div
          key={q.text}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: easePremium,
            delay: q.delay,
          }}
          style={q.position}
          className={[
            "absolute",
            "box-border",
            "p-4 lg:p-5 xl:p-6",
            "rounded-2xl",
            "glass-panel",
            q.emphasis ? "glass-panel-glow" : "",
            "pointer-events-auto",
          ].join(" ")}
        >
          <p className="font-sans text-[14px] lg:text-[15px] xl:text-[17px] leading-snug text-on-surface">
            <span className="text-primary font-display text-2xl align-top mr-1 leading-none">
              &ldquo;
            </span>

            {q.text}

            <span className="text-primary font-display text-2xl align-bottom ml-1 leading-none">
              &rdquo;
            </span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}
