"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FlowerRotate() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      className="absolute top-[55%] left-1/2 transform pr-2  -translate-x-1/2 w-[70px] h-[70px] pointer-events-none z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 89.294 86.555"
        className="w-full h-auto"
      >
        <g transform="translate(3.223 -200.66)">
          <motion.path
            d="M30.962,202.5C33,329.048-13.549,268.554-13.549,268.554"
            transform="translate(-17.594 4.527) rotate(-8)"
            fill="none"
            stroke="#1c1a17"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M53.408,286.664c-.244-82.658,2.3-83.751,2.3-83.751l29.859,83.751V202.913"
            fill="none"
            stroke="#1c1a17"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </g>
      </svg>
    </div>
  );
}
