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
        "left-[55.5vw] hidden lg:block top-[25vh] md:top-[20vh] w-[20vh] h-[30vh] sm:h-[30vh] sm:w-[20vh] z-[2]",
      value: md,
    },
    {
      img: para3,
      style:
        "left-[5vw] sm:left-[10vw] hidden lg:block lg:left-[32vw] xl:left-[35.5vw] top-[35vh] h-[20vh] w-[15vh] sm:h-[23vh] sm:w-[20vh] z-[3]",
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
    <div id="home" ref={container} className="bg-[#ecebeb] h-screen relative">
      {/* Floating images */}
      <div className="absolute top-[16vh]  left-0 w-full h-full flex justify-center pointer-events-none">
        {images.map((image, i) => (
          <motion.div
            key={i}
            style={{ y: image.value }}
            className={` absolute object-cover ${image.style}`}
          >
            <Image
              className="object-cover"
              fill
              priority
              quality={100}
              placeholder="blur"
              alt="image"
              src={image.img}
            />
          </motion.div>
        ))}
      </div>

      {/* Animated Text */}
      <div className="absolute z-30 top-[60vh] sm:top-[65vh] font-serif w-screen overflow-hidden">
        <div
          ref={slider}
          className="relative flex whitespace-nowrap w-max will-change-transform"
        >
          <p
            ref={firstParagraph}
            className="text-[clamp(7rem,10vw,10rem)] text-[#161310] m-2.5 uppercase"
          >
            developer & designer -
          </p>
          <p
            ref={secondParagraph}
            className="text-[clamp(6rem,10vw,10rem)] text-[#161310] m-2.5 uppercase absolute left-full"
          >
            developer & designer -
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
