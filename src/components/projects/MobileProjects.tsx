"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { TEXT_EASE } from "./projectsConstants";
import { projects } from "./projectData";
import ProjectsTextReveal from "./ProjectsTextReveal";

export default function MobileProjects() {
  return (
    <div
      className="
        px-6
        pb-16
        pt-28
        md:hidden
      "
    >
      <div>
        <ProjectsTextReveal
          active
          delay={0.16}
          as="p"
          className="
            mb-2
            text-xs
            uppercase
            tracking-[0.18em]
            text-[#161310]/90
            dark:text-stone-300/90
          "
        >
          Code / Design / Fullstack
        </ProjectsTextReveal>

        <ProjectsTextReveal
          active
          delay={0.1}
          as="h1"
          className="
            text-5xl
            font-semibold
            uppercase
            leading-[0.92]
            tracking-[0.01em]
            text-[#161310]
            dark:text-stone-200
          "
        >
          selected Work
        </ProjectsTextReveal>
      </div>

      <div
        className="
          mt-14
          flex
          flex-col
          gap-16
        "
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="
              flex
              flex-col
            "
          >
            <div>
              <ProjectsTextReveal
                active
                delay={0.12 + index * 0.06}
                as="p"
                className="
                  mb-3
                  text-[16px]
                  uppercase
                  tracking-[0.28em]
                  text-[#161310]/80
                  dark:text-stone-300/80
                "
              >
                {String(index + 1).padStart(2, "0")}
              </ProjectsTextReveal>

              <ProjectsTextReveal
                active
                delay={0.16 + index * 0.06}
                as="h2"
                className="
                  mb-5
                  cursor-pointer
                  text-3xl
                  font-normal
                  uppercase
                  leading-[0.95]
                  tracking-[-0.01em]
                  text-[#161310]
                  dark:text-stone-200
                "
              >
                {project.title}
              </ProjectsTextReveal>
            </div>

            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(6px)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.85,
                delay: 0.08,
                ease: TEXT_EASE,
              }}
              className="
                block
                w-full
                will-change-[opacity,transform,filter]
              "
            >
              <Image
                src={`/projects/${project.images[0]}`}
                alt={project.title}
                width={1600}
                height={1200}
                sizes="100vw"
                className="
                  h-auto
                  w-full
                  object-contain
                "
                draggable={false}
              />
            </motion.a>

            <div
              className="
                mt-6
                border-t
                border-[#161310]/15
                pt-5
                dark:border-stone-300/15
              "
            >
              <ProjectsTextReveal
                active
                delay={0.22 + index * 0.06}
                as="p"
                className="
                  text-lg
                  leading-relaxed
                  text-[#161310]
                  dark:text-stone-300
                "
              >
                {project.about}
              </ProjectsTextReveal>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-4
                  border-t
                  border-[#161310]/15
                  pt-4
                  dark:border-stone-300/15
                "
              >
                <div>
                  <ProjectsTextReveal
                    active
                    delay={0.28 + index * 0.06}
                    as="p"
                    className="
                      mb-2
                      text-[10px]
                      uppercase
                      tracking-[0.22em]
                      text-[#161310]/90
                      dark:text-stone-300/90
                    "
                  >
                    Stack
                  </ProjectsTextReveal>

                  <ProjectsTextReveal
                    active
                    delay={0.32 + index * 0.06}
                    as="p"
                    className="
                      text-sm
                      leading-relaxed
                      text-[#161310]
                      dark:text-stone-300
                    "
                  >
                    {project.stack}
                  </ProjectsTextReveal>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
