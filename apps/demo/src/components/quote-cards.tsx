"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";
import { ThoughtTrail, type ThoughtTrailConfig } from "./thought-trail";
import { useStageSize } from "./use-stage-size";

/**
 * WHY THIS NO LONGER BREAKS
 * -------------------------
 * The stage that holds the photo + bubbles now has a LOCKED aspect ratio
 * (see problem-section.tsx), so it behaves like a poster: it gets bigger or
 * smaller, but its proportions never change, and neither does the photo crop.
 *
 * Everything inside it is therefore expressed in units that scale with the
 * stage itself:
 *   - position / width  -> plain % of the stage
 *   - font / padding    -> `cqw` (1cqw = 1% of the stage width)
 *   - trail end points  -> % of the stage (unchanged from before)
 *
 * No px, vh, vw or mixed clamp() in the layout math, so the bubble, its text
 * and its thought-trail can never drift apart from each other or from the
 * man in the photo.
 */

/** Stage width (px) at which the trail's px values (gap, radii) were authored. */
const REF_STAGE_WIDTH = 1440;

type Quote = {
  text: string;
  /** Percent of the stage. left/top = top-left corner, width = box width. */
  box: { left: number; top: number; width: number };
  emphasis?: boolean;
  delay: number;
  trail: ThoughtTrailConfig;
};

/**
 * `box` values were converted from your current layout (measured off your
 * screenshot). `trail` values are your existing calibrated ones.
 * Do ONE pass in /calibrator against the new stage (aspect 9:4) and paste the
 * results back. That is now a one-time job, because it holds at every width.
 */
