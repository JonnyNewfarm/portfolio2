import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { CONTACT_EASE } from "./contactUtils";

type TextRevealTag = "p" | "h1" | "h2" | "h3" | "span" | "label" | "div";

type ContactTextRevealProps = {
  children: string;
  as?: TextRevealTag;
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
};

export default function ContactTextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
}: ContactTextRevealProps) {
  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants: Variants = {
    hidden: {},

    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotate: 0,
      filter: "blur(10px)",
    },

    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",

      transition: {
        duration: mode === "lines" ? 1 : 0.75,

        ease: CONTACT_EASE,
      },
    },
  };

  const content: ReactNode = items.map((item, index) => (
    <span
      key={`${item}-${index}`}
      className={
        mode === "lines"
          ? "block -my-[0.08em] overflow-hidden py-[0.08em]"
          : "inline-block -my-[0.04em] overflow-hidden py-[0.04em] align-top"
      }
    >
      <motion.span
        variants={itemVariants}
        className="
            inline-block
            will-change-transform
          "
      >
        {item}

        {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
      </motion.span>
    </span>
  ));

  const motionProps = {
    variants: containerVariants,
    initial: "hidden",
    whileInView: "visible",
    viewport: {
      once,
      amount: 0.35,
    },
    className,
  } as const;

  switch (as) {
    case "h1":
      return <motion.h1 {...motionProps}>{content}</motion.h1>;

    case "h2":
      return <motion.h2 {...motionProps}>{content}</motion.h2>;

    case "h3":
      return <motion.h3 {...motionProps}>{content}</motion.h3>;

    case "span":
      return <motion.span {...motionProps}>{content}</motion.span>;

    case "label":
      return (
        <motion.label {...motionProps} htmlFor={htmlFor}>
          {content}
        </motion.label>
      );

    case "div":
      return <motion.div {...motionProps}>{content}</motion.div>;

    case "p":
    default:
      return <motion.p {...motionProps}>{content}</motion.p>;
  }
}
