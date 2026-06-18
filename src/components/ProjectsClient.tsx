"use client";

import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import gsap from "gsap";
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

type DesktopImage = {
  project: Project;
  image: string;
  imageIndex: number;
};

type DesktopOffset = {
  x: string;
  y: string;
  align: "start" | "center" | "end";
};

type DropdownMode = "projects" | "details";

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

const desktopOffsets: DesktopOffset[] = [
  { x: "-0.8vw", y: "-0.35vw", align: "start" },
  { x: "0.35vw", y: "0.2vw", align: "center" },
  { x: "0.7vw", y: "-0.45vw", align: "end" },
  { x: "-0.2vw", y: "0.45vw", align: "center" },

  { x: "0.6vw", y: "-0.25vw", align: "end" },
  { x: "-0.7vw", y: "0.25vw", align: "start" },
  { x: "0.15vw", y: "-0.4vw", align: "center" },
  { x: "0.85vw", y: "0.35vw", align: "end" },

  { x: "-0.55vw", y: "0.15vw", align: "start" },
  { x: "0.25vw", y: "-0.3vw", align: "center" },
  { x: "-0.15vw", y: "0.4vw", align: "center" },
  { x: "0.75vw", y: "-0.2vw", align: "end" },
];

const ProjectsClient = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownMode, setDropdownMode] = useState<DropdownMode>("projects");

  const floatingRefs = useRef<Array<HTMLDivElement | null>>([]);

  const quickSetters = useRef<
    Array<{
      x: (value: number) => void;
      y: (value: number) => void;
    } | null>
  >([]);

  const desktopImages = useMemo<DesktopImage[]>(() => {
    const kerimov = projects[0];
    const calero = projects[1];
    const petsaco = projects[2];

    return [
      {
        project: kerimov,
        image: kerimov.images[0],
        imageIndex: 0,
      },
      {
        project: calero,
        image: calero.images[0],
        imageIndex: 0,
      },
      {
        project: petsaco,
        image: petsaco.images[0],
        imageIndex: 0,
      },
      {
        project: kerimov,
        image: kerimov.images[1],
        imageIndex: 1,
      },

      {
        project: calero,
        image: calero.images[1],
        imageIndex: 1,
      },
      {
        project: petsaco,
        image: petsaco.images[1],
        imageIndex: 1,
      },
      {
        project: kerimov,
        image: kerimov.images[2],
        imageIndex: 2,
      },
      {
        project: calero,
        image: calero.images[2],
        imageIndex: 2,
      },

      {
        project: petsaco,
        image: petsaco.images[2],
        imageIndex: 2,
      },
      {
        project: kerimov,
        image: kerimov.images[3],
        imageIndex: 3,
      },
      {
        project: calero,
        image: calero.images[3],
        imageIndex: 3,
      },
      {
        project: petsaco,
        image: petsaco.images[3],
        imageIndex: 3,
      },
    ];
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  useEffect(() => {
    quickSetters.current = floatingRefs.current.map((element) => {
      if (!element) return null;

      return {
        x: gsap.quickTo(element, "x", {
          duration: 0.85,
          ease: "power3.out",
        }),
        y: gsap.quickTo(element, "y", {
          duration: 0.85,
          ease: "power3.out",
        }),
      };
    });

    return () => {
      quickSetters.current = [];
    };
  }, [desktopImages.length]);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (!isDesktop) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    quickSetters.current.forEach((setter, index) => {
      if (!setter) return;

      const depth = index % 3 === 0 ? 1 : index % 3 === 1 ? 0.65 : 0.35;

      setter.x(normalizedX * 80 * depth);
      setter.y(normalizedY * 55 * depth);
    });
  }

  function handleMouseLeave() {
    quickSetters.current.forEach((setter) => {
      if (!setter) return;

      setter.x(0);
      setter.y(0);
    });
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
  };

  const toggleProjectsMenu = () => {
    if (isDropdownOpen && dropdownMode === "projects") {
      setIsDropdownOpen(false);
      return;
    }

    setDropdownMode("projects");
    setIsDropdownOpen(true);
  };

  const toggleDetailsMenu = () => {
    if (isDropdownOpen && dropdownMode === "details") {
      setIsDropdownOpen(false);
      return;
    }

    setDropdownMode("details");
    setIsDropdownOpen(true);
  };

  const toggleMenuButton = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      return;
    }

    setDropdownMode("projects");
    setIsDropdownOpen(true);
  };

  const getAlignClass = (align: DesktopOffset["align"]) => {
    if (align === "start") return "justify-self-start";
    if (align === "end") return "justify-self-end";
    return "justify-self-center";
  };

  return (
    <SmoothScroll>
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen w-full overflow-hidden bg-[#fbfafa] text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300"
      >
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
                    <div className="relative h-full w-full">
                      <Image
                        src={`/projects/${project.images[0]}`}
                        alt={project.title}
                        fill
                        className="object-contain transition-opacity duration-300 hover:opacity-90"
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

          <footer className="relative overflow-hidden bg-[#fbfafa] px-4 py-10 text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300 md:px-10 lg:px-16">
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
        <div className="hidden h-screen w-full overflow-hidden pt-24 md:block">
          <div className="relative h-[calc(100vh-6rem)] w-full overflow-visible">
            <div className="mx-auto grid h-full w-[90vw] grid-cols-4 grid-rows-3 gap-x-[3vw] gap-y-[2.2vw] overflow-visible px-[0.6vw] py-[1.2vw]">
              {" "}
              {desktopImages.map((item, index) => {
                const isSelected = item.project.title === selectedProject.title;
                const offset = desktopOffsets[index % desktopOffsets.length];

                const wrapperStyle: CSSProperties = {
                  transform: `translate(${offset.x}, ${offset.y}) ${
                    isSelected ? "scale(1.4)" : "scale(1)"
                  }`,
                };

                return (
                  <div
                    key={`${item.project.title}-${item.image}`}
                    className={`flex overflow-visible ${getAlignClass(
                      offset.align,
                    )} items-center`}
                  >
                    <div
                      style={wrapperStyle}
                      className={`relative overflow-visible transition-transform duration-500 ease-out ${
                        isSelected ? "z-30" : "z-0"
                      }`}
                    >
                      <div
                        ref={(element) => {
                          floatingRefs.current[index] = element;
                        }}
                        className="relative overflow-visible"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectProject(item.project)}
                          aria-label={`${item.project.title} image ${
                            item.imageIndex + 1
                          }`}
                          className={`relative block h-[clamp(120px,9.8vw,205px)] w-[clamp(200px,17vw,340px)] overflow-visible transition-[filter,opacity] duration-500 ease-out ${
                            isSelected
                              ? "opacity-100 blur-0"
                              : "opacity-45 blur-[4px]  hover:opacity-70 hover:blur-[1.5px]"
                          }`}
                        >
                          <Image
                            src={`/projects/${item.image}`}
                            alt={`${item.project.title} ${item.imageIndex + 1}`}
                            fill
                            priority={index < 6}
                            sizes="(min-width: 768px) 17vw, 100vw"
                            className="object-contain"
                            draggable={false}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collapsible project menu */}
            <div className="absolute bottom-8 left-6 z-[999] w-[clamp(280px,30vw,500px)] xl:left-8">
              <motion.div
                initial={false}
                animate={{
                  maxHeight: isDropdownOpen
                    ? dropdownMode === "projects"
                      ? 320
                      : 390
                    : 0,
                  opacity: isDropdownOpen ? 1 : 0,
                  y: isDropdownOpen ? 0 : 10,
                }}
                transition={{
                  maxHeight: {
                    duration: isDropdownOpen ? 0.65 : 0.58,
                    delay: isDropdownOpen ? 0 : 0.16,
                    ease: [0.76, 0, 0.24, 1],
                  },
                  opacity: {
                    duration: isDropdownOpen ? 0.18 : 0.16,
                    delay: isDropdownOpen ? 0 : 0.12,
                    ease: "linear",
                  },
                  y: {
                    duration: 0.45,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
                className={`absolute bottom-full left-0 mb-3 w-full overflow-hidden border border-[#161310]/35 text-stone-200  dark:border-stone-300/25 bg-[#263029]/95 dark:bg-[#28322b]/95 dark:text-stone-200 ${
                  isDropdownOpen ? "" : "pointer-events-none"
                }`}
              >
                <motion.div
                  initial={false}
                  animate={
                    isDropdownOpen
                      ? {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }
                      : {
                          opacity: 0,
                          y: 18,
                          filter: "blur(6px)",
                        }
                  }
                  transition={{
                    opacity: {
                      duration: isDropdownOpen ? 0.35 : 0.16,
                      delay: isDropdownOpen ? 0.18 : 0,
                      ease: "easeOut",
                    },
                    y: {
                      duration: isDropdownOpen ? 0.55 : 0.22,
                      delay: isDropdownOpen ? 0.18 : 0,
                      ease: isDropdownOpen
                        ? [0.22, 1, 0.36, 1]
                        : [0.76, 0, 0.24, 1],
                    },
                    filter: {
                      duration: isDropdownOpen ? 0.35 : 0.16,
                      delay: isDropdownOpen ? 0.18 : 0,
                      ease: "easeOut",
                    },
                  }}
                  className="flex flex-col"
                >
                  {dropdownMode === "projects" &&
                    projects.map((project, index) => {
                      const isActive = selectedProject.title === project.title;

                      return (
                        <motion.button
                          key={project.title}
                          type="button"
                          onClick={() => handleSelectProject(project)}
                          initial={false}
                          animate={
                            isDropdownOpen
                              ? {
                                  opacity: isActive ? 1 : 0.5,
                                  y: 0,
                                  filter: "blur(0px)",
                                }
                              : {
                                  opacity: 0,
                                  y: 18,
                                  filter: "blur(6px)",
                                }
                          }
                          transition={{
                            duration: isDropdownOpen ? 0.55 : 0.18,
                            delay: isDropdownOpen ? 0.22 + index * 0.06 : 0,
                            ease: isDropdownOpen
                              ? [0.22, 1, 0.36, 1]
                              : [0.76, 0, 0.24, 1],
                          }}
                          className="group relative grid grid-cols-[1fr_auto] items-center gap-5 border-b border-[#161310]/12 px-6 py-6 text-left last:border-b-0 dark:border-stone-300/12"
                        >
                          <span className="text-[clamp(22px,1.65vw,32px)] font-black uppercase leading-[0.9] tracking-[-0.06em] transition-opacity duration-300 group-hover:opacity-70">
                            {project.title}
                          </span>

                          <span className="text-[12px] font-black tracking-[0.18em] opacity-45">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current opacity-25 transition-transform duration-500 group-hover:scale-x-100" />
                        </motion.button>
                      );
                    })}

                  {dropdownMode === "details" && (
                    <div className="flex flex-col gap-6 p-6">
                      <motion.div
                        initial={false}
                        animate={
                          isDropdownOpen
                            ? {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }
                            : {
                                opacity: 0,
                                y: 18,
                                filter: "blur(6px)",
                              }
                        }
                        transition={{
                          duration: isDropdownOpen ? 0.55 : 0.18,
                          delay: isDropdownOpen ? 0.22 : 0,
                          ease: isDropdownOpen
                            ? [0.22, 1, 0.36, 1]
                            : [0.76, 0, 0.24, 1],
                        }}
                      >
                        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] ">
                          About
                        </p>

                        <p className="text-[clamp(18px,1.2vw,24px)] font-black uppercase leading-[1.02] tracking-[-0.045em]">
                          {selectedProject.about}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={
                          isDropdownOpen
                            ? {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }
                            : {
                                opacity: 0,
                                y: 18,
                                filter: "blur(6px)",
                              }
                        }
                        transition={{
                          duration: isDropdownOpen ? 0.55 : 0.18,
                          delay: isDropdownOpen ? 0.28 : 0,
                          ease: isDropdownOpen
                            ? [0.22, 1, 0.36, 1]
                            : [0.76, 0, 0.24, 1],
                        }}
                        className="grid grid-cols-2 gap-6 border-t border-[#161310]/12 pt-5 dark:border-stone-300/12"
                      >
                        <div>
                          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] ">
                            Stack
                          </p>

                          <p className="text-[14px] font-black uppercase leading-snug tracking-[-0.02em]">
                            {selectedProject.stack}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] ">
                            Role
                          </p>

                          <p className="text-[14px] font-black uppercase leading-snug tracking-[-0.02em] ">
                            {selectedProject.role}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>

              <div className="grid min-h-[72px]  grid-cols-[1fr_auto_auto_auto] backdrop-blur-md border border-[#161310]/35 text-stone-200  dark:border-stone-300/25 bg-[#263029]/95 dark:bg-[#28322b]/95 dark:text-stone-200">
                <button
                  type="button"
                  onClick={toggleProjectsMenu}
                  aria-expanded={isDropdownOpen && dropdownMode === "projects"}
                  aria-label="Open project menu"
                  className="flex min-w-0 items-center px-6 text-left text-[clamp(16px,1vw,22px)] font-black uppercase leading-none tracking-[-0.055em] transition-opacity hover:opacity-60"
                >
                  <span className="truncate">{selectedProject.title}</span>
                </button>

                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center border-l border-[#161310]/15 px-5 text-[12px] font-black uppercase tracking-[0.18em] transition-opacity hover:opacity-60 dark:border-stone-300/15"
                >
                  <WaveLinkText text="Live" />
                </a>

                <button
                  type="button"
                  onClick={toggleDetailsMenu}
                  aria-expanded={isDropdownOpen && dropdownMode === "details"}
                  className={`flex cursor-pointer items-center border-l border-[#161310]/15 px-5 text-[12px] font-black uppercase tracking-[0.18em] transition-opacity hover:opacity-60 dark:border-stone-300/15 ${
                    isDropdownOpen && dropdownMode === "details"
                      ? "opacity-100"
                      : "opacity-60"
                  }`}
                >
                  Details
                </button>

                <button
                  type="button"
                  onClick={toggleMenuButton}
                  aria-expanded={isDropdownOpen}
                  aria-label="Toggle project menu"
                  className="group cursor-pointer relative flex h-[72px] w-[78px] items-center justify-center border-l border-[#161310]/15 transition-opacity hover:opacity-70 dark:border-stone-300/15"
                >
                  <span className="relative block h-6 w-9 overflow-hidden">
                    <motion.span
                      animate={
                        isDropdownOpen
                          ? {
                              top: "50%",
                              y: "-50%",
                              width: "36px",
                              opacity: 1,
                            }
                          : {
                              top: "7px",
                              y: "0%",
                              width: "36px",
                              opacity: 1,
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-[2px] bg-current"
                    />

                    <motion.span
                      animate={
                        isDropdownOpen
                          ? {
                              top: "50%",
                              y: "-50%",
                              x: 10,
                              width: "18px",
                              opacity: 0,
                            }
                          : {
                              top: "17px",
                              y: "0%",
                              x: 0,
                              width: "26px",
                              opacity: 1,
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-[2px] bg-current"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
