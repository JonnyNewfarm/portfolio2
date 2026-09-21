"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  portraitFragmentShader,
  portraitVertexShader,
} from "../hero/heroShaders";

import {
  latestProjectFrameFragmentShader,
  latestProjectFrameVertexShader,
} from "../hero/latestProjectFrameShader";

type MobileProjectPlaneProps = {
  src: string;
  active: boolean;
  isDark: boolean;
  onReadyAction: () => void;
};

const LIGHT_FRAME_COLOR_1 = "#807e75";
const LIGHT_FRAME_COLOR_2 = "#b0a58f";
const LIGHT_FRAME_COLOR_3 = "#6f7468";

const DARK_FRAME_COLOR_1 = "#6f7069";
const DARK_FRAME_COLOR_2 = "#9a927f";
const DARK_FRAME_COLOR_3 = "#565b52";

const FRAME_PADDING_PX = 10;

/*
 * ENTRANCE
 *
 * Litt kraftigere bend enn portrait,
 * men ikke overkill.
 */
const START_BEND_X = -72;
const START_BEND_Y = 14;

const START_POSITION_X = -0.12;
const START_POSITION_Y = 0.02;

/*
 * Fade er tidsbasert så den ikke
 * begynner å pulse/bounce sammen
 * med spring-bevegelsen.
 */
const IMAGE_FADE_DELAY = 0.03;
const IMAGE_FADE_DURATION = 0.88;

const FRAME_FADE_DELAY = 0.13;
const FRAME_FADE_DURATION = 0.92;

const clamp01 = (value: number) => {
  return THREE.MathUtils.clamp(value, 0, 1);
};

const smootherStep = (value: number) => {
  const t = clamp01(value);

  return t * t * t * (t * (t * 6 - 15) + 10);
};

