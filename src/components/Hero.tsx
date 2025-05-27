"use client";
import gsap from "gsap";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

const Hero = () => {
  const container = useRef(null);
  const direction = useRef(-1);

  const firstParagraph = useRef(null);
  const secondParagraph = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;

  const animation = () => {
    if (xPercent < -100) xPercent = 0;
    if (xPercent > 0) xPercent = -100;

    gsap.set(firstParagraph.current, { xPercent });
    gsap.set(secondParagraph.current, { xPercent });
    requestAnimationFrame(animation);
    xPercent += 0.04 * direction.current;
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
          direction.current = event.direction * -1;
        },
      },
      x: "-200px",
    });

    requestAnimationFrame(animation);
  }, []);

  return (
    <div
      id="home"
      ref={container}
      className="bg-[#ececec] h-screen relative text-[#1c1a17] "
    >
      <div className="absolute top-[16vh]  left-0 w-full h-full flex justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 0.1,
            duration: 1,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          className={` absolute object-cover h-[40vh] mb-16 sm:h-[45vh] sm:w-[30vh] w-[30vh] z-[1]`}
        >
          <Image
            className="object-contain"
            fill
            priority
            quality={100}
            alt="image"
            src={"/jonny27.jpg"}
          />
        </motion.div>
      </div>

      <div className="absolute top-[60vh] sm:top-[65vh] w-full flex flex-col items-center lg:hidden">
        <h1 className="text-xl">Jonas Nygaard,</h1>
        <h1 className="text-xl">Freelance developer</h1>
      </div>

      <motion.a
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          delay: 0.1,
          duration: 1,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="xl:w-[400px] w-[300px] h-[120px] gap-x-4 [@media(max-width:400px)]:bottom-[4vh] bottom-[8vh] sm:bottom-[22vh]  lg:top-1/3 xl:h-[150px] lg:flex flex-row items-center p-2 absolute hidden"
        href="https://kerimovdesigns.vercel.app/"
      >
        <div className="w-[200px] relative h-[200px]">
          <Image
            fill
            className="object-contain"
            src="/projects/arkay1.png"
            alt=""
          />
        </div>
        <div className="w-[200px] tracking-tighter text-[13px] text-sm">
          <h1 className="text-lg">Latest work</h1>
          <h1 className="tracking-tighter -mt-1.5">Design & Development, </h1>
          <h1 className="-mt-1.5 mb-2">by Jonas Nygaard</h1>
          <div className="text-sm whitespace-nowrap font-semibold">
            Live link
          </div>
        </div>
      </motion.a>

      <div className="absolute z-30 top-[63vh] [@media(max-width:400px)]:top-[63vh] sm:top-[75vh]  md:top-[75vh] lg:top-[66vh]   w-screen overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 0.5,

            duration: 1,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          ref={slider}
          className="relative flex whitespace-nowrap    w-max will-change-transform"
        >
          <p
            ref={firstParagraph}
            className="text-[clamp(7rem,10vw,10rem)] text-[#1c1a17] m-2.5 uppercase"
          >
            developer & designer -
          </p>
          <p
            ref={secondParagraph}
            className="text-[clamp(7rem,10vw,10rem)] text-[#1c1a17] m-2.5 uppercase absolute translate-x-full left-0"
          >
            developer & designer -
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
