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

  const textureImage = texture.image as HTMLImageElement;

  const naturalWidth = textureImage?.naturalWidth || textureImage?.width || 1;

  const naturalHeight =
    textureImage?.naturalHeight || textureImage?.height || 1;

  const imageAspect = naturalWidth / naturalHeight;

  const worldPerPixel = viewport.width / size.width;

  const framePadding = FRAME_PADDING_PX * worldPerPixel;

  const frameWidth = viewport.width;

  const frameHeight = viewport.height;

  const imageWidth = frameWidth - framePadding * 2;

  const imageHeight = imageWidth / imageAspect;

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(
    new THREE.Vector2(-imageWidth * 0.16, imageHeight * 0.025),
  );

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  const bendCurrent = useRef(new THREE.Vector2(-52, 10));

  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  const alphaCurrent = useRef(0);

  const alphaVelocity = useRef(0);

  const hasStartedLoadAnimation = useRef(false);

  const wasActive = useRef(false);

  const hasReportedReady = useRef(false);

  const imageUniforms = useMemo(
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
        value: new THREE.Vector2(-52, 10),
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

  useFrame((state, rawDelta) => {
    const group = groupRef.current;

    const imageMaterial = imageMaterialRef.current;

    const frameMaterial = frameMaterialRef.current;

    if (!group || !imageMaterial || !frameMaterial) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    frameMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (!active) {
      wasActive.current = false;

      group.position.x = -imageWidth * 0.16;

      group.position.y = imageHeight * 0.025;

      imageMaterial.uniforms.uDelta.value.set(-52, 10);

      frameMaterial.uniforms.uDelta.value.set(-52, 10);

      imageMaterial.uniforms.uAlpha.value = 0;

      frameMaterial.uniforms.uAlpha.value = 0;

      return;
    }

    if (!wasActive.current) {
      wasActive.current = true;

      hasStartedLoadAnimation.current = false;

      positionCurrent.current.set(-imageWidth * 0.16, imageHeight * 0.025);

      positionTarget.current.set(0, 0);

      positionVelocity.current.set(0, 0);

      bendCurrent.current.set(-52, 10);

      bendVelocity.current.set(0, 0);

      alphaCurrent.current = 0;

      alphaVelocity.current = 0;

      group.position.x = positionCurrent.current.x;

      group.position.y = positionCurrent.current.y;

      imageMaterial.uniforms.uDelta.value.set(-52, 10);

      frameMaterial.uniforms.uDelta.value.set(-52, 10);

      imageMaterial.uniforms.uAlpha.value = 0;

      frameMaterial.uniforms.uAlpha.value = 0;
    }

    if (!hasStartedLoadAnimation.current) {
      hasStartedLoadAnimation.current = true;

      bendVelocity.current.set(105, -18);

      positionVelocity.current.set(imageWidth * 0.95, -imageHeight * 0.12);
    }

    const alphaTarget = 1;

    const alphaStiffness = 72;
    const alphaDamping = 14;

    alphaVelocity.current +=
      (alphaTarget - alphaCurrent.current) * alphaStiffness * delta;

    alphaVelocity.current *= Math.exp(-alphaDamping * delta);

    alphaCurrent.current += alphaVelocity.current * delta;

    alphaCurrent.current = THREE.MathUtils.clamp(alphaCurrent.current, 0, 1);

    const targetBendX = 0;
    const targetBendY = 0;

    const bendStiffness = 82;
    const bendDamping = 14;

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

    positionTarget.current.set(0, 0);

    const positionStiffness = 78;
    const positionDamping = 8.5;

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

    const frameAlpha = THREE.MathUtils.smoothstep(
      alphaCurrent.current,
      0.28,
      1,
    );

    frameMaterial.uniforms.uAlpha.value = frameAlpha * 0.96;
  });

  return (
    <group ref={groupRef}>
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
