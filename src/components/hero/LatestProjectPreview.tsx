"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";

import AnimatedLatestProjectPlane from "./AnimatedLatestProjectPlane";
import { heroEase } from "./heroConstants";

export default function LatestProjectPreview() {
  const [imageLoaded, setImageLoaded] = useState(false);

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
        delay: 0.85,
        ease: heroEase,
      }}
      className="
  group
  relative
  hidden
  w-[clamp(200px,14vw,260px)]
  cursor-pointer
  sm:block
"
    >
      <p
        className="
          mb-2
          ml-1
          text-xs
          font-black
          uppercase
          leading-none
          tracking-[-0.015em]
        "
      >
        Latest project
      </p>

      <div className="relative aspect-[16/9] w-full overflow-visible">
        <Canvas
          dpr={[1.5, 2]}
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
            left: "-12%",
            top: "-18%",
            width: "124%",
            height: "136%",
          }}
        >
          <Suspense fallback={null}>
            <AnimatedLatestProjectPlane
              onLoadedAction={() => {
                setImageLoaded(true);
              }}
            />
          </Suspense>
        </Canvas>
      </div>
    </motion.a>
  );
}
