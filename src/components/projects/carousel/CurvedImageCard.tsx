import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { CARD_HEIGHT, carouselMotion } from "../projectsConstants";

import type { CarouselItem, CarouselRuntimeRef } from "../projectsTypes";

import { wrapPosition } from "./carouselUtils";

type CurvedImageCardProps = {
  item: CarouselItem;
  texture: THREE.Texture;

  baseX: number;
  imageWidth: number;

  trackWidth: number;
  runtimeRef: CarouselRuntimeRef;
};

const FRAME_PADDING_X = 0.15;
const FRAME_PADDING_Y = 0.15;
const LIGHT_FRAME_COLOR = "#a8a69d";
const DARK_FRAME_COLOR = "#444340";

export default function CurvedImageCard({
  item,
  texture,
  baseX,
  imageWidth,
  trackWidth,
  runtimeRef,
}: CurvedImageCardProps) {
  const groupRef = useRef<THREE.Group>(null);

  const imageMeshRef = useRef<THREE.Mesh>(null);
  const frameMeshRef = useRef<THREE.Mesh>(null);

  const imageBaseVerticesRef = useRef<Float32Array | null>(null);

  const frameBaseVerticesRef = useRef<Float32Array | null>(null);

  const [isDark, setIsDark] = useState(false);

  const initialX = wrapPosition(baseX - runtimeRef.current.offset, trackWidth);

  const animatedXRef = useRef(initialX);
  const intendedXRef = useRef(initialX);

  const imageMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,

      color: new THREE.Color("#ffffff"),

      side: THREE.DoubleSide,

      toneMapped: false,

      transparent: false,
      opacity: 1,
    });
  }, [texture]);

  const frameMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(LIGHT_FRAME_COLOR),

      side: THREE.DoubleSide,

      toneMapped: false,

      transparent: false,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    imageBaseVerticesRef.current = null;
    frameBaseVerticesRef.current = null;
  }, [imageWidth]);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    frameMaterial.color.set(isDark ? DARK_FRAME_COLOR : LIGHT_FRAME_COLOR);

    frameMaterial.needsUpdate = true;
  }, [frameMaterial, isDark]);

  useEffect(() => {
    return () => {
      imageMaterial.dispose();
      frameMaterial.dispose();
    };
  }, [frameMaterial, imageMaterial]);

  useFrame(() => {
    const group = groupRef.current;

    const imageMesh = imageMeshRef.current;

    const frameMesh = frameMeshRef.current;

    if (!group || !imageMesh || !frameMesh || trackWidth <= 0) {
      return;
    }

    const imageGeometry = imageMesh.geometry as THREE.PlaneGeometry;

    const frameGeometry = frameMesh.geometry as THREE.PlaneGeometry;

    const imagePositionAttribute = imageGeometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const framePositionAttribute = frameGeometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    if (!imageBaseVerticesRef.current) {
      imageBaseVerticesRef.current = new Float32Array(
        imagePositionAttribute.array as Float32Array,
      );
    }

    if (!frameBaseVerticesRef.current) {
      frameBaseVerticesRef.current = new Float32Array(
        framePositionAttribute.array as Float32Array,
      );
    }

    const wrappedX = wrapPosition(
      baseX - runtimeRef.current.offset,
      trackWidth,
    );

    const jumpedAcrossLoop =
      Math.abs(wrappedX - intendedXRef.current) > trackWidth / 2;

    if (jumpedAcrossLoop) {
      animatedXRef.current = wrappedX;
    }

    intendedXRef.current = wrappedX;

    animatedXRef.current +=
      (intendedXRef.current - animatedXRef.current) * carouselMotion.cardEase;

    group.position.x = animatedXRef.current;

    const bendRadius = 2.35;

    const bendPeak = carouselMotion.bendLimit * runtimeRef.current.bendAmount;

    const deformGeometry = (
      positionAttribute: THREE.BufferAttribute,
      baseVertices: Float32Array,
    ) => {
      for (
        let vertexIndex = 0;
        vertexIndex < positionAttribute.count;
        vertexIndex += 1
      ) {
        const x = baseVertices[vertexIndex * 3];

        const y = baseVertices[vertexIndex * 3 + 1];

        const worldX = group.position.x + x;

        const distanceToBendOrigin = Math.sqrt(
          Math.pow(worldX, 2) + Math.pow(y, 2),
        );

        const bendStrength = Math.max(0, 1 - distanceToBendOrigin / bendRadius);

        const zCurve =
          Math.pow(Math.sin((bendStrength * Math.PI) / 2), 1.5) * bendPeak;

        positionAttribute.setZ(vertexIndex, zCurve);
      }

      positionAttribute.needsUpdate = true;
    };

    deformGeometry(imagePositionAttribute, imageBaseVerticesRef.current);

    deformGeometry(framePositionAttribute, frameBaseVerticesRef.current);

    const distanceFromMiddle = Math.abs(group.position.x);

    const scale = THREE.MathUtils.lerp(
      1,
      0.92,
      THREE.MathUtils.clamp(distanceFromMiddle / 7.5, 0, 1),
    );

    group.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} userData={item}>
      {/* Frame */}
      <mesh
        ref={frameMeshRef}
        material={frameMaterial}
        position={[0, 0, -0.025]}
      >
        <planeGeometry
          args={[
            imageWidth + FRAME_PADDING_X,

            CARD_HEIGHT + FRAME_PADDING_Y,

            36,
            18,
          ]}
        />
      </mesh>

      {/* Image */}
      <mesh
        ref={imageMeshRef}
        material={imageMaterial}
        position={[0, 0, 0]}
        userData={item}
      >
        <planeGeometry args={[imageWidth, CARD_HEIGHT, 36, 18]} />
      </mesh>
    </group>
  );
}
