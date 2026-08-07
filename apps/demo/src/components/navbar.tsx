"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home", active: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Practice", href: "#practice" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-20 px-5 md:px-20">
        <a
          href="#home"
          className="font-display text-2xl text-on-surface flex items-center gap-2 shrink-0"
        >
          <AudioLines className="text-primary" size={22} strokeWidth={2} />
          Voxem
        </a>

        <ul className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="relative">
              <a
                href={link.href}
                className={`font-sans text-sm font-semibold tracking-wide transition-colors duration-300 pb-1 ${
                  link.active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
                {link.active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-on-primary text-sm font-bold rounded-full px-6 py-2.5 whitespace-nowrap"
          >
            Waitlist
          </motion.button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-on-surface p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex flex-col gap-1 px-5 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base font-semibold ${
                    link.active ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button className="mt-4 bg-primary text-on-primary text-sm font-bold rounded-full px-6 py-3 w-full">
                Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
