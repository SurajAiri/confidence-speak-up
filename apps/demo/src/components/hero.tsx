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
    className: "left-[62%] top-[6%] sm:left-[68%]",
    delay: 0,
  },
  {
    icon: <Gauge className="size-3.5 text-amber" strokeWidth={2.5} />,
    label: "Speak a bit slower",
    className: "left-[68%] top-[28%] sm:left-[74%]",
    delay: 1.1,
  },
  {
    icon: <ListTree className="size-3.5 text-amber" strokeWidth={2.5} />,
    label: "Clear structure",
    className: "left-[64%] top-[50%] sm:left-[70%]",
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
    <section id="top" className="relative overflow-hidden pt-10 pb-8 sm:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(224,160,84,0.14),transparent_60%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-4 lg:px-10">
        <motion.div
          className="relative z-10"
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
              Early Adopters →
            </a>
            <a
              href="#waitlist"
              className="rounded-full border border-ink-line px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:border-text-muted"
            >
              Waitlist
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[16/11] w-full max-w-xl lg:-mr-6"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <Image
              src="/background.webp"
              alt="A person speaking confidently into a laptop during a practice session"
              fill
              priority
              sizes="(min-width: 1024px) 576px, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/10 via-transparent to-ink/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,black_75%,transparent_100%)] bg-ink/0" />
          </div>

          {CHIPS.map((chip) => (
            <FeedbackChip key={chip.label} chip={chip} />
          ))}
        </motion.div>
      </div>

      <Reveal>
        <p className="mx-auto mt-10 max-w-xl px-6 text-center font-display text-sm italic text-amber-soft/80">
          Communication opens doors. Confidence keeps them open.
        </p>
      </Reveal>
    </section>
  );
}
