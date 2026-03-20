"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const draw = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay,
        duration: 1.15,
        ease: [0.65, 0, 0.35, 1],
      },
      opacity: {
        delay,
        duration: 0.2,
      },
    },
  }),
};

const PreLoadingShow = () => {
  const [percentage, setPercentage] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPercentage(Math.floor(progress));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setFinished(true), 450);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: "-100%",
            transition: {
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#181c14] text-[#ecdfcc]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 h-[1px] w-full origin-left bg-[#ecdfcc]/20"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-0 left-0 h-[1px] w-full origin-left bg-[#ecdfcc]/20"
          />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <JNLogo />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
            >
              Portfolio Experience
            </motion.p>

            <ProgressLine />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.25, 1, 0.5, 1],
              transition: {
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-4 right-6 text-xl sm:text-4xl font-mono text-[#ecdfcc]/45"
          >
            {percentage}%
          </motion.div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.06, 0.14, 0.06],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-[240px] w-[240px] rounded-full bg-[#ecdfcc]/10 blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function JNLogo() {
  return (
    <motion.svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className="overflow-visible"
    >
      <motion.path
        d="M30 35H82"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0}
      />

      <motion.path
        d="M68 35V118C68 140 56 145 40 145C29 145 20 141 14 134"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.18}
      />

      <motion.path
        d="M118 145V35"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.38}
      />

      <motion.path
        d="M118 35L172 145"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.56}
      />

      <motion.path
        d="M172 145V35"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.74}
      />
    </motion.svg>
  );
}

function ProgressLine() {
  return (
    <div className="relative h-[1px] w-[180px] overflow-hidden bg-[#ecdfcc]/15">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-1/2 bg-[#ecdfcc]"
      />
    </div>
  );
}

export default PreLoadingShow;
