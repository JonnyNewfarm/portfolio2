"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import WaveLinkText from "./WaveLinkText";
import Link from "next/link";

type Project = {
  title: string;
  year: string;
  category: string;
  link: string;
  about: string;
  stack: string;
  role: string;
  images: string[];
};

type CaseCard = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

const projects: Project[] = [
  {
    title: "Kerimov Designs",
    year: "2025",
    category: "Web Design & Branding",
    link: "https://kerimovdesigns.com",
    about: "Portfolio website for graphic designer Rustam Kerimov.",
    stack:
      "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    role: "Design, frontend and backend.",
    images: [
      "kerimov-01.jpg",
      "kerimov-02.jpg",
      "kerimov-03.jpg",
      "kerimov-04.jpg",
      "kerimov-05.jpg",
      "kerimov-06.jpg",
    ],
  },
  {
    title: "Calero Studio",
    year: "2025",
    category: "E-commerce & 3D",
    link: "https://www.calero.studio/",
    about:
      "E-commerce product page with visual direction, product storytelling, 3D presentation and smooth motion.",
    stack: "React, Prisma, Three.js, GSAP, TailwindCSS, Neon, Stripe.",
    role: "Design, frontend, backend, Stripe and motion.",
    images: [
      "calero-01.jpg",
      "calero-001.jpg",
      "calero-03.jpg",
      "calero-04.jpg",
      "calero-05.jpg",
      "calero-06.jpg",
    ],
  },
  {
    title: "Petsaco",
    year: "2025",
    category: "E-commerce & Brand",
    link: "https://petsaco.com",
    about:
      "E-commerce store with product browsing, authentication, checkout and animated brand experience.",
    stack:
      "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, Neon, NextAuth, Stripe, Zustand.",
    role: "Design, frontend, backend, auth, checkout and animations.",
    images: [
      "petsaco-01.jpg",
      "petsaco-02.jpg",
      "petsaco-03.jpg",
      "petsaco-04.jpg",
      "petsaco-05.jpg",
      "petsaco-06.jpg",
    ],
  },
];

