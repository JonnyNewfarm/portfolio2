"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { TEXT_EASE } from "./projectsConstants";
import { projects } from "./projectData";
import ProjectsTextReveal from "./ProjectsTextReveal";
import MobileProjectThreeCard from "./MobileProjectThreeCard";

export default function MobileProjects() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState(false);

  const [loadedProjectIndexes, setLoadedProjectIndexes] = useState<Set<number>>(
    () => new Set(),
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const updateThemeState = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateThemeState();

    const observer = new MutationObserver(updateThemeState);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleProjectReady = useCallback((index: number) => {
    setLoadedProjectIndexes((current) => {
      if (current.has(index)) {
        return current;
      }

      const next = new Set(current);

      next.add(index);

      return next;
    });
  }, []);

  const isProjectsReady =
    projects.length === 0 || loadedProjectIndexes.size === projects.length;

  if (isMobile !== true) {
    return null;
  }

  return (
    <div
      className="
        relative
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
            text-sm
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
            text-[11vw]
            font-bold
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

      <AnimatePresence>
        {!isProjectsReady && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              pointer-events-none
              fixed
              bottom-5
              right-6
              z-[100]
              text-[#161310]
              dark:text-stone-200
              md:hidden
            "
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                h-5
                w-5
                rounded-full
                border-[1.5px]
                border-current/20
                border-t-current
              "
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity: isProjectsReady ? 1 : 0,
        }}
        transition={{
          duration: 0.32,
          ease: TEXT_EASE,
        }}
        style={{
          pointerEvents: isProjectsReady ? "auto" : "none",
        }}
        className="
          mt-14
          flex
          flex-col
          gap-16
        "
      >
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="
              flex
              flex-col
            "
          >
            {/* TITLE */}
            <div>
              <ProjectsTextReveal
                active={isProjectsReady}
                delay={0.16 + index * 0.06}
                as="h2"
                className="
                  mb-2
                  cursor-pointer
                  text-3xl
                  font-semibold
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

            <MobileProjectThreeCard
              src={`/projects/${project.images[0]}`}
              href={project.link}
              title={project.title}
              isDark={isDark}
              projectsReady={isProjectsReady}
              onReadyAction={() => {
                handleProjectReady(index);
              }}
            />

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
                active={isProjectsReady}
                delay={0.22 + index * 0.06}
                as="p"
                className="
                  text-2xl
                  leading-[1.1]
                  text-[#161310]
                  dark:text-stone-300
                "
              >
                {project.about}
              </ProjectsTextReveal>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
