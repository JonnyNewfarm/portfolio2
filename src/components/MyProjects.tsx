"use client";
import React, { useState } from "react";
import Project from "./Project";
import Modal from "./Modal";

const MyProjects = () => {
  const projects = [
    {
      title: "Custom Canvas",
      src: "canvas-screen.png",
      color: "#8c8c8c",
      link: "https://createcanvas.vercel.app/",
    },
    {
      title: "Lunnettes",
      src: "Lunnettes-screen.png",
      color: "#161310",
      link: "https://lunnettes-shop.vercel.app/",
    },
  ];

  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <main className="h-screen bg-[#ecebeb] flex items-center justify-center relative">
      <div className="w-full p-8 sm:p-10 md:p-40 lg:p-60 hidden sm:block">
        <h1 className="ml-12 mb-2 font-semibold text-lg">My work</h1>
        <div className="w-full flex flex-col justify-center items-center ">
          {projects.map((project, index) => {
            return (
              <Project
                link={project.link}
                setModal={setModal}
                key={index}
                title={project.title}
                index={index}
              />
            );
          })}
        </div>
      </div>

      <Modal modal={modal} projects={projects} />
    </main>
  );
};

export default MyProjects;
