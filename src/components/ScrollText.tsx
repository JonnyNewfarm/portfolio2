"use client";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ValueProps {
  value: string;
  marginTop?: string;
  marginBottom?: string;
  textSize?: string;
}

const ScrollText = ({
  value,
  marginTop,
  marginBottom,
  textSize,
}: ValueProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.15"],
  });

  const words = value.split(" ");
  return (
    <p
      ref={container}
      className="flex flex-wrap text-4xl sm:px-10  justify-center px-3 md:px-16 lg:px-40 py-32"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word range={[start, end]} progress={scrollYProgress} key={i}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({
  children,
  range,
  progress,
}: {
  children: string;
  range: any;
  progress: any;
}) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative  mr-3">
      <span className="absolute opacity-[0.3]">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export default ScrollText;
