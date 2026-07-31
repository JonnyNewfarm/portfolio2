import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { CONTACT_EASE } from "./contactUtils";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 28,
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount,
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: CONTACT_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedFieldProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function AnimatedField({
  children,
  delay = 0,
  className = "",
}: AnimatedFieldProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 26,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 0.85,
        delay,
        ease: CONTACT_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
