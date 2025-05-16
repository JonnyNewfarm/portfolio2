"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import MyProjectCard from "@/components/MyProjectCard";

const Page = () => {
  const projects = [
    {
      title: "Kerimov Designs",
      src: "project3.png",
      color: "#5e5e5d",
      link: "https://kerimovdesigns.vercel.app/",
    },
    {
      title: "Custom Canvas",
      src: "canvas-screen.png",
      color: "#504f4e",
      link: "https://createcanvas.vercel.app/",
    },
    {
      title: "Lunnettes",
      src: "lunnettes-screen.png",
      color: "#161310",
      link: "https://lunnettes-shop.vercel.app/",
    },
  ];

  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  return (
    <div>
      <div className="w-full flex flex-col px-10 bg-[#ececec] gap-y-28 py-10 md:hidden border-b border-[#161310]">
        <div>
          <h1 className="font-semibold text-2xl mt-10 text-[#1c1a17]">
            My projects
          </h1>
          <h1>Code/Design/Fullstack</h1>
        </div>
        {projects.map((project, index) => {
          return (
            <MyProjectCard
              key={index}
              src={project.src}
              title={project.title}
              link={project.link}
            />
          );
        })}
      </div>
      <div className="w-full min-h-screen hidden md:block bg-[#ececec] border-b border-[#161310]">
        <div className="max-w-7xl h-20 flex  ">
          <div className="mt-16 w-full">
            <h1 className="text-6xl ml-20 mb-5 text-[#1c1a17]">My projects</h1>
            <h2 className="text-xl ml-20 mb-2 text-[#1c1a17] mt-2">
              Code/Design/Fullstack
            </h2>
            <hr />
          </div>
        </div>

        <div className="min-h-screen bg-[#ececec]  flex justify-center w-full items-center px-8 py-16">
          <div className="flex w-full max-w-7xl lg:px-16 xl:p-18 justify-between">
            <div>
              <div className="pl-4">
                <h1 className="mb-2 ml-4 font-semibold">Scrollable</h1>
                <div
                  ref={containerRef}
                  className="w-64 h-[450px] overflow-y-auto p-4 pt-16"
                  style={{ scrollbarWidth: "none" }}
                >
                  <motion.div
                    drag="y"
                    dragConstraints={{
                      top: -projects.length * 170 + 600,
                      bottom: 0,
                    }}
                    style={{ y }}
                    className="flex flex-col gap-y-20"
                  >
                    {projects.map((project) => (
                      <div
                        key={project.title}
                        onMouseEnter={() => setSelectedProject(project)}
                        className={`cursor-pointer transition-transform ${
                          selectedProject.src === project.src
                            ? "scale-105"
                            : "scale-100"
                        }`}
                      >
                        <MyProjectCard
                          title={project.title}
                          src={project.src}
                          link={project.link}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <a
                href={selectedProject.link}
                className="bg-[#1c1a17] mt-6 p-4 md:w-[400px] lg:w-[550px]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={`/projects/${selectedProject.src}`}
                    alt={selectedProject.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
