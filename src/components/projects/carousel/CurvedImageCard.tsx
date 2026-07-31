import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  CARD_HEIGHT,
  CARD_STRIDE,
  CARD_WIDTH,
  carouselMotion,
} from "../projectsConstants";

import type { CarouselItem, CarouselRuntimeRef } from "../projectsTypes";

type CurvedImageCardProps = {
  item: CarouselItem;
  index: number;
  texture: THREE.Texture;
  trackWidth: number;
  runtimeRef: CarouselRuntimeRef;
};

export default function CurvedImageCard({
  item,
  index,
  texture,
  trackWidth,
  runtimeRef,
}: CurvedImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const baseVerticesRef = useRef<Float32Array | null>(null);

  const initialX = index * CARD_STRIDE - trackWidth / 2;

  const animatedXRef = useRef(initialX);

  const intendedXRef = useRef(initialX);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      color: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
      toneMapped: false,
      transparent: false,
      opacity: 1,
    });
  }, [texture]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const geometry = mesh.geometry as THREE.PlaneGeometry;

    const positionAttribute = geometry.attributes.position;

    if (!baseVerticesRef.current) {
      baseVerticesRef.current = new Float32Array(
        positionAttribute.array as Float32Array,
      );
    }

    let wrappedX = index * CARD_STRIDE - runtimeRef.current.offset;

    wrappedX = ((wrappedX % trackWidth) + trackWidth) % trackWidth;

    if (wrappedX > trackWidth / 2) {
      wrappedX -= trackWidth;
    }

    const jumpedAcrossLoop =
      Math.abs(wrappedX - intendedXRef.current) > CARD_WIDTH * 2;

    if (jumpedAcrossLoop) {
      animatedXRef.current = wrappedX;
    }

    intendedXRef.current = wrappedX;

    animatedXRef.current +=
      (intendedXRef.current - animatedXRef.current) * carouselMotion.cardEase;

    mesh.position.x = animatedXRef.current;

    const baseVertices = baseVerticesRef.current;

    const bendRadius = 2.35;

    const bendPeak = carouselMotion.bendLimit * runtimeRef.current.bendAmount;

    for (let index = 0; index < positionAttribute.count; index += 1) {
      const x = baseVertices[index * 3];

      const y = baseVertices[index * 3 + 1];

      const worldX = mesh.position.x + x;

      const distanceToBendOrigin = Math.sqrt(
        Math.pow(worldX, 2) + Math.pow(y, 2),
      );

      const bendStrength = Math.max(0, 1 - distanceToBendOrigin / bendRadius);

      const zCurve =
        Math.pow(Math.sin((bendStrength * Math.PI) / 2), 1.5) * bendPeak;

      positionAttribute.setZ(index, zCurve);
    }

    positionAttribute.needsUpdate = true;

    geometry.computeVertexNormals();

    material.opacity = 1;
    material.transparent = false;

    const distanceFromMiddle = Math.abs(mesh.position.x);

    const scale = THREE.MathUtils.lerp(
      1,
      0.92,
      THREE.MathUtils.clamp(distanceFromMiddle / 7.5, 0, 1),
    );

    mesh.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} material={material} userData={item}>
      <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT, 36, 18]} />
    </mesh>
  );
}
