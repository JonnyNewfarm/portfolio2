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

import {
  latestProjectFrameFragmentShader,
  latestProjectFrameVertexShader,
} from "./latestProjectFrameShader";

type AnimatedLatestProjectPlaneProps = {
  active: boolean;
  isDark: boolean;
  onLoadedAction: () => void;
};

const LIGHT_FRAME_COLOR_1 = "#807e75";
const LIGHT_FRAME_COLOR_2 = "#b0a58f";
const LIGHT_FRAME_COLOR_3 = "#6f7468";

const DARK_FRAME_COLOR_1 = "#6f7069";
const DARK_FRAME_COLOR_2 = "#9a927f";
const DARK_FRAME_COLOR_3 = "#565b52";

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

  /*
   * =====================================================
   * IMAGE SIZE
   * =====================================================
   *
   * Ikke tving bildet til 16:9.
   * Bruk faktisk aspect ratio fra texture.
   */

  const textureAspect = useMemo(() => {
    const image = texture.image as
      | HTMLImageElement
      | {
          width?: number;
          height?: number;
        };

    const width =
      "naturalWidth" in image && image.naturalWidth
        ? image.naturalWidth
        : image.width;

    const height =
      "naturalHeight" in image && image.naturalHeight
        ? image.naturalHeight
        : image.height;

    if (!width || !height) {
      return 2.09;
    }

    return width / height;
  }, [texture]);

  const imageWidth = viewport.width / 1.3;

  const imageHeight = imageWidth / textureAspect;

  /*
   * Rammen i første screenshot er relativt smal
   * på sidene, men har litt mer luft oppe/nede.
   */
  const frameWidth = imageWidth * 1.07;

  const frameHeight = imageHeight * 1.14;

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(
    new THREE.Vector2(imageWidth * 0.22, imageHeight * 0.025),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  const bendCurrent = useRef(new THREE.Vector2(52, 10));

  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  const alphaCurrent = useRef(0);

  const alphaVelocity = useRef(0);

  const hovered = useRef(false);

  const hasStartedAnimation = useRef(false);

  /*
   * IMAGE UNIFORMS
   */
  const imageUniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new THREE.Vector2(52, 10),
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

  /*
   * FRAME UNIFORMS
   */
  const frameUniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uColor1: {
        value: new THREE.Color(LIGHT_FRAME_COLOR_1),
      },

      uColor2: {
        value: new THREE.Color(LIGHT_FRAME_COLOR_2),
      },

      uColor3: {
        value: new THREE.Color(LIGHT_FRAME_COLOR_3),
      },

      uDelta: {
        value: new THREE.Vector2(52, 10),
      },

      uAmplitude: {
        value: 0.00105,
      },

      uAlpha: {
        value: 0,
      },
    }),
    [],
  );

  /*
   * THEME
   */
  useEffect(() => {
    const frameMaterial = frameMaterialRef.current;

    if (!frameMaterial) {
      return;
    }

    if (isDark) {
      frameMaterial.uniforms.uColor1.value.set(DARK_FRAME_COLOR_1);

      frameMaterial.uniforms.uColor2.value.set(DARK_FRAME_COLOR_2);

      frameMaterial.uniforms.uColor3.value.set(DARK_FRAME_COLOR_3);

      return;
    }

    frameMaterial.uniforms.uColor1.value.set(LIGHT_FRAME_COLOR_1);

    frameMaterial.uniforms.uColor2.value.set(LIGHT_FRAME_COLOR_2);

    frameMaterial.uniforms.uColor3.value.set(LIGHT_FRAME_COLOR_3);
  }, [isDark]);

  /*
   * TEXTURE
   */
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

  useFrame((state, rawDelta) => {
    const group = groupRef.current;

    const imageMaterial = imageMaterialRef.current;

    const frameMaterial = frameMaterialRef.current;

    if (!group || !imageMaterial || !frameMaterial) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * GRADIENT
     */
    frameMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    /*
     * INACTIVE
     */
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

    /*
     * INITIAL ENTRANCE
     */
    if (!hasStartedAnimation.current) {
      hasStartedAnimation.current = true;

      positionVelocity.current.set(-imageWidth * 1.02, -imageHeight * 0.105);

      bendVelocity.current.set(-88, -15);
    }

    /*
     * ALPHA
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

    const differenceX = pointerTarget.current.x - smoothPointer.current.x;

    const differenceY = pointerTarget.current.y - smoothPointer.current.y;

    /*
     * BEND
     */
    const hoverBendStrength = 175;

    const targetBendX = hovered.current ? differenceX * hoverBendStrength : 0;

    const targetBendY = hovered.current ? differenceY * hoverBendStrength : 0;

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
    const maxFollowX = imageWidth * 0.18;

    const maxFollowY = imageHeight * 0.16;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY : 0,
    );

    const positionStiffness = hovered.current ? 34 : 62;

    const positionDamping = hovered.current ? 7.5 : 7.4;

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

    /*
     * APPLY POSITION
     */
    group.position.x = positionCurrent.current.x;

    group.position.y = positionCurrent.current.y;

    /*
     * APPLY BEND
     */
    imageMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    frameMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    /*
     * APPLY ALPHA
     */
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
      {/* FRAME */}
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[frameWidth, frameHeight, 24, 18]} />

        <shaderMaterial
          ref={frameMaterialRef}
          uniforms={frameUniforms}
          vertexShader={latestProjectFrameVertexShader}
          fragmentShader={latestProjectFrameFragmentShader}
          toneMapped={false}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          precision="highp"
        />
      </mesh>

      {/* IMAGE */}
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
