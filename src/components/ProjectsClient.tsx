"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { CiPause1, CiPlay1 } from "react-icons/ci";

const ProjectsClient = () => {
  const projects = [
    {
      title: "Job Scriptor",
      src: "jobscriptor-1.jpg",
      src2: "jobscriptor-2.jpg",
      src3: "jobscriptor-3.jpg",
      src4: "jobscriptor-4.jpg",
      link: "https://www.jobscriptor.com/",
      stack:
        "React, Next.js, Prisma, TailwindCSS, Neon, NextAuth, OpenAI, Stripe.",
    },
    {
      title: "Kerimov Designs",
      src: "kerimov1.png",
      src2: "kerimov2.png",
      src3: "kerimov3.png",
      src4: "kerimov4.png",
      link: "https://kerimovdesigns.com",
      stack:
        "React, Next.js, Prisma, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    },
  ];

  const [selected, setSelected] = useState(projects[0]);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!scrollRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight / 2;

    gsap.killTweensOf(scrollRef.current);
    gsap.set(scrollRef.current, { y: 0 });

    animRef.current = gsap.to(scrollRef.current, {
      y: -scrollHeight,
      duration: 15,
      ease: "linear",
      repeat: -1,
      modifiers: {
        y: (y) => {
          const val = parseFloat(y);
          if (val <= -scrollHeight) return "0px";
          return y;
        },
      },
    });

    return () => {
      animRef.current?.kill();
      animRef.current = null;
    };
  }, [selected]);

  const handlePauseToggle = () => {
    if (animRef.current) {
      if (isPaused) {
        animRef.current.resume();
      } else {
        animRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <SmoothScroll>
      <div className="w-full min-h-screen h-full bg-[#ececec] dark:bg-[#2e2b2b] text-[#161310] dark:text-stone-300">
        <div className="md:hidden flex flex-col  text-start px-6 py-10  border-b border-[#161310] dark:border-stone-300">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.6, 1], opacity: [0, 1] }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeInOut" }}
            className="text-2xl font-semibold  mt-10 uppercase"
          >
            My projects
          </motion.h1>
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.6, 1], opacity: [0, 1] }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeInOut" }}
            className="text-base  mb-3"
          >
            Code / Design / Fullstack
          </motion.h2>

          <div className="w-full flex justify-center gap-y-9 flex-col">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.6, 1], opacity: [0, 1] }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="block"
              >
                <div className="mb-2 font-semibold ">{p.title}</div>
                <Image
                  src={`/projects/${p.src}`}
                  alt={p.title}
                  width={600}
                  height={400}
                  className="w-full max-w-md mx-auto object-contain mb-4"
                />
                <p className="text-sm  opacity-70 mb-2">{p.stack}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 border-[2px] font-semibold rounded-[2px] border-[#1c1a17] dark:border-stone-300 text-sm"
                >
                  Live Link
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex min-h-screen border-b border-[#161310] dark:border-stone-300">
          <div
            className="max-w-7xl w-full mx-auto px-10 py-24 flex gap-20 relative"
            onMouseMove={handleMouseMove}
          >
            <div className="w-1/3 flex flex-col">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.6, 1], opacity: [0, 1] }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-5xl uppercase mb-4 "
              >
                My Projects
              </motion.h1>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.6, 1], opacity: [0, 1] }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="w-full flex items-center justify-between mb-10 gap-y-3"
              >
                <motion.h2
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.6, 1], opacity: [0, 1] }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="text-lg  opacity-70 "
                >
                  Code / Design / Fullstack
                </motion.h2>
                <button
                  onClick={handlePauseToggle}
                  className=" hover:scale-[1.03] transition-transform ease-in-out whitespace-nowrap text-lg border-stone-700/80 dark:border-stone-300/80   cursor-pointer  flex items-center gap-1.5"
                >
                  {isPaused ? (
                    <>
                      <CiPlay1 /> Resume
                    </>
                  ) : (
                    <>
                      <CiPause1 /> Pause
                    </>
                  )}
                </button>
              </motion.div>

              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.6, 1], opacity: [0, 1] }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                  className="flex flex-col group"
                >
                  <div
                    className={`cursor-pointer text-xl flex items-center justify-between gap-4 transition-all duration-200 ${
                      selected.title === project.title
                        ? ""
                        : "opacity-60 hover:opacity-100"
                    }`}
                    onMouseEnter={() => {
                      setSelected(project);
                      setHovered(true);
                    }}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => window.open(project.link, "_blank")}
                  >
                    <div className="flex items-center gap-3">
                      {selected.title === project.title && (
                        <div className="w-1 h-1 rounded-full bg-[#1c1a17] dark:bg-stone-300" />
                      )}
                      <span>{project.title}</span>
                    </div>
                    <span className="text-sm opacity-40">Live</span>
                  </div>
                  {i < projects.length - 1 && (
                    <hr className="my-4 border-[#1c1a17]/20" />
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
                className="mt-6"
              >
                <h3 className="text-lg mt-5  font-semibold">Stack</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  {selected.stack}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.6, 1], opacity: [0, 1] }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="w-2/3 max-w-4xl max-h-[600px] overflow-hidden border-l border-[#1c1a17]/20 dark:border-stone-300/20 dark:bg-white/70"
              style={{ position: "relative" }}
            >
              <div
                ref={containerRef}
                style={{
                  overflow: "hidden",
                  height: "620px",
                  position: "relative",
                }}
              >
                <div ref={scrollRef}>
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="space-y-12 mb-12">
                      {[
                        selected.src,
                        selected.src2,
                        selected.src3,
                        selected.src4,
                      ].map((img, i) => (
                        <div key={i} className="relative w-full h-[300px]">
                          <Image
                            src={`/projects/${img}`}
                            alt={`${selected.title} image ${i + 1}`}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {hovered && (
              <div
                style={{
                  position: "fixed",
                  top: mousePos.y + 16,
                  left: mousePos.x + 16,
                }}
                className="bg-[#1c1a17] text-white px-4 py-2 text-sm rounded pointer-events-none z-50 shadow-lg"
              >
                Live link
              </div>
            )}
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default ProjectsClient;
