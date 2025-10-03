"use client";

import { useMotionValue, MotionValue } from "framer-motion";
import { useEffect } from "react";

interface MousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export default function useMouse (): MousePosition{
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const mouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    mouse.x.set(clientX);
    mouse.y.set(clientY);
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  return mouse;
};


