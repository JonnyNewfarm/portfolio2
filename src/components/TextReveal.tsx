"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";

const TEXT_EASE = [0.22, 1, 0.36, 1] as const;

type TextRevealTag = "p" | "h1" | "h2" | "h3" | "span" | "label" | "div";

type TextRevealProps = {
  children: React.ReactNode;
  as?: TextRevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  mode?: "words" | "lines" | "chars";
  viewport?: boolean;
  htmlFor?: string;
};

type TextRange = {
  start: number;
  end: number;
};

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function getNodeTextLength(node: React.ReactNode): number {
  return getTextContent(node).length;
}

function renderNodeRange(
  node: React.ReactNode,
  rangeStart: number,
  rangeEnd: number,
  nodeStart = 0,
): React.ReactNode {
  if (rangeStart >= rangeEnd) {
    return null;
  }

  if (typeof node === "string" || typeof node === "number") {
    const value = String(node);

    const localStart = Math.max(0, rangeStart - nodeStart);
    const localEnd = Math.min(value.length, rangeEnd - nodeStart);

    if (localStart >= localEnd) {
      return null;
    }

    return value.slice(localStart, localEnd);
  }

  if (Array.isArray(node)) {
    let currentOffset = nodeStart;

    return node.map((child, index) => {
      const childLength = getNodeTextLength(child);
      const childStart = currentOffset;
      const childEnd = childStart + childLength;

      currentOffset = childEnd;

      if (rangeEnd <= childStart || rangeStart >= childEnd) {
        return null;
      }

      return (
        <React.Fragment key={index}>
          {renderNodeRange(child, rangeStart, rangeEnd, childStart)}
        </React.Fragment>
      );
    });
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    const nodeLength = getNodeTextLength(node);
    const nodeEnd = nodeStart + nodeLength;

    if (rangeEnd <= nodeStart || rangeStart >= nodeEnd) {
      return null;
    }

    const renderedChildren = renderNodeRange(
      node.props.children,
      rangeStart,
      rangeEnd,
      nodeStart,
    );

    return React.cloneElement(node, undefined, renderedChildren);
  }

  return null;
}

function createTextRanges(
  text: string,
  mode: "words" | "lines" | "chars",
): TextRange[] {
  if (mode === "chars") {
    const ranges: TextRange[] = [];

    let offset = 0;

    for (const character of Array.from(text)) {
      ranges.push({
        start: offset,
        end: offset + character.length,
      });

      offset += character.length;
    }

    return ranges;
  }

  if (mode === "lines") {
    const ranges: TextRange[] = [];

    let lineStart = 0;

    text.split("\n").forEach((line) => {
      const lineEnd = lineStart + line.length;

      if (line.trim().length > 0) {
        ranges.push({
          start: lineStart,
          end: lineEnd,
        });
      }

      lineStart = lineEnd + 1;
    });

    return ranges;
  }

  const ranges: TextRange[] = [];
  const expression = /\S+/g;

  let match: RegExpExecArray | null;

  while ((match = expression.exec(text)) !== null) {
    ranges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return ranges;
}

export default function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  stagger,
  duration,
  once = true,
  amount = 0.35,
  mode = "words",
  viewport = true,
  htmlFor,
}: TextRevealProps) {
  const MotionTag = motion[as] as React.ElementType;

  const text = useMemo(() => getTextContent(children), [children]);

  const ranges = useMemo(() => createTextRanges(text, mode), [text, mode]);

  const resolvedStagger =
    stagger ?? (mode === "lines" ? 0.11 : mode === "chars" ? 0.014 : 0.028);

  const resolvedDuration =
    duration ?? (mode === "lines" ? 1 : mode === "chars" ? 0.55 : 0.75);

  const containerVariants: Variants = {
    hidden: {},

    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: resolvedStagger,
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
        duration: resolvedDuration,
        ease: TEXT_EASE,
      },
    },
  };

  return (
    <MotionTag
      htmlFor={as === "label" ? htmlFor : undefined}
      variants={containerVariants}
      initial="hidden"
      whileInView={viewport ? "visible" : undefined}
      animate={!viewport ? "visible" : undefined}
      viewport={
        viewport
          ? {
              once,
              amount,
            }
          : undefined
      }
      className={className}
    >
      {ranges.map((range, index) => {
        const renderedContent = renderNodeRange(
          children,
          range.start,
          range.end,
        );

        const character = text.slice(range.start, range.end);

        const isSpaceCharacter = mode === "chars" && character === " ";

        return (
          <span
            key={`${range.start}-${range.end}-${index}`}
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
              {isSpaceCharacter ? "\u00A0" : renderedContent}

              {mode === "words" && index !== ranges.length - 1
                ? "\u00A0"
                : null}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
