"use client";
import React, { useState } from "react";
import Project from "./Project";
import Modal from "./Modal";
import MyProjectCard from "./MyProjectCard";

const MyProjects = () => {
  const projects = [
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

  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <main
      id="my-work"
      className="min-h-screen bg-[#ececec] flex sm:items-center flex-col justify-center relative"
    >
      <div className="w-full flex flex-col px-10 gap-y-28 py-10 sm:hidden">
        <h1 className="font-semibold text-lg text-[#1c1a17]">My work</h1>
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
