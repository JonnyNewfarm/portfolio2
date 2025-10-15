"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PreLoadingShow = () => {
  const [showSecond, setShowSecond] = useState(false);
  const [percentage, setPercentage] = useState(0);

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
      if (progress >= 100) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[999] h-screen w-screen bg-[#1c1a17] text-[#ececec] flex flex-col justify-center items-center">
      {/* Text wrapper to avoid layout jumps */}
      <div className="flex flex-col items-center leading-tight">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-semibold text-3xl sm:text-5xl"
        >
          Hello world,
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showSecond ? 1 : 0, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          className="font-semibold text-3xl sm:text-5xl mt-3"
        >
          welcome to my page.
        </motion.p>
      </div>

      <div className="absolute bottom-4 right-4 text-xl sm:text-4xl font-mono text-gray-300">
        {percentage}%
      </div>
    </div>
  );
};

export default PreLoadingShow;
