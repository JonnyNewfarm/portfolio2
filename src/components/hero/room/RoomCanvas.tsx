import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { Suspense } from "react";

import RoomScene from "./RoomScene";
import { roomEase } from "./roomConstants";

type RoomCanvasProps = {
  sceneLoaded: boolean;
  scrollYProgress: MotionValue<number>;
  monitorFocused: boolean;
  onReadyAction: () => void;
};

export default function RoomCanvas({
  sceneLoaded,
  scrollYProgress,
  monitorFocused,
  onReadyAction,
}: RoomCanvasProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.02,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: sceneLoaded ? 1 : 0,
        scale: sceneLoaded ? 1 : 1.02,
        filter: sceneLoaded ? "blur(0px)" : "blur(10px)",
      }}
      transition={{
        duration: 0.8,
        ease: roomEase,
      }}
      className="absolute inset-0"
    >
      <Canvas
        dpr={[1, 1.05]}
        shadows={false}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{
          near: 0.1,
          far: 50,
        }}
        resize={{
          scroll: false,
          debounce: {
            scroll: 0,
            resize: 100,
          },
        }}
      >
        <ambientLight intensity={0.45} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow={false}
        />

        <Suspense fallback={null}>
          <RoomScene
            scrollYProgress={scrollYProgress}
            monitorFocused={monitorFocused}
            onReadyAction={onReadyAction}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
