"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Radar,
  FileEdit,
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
  { icon: GraduationCap, label: "Students" },
  { icon: Briefcase,     label: "Professionals" },
  { icon: Radar,         label: "Job Seekers" },
  { icon: FileEdit,      label: "Creators" },
  { icon: Flag,          label: "Leaders" },
];

const FLOATING_TAGS = [
  { icon: Gauge,         label: "Pace too fast — slowing down helps comprehension",        color: "text-primary"   },
  { icon: AudioWaveform, label: "Tone shift detected — try a warmer register here",        color: "text-secondary" },
  { icon: Mic,           label: "3 filler words in 10 seconds — practice pausing instead", color: "text-primary"   },
  { icon: List,          label: "Structure unclear — lead with your main point first",      color: "text-secondary" },
  { icon: BarChart3,     label: "Confidence score: 72% — eye contact boosts this",         color: "text-primary"   },
  { icon: Brain,         label: "Strong argument — reinforce with a concrete example",      color: "text-secondary" },
  { icon: Zap,           label: "Energy dipped mid-sentence — sustain your emphasis",       color: "text-primary"   },
];

// Each tag's own loop: travel for TRAVEL_MS, then stay hidden for GAP_MS, repeat.
// STAGGER_MS is the time offset between consecutive tags launching.
// With TRAVEL_MS=4800, GAP_MS=9400 → full period=14200ms, stagger=2100ms
// → at any moment ~2–3 tags are visible simultaneously.
const TRAVEL_MS  = 4800;
const GAP_MS     = 9400;   // invisible hold before next pass
const PERIOD_MS  = TRAVEL_MS + GAP_MS;   // each tag's full loop = 14200ms
const STAGGER_MS = 2100;   // offset between consecutive tags

function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function quadBezier(t: number, p0: number, p1: number, p2: number): number {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

/**
 * BezierTag — each tag has its own independent looping rAF.
 *
 * Within each PERIOD_MS loop:
 *   0 → TRAVEL_MS  : tag travels along the Bézier arc (visible)
 *   TRAVEL_MS → end: tag is hidden (waiting for next loop)
 *
 * launchOffset is pre-subtracted from startTs so tag i appears
 * i*STAGGER_MS after the previous one, creating a staggered stream
 * where 2-3 are always visible at once.
 *
 * Arc direction: bottom-left → bows RIGHT → top-right
 *   P0 (start)  : x = cW*0.05,  y = cH*0.90  (bottom, slightly left)
 *   P1 (control): x = cW*1.15,  y = cH*0.40  (far right → rightward bow)
 *   P2 (end)    : x = cW*0.60,  y = cH*0.04  (upper right, vanishes)
 *
 * The rightShift prop nudges the entire arc right so cards sit
 * comfortably within the panel without clipping left.
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

  // Right-shift the whole arc so it sits in the right half of the panel
  const shift = cW * 0.18;

  // Bézier control points (rightward parabola)
  const p0x = cW * 0.00 + shift;  // start: bottom, left-of-centre
  const p0y = cH * 0.92;

  const p1x = cW * 1.05 + shift;  // control: far right → pulls arc rightward
  const p1y = cH * 0.42;

  const p2x = cW * 0.42 + shift;  // end: upper-right
  const p2y = cH * 0.03;

  const TAG_HALF_W = 132; // half of card width (264/2) for centering

  const tick = useCallback((ts: number) => {
    if (!divRef.current) return;

    if (startTsRef.current === null) startTsRef.current = ts;

    // Position within this tag's own looping period
    const elapsed  = ts - startTsRef.current;
    const cyclePos = elapsed % PERIOD_MS;

    let opacity: number;
    let localT: number;

    if (cyclePos < TRAVEL_MS) {
      // Active: travelling along the arc
      const rawT = cyclePos / TRAVEL_MS;
      localT = easeInOut(rawT);

      // Smooth fade in (first 10%) → fully visible → fade out (last 12%)
      if (rawT < 0.10) {
        opacity = rawT / 0.10;
      } else if (rawT > 0.88) {
        opacity = (1 - rawT) / 0.12;
      } else {
        opacity = 1;
      }
    } else {
      // Hidden: waiting for next loop pass
      opacity = 0;
      localT  = 0;
    }

    const x = quadBezier(localT, p0x, p1x, p2x);
    const y = quadBezier(localT, p0y, p1y, p2y);

    divRef.current.style.transform = `translate(${x - TAG_HALF_W}px, ${y - 20}px)`;
    divRef.current.style.opacity   = String(Math.max(0, Math.min(1, opacity)));

    rafRef.current = requestAnimationFrame(tick);
  }, [p0x, p0y, p1x, p1y, p2x, p2y]);

  useEffect(() => {
    // Prime the start timestamp so this tag is already `launchOffset` ms into
    // its own period — giving it the correct staggered position in the stream.
    const prime = requestAnimationFrame((ts) => {
      // Subtract launchOffset so tag appears as if it started that many ms ago
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
        setDims({ w: panelRef.current.offsetWidth, h: panelRef.current.offsetHeight });
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
          <div className="md:col-span-7 flex flex-col justify-center">
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
              AI-powered feedback that helps you speak clearly, confidently
              and with impact in any situation.
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

          {/* Right: staggered Bézier arc tags */}
          <div
            ref={panelRef}
            className="md:col-span-5 hidden md:block relative h-full min-h-[480px] overflow-hidden"
          >
            {dims.w > 0 && FLOATING_TAGS.map((tag, i) => (
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
        </div>
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
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            }}
            className="flex flex-nowrap md:flex-wrap justify-start md:justify-between items-center gap-8 overflow-x-auto pb-2 hide-scrollbar"
          >
            {AUDIENCE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center shrink-0 md:flex-1">
                  {i !== 0 && (
                    <div className="w-px h-12 bg-white/5 hidden md:block mr-8" />
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
                    className="flex flex-col items-center gap-3 shrink-0 md:flex-1 cursor-default group"
                  >
                    <Icon
                      size={26}
                      strokeWidth={1.5}
                      className="text-outline-variant group-hover:text-primary transition-colors duration-300"
                    />
                    <span className="font-sans text-xs text-on-surface-variant whitespace-nowrap">
                      {item.label}
                    </span>
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
