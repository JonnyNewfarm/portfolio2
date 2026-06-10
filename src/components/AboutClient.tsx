"use client";

import React, { useRef } from "react";
import ScrollSection from "@/components/SmoothScroll";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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

export default function AboutClient() {
  const imageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <ScrollSection>
      <section className="min-h-screen w-full overflow-hidden bg-[#ececec] px-4 pb-16 pt-28 text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300 sm:px-8 md:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* HERO */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="mb-6 text-xs font-black uppercase tracking-[0.28em] opacity-45">
                About / Jonas Nygaard
              </p>

              <h1 className="max-w-[1250px] text-[14vw] font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-[14vw] md:text-[10vw] lg:text-[8.2vw]">
                Frontend
                <br />
                developer
                <br />
                with a
                <br />
                design eye.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col justify-end"
            >
              <p className="max-w-[560px] text-base font-bold leading-[1.4] opacity-65 md:text-lg lg:ml-auto lg:text-right">
                I design and build web experiences where layout, motion and code
                work together. Clean interfaces, sharp details and frontend
                systems that feel good to use.
              </p>
            </motion.div>
          </div>

          {/* PORTRAIT / INFO */}
          <div
            ref={imageRef}
            className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:sticky lg:top-28 lg:h-fit"
            >
              <div className="relative aspect-[3/4] w-full max-w-[620px] overflow-hidden bg-stone-400/10 dark:bg-stone-200/5">
                <motion.div
                  style={{
                    y: imageY,
                    scale: imageScale,
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/jonas-2.jpg"
                    alt="Image of Jonas"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </motion.div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 text-xs font-black uppercase tracking-[0.18em] opacity-75">
                <div>
                  <p className="mb-1 opacity-35">Name</p>
                  <p>Jonas Nygaard</p>
                </div>

                <div>
                  <p className="mb-1 opacity-35">Location</p>
                  <p>Oslo, Norway</p>
                </div>

                <div>
                  <p className="mb-1 opacity-35">Focus</p>
                  <p>Frontend / UI</p>
                </div>

                <div>
                  <p className="mb-1 opacity-35">Mode</p>
                  <p>Design / Code</p>
                </div>
              </div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className=" pt-8 dark:border-stone-200/20"
              >
                <p className="mb-8 text-xs font-black uppercase tracking-[0.28em] opacity-45">
                  Profile
                </p>

                <p className="max-w-[1050px] text-[8vw] font-black uppercase leading-[0.9] tracking-[-0.075em] opacity-90 md:text-[5vw] lg:text-[3.75vw]">
                  I work between visual design and development, turning ideas
                  into responsive, polished and usable digital products.
                </p>

                <p className="mt-8 max-w-[760px] text-base font-bold leading-[1.5] opacity-60 md:text-lg">
                  My work usually starts with structure: what should the page
                  say, how should it feel, and how should people move through
                  it. <br />
                  <br /> From there I build interfaces with strong layout, clear
                  interactions and code that is easy to maintain.
                </p>
              </motion.div>

              {/* FOCUS AREAS */}
              <div className="mt-16  border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24">
                <p className="mb-8 text-xs font-black uppercase tracking-[0.28em] opacity-45">
                  Work areas
                </p>

                <div className="divide-y divide-stone-400/30 border-t border-stone-400/30 dark:divide-stone-200/20 dark:border-stone-200/20">
                  {focusAreas.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{
                        duration: 0.85,
                        delay: index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[0.18fr_0.55fr_0.8fr] md:items-start lg:py-10"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.24em] opacity-35">
                        {item.number}
                      </p>

                      <h2 className="text-[12vw] font-black uppercase leading-[0.82] tracking-[-0.09em] md:text-[5vw] lg:text-[3.8vw]">
                        {item.title}
                      </h2>

                      <p className="max-w-[560px] text-base font-bold leading-[1.45] opacity-60 md:justify-self-end md:text-right md:text-lg">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* STACK */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-16 border-t border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24"
              >
                <div className="mb-8 flex items-end justify-between gap-8">
                  <p className="text-xs font-black uppercase tracking-[0.28em] opacity-45">
                    Stack / Tools
                  </p>

                  <p className="hidden max-w-[360px] text-right text-xs font-black uppercase leading-[1.35] tracking-[0.22em] opacity-35 md:block">
                    Tools used to design, build and ship web projects.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  {stack.map((item) => (
                    <span
                      key={item}
                      className="text-[clamp(2.4rem,5vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] opacity-80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-16 border-t border-stone-400/30 pt-8 dark:border-stone-200/20 lg:mt-24"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.4fr] md:items-end">
                  <h2 className="max-w-[1000px] text-[13vw] font-black uppercase leading-[0.8] tracking-[-0.095em] md:text-[6.5vw] lg:text-[5vw]">
                    Let&apos;s build something useful.
                  </h2>

                  <Link
                    href="/contact"
                    className="w-fit border-b border-[#161310] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:opacity-60 dark:border-stone-300"
                  >
                    Contact
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
