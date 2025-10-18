"use client";
import React from "react";
import ScrollSection from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutClient = () => {
  return (
    <ScrollSection>
      <div className="bg-[#ececec] dark:bg-[#2e2b2b] text-[#161310] dark:text-stone-300 flex justify-center min-h-screen h-full w-full border-b md:pt-16 border-stone-300 dark:border-b-stone-600">
        <div className="flex flex-col-reverse mt-10 md:flex-row items-center w-full max-w-7xl">
          <div className="flex flex-col w-full md:w-3/4 px-6 md:px-10 ">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                delay: 0.1,
                duration: 1,
                times: [0, 0.4, 1],
                ease: "easeInOut",
              }}
              className="mb-10"
            >
              <h1 className="mb-3 text-3xl">The Face Behind the Code</h1>
              <p className="text-sm md:text-[16px] max-w-xl lg:max-w-2xl">
                I&apos;m a 28-year-old frontend developer from Oslo with a
                passion for clean design, solid code, and the space where those
                two worlds meet. I&apos;ve worked on everything from portfolio
                sites to fullstack applications — and I love bringing ideas to
                life on the web through smooth animations, interactive 3D
                elements, and thoughtful user experiences built with tools like
                Framer Motion and Three.js.
              </p>
            </motion.div>

            <div className="mb-10 w-full">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  delay: 0.2,
                  duration: 1,
                  times: [0, 0.4, 1],
                  ease: "easeInOut",
                }}
                className="mb-6 text-2xl"
              >
                Design / Code / Fullstack
              </motion.h1>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                  times: [0, 0.4, 1],
                  ease: "easeInOut",
                }}
                className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-400/50 dark:divide-stone-200/50 text-sm"
              >
                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Design</h2>
                  <p>
                    I keep things simple and structured. I design with both
                    users and devs in mind, mostly using Figma and Adobe XD.
                  </p>
                </div>

                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Code</h2>
                  <p>
                    I like to work with React, Next.js, TypeScript, CSS/SASS,
                    and Tailwind. I focus on writing clean, efficient code and
                    building interfaces that feel smooth and responsive.
                  </p>
                </div>

                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Fullstack</h2>
                  <p>
                    I&apos;ve built applications using different tools and
                    frameworks like Prisma, Mongoose, MongoDB, SQL, and Neon, to
                    name a few. I enjoy working across the stack, connecting
                    data with design, and making everything flow smoothly from
                    the backend to the user interface.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 0.1,
              duration: 1,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            className="w-full md:w-1/2 h-[50vh] md:h-screen flex justify-center items-center p-4 relative"
          >
            <div className="relative mt-16 md:mt-0 w-full h-[80%]">
              <Image
                src="/jonnyzoo.jpg"
                alt="Image of Jonas"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollSection>
  );
};

export default AboutClient;
