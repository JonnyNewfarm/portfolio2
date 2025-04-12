"use client";
import Image from "next/image";
import jonny4 from "../../public/jonny4.jpg";
import paraply from "../../public/paraply.jpg";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Section() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="absolute top-8 left-16  w-full z-50">
        <h1 className="text-white/80 text-5xl font-bold font-serif">
          Jonas F. Nygaard
        </h1>
      </div>
      <div className="absolute bottom-8 left-16  w-full z-50">
        <h1 className="text-white/80 text-8xl font-bold font-serif">
          Designer & Developer
        </h1>
      </div>
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image
            src={paraply}
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
