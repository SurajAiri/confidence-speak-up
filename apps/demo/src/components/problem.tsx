"use client";

import { motion } from "motion/react";
import { Reveal } from "./reveal";

const NOTES = [
  { text: "My ideas are good, but I freeze when I speak.", rotate: -4, bg: "#f6c9c4", top: "2%", left: "6%" },
  { text: "I stumble, use \u201cumm...\u201d too often.", rotate: 5, bg: "#c9dcf0", top: "-2%", left: "50%" },
  { text: "I know the topic, but I can't explain it well.", rotate: 3, bg: "#f4d98a", top: "46%", left: "2%" },
  { text: "I don't sound as confident as others.", rotate: -3, bg: "#c7e3c9", top: "44%", left: "48%" },
];

export function Problem() {
  return (
    <section className="bg-cream py-20 text-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.1] tracking-tight sm:text-[2.5rem]">
            You don&rsquo;t just need better English. You need better{" "}
            <span className="italic underline decoration-amber decoration-2 underline-offset-4">
              communication.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/60">
            Grammar won&rsquo;t help you in interviews, client calls or
            stage. We do more — we help you sound confident, clear and
            influential.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto h-[240px] w-full max-w-xs sm:h-[260px]">
            {NOTES.map((note, i) => (
              <motion.div
                key={note.text}
                className="absolute w-[50%] rounded-[2px] p-3.5 text-[13px] font-medium leading-snug text-ink/80 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundColor: note.bg,
                  top: note.top,
                  left: note.left,
                  rotate: note.rotate,
                }}
                initial={{ opacity: 0, y: 20, rotate: note.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: note.rotate }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {note.text}
              </motion.div>
            ))}
            <span className="font-display absolute -top-7 right-1 -rotate-3 text-sm italic text-ink/50">
              Sound familiar?
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
