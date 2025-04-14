"use client";
import gsap from "gsap";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll, useTransform, motion } from "motion/react";
import para1 from "../../public/jonny18.jpg";
import para2 from "../../public/jonas1.jpg";
import para3 from "../../public/jonas2.jpg";

const Hero = () => {
  const container = useRef(null);
  const direction = useRef(-1); // Store direction in useRef

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  const images = [
    {
      img: para1,
      style: "h-[50vh] sm:h-[45vh] sm:w-[30vh] w-[35vh] z-[1]",
      value: 0,
    },
    {
      img: para2,
      style:
        "left-[57.5vw]   [@media(max-width:376px)]:left-[57.5vw] [@media(max-width:450px)]:h-[25vh]  [@media(max-width:391px)]:left-[54vw]  [@media(max-width:450px)]:w-[20vh] [@media(max-width:450px)]:h-[25vh] md:left-[57vw] top-[25vh] md:top-[20vh] w-[20vh] h-[30vh] sm:h-[30vh] sm:w-[20vh] z-[2]",
      value: md,
    },
    {
      img: para3,
      style:
        "left-[5vw] sm:left-[10vw]   md:left-[12.5vw] lg:left-[34.5vw]  top-[35vh] h-[20vh] w-[15vh] sm:h-[23vh] sm:w-[20vh] z-[3]",
      value: lg,
    },
  ];

  const firstParagraph = useRef(null);
  const secondParagraph = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;

  const animation = () => {
    if (xPercent < -100) {
      xPercent = 0;
    }

    if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstParagraph.current, { xPercent: xPercent });
    gsap.set(secondParagraph.current, { xPercent: xPercent });
    requestAnimationFrame(animation);
    xPercent += 0.04 * direction.current; // Use direction from useRef
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,

        onUpdate: (event) => {
          direction.current = event.direction * -1; // Update direction with useRef
        },
      },
      x: "-200px",
    });

    requestAnimationFrame(animation);
  }, [animation]); // Add animation to the dependency array

  return (
    <div ref={container} className="bg-[#ecebeb] h-screen overflow-x-hidden">
      <div className="overflow-x-hidden">
        <div className="overflow-x-hidden">
          <div className="flex w-full overflow-x-hidden h-screen justify-center absolute top-[25vh] sm:top-[20vh]">
            {images.map((image, i) => {
              return (
                <motion.div
                  style={{ y: image.value }}
                  whileInView={{}}
                  key={i}
                  className={`absolute object-cover ${image.style}`}
                >
                  <Image
                    className="object-cover"
                    fill
                    quality={100}
                    placeholder="blur"
                    alt="image"
                    src={image.img}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute z-30 overflow-x-hidden font-serif  top-[68vh] overflow-hiddenS">
          <div ref={slider} className="relative    flex whitespace-nowrap">
            <p
              ref={firstParagraph}
              className=" text-[160px] text-[#161310]  m-2.5 uppercase"
            >
              developer & designer -
            </p>

            <p
              ref={secondParagraph}
              className=" text-[160px] text-[#161310] z-50 left-[100%] absolute m-2.5 uppercase"
            >
              developer & designer -
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
