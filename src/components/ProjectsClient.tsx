"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

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

type IntroImageRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TextRevealTag = "p" | "span" | "h1" | "h2" | "label" | "div";

type TextRevealProps = {
  children: string;
  as?: TextRevealTag;
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
  active?: boolean;
};

const INTRO_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const uiRevealVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

const uiRevealTransition = {
  duration: 0.65,
  ease: INTRO_EASE,
};

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
  active,
}: TextRevealProps) {
  const MotionTag = motion[as] as any;

  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease: INTRO_EASE,
      },
    },
  };

  const motionProps =
    active === undefined
      ? {
          whileInView: "visible",
          viewport: {
            once,
            amount: 0.35,
          },
        }
      : {
          animate: active ? "visible" : "hidden",
        };

  return (
    <MotionTag
      htmlFor={htmlFor}
      variants={containerVariants}
      initial="hidden"
      className={className}
      {...motionProps}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden py-[0.08em] -my-[0.08em]"
              : "inline-block overflow-hidden py-[0.04em] -my-[0.04em] align-top"
          }
        >
          <motion.span
            variants={itemVariants}
            className="inline-block will-change-transform"
          >
            {item}
            {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

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

type IntroOverlayProps = {
  onFinish: () => void;
  onTextStart: () => void;
  mobileImageRect: IntroImageRect | null;
};

const IntroOverlay = ({
  onFinish,
  onTextStart,
  mobileImageRect,
}: IntroOverlayProps) => {
  const shouldReduceMotion = useReducedMotion();
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;

    hasFinishedRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const timeout = window.setTimeout(
      onTextStart,
      shouldReduceMotion ? 0 : 2250,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onTextStart, shouldReduceMotion]);

  useEffect(() => {
    const timeout = window.setTimeout(
      finishIntro,
      shouldReduceMotion ? 100 : 3100,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [finishIntro, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[#1e1c1c] dark:bg-[#fbfafa]"
        initial={{
          y: "0%",
        }}
        animate={{
          y: "-100%",
        }}
        transition={{
          delay: 1.65,
          duration: 1.05,
          ease: INTRO_EASE,
        }}
      />

      <motion.article
        initial={{
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
        }}
        animate={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{
          delay: 0.42,
          duration: 1.18,
          ease: INTRO_EASE,
        }}
        className="absolute left-1/2 top-1/2 z-30 hidden h-[42vh] min-h-[340px] w-[44vw] min-w-[560px] max-w-[860px] -translate-x-1/2 -translate-y-1/2 overflow-hidden md:block"
      >
        <Image
          src={`/projects/${projects[0].images[0]}`}
          alt={projects[0].title}
          fill
          priority
          sizes="44vw"
          className="select-none object-contain"
          draggable={false}
        />
      </motion.article>

      {mobileImageRect && (
        <motion.article
          initial={{
            clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          }}
          animate={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          transition={{
            delay: 0.42,
            duration: 1.18,
            ease: INTRO_EASE,
          }}
          style={{
            top: mobileImageRect.top,
            left: mobileImageRect.left,
            width: mobileImageRect.width,
            height: mobileImageRect.height,
          }}
          className="absolute z-30 block overflow-hidden md:hidden"
        >
          <div className="relative h-full w-full border border-[#161310]/20 p-4 dark:border-stone-300/20">
            <div className="relative h-full w-full">
              <Image
                src={`/projects/${projects[0].images[0]}`}
                alt={projects[0].title}
                fill
                priority
                sizes="calc(100vw - 48px)"
                className="select-none object-contain"
                draggable={false}
              />
            </div>
          </div>
        </motion.article>
      )}

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-50 bg-transparent"
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: 0,
        }}
        transition={{
          delay: 2.95,
          duration: 0.15,
          ease: "linear",
        }}
        onAnimationComplete={finishIntro}
      />
    </motion.div>
  );
};

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
        <span
          className={`absolute -left-[1.5px] -top-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -left-[1.5px] -top-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

        <span
          className={`absolute -right-[1.5px] -top-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -right-[1.5px] -top-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

        <span
          className={`absolute -bottom-[1.5px] -left-[1.5px] ${cornerLength} bg-[#161310] dark:bg-stone-200`}
        />
        <span
          className={`absolute -bottom-[1.5px] -left-[1.5px] ${cornerWidth} bg-[#161310] dark:bg-stone-200`}
        />

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
              ease: INTRO_EASE,
            }}
            className="absolute inset-0 z-10 flex h-full w-full flex-col justify-between bg-[#fbfafa] p-8 text-[#161310] dark:bg-[#1e1c1c] dark:text-stone-300"
          >
            <div>
              <TextReveal
                active={showDetails}
                delay={0.15}
                as="p"
                className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] opacity-40"
              >
                About
              </TextReveal>

              <TextReveal
                active={showDetails}
                delay={0.22}
                as="p"
                className="max-w-[720px] text-[clamp(22px,2.1vw,42px)] font-black uppercase leading-[0.95] tracking-[-0.055em]"
              >
                {card.project.about}
              </TextReveal>
            </div>

            <div className="grid grid-cols-[1.2fr_0.8fr] gap-8">
              <div>
                <TextReveal
                  active={showDetails}
                  delay={0.28}
                  as="p"
                  className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] opacity-40"
                >
                  Stack
                </TextReveal>

                <TextReveal
                  active={showDetails}
                  delay={0.34}
                  as="p"
                  className="text-[clamp(15px,1.1vw,22px)] font-black uppercase leading-[1.05] tracking-[-0.035em] opacity-80"
                >
                  {card.project.stack}
                </TextReveal>
              </div>

              <div>
                <TextReveal
                  active={showDetails}
                  delay={0.38}
                  as="p"
                  className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] opacity-40"
                >
                  Role
                </TextReveal>

                <TextReveal
                  active={showDetails}
                  delay={0.44}
                  as="p"
                  className="text-[clamp(15px,1.1vw,22px)] font-black uppercase leading-[1.05] tracking-[-0.035em] opacity-80"
                >
                  {card.project.role}
                </TextReveal>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: showDetails ? "-105%" : "0%",
            }}
            transition={{
              duration: 0.9,
              ease: INTRO_EASE,
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
  const mobileFirstImageRef = useRef<HTMLDivElement | null>(null);

  const [viewportWidth, setViewportWidth] = useState(1440);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nearestStep, setNearestStep] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [introTextActive, setIntroTextActive] = useState(false);
  const [mobileImageRect, setMobileImageRect] = useState<IntroImageRect | null>(
    null,
  );

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

  const cards = useMemo<ScrollCard[]>(() => {
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
  }, [nearestStep]);

  const measureMobileIntroImage = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.innerWidth >= 768) {
      setMobileImageRect(null);
      return;
    }

    const element = mobileFirstImageRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const nextRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setMobileImageRect((current) => {
      if (
        current &&
        Math.abs(current.top - nextRect.top) < 0.5 &&
        Math.abs(current.left - nextRect.left) < 0.5 &&
        Math.abs(current.width - nextRect.width) < 0.5 &&
        Math.abs(current.height - nextRect.height) < 0.5
      ) {
        return current;
      }

      return nextRect;
    });
  }, []);

  const startIntroText = useCallback(() => {
    setIntroTextActive(true);
  }, []);

  const finishIntro = useCallback(() => {
    setIntroTextActive(true);
    setIntroComplete(true);

    window.setTimeout(() => {
      setShowIntro(false);
    }, 140);
  }, []);

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
        ease: INTRO_EASE,
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

  useLayoutEffect(() => {
    measureMobileIntroImage();

    const frame = window.requestAnimationFrame(measureMobileIntroImage);
    const timeoutOne = window.setTimeout(measureMobileIntroImage, 120);
    const timeoutTwo = window.setTimeout(measureMobileIntroImage, 420);

    window.addEventListener("resize", measureMobileIntroImage);
    window.addEventListener("orientationchange", measureMobileIntroImage);

    void document.fonts?.ready.then(measureMobileIntroImage);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeoutOne);
      window.clearTimeout(timeoutTwo);
      window.removeEventListener("resize", measureMobileIntroImage);
      window.removeEventListener("orientationchange", measureMobileIntroImage);
    };
  }, [measureMobileIntroImage]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      measureMobileIntroImage();
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [measureMobileIntroImage]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.innerWidth < 768) return;
      if (!introComplete) return;

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
  }, [goToRelativeStep, introComplete]);

  useEffect(() => {
    setDetailsOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  const handlePrev = () => {
    if (wheelLockRef.current || !introComplete) return;
    goToRelativeStep(-1);
  };

  const handleNext = () => {
    if (wheelLockRef.current || !introComplete) return;
    goToRelativeStep(1);
  };

  return (
    <SmoothScroll>
      <section
        ref={sectionRef}
        className="relative min-h-screen w-full bg-[#fbfafa] text-[#161310] dark:bg-[#1e1c1c] dark:text-stone-300 md:h-screen"
      >
        {/* Desktop */}
        <div className="relative hidden h-screen w-full overflow-hidden md:block">
          <motion.button
            type="button"
            onClick={handlePrev}
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.05,
            }}
            style={{
              pointerEvents: introComplete ? "auto" : "none",
            }}
            className="absolute left-8 top-[calc(50%-28vh)] z-50 text-[26px] font-black uppercase tracking-[0.12em] text-[#2e2b2b] transition-opacity hover:opacity-70 dark:text-stone-200"
          >
            <TextReveal active={introTextActive} delay={0.05} as="span">
              Prev
            </TextReveal>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNext}
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.1,
            }}
            style={{
              pointerEvents: introComplete ? "auto" : "none",
            }}
            className="absolute right-8 top-[calc(50%-28vh)] z-50 text-[26px] font-black uppercase tracking-[0.12em] text-[#2e2b2b] transition-opacity hover:opacity-70 dark:text-stone-200"
          >
            <TextReveal active={introTextActive} delay={0.08} as="span">
              Next
            </TextReveal>
          </motion.button>

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

          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.18,
            }}
          >
            <SelectionCorners scrollIndex={scrollIndex} />
          </motion.div>

          <motion.div
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.22,
            }}
            className="absolute right-8 top-[calc(50%+23vh)] z-40 text-right text-[13px] font-black uppercase tracking-[0.08em] opacity-60"
          >
            <TextReveal active={introTextActive} delay={0.18} as="span">
              {`${String(activeIndex + 1).padStart(2, "0")}/${String(
                projects.length,
              ).padStart(2, "0")}`}
            </TextReveal>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setDetailsOpen((current) => !current)}
            aria-label={detailsOpen ? "Show image" : "Show details"}
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.25,
            }}
            style={{
              pointerEvents: introComplete ? "auto" : "none",
            }}
            className="absolute bottom-8 left-8 z-40 h-[32px] w-[120px] overflow-hidden text-left text-[26px] font-black uppercase leading-none tracking-[-0.01em] transition-opacity hover:opacity-55"
          >
            <motion.span
              animate={{
                y: detailsOpen ? "-115%" : "0%",
              }}
              transition={{
                duration: 0.55,
                ease: INTRO_EASE,
              }}
              className="absolute left-0 top-0 block"
            >
              <TextReveal active={introTextActive} delay={0.22} as="span">
                Details
              </TextReveal>
            </motion.span>

            <motion.span
              animate={{
                y: detailsOpen ? "0%" : "115%",
              }}
              transition={{
                duration: 0.55,
                ease: INTRO_EASE,
              }}
              className="absolute left-0 top-0 block"
            >
              <TextReveal active={introTextActive} delay={0.22} as="span">
                Image
              </TextReveal>
            </motion.span>
          </motion.button>

          <motion.div
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.32,
            }}
            style={{
              pointerEvents: introComplete ? "auto" : "none",
            }}
            className="absolute bottom-8 left-1/2 z-40 flex max-w-[54vw] -translate-x-1/2 items-center justify-center gap-7 text-center"
          >
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => {
                  if (wheelLockRef.current || !introComplete) return;
                  goToProjectIndex(index);
                }}
                className={`whitespace-nowrap text-[clamp(13px,1vw,18px)] font-black uppercase leading-none tracking-[-0.025em] transition-all duration-500 ${
                  index === activeIndex
                    ? "scale-110 opacity-100"
                    : "opacity-25 hover:opacity-55"
                }`}
              >
                <TextReveal
                  active={introTextActive}
                  delay={0.28 + index * 0.04}
                  as="span"
                >
                  {project.title}
                </TextReveal>
              </button>
            ))}
          </motion.div>

          <motion.a
            href={projects[activeIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            variants={uiRevealVariants}
            initial="hidden"
            animate={introTextActive ? "show" : "hidden"}
            transition={{
              ...uiRevealTransition,
              delay: 0.38,
            }}
            style={{
              pointerEvents: introComplete ? "auto" : "none",
            }}
            className="absolute bottom-8 right-8 z-40 text-right text-[26px] font-black uppercase leading-none tracking-[-0.01em] transition-opacity hover:opacity-55"
          >
            <TextReveal active={introTextActive} delay={0.34} as="span">
              Live Link
            </TextReveal>
          </motion.a>
        </div>

        {/* Mobile */}
        <div className="px-6 pb-16 pt-28 md:hidden">
          <div>
            <TextReveal
              active={introTextActive}
              delay={0.05}
              as="p"
              className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#161310]/45 dark:text-stone-300/45"
            >
              Selected Work
            </TextReveal>

            <TextReveal
              active={introTextActive}
              delay={0.1}
              as="h1"
              className="text-4xl font-anton uppercase leading-[0.92] tracking-[-0.01em] text-[#161310] dark:text-stone-200"
            >
              My Work
            </TextReveal>

            <TextReveal
              active={introTextActive}
              delay={0.16}
              as="p"
              className="mt-4 text-sm uppercase tracking-[0.18em] text-[#161310]/55 dark:text-stone-300/55"
            >
              Code / Design / Fullstack
            </TextReveal>
          </div>

          <div className="mt-14 flex flex-col gap-16">
            {projects.map((project, i) => {
              const isFirstProject = i === 0;
              const showImage = introComplete || isFirstProject;

              return (
                <motion.article key={project.title} className="flex flex-col">
                  <div>
                    <TextReveal
                      active={introTextActive}
                      delay={0.12 + i * 0.06}
                      as="p"
                      className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#161310]/35 dark:text-stone-300/35"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </TextReveal>

                    <TextReveal
                      active={introTextActive}
                      delay={0.16 + i * 0.06}
                      as="h2"
                      className="mb-5 text-2xl uppercase leading-[0.95] tracking-[-0.04em] text-[#161310] dark:text-stone-200"
                    >
                      {project.title}
                    </TextReveal>
                  </div>

                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={false}
                    animate={{
                      opacity: showImage ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: INTRO_EASE,
                    }}
                    className="block"
                  >
                    <div
                      ref={isFirstProject ? mobileFirstImageRef : undefined}
                      className="relative h-[260px] w-full border border-[#161310]/20 p-4 dark:border-stone-300/20"
                    >
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
                  </motion.a>

                  <div className="mt-6 border-t border-[#161310]/15 pt-5 dark:border-stone-300/15">
                    <TextReveal
                      active={introTextActive}
                      delay={0.22 + i * 0.06}
                      as="p"
                      className="text-sm leading-relaxed text-[#161310]/75 dark:text-stone-300/75"
                    >
                      {project.about}
                    </TextReveal>

                    <div className="mt-5 flex flex-col gap-4 border-t border-[#161310]/15 pt-4 dark:border-stone-300/15">
                      <div>
                        <TextReveal
                          active={introTextActive}
                          delay={0.28 + i * 0.06}
                          as="p"
                          className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#161310]/40 dark:text-stone-300/40"
                        >
                          Stack
                        </TextReveal>

                        <TextReveal
                          active={introTextActive}
                          delay={0.32 + i * 0.06}
                          as="p"
                          className="text-sm leading-relaxed text-[#161310]/70 dark:text-stone-300/70"
                        >
                          {project.stack}
                        </TextReveal>
                      </div>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-fit border border-[#161310] px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#161310] dark:border-stone-300 dark:text-stone-300"
                      >
                        <TextReveal
                          active={introTextActive}
                          delay={0.36 + i * 0.06}
                          as="span"
                        >
                          View Website
                        </TextReveal>
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {showIntro && (
          <IntroOverlay
            onFinish={finishIntro}
            onTextStart={startIntroText}
            mobileImageRect={mobileImageRect}
          />
        )}
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