const QUOTES: Quote[] = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    box: { left: 52.2, top: 4.2, width: 24.9 },
    emphasis: true,
    delay: 0.1,
    trail: {
      origin: { x: 66.06, y: 30.84 },
      end: { x: 67.96, y: 16.85 },
      control: { bend: 0.398, skew: 0.458 },
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
    box: { left: 74.4, top: 21.9, width: 22.2 },
    delay: 0.25,
    trail: {
      origin: { x: 69.91, y: 37.85 },
      end: { x: 74.83, y: 29.92 },
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
    box: { left: 71.4, top: 44.1, width: 21.4 },
    delay: 0.4,
    trail: {
      origin: { x: 66.5, y: 54.55 },
      end: { x: 71.9, y: 49.95 },
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
    box: { left: 66.4, top: 65.3, width: 24.9 },
    emphasis: true,
    delay: 0.55,
    trail: {
      origin: { x: 59.32, y: 73.53 },
      end: { x: 67.16, y: 73.1 },
      control: { bend: 0.524, skew: 0.565 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.5,
    },
  },
];

// const QUOTES: Quote[] = [
//   {
//     text: "My ideas are good, but I freeze when I speak.",
//     box: { left: 52.2, top: 4.3, width: 24.9 },
//     emphasis: true,
//     delay: 0.1,
//     trail: {
//       origin: { x: 64.68, y: 34.04 },
//       end: { x: 69.89, y: 23.71 },
//       control: { bend: 0.3, skew: 0.97 },
//       gap: 26,
//       minRadius: 3,
//       maxRadius: 8,
//       minOpacity: 0.2,
//       maxOpacity: 0.85,
//       delay: 0.05,
//     },
//   },
//   {
//     text: "I stumble, use 'umm...' too often.",
//     box: { left: 74.4, top: 21.9, width: 22.2 },
//     delay: 0.25,
//     trail: {
//       origin: { x: 69.21, y: 41.17 },
//       end: { x: 74.27, y: 36.16 },
//       control: { bend: 0.119, skew: 0.96 },
//       gap: 24,
//       minRadius: 3,
//       maxRadius: 7,
//       minOpacity: 0.2,
//       maxOpacity: 0.85,
//       delay: 0.2,
//     },
//   },
//   {
//     text: "I don't sound as confident as others.",
//     box: { left: 71.4, top: 44.1, width: 21.4 },
//     delay: 0.4,
//     trail: {
//       origin: { x: 65.5, y: 54.67 },
//       end: { x: 71.9, y: 55.04 },
//       control: { bend: 0.22, skew: 0.5 },
//       gap: 24,
//       minRadius: 3,
//       maxRadius: 7,
//       minOpacity: 0.2,
//       maxOpacity: 0.85,
//       delay: 0.35,
//     },
//   },
//   {
//     text: "I know the topic, but I can't explain it well.",
//     box: { left: 66.4, top: 65.3, width: 24.9 },
//     emphasis: true,
//     delay: 0.55,
//     trail: {
//       origin: { x: 58.43, y: 71.79 },
//       end: { x: 66.53, y: 77.64 },
//       control: { bend: 0.287, skew: 0.82 },
//       gap: 26,
//       minRadius: 3,
//       maxRadius: 8,
//       minOpacity: 0.2,
//       maxOpacity: 0.85,
//       delay: 0.5,
//     },
//   },
// ];

/** Quote text with the gold marks. Sized purely by inherited font-size (em). */
function QuoteText({ text }: { text: string }) {
  return (
    <p className="font-sans leading-snug text-on-surface">
      <span
        aria-hidden
        className="text-primary font-display align-top mr-1 leading-none"
        style={{ fontSize: "1.6em" }}
      >
        &ldquo;
      </span>
      {text}
      <span
        aria-hidden
        className="text-primary font-display align-bottom ml-1 leading-none"
        style={{ fontSize: "1.6em" }}
      >
        &rdquo;
      </span>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop (>= lg): bubbles + thought trails pinned to the photo             */
/* -------------------------------------------------------------------------- */

export function QuoteCards() {
  const { ref, size } = useStageSize<HTMLDivElement>();

  // Trail dots are drawn in px, so scale them with the stage too. Otherwise
  // the dots stay the same size while the bubbles shrink.
  const k = useMemo(
    () => Math.min(1.25, Math.max(0.6, size.width / REF_STAGE_WIDTH || 1)),
    [size.width],
  );

  const trails = useMemo(
    () =>
      QUOTES.map((q) => ({
        ...q.trail,
        gap: q.trail.gap * k,
        minRadius: q.trail.minRadius * k,
        maxRadius: q.trail.maxRadius * k,
        minOpacity: (q.trail.minOpacity ?? 0.25) * 0.5,
        maxOpacity: (q.trail.maxOpacity ?? 0.9) * 0.5,
        color: "#b2b1ae",
      })),
    [k],
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      // Makes `cqw` inside resolve against THIS box (the stage).
      style={{ containerType: "inline-size" }}
    >
      {QUOTES.map((q, i) => (
        <ThoughtTrail
          key={`trail-${q.text}`}
          config={trails[i]}
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
          transition={{ duration: 0.7, ease: easePremium, delay: q.delay }}
          style={{
            left: `${q.box.left}%`,
            top: `${q.box.top}%`,
            width: `${q.box.width}%`,
            padding: "1.15cqw",
            borderRadius: "1.2cqw",
            fontSize: "clamp(11px, 1.23cqw, 20px)",
          }}
          className={[
            "absolute box-border glass-panel pointer-events-auto",
            q.emphasis ? "glass-panel-glow" : "",
          ].join(" ")}
        >
          <QuoteText text={q.text} />
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tablet / mobile (< lg): simple stacked cards, nothing to misalign         */
/* -------------------------------------------------------------------------- */

export function QuoteList() {
  return (
    <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
      {QUOTES.map((q, i) => (
        <motion.li
          key={q.text}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: easePremium,
            delay: (i % 2) * 0.08,
          }}
          className={[
            "glass-panel rounded-2xl p-4 sm:p-5 text-[15px] sm:text-base",
            // Phones: alternate left/right like a conversation.
            "w-[92%] sm:w-auto",
            i % 2 ? "self-end" : "self-start",
            "sm:self-auto",
            q.emphasis ? "glass-panel-glow" : "",
          ].join(" ")}
        >
          <QuoteText text={q.text} />
        </motion.li>
      ))}
    </ul>
  );
}
