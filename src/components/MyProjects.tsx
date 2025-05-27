"use client";
import React, { useState } from "react";
import Project from "./Project";
import Modal from "./Modal";
import MyProjectCard from "./MyProjectCard";
import Link from "next/link";

const MyProjects = () => {
  const projects = [
    {
      title: "Kerimov Designs",
      src: "arkay.png",
      color: "#5e5e5d",
      link: "https://kerimovdesigns.vercel.app/",
    },
    {
      title: "Custom Canvas",
      src: "canvas-screen.png",
      color: "#504f4e",
      link: "https://createcanvas.vercel.app/",
    },
  ];

  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <main
      id="my-work"
      className="min-h-[40vh] bg-[#ececec] flex sm:items-center flex-col justify-center relative"
    >
      <div className="w-full flex flex-col px-10 gap-y-28 py-10 sm:hidden">
        <h1 className="font-semibold text-lg ml-2 text-[#1c1a17]">
          Recent Projects
        </h1>
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

        <div className="w-full flex  justify-center">
          <Link
            href={"/projects"}
            className="border-[1px] mb-10 border-black py-2 px-4 uppercase hover:bg-[#1c1a17] hover:text-[#ececec]"
          >
            More work
          </Link>
        </div>
      </div>
      <div className="w-full h-full -mt-40 p-8 sm:p-10 md:p-40   hidden sm:block">
        <h1 className="ml-12 mb-2 font-semibold text-lg">Recent Projects</h1>
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
          <div className="w-full flex  justify-center">
            <Link
              href={"/projects"}
              className="border-[1px] mb-10 hover:bg-[#1c1a17] hover:text-[#ececec] border-black py-2 px-4 uppercase"
            >
              More work
            </Link>
          </div>
        </div>
      </div>

      <Modal modal={modal} projects={projects} />
    </main>
  );
};

export default MyProjects;
