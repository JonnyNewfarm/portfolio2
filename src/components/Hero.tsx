"use client";
import gsap from "gsap";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll, useTransform, motion } from "motion/react";
import para1 from "../../public/jonny27.jpg";
import para2 from "../../public/jonas1.jpg";
import para3 from "../../public/jonas2.jpg";

const Hero = () => {
  const container = useRef(null);
  const direction = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const md = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  const images = [
    {
      img: para1,
      style: "h-[40vh] mb-16 sm:h-[45vh] sm:w-[30vh] w-[30vh] z-[1]",
      value: 0,
    },
    {
      img: para2,
      style:
        "left-[55.5vw] hidden  top-[25vh] md:top-[20vh] w-[20vh] h-[30vh] sm:h-[30vh] sm:w-[20vh] z-[2]",
      value: md,
    },
    {
      img: para3,
      style:
        "left-[5vw] sm:left-[10vw] hidden  lg:left-[32vw] xl:left-[35.5vw] top-[33vh]   sm:h-[21vh] sm:w-[20vh] z-[3]",
      value: lg,
    },
  ];

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
    <div id="home" ref={container} className="bg-[#ecebeb] h-screen relative ">
      <div className="absolute top-[16vh]  left-0 w-full h-full flex justify-center pointer-events-none">
        {images.map((image, i) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 2,
              duration: 1,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            key={i}
            style={{ y: image.value }}
            className={` absolute object-cover ${image.style}`}
          >
            <Image
              className="object-contain"
              fill
              priority
              quality={100}
              alt="image"
              src={image.img}
            />
          </motion.div>
        ))}
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
          delay: 2,
          duration: 1,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        className="xl:w-[400px] w-[300px] h-[120px] gap-x-4 [@media(max-width:400px)]:bottom-[4vh] bottom-[8vh] sm:bottom-[22vh]  lg:top-1/3 xl:h-[150px] lg:flex flex-row items-center p-2 absolute border-r-[1px] border-b-[1px] border-t-[1px] border-black hidden"
        href="https://createcanvas.vercel.app/"
      >
        <div className="w-[200px] relative h-[200px]">
          <Image
            fill
            className="object-contain"
            src="/projects/canvas-screen.png"
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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 2,
            duration: 1,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          ref={slider}
          className="relative flex whitespace-nowrap    w-max will-change-transform"
        >
          <p
            ref={firstParagraph}
            className="text-[clamp(7rem,10vw,10rem)] text-[#161310] m-2.5 uppercase"
          >
            developer & designer -
          </p>
          <p
            ref={secondParagraph}
            className="text-[clamp(7rem,10vw,10rem)] text-[#161310] m-2.5 uppercase absolute translate-x-full left-0"
          >
            developer & designer -
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
