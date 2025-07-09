"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";

const Page = () => {
  const projects = [
    {
      title: "Job Scriptor",
      src: "jobscriptor1.png",
      src2: "jobscriptor2.png",
      src3: "jobscriptor3.png",
      src4: "jobscriptor4.png",
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
      link: "https://kerimovdesigns.vercel.app/",
      stack:
        "React, Next.js, Prisma, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    },
    {
      title: "Custom Canvas",
      src: "canvas1.png",
      src2: "canvas2.png",
      src3: "canvas3.png",
      src4: "canvas4.png",
      link: "https://createcanvas.vercel.app/",
      stack: "React, TypeScript, Prisma, Neon, Upstash, Stripe, KindeAuth.",
    },

    {
      title: "Quote Battle",
      src: "quote1.png",
      src2: "quote2.png",
      src3: "quote3.png",
      src4: "quote4.png",
      link: "https://quotes-bay-one.vercel.app/",
      stack: "Python, Flask, React, TypeScript, Tailwind.",
    },
  ];

  const [selected, setSelected] = useState(projects[0]);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight / 2;

    gsap.killTweensOf(scrollRef.current);
    gsap.set(scrollRef.current, { y: 0 });

    const anim = gsap.to(scrollRef.current, {
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
      anim.kill();
    };
  }, [selected]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <SmoothScroll>
      <div className="w-full bg-[#ececec]">
        <div className="md:hidden flex flex-col px-10 py-10 gap-y-8 border-b border-[#161310]">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0, 1], opacity: [0, 1] }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeInOut" }}
            className="text-2xl font-semibold text-[#1c1a17] mt-10 uppercase"
          >
            My projects
          </motion.h1>
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0, 1], opacity: [0, 1] }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeInOut" }}
            className="text-base text-[#1c1a17]"
          >
            Code / Design / Fullstack
          </motion.h2>

          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0, 1], opacity: [0, 1] }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="block"
            >
              <div className="mb-2 font-semibold  text-[#1c1a17]">
                {p.title}
              </div>
              <Image
                src={`/projects/${p.src}`}
                alt={p.title}
                width={300}
                height={170}
                className="object-contain mb-4"
              />
              <p className="text-sm text-[#1c1a17] opacity-70 mb-2">
                {p.stack}
              </p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 border-[1px] border-[#1c1a17] text-[#1c1a17] text-sm"
              >
                Live Link
              </a>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:flex min-h-screen border-b border-[#161310]">
          <div
            className="max-w-7xl w-full mx-auto px-10 py-24 flex gap-20 relative"
            onMouseMove={handleMouseMove}
          >
            <div className="w-1/3 flex flex-col">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0, 1], opacity: [0, 1] }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-5xl uppercase mb-4 text-[#1c1a17]"
              >
                My Projects
              </motion.h1>
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0, 1], opacity: [0, 1] }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-lg text-[#1c1a17] opacity-70 mb-10"
              >
                Code / Design / Fullstack
              </motion.h2>

              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0, 1], opacity: [0, 1] }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                  className="flex flex-col group"
                >
                  <div
                    className={`cursor-pointer text-xl flex items-center justify-between gap-4 transition-all duration-200 ${
                      selected.title === project.title
                        ? "text-[#1c1a17]"
                        : "opacity-60 hover:opacity-100 text-[#1c1a17]"
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
                        <div className="w-1 h-1 rounded-full bg-[#1c1a17]" />
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
                <h3 className="text-lg mt-5  text-[#1c1a17] mb-2">Stack</h3>
                <p className="text-sm text-[#1c1a17] opacity-70 leading-relaxed">
                  {selected.stack}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0, 1], opacity: [0, 1] }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="w-2/3 max-w-4xl overflow-hidden border-l border-[#1c1a17]/20"
              style={{ height: "620px", position: "relative" }}
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

export default Page;
