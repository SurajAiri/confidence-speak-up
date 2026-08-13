"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";

const QUOTES = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    className: "top-[6%] right-[2%] w-[62%] max-w-[220px] md:w-64",
    emphasis: true,
    delay: 0.1,
  },
  {
    text: "I stumble, use 'umm...' too often.",
    className: "top-[30%] right-0 w-[58%] max-w-[200px] md:w-60",
    delay: 0.25,
  },
  {
    text: "I don't sound as confident as others.",
    className: "top-[54%] right-0 w-[60%] max-w-[210px] md:w-60",
    delay: 0.4,
  },
  {
    text: "I know the topic, but I can't explain it well.",
    className: "top-[76%] right-[2%] w-[62%] max-w-[220px] md:w-64",
    emphasis: true,
    delay: 0.55,
  },
];

export function QuoteCards() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {QUOTES.map((q) => (
        <motion.div
          key={q.text}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easePremium, delay: q.delay }}
          className={`absolute p-4 md:p-5 rounded-2xl glass-panel ${
            q.emphasis ? "glass-panel-glow" : ""
          } ${q.className} pointer-events-auto`}
        >
          <p className="font-sans text-[13px] md:text-[15px] leading-snug text-on-surface">
            <span className="text-primary font-display text-lg align-top mr-0.5">
              &ldquo;
            </span>
            {q.text}
            <span className="text-primary font-display text-lg align-bottom ml-0.5">
              &rdquo;
            </span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}
