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
      title: "Kerimov Designs",
      src: "rustam1.webp",
      src2: "rustam2.webp",
      src3: "kerimov-3.jpg",
      src4: "kerimov-4.jpg",
      link: "https://kerimovdesigns.com",
      about: "Portfolio website for graphic designer Rustam Kerimov.",
      stack:
        "React, Next.js, Prisma,GSAP, Motion, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    },
    {
      title: "Calero Studio",
      src: "calero-3.jpg",
      src2: "calero-2.jpg",
      src3: "caler-2.jpg",
      src4: "caler-3.jpg",
      src5: "caler-4.jpg",
      src6: "caler-5.jpg",
      link: "https://www.calero.studio/",
      about:
        "E-commerce product page for Calero Studio showcasing a modern designer lamp with a strong focus on visuals, smooth interactions and 3D product magazine.",
      stack: "React, Prisma, Three.js, GSAP, TailwindCSS, Neon, Stripe",
    },
    {
      title: "Petsaco",
      src: "petsac-1.jpg",
      src2: "petsac-2.jpg",
      src3: "petsac-3.jpg",
      src4: "petsac-4.jpg",
      link: "https://petsaco.com",
      about:
        "E-commerce store for petsaco, selling products for pets. Modern design with GSAP animations ",
      stack:
        "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, Neon, Nextauth, stripe, Zustand.",
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

  const desktopImages = [selected.src, selected.src3, selected.src5].filter(
    Boolean,
  ) as string[];

  const mobileImages = [selected.src2, selected.src4, selected.src6].filter(
    Boolean,
  ) as string[];

  const selectedImages = [
    ...desktopImages.map((img) => ({
      src: img,
      type: "desktop" as const,
    })),
    ...mobileImages.map((img) => ({
      src: img,
      type: "mobile" as const,
    })),
  ];

  const desktopImageLayouts = [
    "ml-[18%] h-[380px] w-[72%] scale-[0.98] xl:h-[460px]",
    "ml-[5%] mt-24 h-[360px] w-[64%] scale-[1.05] xl:h-[440px]",
    "ml-[26%] mt-24 h-[400px] w-[68%] scale-[0.94] xl:h-[480px]",
  ];

  const mobileImageLayouts = [
    "ml-[8%] mt-32 h-[500px] w-[32%] scale-[1] xl:h-[600px]",
    "ml-[56%] mt-32 h-[520px] w-[30%] scale-[0.92] xl:h-[620px]",
    "ml-[28%] mt-32 h-[480px] w-[28%] scale-[1.08] xl:h-[580px]",
  ];

  return (
    <SmoothScroll>
      <section className="relative min-h-screen w-full  bg-[#ececec] text-[#161310]  dark:bg-[#2e2b2b] dark:text-stone-300">
        {/* Mobile */}
        <div className="px-6 pb-16 pt-28 md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] opacity-45">
              Selected Work
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em]">
              My Work
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
                  <div className="relative h-[260px] w-full border border-[#161310]/20 bg-[#f6f4f1] p-4 dark:border-stone-300/20 dark:bg-[#242121]">
                    <div className="relative h-full w-full">
                      <Image
                        src={`/projects/${p.src}`}
                        alt={p.title}
                        fill
                        className="object-contain transition-opacity duration-300 hover:opacity-90"
                      />
                    </div>
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
                      className="inline-block w-fit border border-[#161310] px-4 py-2 text-sm uppercase tracking-[0.18em] dark:border-stone-300"
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
              className="col-span-3 flex min-h-[calc(100vh-7rem)] flex-col"
            >
              <div className="flex flex-1 flex-col justify-center">
                <div>
                  <div className="flex flex-col gap-9">
                    {projects.map((project, i) => {
                      const isSelected = selected.title === project.title;

                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectProject(project)}
                          className="group cursor-pointer text-left"
                        >
                          <h2
                            className={`text-2xl uppercase leading-[0.9] tracking-[-0.05em] transition-all duration-300 xl:text-3xl ${
                              isSelected
                                ? "translate-x-2 opacity-100"
                                : "translate-x-0 opacity-35 group-hover:opacity-100"
                            }`}
                          >
                            {project.title}
                          </h2>
                        </button>
                      );
                    })}
                  </div>

                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-10 inline-block w-fit cursor-pointer overflow-hidden border border-[#161310] px-8 py-4 text-sm  uppercase tracking-[0.2em] text-[#161310] transition dark:border-stone-300 dark:text-stone-300"
                  >
                    <span className="inline-block transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[160%]">
                      View live
                    </span>

                    <span className="absolute left-8 top-4 inline-block translate-y-[160%] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                      View live
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right auto looping page */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
              className="col-span-9"
            >
              <div className="ml-auto flex w-full max-w-[1080px] flex-col">
                <div className="relative h-[76vh] overflow-hidden bg-[#ececec] px-6 dark:bg-[#2e2b2b]">
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
                        <div key={idx} className="mb-24 py-20">
                          <div className="mb-28 max-w-[640px]">
                            <h2 className="text-6xl uppercase font-black leading-[0.86] tracking-[-0.07em] xl:text-8xl">
                              {selected.title}
                            </h2>

                            <p className="mt-7 max-w-[520px] font-semibold text-base leading-relaxed opacity-70 xl:text-xl">
                              {selected.about}
                            </p>

                            <div className="mt-8 max-w-[560px]">
                              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] opacity-35">
                                Stack
                              </p>

                              <p className="text-sm leading-relaxed opacity-60 xl:text-lg">
                                {selected.stack}
                              </p>
                            </div>
                          </div>

                          <div className="relative">
                            {selectedImages.map((image, i) => {
                              const desktopIndex =
                                selectedImages
                                  .slice(0, i + 1)
                                  .filter((item) => item.type === "desktop")
                                  .length - 1;

                              const mobileIndex =
                                selectedImages
                                  .slice(0, i + 1)
                                  .filter((item) => item.type === "mobile")
                                  .length - 1;

                              const layout =
                                image.type === "desktop"
                                  ? desktopImageLayouts[
                                      desktopIndex % desktopImageLayouts.length
                                    ]
                                  : mobileImageLayouts[
                                      mobileIndex % mobileImageLayouts.length
                                    ];

                              return (
                                <div
                                  key={`${image.src}-${i}`}
                                  className={`relative ${layout}`}
                                >
                                  <Image
                                    src={`/projects/${image.src}`}
                                    alt={`${selected.title} ${
                                      image.type === "desktop"
                                        ? "desktop"
                                        : "mobile"
                                    } image ${i + 1}`}
                                    width={
                                      image.type === "desktop" ? 1100 : 500
                                    }
                                    height={
                                      image.type === "desktop" ? 720 : 900
                                    }
                                    className="h-full w-full object-contain"
                                    priority={idx === 0 && i < 2}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <button
            onClick={handlePauseToggle}
            className="fixed bottom-8 right-8 z-50 flex cursor-pointer items-center gap-3  px-6 py-4 text-base font-semibold uppercase tracking-[0.16em] opacity-90 transition-opacity duration-300 hover:opacity-100 "
          >
            {isPaused ? <>Resume</> : <>Pause</>}
          </button>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
