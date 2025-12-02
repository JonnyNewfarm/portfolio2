"use client";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export default function Clouds() {
  const { scene } = useGLTF("/cloud.glb");

  const cloud1 = useRef<any>();
  const cloud2 = useRef<any>();
  const rain1 = useRef<THREE.Points>();
  const rain2 = useRef<THREE.Points>();
  const flash1 = useRef<THREE.PointLight>();
  const flash2 = useRef<THREE.PointLight>();

  const [storm1, setStorm1] = useState(false);
  const [storm2, setStorm2] = useState(false);

  const stormAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    stormAudio.current = new Audio("/storm.mp3");
    stormAudio.current.loop = true;
  }, []);

  const createRain = (width = 0.3, height = 0.4, depth = 0.1) => {
    const geometry = new THREE.BufferGeometry();
    const count = 80;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * depth;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xaaaaff, size: 0.02 });
    return { geometry, material, count };
  };

  const rainData1 = createRain();
  const rainData2 = createRain();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (cloud1.current) {
      cloud1.current.position.y = 2.2 + Math.sin(t * 0.3) * 0.03;
      cloud1.current.position.x = -2.4 + Math.cos(t * 0.2) * 0.03;
    }
    if (cloud2.current) {
      cloud2.current.position.y = 2.2 + Math.sin(t * 0.25) * 0.03;
      cloud2.current.position.x = -2.2 + Math.cos(t * 0.18) * 0.03;
    }

    if (storm1 && rain1.current) {
      const positions = rain1.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < rainData1.count; i++) {
        positions[i * 3 + 1] -= 0.08;
        if (positions[i * 3 + 1] < 0)
          positions[i * 3 + 1] = Math.random() * 0.4 + 0.1;
      }
      rain1.current.geometry.attributes.position.needsUpdate = true;
      flash1.current!.intensity = Math.random() > 0.8 ? 2 : 0;
    }

    if (storm2 && rain2.current) {
      const positions = rain2.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < rainData2.count; i++) {
        positions[i * 3 + 1] -= 0.08;
        if (positions[i * 3 + 1] < 0)
          positions[i * 3 + 1] = Math.random() * 0.4 + 0.1;
      }
      rain2.current.geometry.attributes.position.needsUpdate = true;
      flash2.current!.intensity = Math.random() > 0.8 ? 2 : 0;
    }
  });

  const handleCloudClick = (cloud: 1 | 2) => {
    if (!stormAudio.current) return;

    stormAudio.current.currentTime = 0;
    stormAudio.current.play();

    if (cloud === 1) {
      setStorm1(true);
      setTimeout(() => {
        setStorm1(false);
        if (!storm2) stormAudio.current?.pause();
      }, 3000);
    } else {
      setStorm2(true);
      setTimeout(() => {
        setStorm2(false);
        if (!storm1) stormAudio.current?.pause();
      }, 3000);
    }
  };

  return (
    <>
      {/* Cloud 1 */}
      <group
        ref={cloud1}
        rotation={[0, 1, 0]}
        position={[-2.4, 2.2, 2.8]}
        onClick={() => handleCloudClick(1)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <primitive object={scene.clone()} scale={0.002} />
        {storm1 && (
          <>
            <points
              ref={rain1}
              geometry={rainData1.geometry}
              material={rainData1.material}
              position={[0.1, -0.6, 0]}
            />
            <pointLight
              ref={flash1}
              position={[0, -0.3, 0]}
              intensity={0}
              color={0xffffff}
            />
          </>
        )}
      </group>

      {/* Cloud 2 */}
      <group
        ref={cloud2}
        rotation={[0, 1, 0]}
        position={[-2.1, 2, 2.8]}
        onClick={() => handleCloudClick(2)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <primitive object={scene.clone()} scale={0.0023} />
        {storm2 && (
          <>
            <points
              ref={rain2}
              geometry={rainData2.geometry}
              material={rainData2.material}
              position={[0, -0.6, 0]}
            />
            <pointLight
              ref={flash2}
              position={[0, -0.3, 0]}
              intensity={0}
              color={0xffffff}
            />
          </>
        )}
      </group>
    </>
  );
}
