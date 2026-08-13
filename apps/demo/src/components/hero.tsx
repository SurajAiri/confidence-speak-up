"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  UserSearch,
  Feather,
  Flag,
  Gauge,
  AudioWaveform,
  Mic,
  List,
  BarChart3,
  Brain,
  Zap,
  ArrowRight,
} from "lucide-react";
import { easePremium } from "./motion-primitives";
import { useEffect, useRef, useState, useCallback } from "react";

const AUDIENCE = [
  {
    icon: Users,
    label: "For Students",
    copy: "Speak up in class and stand out.",
  },
  {
    icon: Briefcase,
    label: "For Professionals",
    copy: "Lead meetings and present with impact.",
  },
  {
    icon: UserSearch,
    label: "For Job Seekers",
    copy: "Ace interviews with confidence.",
  },
  {
    icon: Feather,
    label: "For Creators",
    copy: "Engage your audience with clarity.",
  },
  { icon: Flag, label: "For Leaders", copy: "Inspire teams and drive change." },
];

const FLOATING_TAGS = [
  {
    icon: Gauge,
    label: "Pace too fast — slowing down helps comprehension",
    color: "text-primary",
  },
  {
    icon: AudioWaveform,
    label: "Tone shift detected — try a warmer register here",
    color: "text-secondary",
  },
  {
    icon: Mic,
    label: "3 filler words in 10 seconds — practice pausing instead",
    color: "text-primary",
  },
  {
    icon: List,
    label: "Structure unclear — lead with your main point first",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    label: "Confidence score: 72% — eye contact boosts this",
    color: "text-primary",
  },
  {
    icon: Brain,
    label: "Strong argument — reinforce with a concrete example",
    color: "text-secondary",
  },
  {
    icon: Zap,
    label: "Energy dipped mid-sentence — sustain your emphasis",
    color: "text-primary",
  },
];

// ---------------------------------------------------------------------------
// Animation model — only two knobs matter, everything else is derived so it
// can never silently drift out of sync when you tune them.
//
//   TRAVEL_MS   speed   — how long one card takes to cross the arc
//   STAGGER_MS  spawn   — delay before the next card launches
//
// PERIOD_MS is forced to be an exact multiple of STAGGER_MS (one full trip
// per tag), which guarantees the staggered tags tile the timeline cleanly
// instead of drifting relative to each other. GAP_MS (idle time before a
// tag's next lap) falls out of that, it is not a number you should hand-pick.
//
//   visible_at_once ≈ TRAVEL_MS / STAGGER_MS
//
// Current values → 7200 / 2400 = 3 cards visible at any moment.
// Want denser? Lower STAGGER_MS (e.g. 1800 → ~4 visible). Want sparser?
// Raise it. Don't touch GAP_MS/PERIOD_MS directly — they're computed below.
// ---------------------------------------------------------------------------
const TRAVEL_MS = 15000; // speed: time for one card to travel start -> end
const STAGGER_MS = 5000; // spawn rate: time between successive card launches
const FADE_IN_PCT = 0.15; // fraction of TRAVEL_MS spent fading in
const FADE_OUT_PCT = 0.18; // fraction of TRAVEL_MS spent fading out

const TAG_COUNT = FLOATING_TAGS.length;
const PERIOD_MS = TAG_COUNT * STAGGER_MS; // each tag's full loop (travel + idle)

if (PERIOD_MS <= TRAVEL_MS) {
  // Dev-time guard: if this ever fires, every tag overlaps permanently —
  // either raise STAGGER_MS or lower TRAVEL_MS.
  console.warn(
    `[Hero] PERIOD_MS (${PERIOD_MS}) <= TRAVEL_MS (${TRAVEL_MS}); tags will never fully cycle out. Raise STAGGER_MS or lower TRAVEL_MS.`,
  );
}

