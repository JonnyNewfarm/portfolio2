"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PreLoadingShow = () => {
  const [index, setIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const texts = ["Hello world.", "Welcome to my page."];

  useEffect(() => {
    if (index === texts.length - 1) return;

    const timeout = setTimeout(
      () => setIndex(index + 1),
      index === 0 ? 1000 : 150
    );

    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let progress = (elapsed / duration) * 100;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setPercentage(Math.floor(progress));
    }, 16); // ~60fps for smooth animation

    return () => clearInterval(interval);
  }, []);

  const opacity = {
    initial: { opacity: 0 },
    enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
  };

  const slideUpAnimation = {
    initial: { top: 0 },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  return (
    <motion.div
      variants={slideUpAnimation}
      initial="initial"
      exit="exit"
      className="h-screen w-screen bg-[#1c1a17] fixed top-0 left-0 z-[999] text-[#ececec] flex justify-center items-center"
    >
      <motion.p
        className="font-semibold text-3xl sm:text-5xl"
        variants={opacity}
        initial="initial"
        animate="enter"
      >
        {texts[index]}
      </motion.p>

      {/* Percentage loader */}
      <div className="absolute bottom-4 right-4 text-lg sm:text-2xl font-mono text-gray-300">
        {percentage}%
      </div>
    </motion.div>
  );
};

export default PreLoadingShow;
