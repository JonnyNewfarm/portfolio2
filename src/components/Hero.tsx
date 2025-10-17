"use client";

import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useTransform, motion as regMotion } from "framer-motion";

import { Suspense, useRef } from "react";

import DarkModeBtn from "./DarkModeBtn";
import FloorLamp from "./hero/FloorLamp";
import Desk from "./hero/Desk";
import Bookshelf from "./hero/BookShelf";
import WindowOnWall from "./hero/WindowOnWall";
import Wall from "./hero/Wall";
import Wall2 from "./hero/Wall2";
import WallShelfWithCandle from "./hero/WallShelfWithCandle";
import Floor from "./hero/Floor";
import CartoonModel from "./hero/CartoonModel";
import Chair from "./hero/Chair";
import ComputerTower from "./hero/ComputerTower";
import ScreenUI from "./hero/ScreenUI";
import ScreenHint from "./hero/ScreenHint";
import { CameraController } from "./hero/CameraController";
import { Preload } from "@react-three/drei";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.2, 0.26], [1, 0]);

  return (
    <section
      ref={ref}
      className="h-[155vh] md:h-[140vh]  bg-[#c6c0c0] dark:bg-[#757474] text-black dark:text-stone-300"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Canvas shadows dpr={[1, 1.5]}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <FloorLamp />
          <Desk />
          <Suspense fallback={null}>
            <Bookshelf />
          </Suspense>
          <Suspense fallback={null}>
            <WindowOnWall />
          </Suspense>
          <Wall />
          <Wall2 />
          <WallShelfWithCandle />
          <Floor />
          <CartoonModel scrollYProgress={scrollYProgress} />
          <Chair />
          <ComputerTower />
          <ScreenUI scrollYProgress={scrollYProgress} />
          <ScreenHint scrollYProgress={scrollYProgress} />
          <CameraController scrollYProgress={scrollYProgress} />
          <Preload all />
        </Canvas>

        <div className="absolute  z-50 text-xl  text-[#e6ebe6] uppercase  md:text-3xl font-semibold  left-5 bottom-14  md:left-20">
          <regMotion.h1 style={{ opacity }}>Scroll to zoom</regMotion.h1>
        </div>
        <div className="absolute hidden md:block  md:-translate-y-1/2 md:top-1/2 right-5 z-50">
          <DarkModeBtn />
        </div>
        <div className="absolute  md:hidden  bottom-12 right-5 z-50">
          <DarkModeBtn />
        </div>
      </div>
    </section>
  );
}
