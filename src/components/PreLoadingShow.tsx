"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function HeroIntro() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
        }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-[#181c14]"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className="hero-intro-logo"
              width="300"
              height="300"
              viewBox="0 0 199 93"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.36 92.16C12.544 92.16 9.94134 91.4773 7.55201 90.112C5.24801 88.7467 3.41334 86.912 2.04801 84.608C0.682673 82.2187 6.61612e-06 79.616 6.61612e-06 76.8V69.504H10.368V76.8C10.368 78.1653 10.8373 79.36 11.776 80.384C12.8 81.3227 13.9947 81.792 15.36 81.792H76.8C78.1653 81.792 79.3173 81.3227 80.256 80.384C81.28 79.36 81.792 78.1653 81.792 76.8V0H92.16V76.8C92.16 79.616 91.4773 82.2187 90.112 84.608C88.7467 86.912 86.8693 88.7467 84.48 90.112C82.176 91.4773 79.616 92.16 76.8 92.16H15.36ZM106.531 92.16V0H120.739L188.323 80.384V0H198.691V92.16H184.483L116.899 11.776V92.16H106.531Z"
                fill="black"
              />
            </svg>
          </motion.div>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
          >
            Portfolio Experience
          </motion.p>

          <ProgressLine />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProgressLine() {
  return (
    <div className="relative h-[1px] w-[180px] overflow-hidden bg-[#ecdfcc]/15">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-1/2 bg-[#ecdfcc]"
      />
    </div>
  );
}
