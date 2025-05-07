"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PreLoadingShow = () => {
  const [index, setIndex] = useState(0);
  const texts = ["Hello world", "welcome to my page"];

  useEffect(() => {
    if (index == texts.length - 1) return;

    setTimeout(
      () => {
        setIndex(index + 1);
      },
      index == 0 ? 1000 : 150
    );
  }, [index]);

  const opacity = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 0.75,
      transition: { duration: 1, delay: 0.2 },
    },
  };

  const slideUpAnimation = {
    initial: {
      top: 0,
    },
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
      className="h-screen w-screen bg-[#161310] fixed top-0 left-0 z-[999] text-[#ecebeb] flex justify-center items-center"
    >
      <motion.p
        className="font-semibold text-3xl sm:text-5xl"
        variants={opacity}
        initial="initial"
        animate="enter"
      >
        {texts[index]}
      </motion.p>
    </motion.div>
  );
};

export default PreLoadingShow;
