import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

type CanvasBackgroundProps = {
  color: string;
};

export default function CanvasBackground({ color }: CanvasBackgroundProps) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const backgroundColor = new THREE.Color(color);

    gl.setClearColor(backgroundColor, 1);

    scene.background = backgroundColor;
  }, [color, gl, scene]);

  return null;
}
