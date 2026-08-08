"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";
import { DashboardMock } from "./dashboard-mock";

export function LaptopMock() {
  return (
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
  );
}
