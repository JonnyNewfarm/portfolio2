"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollSection from "@/components/SmoothScroll";
import WaveLinkText from "./WaveLinkText";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const introImages = [
  {
    src: "/jonas-03.jpeg",
    alt: "Jonas Nygaard 3",
  },
  {
    src: "/jonas-02.jpg",
    alt: "Jonas Nygaard 2",
  },
  {
    src: "/jonas-01.jpg",
    alt: "Jonas Nygaard 1",
  },
];

const imageStats = [
  {
    label: "Name",
    value: "Jonas Nygaard",
  },
  {
    label: "Location",
    value: "Oslo, Norway",
  },
];

type TextRevealProps = {
  children: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  trigger?: boolean;
};

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  trigger,
}: TextRevealProps) {
  const MotionTag = motion[as];

  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: "110%",
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease,
      },
    },
  };

  const animationProps =
    typeof trigger === "boolean"
      ? {
          initial: "hidden",
          animate: trigger ? "visible" : "hidden",
        }
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once, amount: 0.35 },
        };

  return (
    <MotionTag
      variants={containerVariants}
      className={className}
      {...animationProps}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden py-[0.08em] -my-[0.08em]"
              : "inline-block overflow-hidden align-top py-[0.08em] -my-[0.08em]"
          }
        >
          <motion.span
            variants={itemVariants}
            className="inline-block leading-[inherit] will-change-transform"
          >
            {item}
            {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 32,
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutClient() {
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);

  const allImagesLoaded = loadedImages >= introImages.length;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const smoothMouseY = useSpring(mouseY, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);

  useEffect(() => {
    if (introDone) return;

    const scrollY = window.scrollY;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const preventDefault = (event: Event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      const blockedKeys = [
        " ",
        "PageUp",
        "PageDown",
        "End",
        "Home",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ];

      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;

      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventScrollKeys);

      window.scrollTo(0, scrollY);
    };
  }, [introDone]);

  useEffect(() => {
    if (!allImagesLoaded) return;

    const firstImageHold = 1050;
    const stepDuration = 850;

    const secondImageTimer = window.setTimeout(() => {
      setActiveImage(1);
    }, firstImageHold);

    const thirdImageTimer = window.setTimeout(() => {
      setActiveImage(2);
    }, firstImageHold + stepDuration);

    const doneTimer = window.setTimeout(
      () => {
        setIntroDone(true);
      },
      firstImageHold + stepDuration * 2 + 250,
    );

    return () => {
      window.clearTimeout(secondImageTimer);
      window.clearTimeout(thirdImageTimer);
      window.clearTimeout(doneTimer);
    };
  }, [allImagesLoaded]);

  const handleImageLoad = () => {
    setLoadedImages((current) => {
      if (current >= introImages.length) return current;
      return current + 1;
    });
  };

  const handleImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 8;
    const moveY = ((y - centerY) / centerY) * 8;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleImageLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ScrollSection>
      <section className="relative min-h-screen overflow-hidden bg-[#fbfafa] text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300">
        {/* IMAGE + STATS */}
        <div className="absolute right-0 top-[6.2rem] z-[1] w-[54vw] sm:w-[42vw] md:w-[34vw] lg:top-[5.7rem] lg:w-[27vw] xl:w-[24vw] 2xl:w-[21vw]">
          <motion.div
            ref={imageRef}
            onMouseMove={handleImageMove}
            onMouseLeave={handleImageLeave}
            style={{
              x: smoothMouseX,
              y: smoothMouseY,
              scale: imageScale,
            }}
            initial={{
              clipPath: "inset(100% 0% 0% 0%)",
              filter: "blur(12px)",
            }}
            animate={{
              clipPath: allImagesLoaded
                ? "inset(0% 0% 0% 0%)"
                : "inset(100% 0% 0% 0%)",
              filter: allImagesLoaded ? "blur(0px)" : "blur(12px)",
            }}
            transition={{
              duration: 1.1,
              ease,
            }}
            className="relative aspect-[4/5] w-full overflow-hidden bg-stone-400/10 dark:bg-stone-200/5"
          >
            {introImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={false}
                animate={{
                  y:
                    activeImage === index
                      ? "0%"
                      : index < activeImage
                        ? "-100%"
                        : "100%",
                  scale: activeImage === index ? 1 : 1.08,
                  opacity: activeImage === index ? 1 : 0,
                  filter: activeImage === index ? "blur(0px)" : "blur(8px)",
                  zIndex: activeImage === index ? 2 : 1,
                }}
                transition={{
                  duration: 0.55,
                  ease,
                }}
                className="absolute inset-0"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  onLoad={handleImageLoad}
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 54vw, (max-width: 768px) 42vw, (max-width: 1024px) 34vw, 27vw"
                />
              </motion.div>
            ))}

            {/* AWWWARDS STYLE COUNTER */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-between p-3 mix-blend-difference">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: allImagesLoaded ? 1 : 0,
                  y: allImagesLoaded ? 0 : 12,
                }}
                transition={{ duration: 0.65, delay: 0.25, ease }}
                className="text-[9px] font-black uppercase leading-none tracking-[0.22em] text-white"
              >
                Jonas
              </motion.p>

              <motion.p
                key={activeImage}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: allImagesLoaded ? 1 : 0,
                  y: allImagesLoaded ? 0 : 10,
                }}
                transition={{ duration: 0.35, ease }}
                className="text-[9px] font-black uppercase leading-none tracking-[0.22em] text-white"
              >
                0{activeImage + 1} / 03
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.15,
                },
              },
            }}
            className="mt-5 grid grid-cols-1 gap-4 text-[10px] font-black uppercase leading-[1.25] tracking-[0.16em] sm:grid-cols-2 sm:gap-6 lg:text-xs lg:tracking-[0.18em]"
          >
            {imageStats.map((item) => (
              <motion.div
                key={item.label}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 16,
                    filter: "blur(6px)",
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.7,
                      ease,
                    },
                  },
                }}
              >
                <p className="mb-1 opacity-35">{item.label}</p>
                <p className="opacity-85">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CONTENT */}
        <div className="relative z-[2] px-4 sm:px-8 md:px-10 lg:pl-16 lg:pr-[28vw] xl:pr-[26vw] 2xl:pr-[24vw]">
          {/* HERO */}
          <div className="flex min-h-screen flex-col justify-end pb-10 pt-28 lg:pt-36">
            <TextReveal
              as="h1"
              mode="lines"
              delay={0.05}
              trigger={introDone}
              className="max-w-[980px] text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.92] tracking-[-0.07em]"
            >
              {`Designer &
frontend
developer.`}
            </TextReveal>
          </div>

          {/* UNDER FIRST VIEWPORT */}
          <div className="pb-16 lg:pb-24">
            <div className=" pt-8 ">
              <div className="grid max-w-[900px] grid-cols-1 gap-6 md:grid-cols-2">
                <TextReveal
                  as="p"
                  mode="words"
                  delay={0.05}
                  className="text-base leading-[1.65] opacity-80 md:text-lg"
                >
                  I like being creative in both design and development, building
                  digital experiences with focus on layout, interaction, motion
                  and frontend details.
                </TextReveal>

                <TextReveal
                  as="p"
                  mode="words"
                  delay={0.13}
                  className="text-base leading-[1.65] opacity-80 md:text-lg"
                >
                  My work is about making websites feel sharp, responsive and
                  alive — from the first idea to the final interface.
                </TextReveal>
              </div>
            </div>

            <div className="mt-16  pt-8 ">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.35fr] md:items-end">
                <TextReveal
                  as="p"
                  mode="lines"
                  delay={0.05}
                  className="max-w-[760px] text-3xl font-black uppercase leading-[1] tracking-[-0.05em] md:text-5xl"
                >
                  {`Available for
selected freelance
projects.`}
                </TextReveal>

                <FadeIn delay={0.25} y={20} className="md:justify-self-end">
                  <Link
                    href="/contact"
                    className="group relative block w-fit overflow-hidden text-sm font-black uppercase tracking-[0.22em] md:text-base"
                  >
                    <WaveLinkText text="Contact Me" />
                  </Link>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
