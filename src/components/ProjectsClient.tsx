"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import {
  MotionValue,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import WaveLinkText from "./WaveLinkText";

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

type ScrollCard = {
  project: Project;
  projectIndex: number;
  globalIndex: number;
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
      "kerimov-001.jpg",
      "kerimov-002.jpg",
      "kerimov-003.jpg",
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

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type SelectionCornersProps = {
  scrollIndex: MotionValue<number>;
};

const SelectionCorners = ({ scrollIndex }: SelectionCornersProps) => {
  const snapProgress = useTransform(scrollIndex, (latest) => {
    const nearest = Math.round(latest);
    const distance = Math.abs(latest - nearest);

    return clamp(distance / 0.5, 0, 1);
  });

  const scale = useTransform(snapProgress, [0, 0.25, 1], [1, 1.025, 1.12]);
  const opacity = useTransform(snapProgress, [0, 0.65, 1], [1, 0.9, 0.72]);

  const cornerLength = "h-8 w-[1.5px]";
  const cornerWidth = "h-[1.5px] w-8";

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scale,
        opacity,
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[42vh] min-h-[340px] w-[44vw] min-w-[560px] max-w-[860px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="absolute -inset-3 border-[1px] border-[#161310]/50 dark:border-stone-200/35">
        {/* Top left */}
        <span
          className={`absolute -left-[1.5px] -top-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -left-[1.5px] -top-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

        {/* Top right */}
        <span
          className={`absolute -right-[1.5px] -top-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -right-[1.5px] -top-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

        {/* Bottom left */}
        <span
          className={`absolute -bottom-[1.5px] -left-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -bottom-[1.5px] -left-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

        {/* Bottom right */}
        <span
          className={`absolute -bottom-[1.5px] -right-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -bottom-[1.5px] -right-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />
      </div>
    </motion.div>
  );
};

type ProjectCardProps = {
  card: ScrollCard;
  scrollIndex: MotionValue<number>;
  step: number;
  isActive: boolean;
  detailsOpen: boolean;
};

const ProjectCard = ({
  card,
  scrollIndex,
  step,
  isActive,
  detailsOpen,
}: ProjectCardProps) => {
  const x = useTransform(scrollIndex, (latest) => {
    return (card.globalIndex - latest) * step;
  });

  const distance = useTransform(scrollIndex, (latest) => {
    return clamp(Math.abs(card.globalIndex - latest), 0, 1);
  });

  const scale = useTransform(distance, [0, 1], [1, 0.92]);
  const opacity = useTransform(distance, [0, 1], [1, 0.72]);

  const showDetails = isActive && detailsOpen;

  return (
    <motion.article
      style={{
        x,
        scale,
        opacity,
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[42vh] min-h-[340px] w-[44vw] min-w-[560px] max-w-[860px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative h-full w-full overflow-visible">
        <div className="relative h-full w-full overflow-hidden bg-[#fbfafa] dark:bg-[#1e1c1c]">
          <motion.div
            animate={{
              y: showDetails ? "0%" : "105%",
            }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-0 z-10 flex h-full w-full flex-col justify-between bg-[#fbfafa] p-8 text-[#161310] dark:bg-[#1e1c1c] dark:text-stone-300"
          >
            <div>
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] opacity-40">
                About
              </p>

              <p className="max-w-[720px] text-[clamp(22px,2.1vw,42px)] font-black uppercase leading-[0.95] tracking-[-0.055em]">
                {card.project.about}
              </p>
            </div>

            <div className="grid grid-cols-[1.2fr_0.8fr] gap-8">
              <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] opacity-40">
                  Stack
                </p>

                <p className="text-[clamp(15px,1.1vw,22px)] font-black uppercase leading-[1.05] tracking-[-0.035em] opacity-80">
                  {card.project.stack}
                </p>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] opacity-40">
                  Role
                </p>

                <p className="text-[clamp(15px,1.1vw,22px)] font-black uppercase leading-[1.05] tracking-[-0.035em] opacity-80">
                  {card.project.role}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: showDetails ? "-105%" : "0%",
            }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-0 z-20 bg-[#fbfafa] dark:bg-[#1e1c1c]"
          >
            <Image
              src={`/projects/${card.project.images[0]}`}
              alt={card.project.title}
              fill
              priority={Math.abs(card.globalIndex) <= 2}
              sizes="(min-width: 768px) 44vw, 100vw"
              className="select-none object-contain"
              draggable={false}
            />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

const ProjectsClient = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);
  const activeStepRef = useRef(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const [viewportWidth, setViewportWidth] = useState(1440);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nearestStep, setNearestStep] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const rawScrollIndex = useMotionValue(0);

  const scrollIndex = useSpring(rawScrollIndex, {
    stiffness: 260,
    damping: 38,
    mass: 0.42,
  });

  const step = useMemo(() => {
    if (viewportWidth < 1024) return viewportWidth * 0.78;
    if (viewportWidth < 1440) return viewportWidth * 0.58;
    return viewportWidth * 0.5;
  }, [viewportWidth]);

  const cards = useMemo<ScrollCard[]>(
    (() => {
      const items: ScrollCard[] = [];
      const buffer = projects.length * 2;

      for (
        let globalIndex = nearestStep - buffer;
        globalIndex <= nearestStep + buffer;
        globalIndex++
      ) {
        const projectIndex = wrapIndex(globalIndex, projects.length);

        items.push({
          project: projects[projectIndex],
          projectIndex,
          globalIndex,
        });
      }

      return items;
    }) as () => ScrollCard[],
    [nearestStep],
  );

  const lockWheel = useCallback((duration = 780) => {
    wheelLockRef.current = true;

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, duration);
  }, []);

  const goToStep = useCallback(
    (targetStep: number) => {
      animationRef.current?.stop();

      activeStepRef.current = targetStep;

      setDetailsOpen(false);
      setNearestStep(targetStep);
      setActiveIndex(wrapIndex(targetStep, projects.length));

      animationRef.current = animate(rawScrollIndex, targetStep, {
        duration: 0.74,
        ease: [0.76, 0, 0.24, 1],
        onComplete: () => {
          rawScrollIndex.set(targetStep);
          activeStepRef.current = targetStep;
          setNearestStep(targetStep);
          setActiveIndex(wrapIndex(targetStep, projects.length));
        },
      });
    },
    [rawScrollIndex],
  );

  const goToRelativeStep = useCallback(
    (direction: 1 | -1) => {
      const nextStep = activeStepRef.current + direction;

      lockWheel();
      goToStep(nextStep);
    },
    [goToStep, lockWheel],
  );

  const goToProjectIndex = useCallback(
    (projectIndex: number) => {
      const currentStep = activeStepRef.current;
      const currentProjectIndex = wrapIndex(currentStep, projects.length);

      let delta = projectIndex - currentProjectIndex;

      if (delta > projects.length / 2) {
        delta -= projects.length;
      }

      if (delta < -projects.length / 2) {
        delta += projects.length;
      }

      const targetStep = currentStep + delta;

      lockWheel();
      goToStep(targetStep);
    },
    [goToStep, lockWheel],
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.innerWidth < 768) return;

      const rect = section.getBoundingClientRect();

      const isInsideStickyArea =
        rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!isInsideStickyArea) return;

      event.preventDefault();

      if (wheelLockRef.current) return;

      const direction = event.deltaY > 0 ? 1 : -1;

      goToRelativeStep(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [goToRelativeStep]);

  useEffect(() => {
    setDetailsOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  const handlePrev = () => {
    if (wheelLockRef.current) return;
    goToRelativeStep(-1);
  };

  const handleNext = () => {
    if (wheelLockRef.current) return;
    goToRelativeStep(1);
  };

  return (
    <SmoothScroll>
      <section
        ref={sectionRef}
        className="relative min-h-screen w-full bg-[#fbfafa] text-[#161310] dark:bg-[#1e1c1c] dark:text-stone-300 md:h-screen"
      >
        {/* Desktop sticky carousel */}
        <div className="relative hidden h-screen w-full overflow-hidden md:block">
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-8 top-[calc(50%-28vh)] z-50 text-[26px] font-black uppercase tracking-[0.12em] text-[#2e2b2b] opacity-100 transition-opacity hover:opacity-70 dark:text-stone-200"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-8 top-[calc(50%-28vh)] z-50 text-[26px] font-black uppercase tracking-[0.12em] text-[#2e2b2b] opacity-100 transition-opacity hover:opacity-70 dark:text-stone-200"
          >
            Next
          </button>

          <div className="absolute left-0 top-1/2 z-10 h-[62vh] w-full -translate-y-1/2 overflow-visible">
            <div className="pointer-events-none absolute inset-0">
              {cards.map((card) => {
                const isActiveCard = card.globalIndex === nearestStep;

                return (
                  <ProjectCard
                    key={`${card.globalIndex}-${card.project.title}`}
                    card={card}
                    scrollIndex={scrollIndex}
                    step={step}
                    isActive={isActiveCard}
                    detailsOpen={detailsOpen}
                  />
                );
              })}
            </div>
          </div>

          <SelectionCorners scrollIndex={scrollIndex} />

          <div className="absolute right-8 top-[calc(50%+23vh)] z-40 text-right text-[13px] font-black uppercase tracking-[0.08em] opacity-60">
            {String(activeIndex + 1).padStart(2, "0")}/
            {String(projects.length).padStart(2, "0")}
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen((current) => !current)}
            aria-label={detailsOpen ? "Show image" : "Show details"}
            className="absolute bottom-8 left-8 z-40 h-[32px] w-[120px] overflow-hidden text-left text-[26px] font-black uppercase leading-none tracking-[-0.01em] transition-opacity hover:opacity-55"
          >
            <motion.span
              animate={{
                y: detailsOpen ? "-115%" : "0%",
              }}
              transition={{
                duration: 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute left-0 top-0 block"
            >
              Details
            </motion.span>

            <motion.span
              animate={{
                y: detailsOpen ? "0%" : "115%",
              }}
              transition={{
                duration: 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute left-0 top-0 block"
            >
              Image
            </motion.span>
          </button>

          <div className="absolute bottom-8 left-1/2 z-40 flex max-w-[54vw] -translate-x-1/2 items-center justify-center gap-7 text-center">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => {
                  if (wheelLockRef.current) return;
                  goToProjectIndex(index);
                }}
                className={`whitespace-nowrap text-[clamp(13px,1vw,18px)] font-black uppercase leading-none tracking-[-0.025em] transition-all duration-500 ${
                  index === activeIndex
                    ? "scale-110 opacity-100"
                    : "opacity-25 hover:opacity-55"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>

          <a
            href={projects[activeIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-8 right-8 z-40 text-right text-[26px] font-black uppercase leading-none tracking-[-0.01em] transition-opacity hover:opacity-55"
          >
            <WaveLinkText text="Live Link" />
          </a>
        </div>

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

            <h1 className="text-4xl font-anton uppercase leading-[0.92] tracking-[-0.01em] text-[#161310] dark:text-stone-200">
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
                    <div className="relative h-full w-full">
                      <Image
                        src={`/projects/${project.images[0]}`}
                        alt={project.title}
                        fill
                        sizes="100vw"
                        className="object-contain transition-opacity duration-300 hover:opacity-90"
                        draggable={false}
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
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
