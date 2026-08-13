"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";

// Positions measured as percentages of the photo frame (matching the
// reference composition, bubbles arcing down the right side alongside
// the figure's eyeline).
const QUOTES = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    style: { left: "52%", top: "8%", width: "25%" },
    emphasis: true,
    delay: 0.1,
  },
  {
    text: "I stumble, use 'umm...' too often.",
    style: { left: "74%", top: "24%", width: "22%" },
    delay: 0.25,
  },
  {
    text: "I don't sound as confident as others.",
    style: { left: "71%", top: "44%", width: "21%" },
    delay: 0.4,
  },
  {
    text: "I know the topic, but I can't explain it well.",
    style: { left: "66%", top: "64%", width: "25%" },
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
          transition={{ duration: 0.7, ease: easePremium, delay: q.delay }}
          // style={{ ...q.style, minWidth: "230px" }}
          style={{
            ...q.style,
            minWidth: "230px",
            maxWidth: "360px",
          }}
          className={`absolute p-5 lg:p-6 rounded-2xl glass-panel ${
            q.emphasis ? "glass-panel-glow" : ""
          } pointer-events-auto`}
        >
          <p className="font-sans text-[15px] lg:text-[17px] leading-snug text-on-surface">
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
