"use client";
import React from "react";
import ScrollSection from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutClient = () => {
  return (
    <ScrollSection>
      <div className="bg-[#ececec] flex justify-center min-h-screen h-full w-full border-b border-[#161310]">
        <div className="flex flex-col-reverse mt-10 md:flex-row items-center w-full max-w-7xl">
          <div className="flex flex-col w-full md:w-1/2 px-6 md:px-10 ">
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
              <p className="text-sm max-w-xl">
                I&apos;m a 28-year-old frontend developer from Oslo with a
                passion for clean design, solid code, and the space where those
                two worlds meet. I&apos;ve worked on everything from portfolio
                sites to fullstack apps — and I love bringing ideas to life on
                the web.
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
                className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-400/50 text-sm"
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
                    I work a lot with React, Next.js, TypeScript, CSS/SASS and
                    Tailwind. I care about clean code, performance, and
                    accessibility.
                  </p>
                </div>

                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Fullstack</h2>
                  <p>
                    I&apos;ve built with stacks using Prisma, mongoose, MongoDB,
                    SQL, neon, relational and non-relational databases, to
                    mention some. I enjoy managing the full flow — from database
                    to UI.
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
            <div className="relative w-full h-[80%]">
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
