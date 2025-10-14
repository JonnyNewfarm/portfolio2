"use client";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Floor() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/floor-13.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[1.62, -0, 2.08]}
      receiveShadow
    >
      <planeGeometry args={[8.43, 4.8]} />
      <meshStandardMaterial
        color={"#bfb9a8"}
        map={texture}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}
