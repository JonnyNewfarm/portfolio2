"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface Project {
  src: string;
  color?: string;
}

interface ModalProps {
  modal?: {
    active: any;
    index: any;
  };
  projects: Project[];
}
const scaleAnimation = {
  initial: { scale: 0 },
  open: {
    scale: 1,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

const Modal = ({ modal, projects }: ModalProps) => {
  const container = useRef(null);

  useEffect(() => {
    const modalWidth = 400;
    const modalHeight = 300;

    const moveContainerX = gsap.quickTo(container.current, "left", {
      duration: 0.8,
      ease: "power3.out",
    });
    const moveContainerY = gsap.quickTo(container.current, "top", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      moveContainerX(clientX - modalWidth / 2);
      moveContainerY(clientY - modalHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={container}
      variants={scaleAnimation}
      initial="initial"
      animate={modal?.active ? "open" : "closed"}
      className="h-[300px] z-50 overflow-hidden pointer-events-none fixed w-[400px] flex items-center justify-center"
    >
      <div
        style={{ top: modal?.index * -100 + "%" }}
        className="w-full h-full absolute"
        id="modal-slider"
      >
        {projects.map((project, index) => {
          return (
            <div
              key={index}
              className="h-full w-full flex items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <div className="bg-black/60 text-lg absolute flex justify-center items-center text-white py-3 px-6">
                <h1>Live link</h1>
              </div>
              <Image
                className="h-auto"
                width={320}
                height={0}
                alt=""
                src={`/projects/${project.src}`}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Modal;
