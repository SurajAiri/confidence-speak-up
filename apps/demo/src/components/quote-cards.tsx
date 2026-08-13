"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";

const QUOTES = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    position: {
      left: "clamp(48%, 52vw, 52%)",
      top: "clamp(7%, 8vh, 10%)",
      width: "clamp(240px, 25vw, 360px)",
    },
    emphasis: true,
    delay: 0.1,
  },
  {
    text: "I stumble, use 'umm...' too often.",
    position: {
      left: "clamp(66%, 74vw, 74%)",
      top: "clamp(21%, 24vh, 26%)",
      width: "clamp(220px, 22vw, 320px)",
    },
    delay: 0.25,
  },
  {
    text: "I don't sound as confident as others.",
    position: {
      left: "clamp(64%, 71vw, 71%)",
      top: "clamp(40%, 44vh, 47%)",
      width: "clamp(220px, 21vw, 310px)",
    },
    delay: 0.4,
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
  },
];

export function QuoteCards() {
  return (
    <div className="absolute inset-0 pointer-events-none">
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