export default function MobileProjectPlane({
  src,
  active,
  isDark,
  onReadyAction,
}: MobileProjectPlaneProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  const imageMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const frameMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, src);

  const { viewport, size, gl } = useThree();

  /*
   * --------------------------------
   * ACTUAL IMAGE RATIO
   * --------------------------------
   */

  const textureImage = texture.image as HTMLImageElement;

  const naturalWidth = textureImage?.naturalWidth || textureImage?.width || 1;

  const naturalHeight =
    textureImage?.naturalHeight || textureImage?.height || 1;

  const imageAspect = naturalWidth / naturalHeight;

  /*
   * --------------------------------
   * SIZE
   * --------------------------------
   */

  const worldPerPixel = viewport.width / size.width;

  const framePadding = FRAME_PADDING_PX * worldPerPixel;

  const frameWidth = viewport.width;

  const frameHeight = viewport.height;

  const imageWidth = frameWidth - framePadding * 2;

  const imageHeight = imageWidth / imageAspect;

  /*
   * --------------------------------
   * POSITION SPRING
   * --------------------------------
   */

  const positionCurrent = useRef(
    new THREE.Vector2(
      imageWidth * START_POSITION_X,
      imageHeight * START_POSITION_Y,
    ),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * --------------------------------
   * BEND SPRING
   * --------------------------------
   */

  const bendCurrent = useRef(new THREE.Vector2(START_BEND_X, START_BEND_Y));

  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * --------------------------------
   * ENTRANCE
   * --------------------------------
   */

  const entranceTime = useRef(0);

  const wasActive = useRef(false);

  const hasReportedReady = useRef(false);

  /*
   * --------------------------------
   * IMAGE UNIFORMS
   * --------------------------------
   */

  const imageUniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new THREE.Vector2(START_BEND_X, START_BEND_Y),
      },

      uAmplitude: {
        value: 0.0011,
      },

      uAlpha: {
        value: 0,
      },
    }),
    [texture],
  );

  /*
   * --------------------------------
   * FRAME UNIFORMS
   * --------------------------------
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
        value: new THREE.Vector2(START_BEND_X, START_BEND_Y),
      },

      uAmplitude: {
        value: 0.0011,
      },

      uAlpha: {
        value: 0,
      },
    }),
    [],
  );

  /*
   * --------------------------------
   * THEME
   * --------------------------------
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
   * --------------------------------
   * TEXTURE
   * --------------------------------
   */

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;

    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearFilter;

    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = false;

    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);

    texture.needsUpdate = true;

    if (!hasReportedReady.current) {
      hasReportedReady.current = true;

      onReadyAction();
    }
  }, [gl, onReadyAction, texture]);

  /*
   * --------------------------------
   * ANIMATION
   * --------------------------------
   */

  useFrame((state, rawDelta) => {
    const group = groupRef.current;

    const imageMaterial = imageMaterialRef.current;

    const frameMaterial = frameMaterialRef.current;

    if (!group || !imageMaterial || !frameMaterial) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * Moving gradient.
     */
    frameMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    /*
     * --------------------------------
     * WAIT
     * --------------------------------
     */

    if (!active) {
      wasActive.current = false;

      entranceTime.current = 0;

      positionCurrent.current.set(
        imageWidth * START_POSITION_X,
        imageHeight * START_POSITION_Y,
      );

      positionVelocity.current.set(0, 0);

      bendCurrent.current.set(START_BEND_X, START_BEND_Y);

      bendVelocity.current.set(0, 0);

      group.position.x = positionCurrent.current.x;

      group.position.y = positionCurrent.current.y;

      imageMaterial.uniforms.uDelta.value.set(START_BEND_X, START_BEND_Y);

      frameMaterial.uniforms.uDelta.value.set(START_BEND_X, START_BEND_Y);

      imageMaterial.uniforms.uAlpha.value = 0;

      frameMaterial.uniforms.uAlpha.value = 0;

      return;
    }

    /*
     * --------------------------------
     * FIRST ACTIVE FRAME
     * --------------------------------
     */

    if (!wasActive.current) {
      wasActive.current = true;

      entranceTime.current = 0;

      positionCurrent.current.set(
        imageWidth * START_POSITION_X,
        imageHeight * START_POSITION_Y,
      );

      /*
       * Litt kick.
       *
       * Mye mindre enn portrait,
       * men nok til at vi får
       * litt liv / bounce.
       */
      positionVelocity.current.set(imageWidth * 0.28, -imageHeight * 0.025);

      bendCurrent.current.set(START_BEND_X, START_BEND_Y);

      bendVelocity.current.set(42, -7);
    }

    entranceTime.current += delta;

    const time = entranceTime.current;

    /*
     * --------------------------------
     * POSITION SPRING
     * --------------------------------
     *
     * Litt underdamped.
     *
     * Gir en liten overshoot,
     * men ikke portrait-nivå bounce.
     */

    const positionStiffness = 68;

    const positionDamping = 10;

    positionVelocity.current.x +=
      (0 - positionCurrent.current.x) * positionStiffness * delta;

    positionVelocity.current.y +=
      (0 - positionCurrent.current.y) * positionStiffness * delta;

    positionVelocity.current.multiplyScalar(Math.exp(-positionDamping * delta));

    positionCurrent.current.addScaledVector(positionVelocity.current, delta);

    group.position.x = positionCurrent.current.x;

    group.position.y = positionCurrent.current.y;

    /*
     * --------------------------------
     * BEND SPRING
     * --------------------------------
     *
     * Litt løsere enn position.
     *
     * Dermed har bildet fortsatt
     * litt bend etter at posisjonen
     * nesten har landet.
     */

    const bendStiffness = 60;

    const bendDamping = 9.5;

    bendVelocity.current.x +=
      (0 - bendCurrent.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (0 - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    bendCurrent.current.x = THREE.MathUtils.clamp(
      bendCurrent.current.x,
      -90,
      55,
    );

    bendCurrent.current.y = THREE.MathUtils.clamp(
      bendCurrent.current.y,
      -40,
      40,
    );

    imageMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    frameMaterial.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    /*
     * --------------------------------
     * IMAGE FADE
     * --------------------------------
     *
     * Smooth, men raskere enn
     * forrige versjon.
     */

    const imageFade = smootherStep(
      (time - IMAGE_FADE_DELAY) / IMAGE_FADE_DURATION,
    );

    imageMaterial.uniforms.uAlpha.value = imageFade;

    /*
     * --------------------------------
     * FRAME FADE
     * --------------------------------
     */

    const frameFade = smootherStep(
      (time - FRAME_FADE_DELAY) / FRAME_FADE_DURATION,
    );

    frameMaterial.uniforms.uAlpha.value = frameFade * 0.96;
  });

  return (
    <group ref={groupRef}>
      {/* GRADIENT FRAME */}
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[frameWidth, frameHeight, 48, 60]} />

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
      <mesh>
        <planeGeometry args={[imageWidth, imageHeight, 48, 60]} />

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
