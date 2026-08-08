"use client";

import { motion } from "framer-motion";
import { Gauge, AudioWaveform, GitBranch, BrainCircuit } from "lucide-react";
import { Reveal, Stagger, fadeUp, easePremium } from "./motion-primitives";
import { DashboardMock } from "./dashboard-mock";

const FEATURES = [
  {
    icon: Gauge,
    title: "Pace & Rhythm",
    desc: "Speak with the confidence of a native by mastering natural pauses and speed.",
  },
  {
    icon: AudioWaveform,
    title: "Dynamic Emphasis",
    desc: "Learn to stress the right words to make your core message unmissable.",
  },
  {
    icon: GitBranch,
    title: "Thought Organization",
    desc: "Structure your ideas on the fly, moving from rambling to rhetoric.",
  },
  {
    icon: BrainCircuit,
    title: "Strategic Thinking",
    desc: "Train your brain to think and speak simultaneously without freezing.",
  },
];

export function BeyondGrammar() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-[120px] bg-surface overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <h2 className="font-display text-[32px] leading-[1.2] md:text-[48px] md:leading-[1.2] text-on-surface mb-6">
                Beyond Grammar.
                <br />
                <span className="italic text-primary">Mastering Presence.</span>
              </h2>
              <p className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant mb-12 max-w-lg">
                Vocabulary is just the start. We help you master the nuances
                that command a room.
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    className="flex flex-col gap-3"
                  >
                    <Icon size={28} strokeWidth={1.75} className="text-primary" />
                    <h4 className="font-sans text-sm font-bold text-on-surface">
                      {f.title}
                    </h4>
                    <p className="font-sans text-xs leading-relaxed text-on-surface-variant">
                      {f.desc}
                    </p>
                  </motion.div>
                );
              })}
            </Stagger>
          </div>

          <div className="md:col-span-6 mt-16 md:mt-0 relative">
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: easePremium }}
              className="relative w-full md:w-[130%] md:-mr-[30%]"
              style={{ perspective: 1200 }}
            >
              {/* Laptop chrome built in CSS so the screen is a real, live element */}
              <div className="relative w-full">
                <div className="relative rounded-t-[14px] rounded-b-[4px] bg-gradient-to-b from-[#2b2b2b] to-[#161616] p-[14px] md:p-[18px] pb-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10">
                  <div className="absolute left-1/2 -translate-x-1/2 top-[6px] w-1.5 h-1.5 rounded-full bg-black/60 ring-1 ring-white/10" />
                  <div className="relative w-full aspect-[16/10] rounded-[4px] overflow-hidden bg-black ring-1 ring-black/60">
                    <DashboardMock />
                  </div>
                </div>
                {/* Base / hinge */}
                <div className="relative h-[16px] md:h-[20px] mx-[-4%] rounded-b-[10px] bg-gradient-to-b from-[#3a3939] to-[#232323] border-x border-b border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[14%] h-[6px] rounded-b-md bg-black/40" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
