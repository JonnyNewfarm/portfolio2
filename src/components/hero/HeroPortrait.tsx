"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";

import AnimatedPortraitPlane from "./AnimatedPortraitPlane";
import { heroEase } from "./heroConstants";

export default function HeroPortrait() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: imageLoaded ? 1 : 0,
        y: imageLoaded ? 0 : 18,
        filter: imageLoaded ? "blur(0px)" : "blur(8px)",
      }}
      transition={{
        duration: 0.8,
        ease: heroEase,
      }}
      className="
        absolute
        left-0
        top-[24%]
        z-20

        sm:left-auto
        sm:right-0
        sm:top-[20%]

        lg:top-[35%]
      "
    >
      <div
        className="
          flex
          flex-col
          items-start

          sm:items-end
        "
      >
        <div
          className="
            relative
            aspect-[4/5]
            w-[44vw]
            max-w-[205px]
            overflow-visible

            sm:w-[17vw]
            sm:min-w-[185px]
            sm:max-w-[235px]

            lg:w-[17vw]
            lg:max-w-[260px]
          "
        >
          <Canvas
            dpr={[2, 3]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
              stencil: false,
            }}
            camera={{
              position: [0, 0, 2.2],
              fov: 34,
              near: 0.1,
              far: 10,
            }}
            style={{
              position: "absolute",
              left: "-30%",
              top: "-30%",
              width: "165%",
              height: "165%",
            }}
          >
            <Suspense fallback={null}>
              <AnimatedPortraitPlane
                onLoadedAction={() => {
                  setImageLoaded(true);
                }}
              />
            </Suspense>
          </Canvas>

          <p
            className="
              absolute
              left-0
              top-full
              mt-3.5
              text-[10px]
              uppercase
              tracking-[0.045em]
              sm:hidden
            "
          >
            portrait / 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
}
