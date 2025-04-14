"use client";
import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import React from "react";

interface FlowerRotate {
  scrollYProgress: MotionValue<number>;
}

const FlowerRotate = ({ scrollYProgress }: FlowerRotate) => {
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "180deg"]);

  return (
    <motion.div style={{ rotate }} className="w-20 h-20 mx-auto my-10">
      <Image src="/blomst.png" className="w-20 h-20" alt="flower" />
    </motion.div>
  );
};

export default FlowerRotate;
