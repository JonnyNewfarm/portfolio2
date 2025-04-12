"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import para1 from "../../public/jonny9.jpg";
import para2 from "../../public/jonas1.jpeg";
import para3 from "../../public/jonas2.jpg";

const ImgParallax = () => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const sm = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const FadeInAnimation = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
      },
    },
  };

  const images = [
    {
      img: para1,
      style: "h-[50vh] sm:h-[60vh] sm:w-[50vh] w-[40vh] z-[1]",
      value: 0,
    },

    {
      img: para2,
      style:
        "left-[57.5vw] [@media(max-width:376px)]:left-[57.5vw] [@media(max-width:450px)]:h-[25vh]  [@media(max-width:391px)]:left-[54vw]  [@media(max-width:450px)]:w-[20vh] [@media(max-width:450px)]:h-[25vh] md:left-[57vw] top-[25vh] md:top-[15vh] w-[25vh] h-[35vh] sm:h-[40vh] sm:w-[30vh] z-[2]",
      value: md,
    },

    {
      img: para3,
      style:
        "left-[5vw] sm:left-[10vw]  md:left-[12.5vw] lg:left-[27.5vw]  top-[40vh] h-[20vh] w-[15vh] sm:h-[25vh] sm:w-[20vh] z-[3]",
      value: lg,
    },
  ];
  return (
    <div className="h-screen" ref={container}>
      {" "}
      <div className="flex w-full h-screen justify-center absolute top-[25vh] sm:top-[20vh]">
        {images.map((image, i) => {
          return (
            <motion.div
              style={{ y: image.value }}
              key={i}
              className={`absolute object-cover ${image.style}`}
            >
              <Image
                className="object-cover"
                fill
                placeholder="blur"
                alt="image"
                src={image.img}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ImgParallax;
