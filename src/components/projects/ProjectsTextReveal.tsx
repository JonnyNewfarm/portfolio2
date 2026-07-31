import { motion, type Variants } from "framer-motion";
import { Children, type ReactNode } from "react";

import { TEXT_EASE } from "./projectsConstants";

type TextRevealTag = "p" | "span" | "h1" | "h2" | "label" | "div";

type ProjectsTextRevealProps = {
  children: ReactNode;
  as?: TextRevealTag;
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
  active?: boolean;
};

export default function ProjectsTextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
  active,
}: ProjectsTextRevealProps) {
  const childArray = Children.toArray(children);

  const canSplitText = childArray.every(
    (child) => typeof child === "string" || typeof child === "number",
  );

  const textContent = canSplitText ? childArray.join("") : null;

  const items: ReactNode[] =
    textContent !== null
      ? mode === "lines"
        ? textContent.split("\n").filter((line) => line.trim().length > 0)
        : textContent.split(" ")
      : childArray;

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
    },

    visible: {
      y: "0%",
      opacity: 1,

      transition: {
        duration: mode === "lines" ? 1 : 0.75,

        ease: TEXT_EASE,
      },
    },
  };

  const content = items.map((item, index) => (
    <span
      key={`${
        typeof item === "string" || typeof item === "number" ? item : "item"
      }-${index}`}
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

        {textContent !== null && mode === "words" && index !== items.length - 1
          ? "\u00A0"
          : null}
      </motion.span>
    </span>
  ));

  const animationProps =
    active === undefined
      ? {
          whileInView: "visible",
          viewport: {
            once,
            amount: 0.35,
          },
        }
      : {
          animate: active ? "visible" : "hidden",
        };

  const commonProps = {
    variants: containerVariants,
    initial: "hidden",
    className,
    ...animationProps,
  };

  switch (as) {
    case "span":
      return <motion.span {...commonProps}>{content}</motion.span>;

    case "h1":
      return <motion.h1 {...commonProps}>{content}</motion.h1>;

    case "h2":
      return <motion.h2 {...commonProps}>{content}</motion.h2>;

    case "label":
      return (
        <motion.label {...commonProps} htmlFor={htmlFor}>
          {content}
        </motion.label>
      );

    case "div":
      return <motion.div {...commonProps}>{content}</motion.div>;

    case "p":
    default:
      return <motion.p {...commonProps}>{content}</motion.p>;
  }
}