function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Gentle sine ease-in-out: smooth, evenly-paced glide with no sharp
// acceleration through the middle (unlike a cubic ease, which snaps
// through the midpoint and reads as "fast").
function easeInOut(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function quadBezier(t: number, p0: number, p1: number, p2: number): number {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

/**
 * BezierTag — each tag has its own independent looping rAF.
 *
 * Within each PERIOD_MS loop:
 *   0 → TRAVEL_MS   : tag travels along the Bézier arc (visible)
 *   TRAVEL_MS → end : tag is hidden (idle, waiting for next loop)
 *
 * launchOffset is pre-subtracted from startTs so tag i appears
 * i*STAGGER_MS after the previous one. Because PERIOD_MS is an exact
 * multiple of STAGGER_MS, these offsets tile the loop with no drift,
 * so the "N tags visible at once" count stays constant over time
 * instead of wobbling.
 *
 * The panel is a strip anchored to the bottom-right of the section,
 * sized and positioned to sit over the laptop in the background photo
 * and reach up roughly to head height (see the Hero component below
 * for the exact measurements) — tall enough that the same 0.75→0.15
 * vertical fractions below now translate to real spacing between
 * cards instead of a cramped, overlapping stack.
 *
 * Arc direction: near the laptop → bows right → exits upper-right,
 * all while staying inside this panel:
 *   P0 (start)  : x = cW*0.28,  y = cH*0.75
 *   P1 (control): x = cW*0.85,  y = cH*0.40
 *   P2 (end)    : x = cW*0.62,  y = cH*0.15
 *
 * These fractions are deliberately inset from all four panel edges by
 * more than half a card's width/height, so no card is ever clipped by
 * the panel's overflow-hidden boundary.
 */
function BezierTag({
  icon: Icon,
  label,
  color,
  launchOffset,
  cW,
  cH,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  launchOffset: number;
  cW: number;
  cH: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTsRef = useRef<number | null>(null);

  // Bézier control points (rightward parabola). The panel is short and
  // wide (a strip over the laptop, not a tall column reaching toward
  // head height), so these fractions stay inset from all four edges
  // by more than half a card's size — no clipping, no reach upward.
  const p0x = cW * 0.28; // start: lower-left of the panel, near the laptop
  const p0y = cH * 0.75;

  const p1x = cW * 0.85; // control: rightward bow, inside the panel
  const p1y = cH * 0.4;

  const p2x = cW * 0.62; // end: upper-right, still well inside the panel
  const p2y = cH * 0.15;

  const TAG_HALF_W = 132; // half of card width (264/2) for centering

  const tick = useCallback(
    (ts: number) => {
      if (!divRef.current) return;

      if (startTsRef.current === null) startTsRef.current = ts;

      // Position within this tag's own looping period.
      const elapsed = (ts - startTsRef.current) % PERIOD_MS;
      const isTraveling = elapsed < TRAVEL_MS;

      // rawT: 0->1 progress through the travel phase only.
      const rawT = isTraveling ? elapsed / TRAVEL_MS : 0;
      const localT = isTraveling ? easeInOut(rawT) : 0;

      // Fade in for the first FADE_IN_PCT, fade out for the last
      // FADE_OUT_PCT, fully opaque in between. Zero whenever idle.
      const opacity = !isTraveling
        ? 0
        : rawT < FADE_IN_PCT
          ? rawT / FADE_IN_PCT
          : rawT > 1 - FADE_OUT_PCT
            ? (1 - rawT) / FADE_OUT_PCT
            : 1;

      const x = quadBezier(localT, p0x, p1x, p2x);
      const y = quadBezier(localT, p0y, p1y, p2y);

      divRef.current.style.transform = `translate(${x - TAG_HALF_W}px, ${y - 20}px)`;
      divRef.current.style.opacity = String(Math.max(0, Math.min(1, opacity)));

      rafRef.current = requestAnimationFrame(tick);
    },
    [p0x, p0y, p1x, p1y, p2x, p2y],
  );

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the animation loop entirely and
    // leave the tag at rest (invisible) rather than forcing motion on users
    // who've asked their OS/browser not to show it.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Prime the start timestamp so this tag is already `launchOffset` ms into
    // its own period — giving it the correct staggered position in the stream.
    const prime = requestAnimationFrame((ts) => {
      startTsRef.current = ts - launchOffset;
      rafRef.current = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(prime);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick, launchOffset]);

  return (
    <div
      ref={divRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ opacity: 0, willChange: "transform, opacity" }}
    >
      <div
        className="glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xl"
        style={{ width: 264 }}
      >
        <Icon size={14} className={`${color} shrink-0`} />
        <span className="font-sans text-xs text-on-surface leading-snug">
          {label}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      if (panelRef.current) {
        setDims({
          w: panelRef.current.offsetWidth,
          h: panelRef.current.offsetHeight,
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (panelRef.current) ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen md:min-h-[92vh] flex flex-col justify-center pt-32 pb-0 md:pb-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: easePremium }}
          className="absolute inset-0"
        >
          <Image
            src="/assets/background.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 hero-gradient z-10" />
      </div>

      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: copy */}
          <div className="md:col-span-7 flex flex-col justify-center relative z-20">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 0.15 }}
              className="font-display text-[42px] leading-[1.1] md:text-[64px] md:leading-[1.1] tracking-[-0.02em] text-on-surface mb-6"
            >
              Speak Confidently,
              <br />
              <span className="italic text-on-surface-variant">
                In any{" "}
                <span className="text-primary underline decoration-1 underline-offset-8">
                  moment
                </span>
                .
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 0.35 }}
              className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant max-w-lg mb-10"
            >
              AI-powered feedback that helps you speak clearly, confidently and
              with impact in any situation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={scrollToWaitlist}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-on-primary font-bold text-sm rounded-full px-8 py-3.5 shadow-[0_8px_30px_-8px_rgba(242,202,80,0.5)] flex items-center gap-2.5"
              >
                Join Waitlist
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="font-sans text-xs text-outline mt-12 tracking-wide"
            >
              Communication opens doors. Confidence keeps them open.
            </motion.p>
          </div>

          {/* Right column is left empty — it exists only to keep the
              copy at md:col-span-7 width. The tag panel below is
              positioned independently of this grid so it can anchor
              to the laptop in the background photo, wherever that
              falls, rather than being boxed into this column's width
              (which sat further left, over the person's face). */}
          <div className="md:col-span-5 hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* Floating tags — anchored to the bottom-right of the section,
          directly over the laptop in the background photo.
          Measured from the reference screenshot: the laptop sits in
          roughly the bottom-right ~30% x ~29% of the frame (x: 68–100%,
          y: 71–100%), the face's chin line is at ~60% down, and the
          audience bar starts at ~86% down. So the panel is kept short
          (a percentage of viewport height, not a tall fixed pixel box)
          and boxed into the strip between the chin and the audience
          bar — it no longer reaches anywhere near head height. */}
      <div
        ref={panelRef}
        className="hidden md:block absolute z-20 pointer-events-none overflow-hidden"
        style={{
          right: "clamp(8px, 2vw, 40px)",
          bottom: "clamp(110px, 15vh, 170px)",
          width: "clamp(500px, 32vw, 560px)",
          height: "clamp(400px, 50vh, 560px)",
        }}
      >
        {dims.w > 0 &&
          FLOATING_TAGS.map((tag, i) => (
            <BezierTag
              key={tag.label}
              icon={tag.icon}
              label={tag.label}
              color={tag.color}
              launchOffset={i * STAGGER_MS}
              cW={dims.w}
              cH={dims.h}
            />
          ))}
      </div>

      {/* Audience bar */}
      <div className="relative md:absolute md:bottom-0 left-0 right-0 z-30 mt-16 md:mt-0 pb-10 pt-10 md:pt-24 bg-gradient-to-t from-surface to-transparent">
        <div className="max-w-[1280px] mx-auto px-5 md:px-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px bg-gradient-to-r from-transparent to-outline-variant/40 w-16 md:w-48" />
            <span className="font-sans text-xs font-semibold text-outline-variant tracking-[0.15em] uppercase whitespace-nowrap">
              Built for every voice
            </span>
            <div className="h-px bg-gradient-to-l from-transparent to-outline-variant/40 w-16 md:w-48" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="flex flex-nowrap md:flex-wrap justify-start md:justify-between items-stretch gap-0 overflow-x-auto pb-2 hide-scrollbar"
          >
            {AUDIENCE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center shrink-0 md:flex-1"
                >
                  {i !== 0 && (
                    <div className="w-px self-stretch bg-white/10 hidden md:block mr-8" />
                  )}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: easePremium },
                      },
                    }}
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3.5 shrink-0 md:flex-1 cursor-default group pr-6 md:pr-0"
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="text-primary shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-sans text-sm font-semibold text-on-surface whitespace-nowrap">
                        {item.label}
                      </span>
                      <span className="font-sans text-xs text-on-surface-variant leading-snug max-w-[150px]">
                        {item.copy}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
