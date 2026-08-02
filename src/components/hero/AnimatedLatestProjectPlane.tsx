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
  active: boolean;
  isDark: boolean;
  onLoadedAction: () => void;
};

const frameFragmentShader = `
  uniform vec3 uColor;
  uniform float uAlpha;

  void main() {
    gl_FragColor = vec4(uColor, uAlpha);
  }
`;

export default function AnimatedLatestProjectPlane({
  active,
  isDark,
  onLoadedAction,
}: AnimatedLatestProjectPlaneProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  const imageMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, "/projects/keri-01.jpg");

  const { viewport, gl } = useThree();

  const imageWidth = viewport.width / 1.3;
  const imageHeight = imageWidth / 1.78;

  /*
   * Hvor mye av rammen som er synlig rundt bildet.
   */
  const frameWidth = imageWidth * 1.07;
  const frameHeight = imageHeight * 1.13;

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(
    new THREE.Vector2(imageWidth * 0.22, imageHeight * 0.025),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  const bendCurrent = useRef(new THREE.Vector2(155, 28));
  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  const alphaCurrent = useRef(0);
  const alphaVelocity = useRef(0);

  const hovered = useRef(false);
  const hasStartedAnimation = useRef(false);

  const imageUniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },
      uDelta: {
        value: new THREE.Vector2(155, 28),
      },
      uAmplitude: {
        value: 0.00155,
      },
      uAlpha: {
        value: 0,
      },
    }),
    [texture],
  );

  const frameUniforms = useMemo(
    () => ({
      uColor: {
        value: new THREE.Color(isDark ? "#4a4540" : "#7a1e16"),
      },
      uDelta: {
        value: new THREE.Vector2(155, 28),
      },
      uAmplitude: {
        value: 0.00155,
      },
      uAlpha: {
        value: 0,
      },
    }),
    [],
  );

  useEffect(() => {
    const frameMaterial = frameMaterialRef.current;

    if (!frameMaterial) {
      return;
    }

    frameMaterial.uniforms.uColor.value.set(isDark ? "#8e968c" : "#6b7368");
  }, [isDark]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = true;

    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);

    texture.needsUpdate = true;

    onLoadedAction();
  }, [gl, onLoadedAction, texture]);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    const imageMaterial = imageMaterialRef.current;
    const frameMaterial = frameMaterialRef.current;

    if (!group || !imageMaterial || !frameMaterial) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    if (!active) {
      group.position.x = positionCurrent.current.x;
      group.position.y = positionCurrent.current.y;

      imageMaterial.uniforms.uDelta.value.set(
        bendCurrent.current.x,
        bendCurrent.current.y,
      );

      frameMaterial.uniforms.uDelta.value.set(
        bendCurrent.current.x,
        bendCurrent.current.y,
      );

      imageMaterial.uniforms.uAlpha.value = 0;
      frameMaterial.uniforms.uAlpha.value = 0;

      return;
    }

    if (!hasStartedAnimation.current) {
      hasStartedAnimation.current = true;

      positionVelocity.current.set(-imageWidth * 1.35, -imageHeight * 0.14);

      bendVelocity.current.set(-340, -58);
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

    const positionStiffness = hovered.current ? 34 : 72;
    const positionDamping = hovered.current ? 7.5 : 6.8;

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

    group.position.x = positionCurrent.current.x;
    group.position.y = positionCurrent.current.y;

    imageMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    frameMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    imageMaterial.uniforms.uAlpha.value = alphaCurrent.current;

    frameMaterial.uniforms.uAlpha.value = alphaCurrent.current * 0.96;
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
    <group ref={groupRef}>
      {/* Frame */}
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[frameWidth, frameHeight, 24, 18]} />

        <shaderMaterial
          ref={frameMaterialRef}
          uniforms={frameUniforms}
          vertexShader={portraitVertexShader}
          fragmentShader={frameFragmentShader}
          toneMapped={false}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          precision="highp"
        />
      </mesh>

      {/* Selve bildet */}
      <mesh
        position={[0, 0, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[imageWidth, imageHeight, 24, 18]} />

        <shaderMaterial
          ref={imageMaterialRef}
          uniforms={imageUniforms}
          vertexShader={portraitVertexShader}
          fragmentShader={portraitFragmentShader}
          toneMapped={false}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          precision="highp"
        />
      </mesh>
    </group>
  );
}
