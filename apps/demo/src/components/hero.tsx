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
} from "lucide-react";
import { easePremium } from "./motion-primitives";

const AUDIENCE = [
  { icon: GraduationCap, label: "Students" },
  { icon: Briefcase, label: "Professionals" },
  { icon: Radar, label: "Job Seekers" },
  { icon: FileEdit, label: "Creators" },
  { icon: Flag, label: "Leaders" },
];

const FLOATING_TAGS = [
  { icon: Gauge, label: "Analyzing pace...", top: "14%", right: "28%", delay: 0 },
  { icon: AudioWaveform, label: "Refining tone...", top: "38%", right: "6%", delay: 1.2 },
  { icon: Mic, label: "Detecting filler words...", top: "62%", right: "34%", delay: 2.4 },
  { icon: List, label: "Improving structure...", top: "84%", right: "16%", delay: 3.6 },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen md:min-h-[92vh] flex flex-col justify-center pt-32 pb-0 md:pb-24 overflow-hidden"
    >
      {/* Background image */}
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-on-primary font-bold text-sm rounded-full px-8 py-3.5 shadow-[0_8px_30px_-8px_rgba(242,202,80,0.5)]"
              >
                Waitlist
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

          <div className="md:col-span-5 hidden md:block relative h-full min-h-[400px]">
            {FLOATING_TAGS.map((tag, i) => {
              const Icon = tag.icon;
              return (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: easePremium,
                    delay: 0.6 + i * 0.15,
                  }}
                  className="absolute float-idle"
                  style={{
                    top: tag.top,
                    right: tag.right,
                    animationDelay: `${tag.delay}s`,
                  }}
                >
                  <div className="glass-panel rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl">
                    <Icon size={14} className="text-primary shrink-0" />
                    <span className="font-sans text-xs text-on-surface whitespace-nowrap">
                      {tag.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
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
