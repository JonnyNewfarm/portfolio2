"use client";

import { motion } from "framer-motion";

export default function PreLoadingShow() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.7,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#181c14]"
    >
      <div className="flex flex-col items-center gap-7">
        <div className="text-center uppercase text-[#ecdfcc]">
          <p className="text-[14px] font-medium tracking-[0.2em]">
            Jonas Nygaard
          </p>

          <p className="mt-1 text-[10px] tracking-[0.32em] text-[#ecdfcc]/60">
            — Portfolio Experience
          </p>
        </div>

        <ProgressLine />
      </div>
    </motion.div>
  );
}

function ProgressLine() {
  return (
    <div className="relative h-px w-[180px] overflow-hidden bg-[#ecdfcc]/15">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute inset-y-0 left-0 w-1/2 bg-[#ecdfcc]"
      />
    </div>
  );
}
