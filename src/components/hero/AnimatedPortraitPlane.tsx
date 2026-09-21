import {
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { portraitFragmentShader, portraitVertexShader } from "./heroShaders";

type AnimatedPortraitPlaneProps = {
  onLoadedAction: () => void;
};

export default function AnimatedPortraitPlane({
  onLoadedAction,
}: AnimatedPortraitPlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, "/newfarm-4.jpg");

  const { viewport, gl } = useThree();

  const canvasScale = 1.6;

  const portraitWidth = viewport.width / canvasScale;

  const portraitHeight = viewport.height / canvasScale;

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(
    new THREE.Vector2(-portraitWidth * 0.16, portraitHeight * 0.025),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  const bendCurrent = useRef(new THREE.Vector2(-52, 10));

  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  const alphaCurrent = useRef(0);

  const alphaVelocity = useRef(0);

  const hasStartedLoadAnimation = useRef(false);

  const hovered = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new THREE.Vector2(-52, 10),
      },

      uAmplitude: {
        value: 0.00105,
      },

      uAlpha: {
        value: 0,
      },
    }),
    [texture],
  );

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
    const mesh = meshRef.current;

    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * SLOWER INITIAL ENTRANCE
     */
    if (!hasStartedLoadAnimation.current) {
      hasStartedLoadAnimation.current = true;

      bendVelocity.current.set(84, -14);

      positionVelocity.current.set(
        portraitWidth * 0.72,
        -portraitHeight * 0.09,
      );
    }

    /*
     * SLOWER FADE
     */
    const alphaTarget = 1;

    const alphaStiffness = 60;

    const alphaDamping = 13;

    alphaVelocity.current +=
      (alphaTarget - alphaCurrent.current) * alphaStiffness * delta;

    alphaVelocity.current *= Math.exp(-alphaDamping * delta);

    alphaCurrent.current += alphaVelocity.current * delta;

    alphaCurrent.current = THREE.MathUtils.clamp(alphaCurrent.current, 0, 1);

    /*
     * POINTER
     */
    const pointerFollow = 1 - Math.exp(-delta * 8.5);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const rawDifferenceX = pointerTarget.current.x - smoothPointer.current.x;

    const rawDifferenceY = pointerTarget.current.y - smoothPointer.current.y;

    /*
     * BEND
     */
    const hoverBendStrength = 175;

    const targetBendX = hovered.current
      ? rawDifferenceX * hoverBendStrength
      : 0;

    const targetBendY = hovered.current
      ? rawDifferenceY * hoverBendStrength
      : 0;

    /*
     * Hover beholdes responsive.
     *
     * Non-hover/load gjøres
     * litt roligere.
     */
    const bendStiffness = hovered.current ? 95 : 70;

    const bendDamping = hovered.current ? 18 : 13;

    bendVelocity.current.x +=
      (targetBendX - bendCurrent.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    bendCurrent.current.x = THREE.MathUtils.clamp(
      bendCurrent.current.x,
      -65,
      65,
    );

    bendCurrent.current.y = THREE.MathUtils.clamp(
      bendCurrent.current.y,
      -45,
      45,
    );

    /*
     * POSITION
     */
    const maxFollowX = portraitWidth * 0.42;

    const maxFollowY = portraitHeight * 0.22;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY : 0,
    );

    /*
     * Hover-feel beholdes.
     *
     * Load/return gjøres bare
     * litt roligere.
     */
    const positionStiffness = hovered.current ? 34 : 66;

    const positionDamping = hovered.current ? 7.5 : 8.3;

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
      <planeGeometry args={[portraitWidth, portraitHeight, 48, 60]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portraitVertexShader}
        fragmentShader={portraitFragmentShader}
        toneMapped={false}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}
