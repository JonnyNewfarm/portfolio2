"use client";
import Image from "next/image";

import wnb from "../../public/wnb.jpg";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import FlowerRotate from "./FlowerRotate";

export default function Section() {
  const container = useRef(null);
  const flowerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-[150vh] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[40vw] font-serif   px-10 py-16  flex flex-col h-[75vh]  bg-[#ecebeb] z-50">
        <h1 className="text-center text-3xl">
          I’m always open to discussing new projects and collaboration
          opportunities. let’s work together to create something exceptional.
        </h1>
        <FlowerRotate scrollYProgress={scrollYProgress} />

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 font-sans">
          <h1>jonasnygaard96@gmail.com</h1>
          <h1>github.com/JonnyNewfarm</h1>
        </div>
      </div>

      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image
            src={wnb}
            priority
            quality={100}
            fill
            alt="image"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
