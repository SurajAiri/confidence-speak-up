"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";

const QUOTES = [
  {
    text: "\u201cMy ideas are good, but I freeze when I speak.\u201d",
    className: "top-0 right-2 md:right-10 w-56 md:w-64 rotate-3 z-20 shadow-2xl",
    emphasis: true,
    delay: 0.1,
  },
  {
    text: "\u201cI stumble, use 'umm...' too often.\u201d",
    className:
      "top-28 md:top-32 right-20 md:right-32 w-48 md:w-56 -rotate-2 z-10 shadow-xl border-l-2 border-l-secondary/50",
    delay: 0.25,
  },
  {
    text: "\u201cI know the topic, but I can't explain it well.\u201d",
    className:
      "bottom-8 md:bottom-10 right-0 w-56 md:w-64 rotate-1 z-30 shadow-2xl border-b-2 border-b-primary/50",
    emphasis: true,
    delay: 0.4,
  },
  {
    text: "\u201cI don't sound as confident as others.\u201d",
    className:
      "bottom-20 md:bottom-24 right-32 md:right-48 w-48 md:w-56 -rotate-3 z-10 shadow-xl border-r-2 border-r-tertiary/50",
    delay: 0.55,
  },
];

export function QuoteCards() {
  return (
    <div className="relative h-[340px] md:h-[400px] mt-12 md:mt-0">
      {QUOTES.map((q) => (
        <motion.div
          key={q.text}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easePremium, delay: q.delay }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
          className={`absolute p-5 md:p-6 rounded-xl glass-panel ${
            q.emphasis ? "glass-panel-glow" : ""
          } ${q.className} cursor-default`}
        >
          <p
            className={`font-sans text-sm md:text-base ${
              q.emphasis ? "text-on-surface" : "text-on-surface-variant"
            }`}
          >
            {q.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
