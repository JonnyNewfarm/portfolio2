"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";

import AnimatedLatestProjectPlane from "./AnimatedLatestProjectPlane";
import { heroEase } from "./heroConstants";

type LatestProjectPreviewProps = {
  variant?: "desktop" | "mobile";
};

export default function LatestProjectPreview({
  variant = "desktop",
}: LatestProjectPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const isMobile = variant === "mobile";

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAnimationActive(true);
    }, 850);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [imageLoaded]);

  return (
    <motion.a
      href="https://www.kerimovdesigns.com/"
      target="_blank"
      rel="noreferrer"
      aria-label="Open latest project: Kerimov Designs"
      initial={{
        opacity: 0,
        y: 12,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: imageLoaded ? 1 : 0,
        y: imageLoaded ? 0 : 12,
        filter: imageLoaded ? "blur(0px)" : "blur(6px)",
      }}
      transition={{
        duration: 0.8,
        delay: isMobile ? 0 : 0.85,
        ease: heroEase,
      }}
      className={
        isMobile
          ? `
              group
              relative
              block
              w-full
              cursor-pointer
            `
          : `
              group
              relative
              hidden
              w-[clamp(200px,14vw,260px)]
              cursor-pointer

              sm:block
            `
      }
    >
      <div
        className={
          isMobile
            ? `
                mb-4
                flex
                items-center
                justify-between
              `
            : ""
        }
      >
        <p
          className={
            isMobile
              ? `
                  text-[14px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.05em]
                `
              : `
                  mb-2
                  ml-1
                  text-md
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.04em]
                `
          }
        >
          Latest project
        </p>

        {isMobile && (
          <p
            className="
              text-[13px]
              font-semibold
              uppercase
              tracking-[0.05em]
              opacity-70
            "
          >
            2026
          </p>
        )}
      </div>

      <div
        className="
          relative
          aspect-[16/9]
          w-full
          overflow-visible
        "
      >
        <Canvas
          dpr={isMobile ? [1, 1.25] : [1.5, 2]}
          gl={{
            alpha: true,
            antialias: !isMobile,
            powerPreference: "high-performance",
            stencil: false,
          }}
          camera={{
            position: [0, 0, 2.2],
            fov: 34,
            near: 0.1,
            far: 10,
          }}
          style={
            isMobile
              ? {
                  position: "absolute",
                  left: "-5%",
                  top: "-12%",
                  width: "110%",
                  height: "124%",
                }
              : {
                  position: "absolute",
                  left: "-12%",
                  top: "-18%",
                  width: "124%",
                  height: "136%",
                }
          }
        >
          <Suspense fallback={null}>
            <AnimatedLatestProjectPlane
              active={animationActive}
              isDark={isDark}
              onLoadedAction={() => {
                setImageLoaded(true);
              }}
            />
          </Suspense>
        </Canvas>
      </div>

      {isMobile && (
        <div
          className="
            mt-5
            flex
            items-end
            justify-between
          "
        >
          <div>
            <p
              className="
                text-[20px]
                font-semibold
                uppercase
                leading-none
              "
            >
              Kerimov Designs
            </p>

            <p
              className="
                mt-2
                text-[13px]
                uppercase
                tracking-[0.04em]
                opacity-80
              "
            >
              Design / Development
            </p>
          </div>
        </div>
      )}
    </motion.a>
  );
}
