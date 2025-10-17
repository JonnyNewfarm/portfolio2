"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PreLoadingShow = () => {
  const [showSecond, setShowSecond] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPercentage(Math.floor(progress));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setFinished(true), 500);
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
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-0 left-0 z-[999] h-screen w-screen bg-[#23211e] text-[#ececec] flex flex-col justify-center items-center"
        >
          <div className="flex flex-col items-center leading-tight overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="font-semibold text-3xl sm:text-5xl bg-gradient-to-r from-[#e4fae3] to-[#ececec] bg-clip-text text-transparent"
            >
              Hello world,
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{
                opacity: showSecond ? 1 : 0,
                y: showSecond ? 0 : 50,
                scale: showSecond ? 1 : 0.95,
              }}
              transition={{
                duration: 1.4,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.4,
              }}
              className="font-semibold text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-[#ececec] to-[#e4fae3] bg-clip-text text-transparent"
            >
              welcome to my page.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 1, 0.5, 1],
              transition: {
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-4 right-6 text-xl sm:text-4xl font-mono text-gray-400"
          >
            {percentage}%
          </motion.div>

          {/* Glow pulse circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[200px] h-[200px] rounded-full bg-[#d4af37]/10 blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreLoadingShow;
