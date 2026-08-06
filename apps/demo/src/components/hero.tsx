"use client";

import { CheckCircle2, Gauge, ListTree } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Chip = {
  icon: ReactNode;
  label: string;
  className: string;
  delay: number;
};

const CHIPS: Chip[] = [
  {
    icon: <CheckCircle2 className="size-3.5 text-amber" strokeWidth={2.5} />,
    label: "Great energy!",
    className: "left-[10%] top-[14%]",
    delay: 0,
  },
  {
    icon: <Gauge className="size-3.5 text-amber" strokeWidth={2.5} />,
    label: "Speak a bit slower",
    className: "left-[28%] top-[38%]",
    delay: 1.1,
  },
  {
    icon: <ListTree className="size-3.5 text-amber" strokeWidth={2.5} />,
    label: "Clear structure",
    className: "left-[16%] top-[60%]",
    delay: 2.2,
  },
];

const CYCLE = 3.3;

function FeedbackChip({ chip }: { chip: Chip }) {
  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-line/80 bg-ink-soft/95 px-3 py-1.5 text-xs font-medium text-cream shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] ${chip.className}`}
      initial={{ opacity: 0, y: 16, scale: 0.85 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [16, 0, 0, -10],
        scale: [0.85, 1, 1, 0.9],
      }}
      transition={{
        duration: CYCLE,
        times: [0, 0.18, 0.82, 1],
        repeat: Infinity,
        repeatDelay: (CHIPS.length - 1) * CYCLE,
        delay: chip.delay,
        ease: "easeOut",
      }}
    >
      {chip.icon}
      {chip.label}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[640px] overflow-hidden pt-10 pb-16 sm:pt-14 sm:min-h-[720px]">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.webp"
          alt="A person speaking confidently into a laptop during a practice session"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Left-to-right fade so the headline stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          className="relative z-10 max-w-lg py-16 sm:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-cream sm:text-[3.25rem]">
            Speak Confidently,
            <br />
            <span className="text-amber italic">In any moment.</span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-text-muted">
            AI-powered feedback that helps you speak clearly, confidently and
            with impact in any situation.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-amber-soft"
            >
              Join Waitlist →
            </a>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          {CHIPS.map((chip) => (
            <FeedbackChip key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <Reveal>
        <p className="relative mx-auto mt-4 max-w-xl px-6 text-center font-display text-sm italic text-amber-soft/80">
          Communication opens doors. Confidence keeps them open.
        </p>
      </Reveal>
    </section>
  );
}
