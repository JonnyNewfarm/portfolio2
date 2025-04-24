"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyScrollParagraphs() {
  const [step, setStep] = useState(0);
  const [canScroll, setCanScroll] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (!triggerRef.current || !canScroll) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight / 2;
      const scrollingDown = window.scrollY > lastScrollY.current;
      const scrollingUp = window.scrollY < lastScrollY.current;

      if (scrollingDown && rect.top <= triggerPoint && step === 0) {
        setCanScroll(false);
        setStep(1);
        setTimeout(() => setCanScroll(true), 1000);
      }

      if (scrollingUp && rect.top > triggerPoint && step === 1) {
        setCanScroll(false);
        setStep(0);
        setTimeout(() => setCanScroll(true), 1000);
      }

      lastScrollY.current = window.scrollY;
    };

    if (!canScroll) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflowX = "hidden";
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("scroll", onScroll);
    };
  }, [step, canScroll]);

  return (
    <div className="relative h-[250vh] bg-[#ecebeb]">
      <div className="sticky top-0 h-screen flex items-center justify-center bg-[#ecebeb] text-[#161310] text-2xl px-6 sm:text-3xl lg:text-5xl md:text-4xl z-10">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.p
              key="p-a"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl px-4 text-center"
            >
              Hi, Im Jonas, a 28-year-old designer and developer with a passion
              for creating seamless, user-friendly digital experiences. I like
              to work in JavaScript and TypeScript.
            </motion.p>
          ) : (
            <motion.p
              key="p-b"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl px-4 text-center"
            >
              I work extensively with libraries like React and Next.js to build
              dynamic, responsive websites and applications. I’m always excited
              to blend design with development to bring innovative ideas to
              life.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div ref={triggerRef} className="absolute top-[120vh] h-1 w-full" />
    </div>
  );
}
