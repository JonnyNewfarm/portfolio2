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
      title: "Calero Studio",
      src: "cal.png",
      src2: "cal2.png",
      src3: "cal3.png",
      src4: "cal4.png",
      link: "https://www.calero.studio/",
      about:
        "E-commerce product page for Calero Studio showcasing a modern designer lamp with a strong focus on visuals, smooth interactions and 3D product magazine.",
      stack: "React, Prisma, Three.js, GSAP, TailwindCSS, Neon, Stripe",
    },
    {
      title: "Job Scriptor",
      src: "job1.webp",
      src2: "job2.webp",
      src3: "job3.webp",
      src4: "job4.webp",
      link: "https://www.jobscriptor.com/",
      about:
        "Website featuring AI tools for writing resumes and cover letters, and for finding jobs that match your resume.",
      stack:
        "React, Next.js, Prisma, TailwindCSS, Neon, NextAuth, OpenAI, Stripe.",
    },
    {
      title: "Kerimov Designs",
      src: "rustam1.webp",
      src2: "rustam2.webp",
      src3: "rustam3.webp",
      src4: "rustam4.webp",
      link: "https://kerimovdesigns.com",
      about: "Portfolio website for graphic designer Rustam Kerimov.",
      stack:
        "React, Next.js, Prisma, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    },
  ];

  const [selected, setSelected] = useState(projects[0]);
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
    if (!animRef.current) return;

    if (isPaused) {
      animRef.current.resume();
    } else {
      animRef.current.pause();
    }

    setIsPaused(!isPaused);
  };

  const handleSelectProject = (project: (typeof projects)[number]) => {
    setSelected(project);

    if (isPaused && animRef.current) {
      animRef.current.resume();
      setIsPaused(false);
    }
  };

  return (
    <SmoothScroll>
      <section className="min-h-screen w-full border-b border-stone-300 bg-[#ececec] text-[#161310] dark:border-stone-600 dark:bg-[#2e2b2b] dark:text-stone-300">
        {/* Mobile */}
        <div className="md:hidden px-6 pb-16 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] opacity-45">
              Selected Work
            </p>
            <h1 className="text-4xl uppercase leading-[0.92] tracking-[-0.05em]">
              My Projects
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] opacity-55">
              Code / Design / Fullstack
            </p>
          </motion.div>

          <div className="mt-14 flex flex-col gap-16">
            {projects.map((p, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                className="flex flex-col"
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] opacity-35">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h2 className="mb-5 text-2xl uppercase leading-[0.95] tracking-[-0.04em]">
                  {p.title}
                </h2>

                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative h-[240px] w-full overflow-hidden border border-[#161310]/15 dark:border-stone-300/15">
                    <Image
                      src={`/projects/${p.src}`}
                      alt={p.title}
                      fill
                      className="object-cover transition-opacity duration-300 hover:opacity-90"
                    />
                  </div>
                </a>

                <div className="mt-6 border-t border-[#161310]/15 pt-5 dark:border-stone-300/15">
                  <p className="text-sm leading-relaxed opacity-75">
                    {p.about}
                  </p>

                  <div className="mt-5 flex flex-col gap-4 border-t border-[#161310]/15 pt-4 dark:border-stone-300/15">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] opacity-40">
                        Stack
                      </p>
                      <p className="text-sm leading-relaxed opacity-70">
                        {p.stack}
                      </p>
                    </div>

                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-fit border border-[#161310] px-4 py-2 text-xs uppercase tracking-[0.18em] dark:border-stone-300"
                    >
                      View Website
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-12 gap-10 px-10 pb-12 pt-28 xl:px-20">
            {/* Left rail */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="col-span-4 flex min-h-[calc(100vh-7rem)] flex-col"
            >
              <div className="shrink-0">
                <p className="mb-4 text-[10px] uppercase tracking-[0.3em] opacity-45">
                  Selected Work
                </p>

                <h1 className="max-w-[420px] text-6xl uppercase leading-[0.9] tracking-[-0.06em] xl:text-7xl">
                  My Projects
                </h1>

                <div className="mt-5 flex items-center justify-between gap-4 border-b border-[#161310]/15 pb-6 dark:border-stone-300/15">
                  <p className="text-sm uppercase tracking-[0.18em] opacity-55">
                    Code / Design / Fullstack
                  </p>

                  <button
                    onClick={handlePauseToggle}
                    className="flex cursor-pointer items-center gap-2 text-sm uppercase tracking-[0.16em] opacity-70 transition-opacity duration-300 hover:opacity-100"
                  >
                    {isPaused ? (
                      <>
                        <CiPlay1 />
                        Resume
                      </>
                    ) : (
                      <>
                        <CiPause1 />
                        Pause
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-10 flex-1">
                {projects.map((project, i) => {
                  const isSelected = selected.title === project.title;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectProject(project)}
                      className="group flex w-full cursor-pointer flex-col border-b border-[#161310]/15 py-5 text-left dark:border-stone-300/15"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-1 text-[10px] uppercase tracking-[0.24em] transition-opacity duration-300 ${
                              isSelected ? "opacity-100" : "opacity-30"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <h2
                              className={`text-2xl uppercase leading-none tracking-[-0.04em] transition-all duration-300 xl:text-3xl ${
                                isSelected
                                  ? "translate-x-2 opacity-100"
                                  : "translate-x-0 opacity-65 group-hover:opacity-100"
                              }`}
                            >
                              {project.title}
                            </h2>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-xs uppercase tracking-[0.18em] transition-opacity duration-300 ${
                            isSelected ? "opacity-60" : "opacity-25"
                          }`}
                        >
                          Live
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={selected.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mt-10 shrink-0 border-t border-[#161310]/15 pt-6 dark:border-stone-300/15"
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] opacity-40">
                  Selected Project
                </p>

                <h3 className="text-3xl uppercase leading-[0.95] tracking-[-0.04em]">
                  {selected.title}
                </h3>

                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#161310]/15 pt-6 dark:border-stone-300/15">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] opacity-40">
                      About
                    </p>
                    <p className="max-w-[520px] text-sm leading-relaxed opacity-75">
                      {selected.about}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] opacity-40">
                      Stack
                    </p>
                    <p className="text-sm leading-relaxed opacity-70">
                      {selected.stack}
                    </p>
                  </div>

                  <div>
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border border-[#161310] px-5 py-2 text-xs uppercase tracking-[0.18em] dark:border-stone-300"
                    >
                      View Website
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right showcase */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
              className="col-span-8"
            >
              <div className="ml-auto flex w-full max-w-[980px] flex-col">
                <div className="mb-6 flex items-end justify-between gap-6  pb-5 dark:border-stone-300/15">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.25em] opacity-40">
                      Showcase
                    </p>
                    <h2 className="text-4xl uppercase leading-none tracking-[-0.05em] xl:text-2xl">
                      {selected.title}
                    </h2>
                  </div>

                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm uppercase tracking-[0.18em] opacity-55 transition-opacity duration-300 hover:opacity-100"
                  >
                    Open Live
                  </a>
                </div>

                <div className="relative h-[76vh] overflow-hidden border-l border-[#161310]/15 dark:border-stone-300/15">
                  <div
                    ref={containerRef}
                    className="h-screen"
                    style={{
                      overflow: "hidden",
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
