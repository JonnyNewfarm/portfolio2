"use client";

import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";

import MobileProjectPlane from "./MobileProjectPlane";

type MobileProjectThreeCardProps = {
  src: string;
  href: string;
  title: string;
  isDark: boolean;
  projectsReady: boolean;
  onReadyAction: () => void;
};

export default function MobileProjectThreeCard({
  src,
  href,
  title,
  isDark,
  projectsReady,
  onReadyAction,
}: MobileProjectThreeCardProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [hasEntered, setHasEntered] = useState(false);

  const isInView = useInView(anchorRef, {
    amount: 0.16,
    margin: "10% 0px 10% 0px",
  });

  useEffect(() => {
    if (projectsReady && isInView && !hasEntered) {
      setHasEntered(true);
    }
  }, [hasEntered, isInView, projectsReady]);

  return (
    <a
      ref={anchorRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${title}`}
      className="
        relative
        block
        w-full
      "
    >
      <div
        aria-hidden="true"
        className="
          invisible
          pointer-events-none
          w-full
          p-[10px]
        "
      >
        <img
          src={src}
          alt=""
          className="
            block
            h-auto
            w-full
          "
          draggable={false}
        />
      </div>

      <Canvas
        dpr={[1, 2]}
        shadows={false}
        frameloop={isInView ? "always" : "demand"}
        camera={{
          position: [0, 0, 5],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Suspense fallback={null}>
          <MobileProjectPlane
            src={src}
            active={projectsReady && hasEntered}
            isDark={isDark}
            onReadyAction={onReadyAction}
          />
        </Suspense>
      </Canvas>
    </a>
  );
}
