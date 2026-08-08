"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, FileText, User, Users } from "lucide-react";
import { Reveal, Stagger, fadeUp } from "./motion-primitives";

const MODES = [
  {
    title: "Quick Prompt",
    desc: "Answer a question and speak naturally.",
    icon: MessageCircle,
    img: "/assets/prompt.webp",
  },
  {
    title: "Read & Explain",
    desc: "Read, absorb, and speak your take.",
    icon: FileText,
    img: "/assets/read.webp",
  },
  {
    title: "Interview Simulator",
    desc: "Practice interviews with confidence.",
    icon: User,
    img: "/assets/interview.webp",
  },
  {
    title: "Debate Arena",
    desc: "Argue, defend, and think on your feet.",
    icon: Users,
    img: "/assets/debate.webp",
  },
];

export function PracticeModes() {
  return (
    <section id="practice" className="py-24 md:py-[120px] bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 text-center mb-14 md:mb-16">
        <Reveal>
          <h2 className="font-display text-[28px] md:text-[32px] text-on-surface mb-2">
            Practice like <span className="italic text-primary">real life.</span>
          </h2>
          <p className="font-sans text-base text-on-surface-variant">
            Choose a mode and start a conversation.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.title}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative rounded-xl overflow-hidden glass-panel h-[260px] md:h-[400px] flex flex-col justify-end cursor-pointer"
              >
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={mode.img}
                      alt={mode.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </motion.div>
                </div>
                <div className="relative z-20 p-4 md:p-6">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center mb-3 md:mb-4">
                    <Icon size={16} className="text-on-surface" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-on-surface mb-1">
                    {mode.title}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant line-clamp-2">
                    {mode.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
