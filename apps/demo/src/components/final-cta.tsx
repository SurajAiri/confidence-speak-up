"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Reveal, easePremium } from "./motion-primitives";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-24 md:py-[120px] bg-surface relative">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <Reveal variants={{
          hidden: { opacity: 0, y: 40, scale: 0.97 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: easePremium } },
        }}>
          <div className="relative glass-panel glass-panel-glow rounded-3xl p-8 md:p-16 text-center max-w-3xl mx-auto overflow-hidden">
            <motion.div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="font-display text-[28px] leading-[1.2] md:text-[48px] md:leading-[1.2] text-on-surface mb-4 relative">
              Small practice today.
              <br />
              <span className="text-primary italic">Big difference tomorrow.</span>
            </h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant mb-10 max-w-md mx-auto relative">
              Join the waitlist and be the first to know when we go live.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow bg-surface-container-low border border-outline-variant rounded-full px-6 py-3 font-sans text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="bg-primary text-on-primary font-bold text-sm rounded-full px-8 py-3 flex justify-center items-center gap-2 whitespace-nowrap"
                >
                  Join Waitlist
                  <ArrowRight size={16} />
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto bg-primary/10 border border-primary/30 rounded-full px-6 py-3.5 relative"
              >
                <span className="font-sans text-sm text-primary font-semibold">
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </span>
              </motion.div>
            )}
            <p className="font-sans text-xs text-outline-variant mt-4 relative">
              No spam. Just updates about our launch.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
