"use client";
import React from "react";
import ScrollSection from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutClient = () => {
  return (
    <ScrollSection>
      <section className="min-h-screen w-full border-b border-stone-300 bg-[#ececec] text-[#161310] dark:border-b-stone-600 dark:bg-[#2e2b2b] dark:text-stone-300">
        <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-20">
          {/* Left content */}
          <div className="order-2 flex flex-col lg:order-1 lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-[980px]"
            >
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] opacity-45">
                About / Profile
              </p>

              <div className="max-w-[950px]">
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:text-6xl xl:text-7xl">
                  The face
                </h1>
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:ml-10 sm:text-6xl xl:ml-16 xl:text-7xl">
                  behind
                </h1>
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:ml-20 sm:text-6xl xl:ml-32 xl:text-7xl">
                  the code
                </h1>
              </div>

              <p className="mt-10 max-w-[760px] text-sm leading-relaxed opacity-75 sm:text-base">
                I&apos;m a 28-year-old frontend developer from Oslo with a
                passion for clean design, solid code, and the space where those
                two worlds meet. I&apos;ve worked on everything from portfolio
                sites to fullstack applications — and I love bringing ideas to
                life on the web through smooth animations, interactive 3D
                elements, and thoughtful user experiences built with tools like
                Framer Motion and Three.js.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
              className="mt-16"
            >
              <div className="mb-8 border-t border-stone-400/30 pt-6 dark:border-stone-200/20">
                <p className="text-[10px] uppercase tracking-[0.26em] opacity-45">
                  Design / Code / Fullstack
                </p>
              </div>

              <div className="grid grid-cols-1 border-t border-stone-400/30 dark:border-stone-200/20 lg:grid-cols-3 lg:divide-x lg:divide-stone-400/30 lg:dark:divide-stone-200/20">
                <div className="border-b border-stone-400/30 px-0 py-8 dark:border-stone-200/20 lg:border-b-0 lg:px-6 lg:first:pl-0">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.24em] opacity-40">
                    01
                  </p>
                  <h2 className="mb-4 text-2xl uppercase tracking-[-0.04em]">
                    Design
                  </h2>
                  <p className="text-sm leading-relaxed opacity-75">
                    I keep things simple and structured. I design with both
                    users and devs in mind, mostly using Figma and Adobe XD.
                  </p>
                </div>

                <div className="border-b border-stone-400/30 px-0 py-8 dark:border-stone-200/20 lg:border-b-0 lg:px-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.24em] opacity-40">
                    02
                  </p>
                  <h2 className="mb-4 text-2xl uppercase tracking-[-0.04em]">
                    Code
                  </h2>
                  <p className="text-sm leading-relaxed opacity-75">
                    I like to work with React, Next.js, TypeScript, CSS/SASS,
                    and Tailwind. I focus on writing clean, efficient code and
                    building interfaces that feel smooth and responsive.
                  </p>
                </div>

                <div className="px-0 py-8 lg:px-6 lg:last:pr-0">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.24em] opacity-40">
                    03
                  </p>
                  <h2 className="mb-4 text-2xl uppercase tracking-[-0.04em]">
                    Fullstack
                  </h2>
                  <p className="text-sm leading-relaxed opacity-75">
                    I&apos;ve built applications using different tools and
                    frameworks like Prisma, Mongoose, MongoDB, SQL, and Neon, to
                    name a few. I enjoy working across the stack, connecting
                    data with design, and making everything flow smoothly from
                    the backend to the user interface.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.04 }}
            className="order-1 mb-12 flex lg:order-2 lg:col-span-5 lg:mb-0 xl:col-span-4"
          >
            <div className="w-full lg:ml-auto lg:max-w-[540px]">
              <div className="mb-6 border-b border-stone-400/30 pb-5 dark:border-stone-200/20">
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] opacity-40">
                  Portrait
                </p>
                <h2 className="text-3xl uppercase leading-none tracking-[-0.04em] sm:text-4xl">
                  Jonas Nygaard
                </h2>
              </div>

              <div className="relative overflow-hidden ">
                <div className="relative h-[48vh] w-full sm:h-[58vh] lg:h-[72vh]">
                  <Image
                    src="/jonas1.webp"
                    alt="Image of Jonas"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-stone-400/30 pt-5 dark:border-stone-200/20">
                <p className="max-w-[420px] text-sm leading-relaxed opacity-65">
                  Frontend developer with a strong interest in visual design,
                  motion, interactivity and polished digital experiences.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </ScrollSection>
  );
};

export default AboutClient;
