"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import Steam from "./Steam";

export default function Desk() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  const { scene: cupScene } = useGLTF("/flower-cup.glb");
  const screenRef = useRef<THREE.Mesh>(null);
  const { scene: keyboardScene } = useGLTF("/keyboard-small.glb");

  useFrame(({ clock }) => {
    if (screenRef.current) {
      (
        screenRef.current.material as THREE.ShaderMaterial
      ).uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#e6eefc") },
      uColor2: { value: new THREE.Color("#ccd7eb") },
    },
    vertexShader: `
    varying vec2 vUv; 


    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Create flowing, wavy pattern
      float wave1 = sin(uv.x * 10.0 + uTime * 2.0);
      float wave2 = cos(uv.y * 8.0 - uTime * 1.5);
      float wave3 = sin((uv.x + uv.y) * 6.0 + uTime * 2.5);

      float mixValue = 0.5 + 0.5 * (wave1 + wave2 + wave3) / 3.0;

      // Smooth the edges for a soft blob effect
      mixValue = smoothstep(0.3, 0.7, mixValue);

      vec3 color = mix(uColor1, uColor2, mixValue);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  });

  useFrame(({ clock }) => {
    if (screenRef.current) {
      (
        screenRef.current.material as THREE.ShaderMaterial
      ).uniforms.uTime.value = clock.getElapsedTime() * 0.6;
    }
  });

  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard (GLB) */}
      <group position={[-0.33, 1.32, 0.6]} scale={0.11}>
        <primitive object={keyboardScene} />
      </group>
      {/* Desk Lamp */}
      <group position={[1.1, 1.05, -0.5]}>
        <spotLight
          ref={lightRef}
          position={[1.12, 1.8, -0.46]}
          angle={Math.PI / 5.56}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 1.8 : 0
          }
          castShadow={false}
        />
      </group>
      y {/* Desk Top */}
      <RoundedBox
        args={[2.75, 0.06, 1.5]}
        radius={0.01}
        smoothness={2.5}
        position={[0, 0.95, 0]}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      </RoundedBox>
      {/* Legs */}
      {[-1.28, 1.28].map((x) =>
        [-0.68, 0.62].map((z, i) => (
          <mesh
            key={`${x}-${z}-${i}`}
            position={[x, 0.43, z]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.05, 0.022, 0.99, 10]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        ))
      )}
      {[-1.36, 1.27].map((x) => (
        <mesh
          key={`bar-${x}`}
          position={[x, 0.73, 0]}
          rotation={[36, 36, -0.06]}
          castShadow={false}
          receiveShadow
        >
          <cylinderGeometry args={[0.025, 0.02, 1.3, 13]} />
          <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      {/* Monitor */}
      <group position={[0, 0.96, -0.6]}>
        <mesh position={[0, 0.4, 0]} castShadow={false} receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.15, 0.15, 0.03]} />
          <meshStandardMaterial color="black" roughness={0.5} metalness={0.3} />
        </mesh>
        <RoundedBox
          args={[2.26, 1.32, 0.07]}
          radius={0.02}
          smoothness={2}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>
        <RoundedBox
          ref={screenRef}
          args={[2.17, 1.24, 0.141]}
          radius={0.02}
          smoothness={2}
          position={[0.015, 0.8, 0]}
          castShadow={false}
          receiveShadow={false}
          material={gradientMaterial}
        />
      </group>
      <group
        position={[1.25, 1.03, 0.7]}
        rotation={[0, Math.PI / 9, 0]}
        scale={1.8}
      >
        <primitive object={cupScene} />

        <group position={[0.0, 0.1, 0]}>
          <Steam count={14} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/flower-cup.glb");
useGLTF.preload("/keyboard-small.glb");
