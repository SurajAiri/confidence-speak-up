"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export const easePremium = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easePremium },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: easePremium },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easePremium },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  once = true,
  amount = 0.25,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}
