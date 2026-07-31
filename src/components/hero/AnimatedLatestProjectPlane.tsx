"use client";

import {
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { portraitFragmentShader, portraitVertexShader } from "./heroShaders";

type AnimatedLatestProjectPlaneProps = {
  onLoadedAction: () => void;
};

export default function AnimatedLatestProjectPlane({
  onLoadedAction,
}: AnimatedLatestProjectPlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, "/projects/rustam-01.jpg");

  const { viewport } = useThree();

  const imageWidth = viewport.width / 1.3;
  const imageHeight = imageWidth / 1.78;

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(
    new THREE.Vector2(-imageWidth * 0.13, imageHeight * 0.02),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  const bendCurrent = useRef(new THREE.Vector2(-130, 22));
  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  const alphaCurrent = useRef(0);
  const alphaVelocity = useRef(0);

  const hovered = useRef(false);
  const hasStartedAnimation = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new THREE.Vector2(-130, 22),
      },

      uAmplitude: {
        value: 0.00145,
      },

      uAlpha: {
        value: 0,
      },
    }),
    [texture],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    onLoadedAction();
  }, [onLoadedAction, texture]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    if (!hasStartedAnimation.current) {
      hasStartedAnimation.current = true;

      bendVelocity.current.set(260, -44);

      positionVelocity.current.set(imageWidth * 0.8, -imageHeight * 0.1);
    }

    const alphaTarget = 1;
    const alphaStiffness = 72;
    const alphaDamping = 14;

    alphaVelocity.current +=
      (alphaTarget - alphaCurrent.current) * alphaStiffness * delta;

    alphaVelocity.current *= Math.exp(-alphaDamping * delta);

    alphaCurrent.current += alphaVelocity.current * delta;

    alphaCurrent.current = THREE.MathUtils.clamp(alphaCurrent.current, 0, 1);

    const pointerFollow = 1 - Math.exp(-delta * 8.5);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const differenceX = pointerTarget.current.x - smoothPointer.current.x;

    const differenceY = pointerTarget.current.y - smoothPointer.current.y;

    const targetBendX = hovered.current ? differenceX * 460 : 0;

    const targetBendY = hovered.current ? differenceY * 460 : 0;

    const bendStiffness = hovered.current ? 115 : 88;
    const bendDamping = hovered.current ? 15 : 10.5;

    bendVelocity.current.x +=
      (targetBendX - bendCurrent.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    const maxFollowX = imageWidth * 0.18;
    const maxFollowY = imageHeight * 0.16;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY : 0,
    );

    const positionStiffness = hovered.current ? 34 : 78;
    const positionDamping = hovered.current ? 7.5 : 8.5;

    positionVelocity.current.x +=
      (positionTarget.current.x - positionCurrent.current.x) *
      positionStiffness *
      delta;

    positionVelocity.current.y +=
      (positionTarget.current.y - positionCurrent.current.y) *
      positionStiffness *
      delta;

    positionVelocity.current.multiplyScalar(Math.exp(-positionDamping * delta));

    positionCurrent.current.addScaledVector(positionVelocity.current, delta);

    mesh.position.x = positionCurrent.current.x;
    mesh.position.y = positionCurrent.current.y;

    material.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    material.uniforms.uAlpha.value = alphaCurrent.current;
  });

  const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    hovered.current = true;

    if (event.uv) {
      pointerTarget.current.copy(event.uv);
      smoothPointer.current.copy(event.uv);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    pointerTarget.current.copy(event.uv);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    hovered.current = false;
    pointerTarget.current.set(0.5, 0.5);
  };

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[imageWidth, imageHeight, 24, 18]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portraitVertexShader}
        fragmentShader={portraitFragmentShader}
        toneMapped={false}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
