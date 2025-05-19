"use client";

import React, { useState } from "react";
import Image from "next/image";
import MyProjectCard from "@/components/MyProjectCard";

const Page = () => {
  const projects = [
    {
      title: "Kerimov Designs",
      src: "project3.png",
      link: "https://kerimovdesigns.vercel.app/",
      stack:
        "React, Next.js, Prisma, TailwindCSS, MongoDB, Uploadthing, NextAuth",
    },
    {
      title: "Custom Canvas",
      src: "canvas-screen.png",
      link: "https://createcanvas.vercel.app/",
      stack: "React, TypeScript, Prisma, Neon, Upstash, Stripe, KindeAuth",
    },
    {
      title: "Lunnettes",
      src: "lunnettes-screen.png",
      link: "https://lunnettes-shop.vercel.app/",
      stack: "React, Next.js, Stripe, MongoDB, Prisma, Stripe, NextAuth",
    },
  ];

  const [selected, setSelected] = useState(projects[0]);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="w-full bg-[#ececec]">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col px-10 py-10 gap-y-20 border-b border-[#161310]">
        <h1 className="text-2xl font-semibold text-[#1c1a17] mt-10 uppercase">
          My projects
        </h1>
        <h2>Code/Design/Fullstack</h2>
        {projects.map((p, i) => (
          <MyProjectCard key={i} src={p.src} title={p.title} link={p.link} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen border-b border-[#161310]">
        <div
          className="max-w-7xl w-full mx-auto px-10 py-20 flex gap-16 relative"
          onMouseMove={handleMouseMove}
        >
          {/* Left: List of titles */}
          <div className="w-1/3 flex flex-col gap-4">
            <h1 className="text-5xl font-semibold text-[#1c1a17] mb-6 uppercase">
              My projects
            </h1>
            <h2 className="text-lg text-[#1c1a17] mb-8">
              Code / Design / Fullstack
            </h2>

            {projects.map((project, i) => (
              <div key={i} className="flex flex-col">
                <div
                  className={`cursor-pointer text-xl text-[#1c1a17] transition-all duration-200 flex justify-between ${
                    selected.title === project.title
                      ? "font-semibold"
                      : "opacity-70"
                  }`}
                  onMouseEnter={() => {
                    setSelected(project);
                    setHovered(true);
                  }}
                  onMouseLeave={() => setHovered(false)}
                  onClick={() => window.open(project.link, "_blank")}
                >
                  <span>{project.title}</span>
                  <span className="text-sm opacity-50">Fullstack</span>
                </div>
                {i < projects.length - 1 && (
                  <hr className="my-3 border-[#1c1a17]/30" />
                )}
              </div>
            ))}
          </div>

          {/* Right: Image Preview + Stack */}
          <div className="w-2/3 flex flex-col items-center justify-center">
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-video bg-[#1c1a17] p-4"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/projects/${selected.src}`}
                  alt={selected.title}
                  fill
                  className="object-contain"
                />
              </div>
            </a>
            <p className="mt-4 text-center text-[#1c1a17] text-lg opacity-75">
              {selected.stack}
            </p>
          </div>

          {/* Tooltip */}
          {hovered && (
            <div
              style={{
                position: "fixed",
                top: mousePos.y + 12,
                left: mousePos.x + 12,
                backgroundColor: "#1c1a17",
                color: "#fff",
                padding: "5px 10px",

                fontSize: "16px",
                pointerEvents: "none",
                zIndex: 9999,
              }}
            >
              Live link
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
