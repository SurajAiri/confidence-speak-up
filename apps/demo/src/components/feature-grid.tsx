"use client";

import { motion } from "framer-motion";
import { Gauge, AudioWaveform, GitBranch, BrainCircuit } from "lucide-react";
import { Stagger, fadeUp } from "./motion-primitives";

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

export function FeatureGrid() {
  return (
    <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <motion.div key={f.title} variants={fadeUp} className="flex flex-col gap-3">
            <Icon size={28} strokeWidth={1.75} className="text-primary" />
            <h4 className="font-sans text-sm font-bold text-on-surface">{f.title}</h4>
            <p className="font-sans text-xs leading-relaxed text-on-surface-variant">
              {f.desc}
            </p>
          </motion.div>
        );
      })}
    </Stagger>
  );
}