const ProjectsClient = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const cards = useMemo<CaseCard[]>(() => {
    const content = [
      {
        eyebrow: `${selectedProject.category}, ${selectedProject.year}`,
        title: selectedProject.title,
        description: selectedProject.about,
      },
      {
        eyebrow: `Design, ${selectedProject.year}`,
        title: "Design",
        description:
          "Visual direction, typography, layout and interaction design.",
      },
      {
        eyebrow: `Frontend, ${selectedProject.year}`,
        title: "Frontend",
        description:
          "Responsive interface, animation system and polished user experience.",
      },
      {
        eyebrow: `Backend, ${selectedProject.year}`,
        title: "Backend",
        description:
          "Database, authentication, API logic and application structure.",
      },
      {
        eyebrow: "Stack",
        title: "Technology",
        description: selectedProject.stack,
      },
      {
        eyebrow: "Role",
        title: "What I Did",
        description: selectedProject.role,
      },
    ];

    return selectedProject.images.map((image, index) => ({
      image,
      ...content[index],
    }));
  }, [selectedProject]);

  const loopedCards = useMemo(() => {
    return [
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
      ...cards,
    ];
  }, [cards]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const baseWidth = () => window.innerWidth * 0.22;
    const baseHeight = () => baseWidth() * 1.02;

    const minScale = 1;
    const maxScale = 1.6;

    const getScaleFromX = (x: number) => {
      const vw = window.innerWidth;

      return gsap.utils.clamp(
        minScale,
        maxScale,
        gsap.utils.mapRange(0, vw * 0.9, minScale, maxScale, x),
      );
    };

    const render = () => {
      const bw = baseWidth();
      const bh = baseHeight();

      const oneSetWidth = cards.length * bw;
      const wrappedOffset = gsap.utils.wrap(0, oneSetWidth, offsetRef.current);

      let runningX = -oneSetWidth + wrappedOffset;

      cardRefs.current.forEach((card) => {
        if (!card) return;

        const scale = getScaleFromX(runningX);
        const width = bw * scale;
        const height = bh * scale;

        gsap.set(card, {
          x: runningX,
          width,
          height,
        });

        runningX += width;
      });
    };

    const tick = () => {
      offsetRef.current += velocityRef.current;
      velocityRef.current *= 0.88;

      if (Math.abs(velocityRef.current) < 0.01) {
        velocityRef.current = 0;
      }

      render();
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      velocityRef.current += event.deltaY * 0.22;
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", render);

    render();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      stage.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", render);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [cards]);

  const handleSelectProject = (project: Project) => {
    if (project.title === selectedProject.title) return;

    setSelectedProject(project);
    offsetRef.current = 0;
    velocityRef.current = 0;
  };

  return (
    <SmoothScroll>
      <section className="relative min-h-screen w-full overflow-hidden bg-[#ececec] text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300">
        {/* Mobile */}
        <div className="px-6 pb-16 pt-28 md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#161310]/45 dark:text-stone-300/45">
              Selected Work
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#161310] dark:text-stone-200">
              My Work
            </h1>

            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#161310]/55 dark:text-stone-300/55">
              Code / Design / Fullstack
            </p>
          </motion.div>

          <div className="mt-14 flex flex-col gap-16">
            {projects.map((project, i) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                className="flex flex-col"
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#161310]/35 dark:text-stone-300/35">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h2 className="mb-5 text-2xl uppercase leading-[0.95] tracking-[-0.04em] text-[#161310] dark:text-stone-200">
                  {project.title}
                </h2>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative h-[260px] w-full border border-[#161310]/20 p-4 dark:border-stone-300/20">
                    <div className="relative h-full w-full ">
                      <Image
                        src={`/projects/${project.images[0]}`}
                        alt={project.title}
                        fill
                        className="object-contain  transition-opacity duration-300 hover:opacity-90"
                      />
                    </div>
                  </div>
                </a>

                <div className="mt-6 border-t border-[#161310]/15 pt-5 dark:border-stone-300/15">
                  <p className="text-sm leading-relaxed text-[#161310]/75 dark:text-stone-300/75">
                    {project.about}
                  </p>

                  <div className="mt-5 flex flex-col gap-4 border-t border-[#161310]/15 pt-4 dark:border-stone-300/15">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#161310]/40 dark:text-stone-300/40">
                        Stack
                      </p>

                      <p className="text-sm leading-relaxed text-[#161310]/70 dark:text-stone-300/70">
                        {project.stack}
                      </p>
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-fit border border-[#161310] px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#161310] dark:border-stone-300 dark:text-stone-300"
                    >
                      View Website
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <footer className="relative overflow-hidden bg-[#ececec] px-4 py-10 text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300 md:px-10 lg:px-16">
            <div className="mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-between pt-8">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                <div>
                  <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] opacity-45 md:text-sm">
                    Contact / Availability
                  </p>

                  <h2 className="max-w-[1200px] text-[13vw] font-black uppercase leading-[0.78] tracking-[-0.075em] md:text-[10vw] lg:text-[7.6vw]">
                    Let&apos;s build
                    <br />
                    something
                    <br />
                    useful.
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:justify-self-end md:text-right">
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] opacity-40">
                      Navigation
                    </p>

                    <div className="flex flex-col items-start gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] opacity-80 md:items-end md:text-3xl">
                      <Link
                        href="/"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="Home" />
                      </Link>

                      <Link
                        href="/projects"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="My Work" />
                      </Link>

                      <Link
                        href="/about"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="About" />
                      </Link>

                      <Link
                        href="/contact"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="Contact" />
                      </Link>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] opacity-40">
                      Social
                    </p>

                    <div className="flex flex-col items-start gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] opacity-80 md:items-end md:text-3xl">
                      <a
                        href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="LinkedIn" />
                      </a>

                      <a
                        href="https://www.jonasnygaard.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit transition hover:opacity-60"
                      >
                        <WaveLinkText text="Portfolio" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 grid grid-cols-1 gap-6 border-t border-stone-400/30 pt-6 text-sm font-black uppercase tracking-[0.14em] opacity-75 dark:border-stone-200/20 md:grid-cols-4">
                <div>
                  <p className="mb-1 opacity-35">Created by</p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.jonasnygaard.com/"
                    className="inline-block w-fit transition hover:opacity-60"
                  >
                    <WaveLinkText text="Newfarm Studio" />
                  </a>
                </div>

                <div>
                  <p className="mb-1 opacity-35">Email</p>
                  <a
                    href="mailto:jonasnygaard96@gmail.com"
                    className="inline-block w-fit normal-case tracking-normal transition hover:opacity-60"
                  >
                    <WaveLinkText text="jonasnygaard96@gmail.com" />
                  </a>
                </div>

                <div className="md:text-right">
                  <p className="mb-1 opacity-35">Location</p>
                  <p>Oslo, Norway</p>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Desktop */}
        <div className="hidden h-screen w-full overflow-hidden md:block">
          {/* Left project list */}
          <div className="fixed left-6 top-[22vh] z-50 flex flex-col gap-5 xl:left-8">
            <p className="relative text-[11px] font-black uppercase tracking-[0.28em] text-[#161310]/80 dark:text-stone-300/80">
              Selected Work <span className="opacity-70">/ 03</span>
            </p>
            <div className="flex flex-col gap-5">
              {projects.map((project, index) => {
                const isActive = selectedProject.title === project.title;

                return (
                  <button
                    key={project.title}
                    onClick={() => handleSelectProject(project)}
                    className={`w-fit text-left cursor-pointer text-[18px] font-black uppercase tracking-[-0.02em] text-[#161310] transition-opacity duration-300 dark:text-stone-300 ${
                      isActive ? "opacity-100" : "opacity-35 hover:opacity-100"
                    }`}
                  >
                    <span className="mr-2 inline-block min-w-[24px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {project.title}
                  </button>
                );
              })}
            </div>

            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-1 inline-block  w-fit overflow-hidden text-[15px] font-black uppercase tracking-[0.18em] text-[#161310] dark:text-stone-300"
            >
              <WaveLinkText text="Live Link" />
            </a>
          </div>

          {/* Infinite desktop cards */}
          <div
            ref={stageRef}
            className="relative  h-screen w-full overflow-hidden"
          >
            {loopedCards.map((card, index) => (
              <article
                key={`${card.title}-${card.image}-${index}`}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="absolute  bottom-[-3vh]  left-0 flex flex-col overflow-hidden border border-[#161310]/30 bg-[#ececec] p-[1.1vw] text-[#161310] will-change-[transform,width,height] dark:border-stone-300/25 dark:bg-[#2e2b2b] dark:text-stone-300"
              >
                <div className="relative  aspect-[16/9] w-full shrink-0 overflow-hidden bg-transparent">
                  <Image
                    src={`/projects/${card.image}`}
                    alt={card.title}
                    fill
                    priority={index < 6}
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>

                <div className="flex min-h-0 flex-1 flex-col pt-[1vw]">
                  <p className="text-[clamp(12px,0.85vw,18px)] leading-none text-[#161310]/60 dark:text-stone-300/60">
                    {card.eyebrow}
                  </p>

                  <h2 className="mt-[0.55vw] text-[clamp(18px,1.35vw,32px)] font-medium uppercase leading-[1.02] text-[#161310] dark:text-stone-200">
                    {card.title}
                  </h2>

                  <p className="mt-[0.85vw] line-clamp-4 max-w-[96%] text-[clamp(13px,0.95vw,20px)] leading-[1.35] text-[#161310]/75 dark:text-stone-300/75">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
