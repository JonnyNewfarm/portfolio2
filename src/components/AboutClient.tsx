"use client";

import React, { useRef } from "react";
import ScrollSection from "@/components/SmoothScroll";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Three.js",
  "Prisma",
  "MongoDB",
  "SQL",
  "Neon",
  "Figma",
  "Photoshop",
];

const focusAreas = [
  {
    number: "01",
    title: "Interface",
    text: "Clean layouts, strong hierarchy and digital experiences that feel clear from the first interaction.",
  },
  {
    number: "02",
    title: "Frontend",
    text: "React and Next.js builds with responsive structure, motion and attention to detail.",
  },
  {
    number: "03",
    title: "Systems",
    text: "Auth, databases, dashboards and fullstack features connected to usable interfaces.",
  },
];

type TextRevealProps = {
  children: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
};

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
}: TextRevealProps) {
  const MotionTag = motion[as];

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
      rotate: mode === "lines" ? 2.5 : 1.5,
      filter: "blur(10px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease,
      },
    },
  };

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      className={className}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden"
              : "inline-block overflow-hidden align-top"
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

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 32,
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutClient() {
  const imageRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const smoothMouseY = useSpring(mouseY, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.08]);

  const handleImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 18;
    const moveY = ((y - centerY) / centerY) * 18;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleImageLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ScrollSection>
      <section className="min-h-screen w-full overflow-hidden bg-[#ececec] px-4 pb-16 pt-28 text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300 sm:px-8 md:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* HERO */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.05}
                className="mb-6 text-xs font-black uppercase tracking-[0.28em] opacity-45"
              >
                About / Jonas Nygaard
              </TextReveal>

              <TextReveal
                as="h1"
                mode="lines"
                delay={0.12}
                className="max-w-[1250px] text-[14vw] font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-[14vw] md:text-[10vw] lg:text-[8.2vw]"
              >
                {`Frontend
developer
with a
design eye.`}
              </TextReveal>
            </div>

            <div className="flex flex-col justify-end">
              <TextReveal
                as="p"
                mode="words"
                delay={0.35}
                className="max-w-[560px] text-base font-bold leading-[1.4] opacity-65 md:text-lg lg:ml-auto lg:text-right"
              >
                I design and build web experiences where layout, motion and code
                work together. Clean interfaces, sharp details and frontend
                systems that feel good to use.
              </TextReveal>
            </div>
          </div>

          {/* PORTRAIT / INFO */}
          <div
            ref={imageRef}
            className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16"
          >
            <FadeIn className="lg:sticky lg:top-28 lg:h-fit">
              <motion.div
                onMouseMove={handleImageMove}
                onMouseLeave={handleImageLeave}
                className="relative aspect-[3/4] w-full max-w-[620px] overflow-hidden bg-stone-400/10 dark:bg-stone-200/5"
              >
                <motion.div
                  style={{
                    y: imageY,
                    x: smoothMouseX,
                    scale: imageScale,
                  }}
                  className="absolute inset-[-6%] will-change-transform"
                >
                  <motion.div
                    style={{
                      y: smoothMouseY,
                    }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src="/jonas-2.jpg"
                      alt="Image of Jonas"
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.15,
                    },
                  },
                }}
                className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 text-xs font-black uppercase tracking-[0.18em] opacity-75"
              >
                {[
                  ["Name", "Jonas Nygaard"],
                  ["Location", "Oslo, Norway"],
                  ["Focus", "Frontend / UI"],
                  ["Mode", "Design / Code"],
                ].map(([label, value]) => (
                  <motion.div
                    key={label}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 18,
                        filter: "blur(6px)",
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          duration: 0.7,
                          ease,
                        },
                      },
                    }}
                  >
                    <p className="mb-1 opacity-35">{label}</p>
                    <p>{value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </FadeIn>

            <div>
              {/* PROFILE */}
              <div className="pt-8 dark:border-stone-200/20">
                <TextReveal
                  as="p"
                  mode="words"
                  className="mb-8 text-xs font-black uppercase tracking-[0.28em] opacity-45"
                >
                  Profile
                </TextReveal>

                <TextReveal
                  as="p"
                  mode="words"
                  delay={0.05}
                  className="max-w-[1050px] text-[8vw] font-black uppercase leading-[0.9] tracking-[-0.075em] opacity-90 md:text-[5vw] lg:text-[3.75vw]"
                >
                  I work between visual design and development, turning ideas
                  into responsive, polished and usable digital products.
                </TextReveal>

                <TextReveal
                  as="p"
                  mode="words"
                  delay={0.15}
                  className="mt-8 max-w-[760px] text-base font-bold leading-[1.5] opacity-60 md:text-lg"
                >
                  My work usually starts with structure: what should the page
                  say, how should it feel, and how should people move through
                  it. From there I build interfaces with strong layout, clear
                  interactions and code that is easy to maintain.
                </TextReveal>
              </div>

              {/* FOCUS AREAS */}
              <div className="mt-16 border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24">
                <TextReveal
                  as="p"
                  mode="words"
                  className="mb-8 text-xs font-black uppercase tracking-[0.28em] opacity-45"
                >
                  Work areas
                </TextReveal>

                <div className="divide-y divide-stone-400/30 border-t border-stone-400/30 dark:divide-stone-200/20 dark:border-stone-200/20">
                  {focusAreas.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.35 }}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.08,
                            delayChildren: index * 0.05,
                          },
                        },
                      }}
                      className="group grid grid-cols-1 gap-6 py-8 md:grid-cols-[0.18fr_0.55fr_0.8fr] md:items-start lg:py-10"
                    >
                      <motion.p
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 20,
                            filter: "blur(6px)",
                          },
                          visible: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: {
                              duration: 0.75,
                              ease,
                            },
                          },
                        }}
                        className="text-xs font-black uppercase tracking-[0.24em] opacity-35"
                      >
                        {item.number}
                      </motion.p>

                      <TextReveal
                        as="h2"
                        mode="lines"
                        delay={0}
                        className="text-[12vw] font-black uppercase leading-[0.82] tracking-[-0.09em] md:text-[5vw] lg:text-[3.8vw]"
                      >
                        {item.title}
                      </TextReveal>

                      <TextReveal
                        as="p"
                        mode="words"
                        delay={0.08}
                        className="max-w-[560px] text-base font-bold leading-[1.45] opacity-60 md:justify-self-end md:text-right md:text-lg"
                      >
                        {item.text}
                      </TextReveal>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* STACK */}
              <div className="mt-16 border-t border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24">
                <div className="mb-8 flex items-end justify-between gap-8">
                  <TextReveal
                    as="p"
                    mode="words"
                    className="text-xs font-black uppercase tracking-[0.28em] opacity-45"
                  >
                    Stack / Tools
                  </TextReveal>

                  <TextReveal
                    as="p"
                    mode="words"
                    delay={0.1}
                    className="hidden max-w-[360px] text-right text-xs font-black uppercase leading-[1.35] tracking-[0.22em] opacity-35 md:block"
                  >
                    Tools used to design, build and ship web projects.
                  </TextReveal>
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.035,
                      },
                    },
                  }}
                  className="flex flex-wrap gap-x-5 gap-y-3"
                >
                  {stack.map((item) => (
                    <span key={item} className="overflow-hidden">
                      <motion.span
                        variants={{
                          hidden: {
                            y: "120%",
                            opacity: 0,
                            rotate: 2,
                            filter: "blur(8px)",
                          },
                          visible: {
                            y: "0%",
                            opacity: 1,
                            rotate: 0,
                            filter: "blur(0px)",
                            transition: {
                              duration: 0.85,
                              ease,
                            },
                          },
                        }}
                        className="inline-block text-[clamp(2.4rem,5vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] opacity-80 will-change-transform"
                      >
                        {item}
                      </motion.span>
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* CTA */}
              <div className="mt-16 border-t border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.4fr] md:items-end">
                  <TextReveal
                    as="h2"
                    mode="lines"
                    className="max-w-[1000px] text-[13vw] font-black uppercase leading-[0.8] tracking-[-0.095em] md:text-[6.5vw] lg:text-[5vw]"
                  >
                    {`Let's build
something useful.`}
                  </TextReveal>

                  <FadeIn delay={0.2} y={20} className="md:justify-self-end">
                    <Link
                      href="/contact"
                      className="group relative block w-fit overflow-hidden border-b border-[#161310] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] transition dark:border-stone-300"
                    >
                      <span className="inline-block transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                        Contact
                      </span>

                      <span className="absolute left-7 top-4 inline-block translate-y-full transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                        Contact
                      </span>
                    </Link>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
