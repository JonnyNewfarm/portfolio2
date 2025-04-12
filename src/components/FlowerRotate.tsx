"use client";
import { motion, useTransform } from "framer-motion";
import React from "react";
interface FlowerRotate {
  scrollYProgress: any;
}

const FlowerRotate = ({ scrollYProgress }: FlowerRotate) => {
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "180deg"]);

  return (
    <motion.div style={{ rotate }} className="w-20 h-20 mx-auto my-10">
      <img src="/blomst.png" className="w-20 h-20" alt="flower" />
    </motion.div>
  );
};

export default FlowerRotate;
