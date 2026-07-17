"use client";

import { RoundedBox, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Desk() {
  const [isDark, setIsDark] = useState(false);

  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");

  const { scene: cupScene } = useGLTF("/flower-cup.glb");
  const { scene: keyboardScene } = useGLTF("/keyboard_1.glb");

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    const html = document.documentElement;

    const updateTheme = () => {
      setIsDark(html.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const gradientMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: {
            value: 0,
          },
          uColor1: {
            value: new THREE.Color("#eef3fc"),
          },
          uColor2: {
            value: new THREE.Color("#d9e2f1"),
          },
        },

        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;

          varying vec2 vUv;

          void main() {
            float wave1 =
              sin(vUv.x * 6.0 + uTime * 0.8);

            float wave2 =
              cos(vUv.y * 5.0 - uTime * 0.6);

            float wave3 =
              sin(
                (vUv.x + vUv.y) * 4.0 +
                uTime * 0.7
              );

            float mixValue =
              0.5 +
              0.5 *
              (wave1 + wave2 + wave3) /
              3.0;

            mixValue =
              smoothstep(
                0.15,
                0.85,
                mixValue
              );

            vec3 color =
              mix(
                uColor1,
                uColor2,
                mixValue
              );

            gl_FragColor =
              vec4(color, 1.0);
          }
        `,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      gradientMaterial.dispose();
    };
  }, [gradientMaterial]);

  useFrame(({ clock }) => {
    gradientMaterial.uniforms.uTime.value = clock.getElapsedTime() * 0.6;
  });

  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard */}
      <group position={[-0.33, 1.32, 0.6]} scale={0.11}>
        <primitive object={keyboardScene} />
      </group>

      {/* Desk Top */}
      <RoundedBox
        args={[2.75, 0.06, 1.5]}
        radius={0.01}
        smoothness={2}
        position={[0, 0.95, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <meshStandardMaterial map={texture} roughness={0.66} metalness={0.03} />
      </RoundedBox>

      {/* Legs */}
      {[-1.28, 1.28].map((x) =>
        [-0.68, 0.62].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.43, z]}
            castShadow={false}
            receiveShadow={false}
          >
            <cylinderGeometry args={[0.05, 0.022, 0.99, 8]} />

            <meshStandardMaterial
              map={texture}
              roughness={0.55}
              metalness={0.08}
            />
          </mesh>
        )),
      )}

      {/* Side support bars */}
      {[-1.3, 1.27].map((x) => (
        <mesh
          key={`bar-${x}`}
          position={[x, 0.73, 0]}
          rotation={[36, 36, -0.06]}
          castShadow={false}
          receiveShadow={false}
        >
          <cylinderGeometry args={[0.025, 0.02, 1.3, 8]} />

          <meshStandardMaterial
            map={texture}
            roughness={0.55}
            metalness={0.08}
          />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.96, -0.6]}>
        {/* Monitor stand */}
        <mesh position={[0, 0.4, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 10]} />

          <meshStandardMaterial
            color="#333333"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Monitor base */}
        <mesh position={[0, 0, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />

          <meshStandardMaterial
            color="#000000"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Monitor frame */}
        <RoundedBox
          args={[2.26, 1.32, 0.07]}
          radius={0.02}
          smoothness={2}
          position={[0, 0.8, 0]}
          castShadow={false}
          receiveShadow={false}
        >
          <meshStandardMaterial
            color="#000000"
            roughness={0.45}
            metalness={0.25}
          />
        </RoundedBox>

        {/* Monitor screen */}
        <RoundedBox
          args={[2.16, 1.24, 0.141]}
          radius={0.02}
          smoothness={2}
          position={[0.01, 0.8, 0]}
          castShadow={false}
          receiveShadow={false}
          material={gradientMaterial}
        />
      </group>

      {/* Flower cup */}
      <group
        position={[1.25, 1.03, 0.7]}
        rotation={[0, Math.PI / 9, 0]}
        scale={1.8}
      >
        <primitive object={cupScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/flower-cup.glb");
useGLTF.preload("/keyboard_1.glb");
