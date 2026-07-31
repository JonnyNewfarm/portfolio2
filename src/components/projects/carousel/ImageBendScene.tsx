import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { CARD_STRIDE, carouselMotion } from "../projectsConstants";

import type { CarouselItem, CarouselRuntimeRef } from "../projectsTypes";

import CurvedImageCard from "./CurvedImageCard";
import useCarouselImages from "./useCarouselImages";
import { wrapIndex } from "./carouselUtils";

type ImageBendSceneProps = {
  items: CarouselItem[];
  runtimeRef: CarouselRuntimeRef;
  onActiveProjectChangeAction: (index: number) => void;
  onReadyAction: () => void;
};

export default function ImageBendScene({
  items,
  runtimeRef,
  onActiveProjectChangeAction,
  onReadyAction,
}: ImageBendSceneProps) {
  const textures = useCarouselImages(items);

  const { camera, size } = useThree();

  const trackWidth = items.length * CARD_STRIDE;

  const activeProjectRef = useRef(0);

  const hasReportedReadyRef = useRef(false);

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    perspectiveCamera.fov = size.width < 1100 ? 48 : 43;

    perspectiveCamera.position.z = size.width < 1100 ? 5.3 : 4.75;

    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame((_, delta) => {
    if (!hasReportedReadyRef.current) {
      hasReportedReadyRef.current = true;

      onReadyAction();
    }

    const runtime = runtimeRef.current;

    const safeDelta = delta || 0.016;

    const previousOffset = runtime.offset;

    if (runtime.hasMomentum) {
      runtime.desiredOffset += runtime.glideSpeed;

      const speedFade = 0.97 - Math.abs(runtime.glideSpeed) * 0.5;

      runtime.glideSpeed *= Math.max(0.91, speedFade);

      if (Math.abs(runtime.glideSpeed) < 0.001) {
        runtime.glideSpeed = 0;
      }
    }

    runtime.offset +=
      (runtime.desiredOffset - runtime.offset) * carouselMotion.positionEase;

    const liveSpeed = Math.abs(runtime.offset - previousOffset) / safeDelta;

    runtime.speedSamples.push(liveSpeed);

    runtime.speedSamples.shift();

    const averageSpeed =
      runtime.speedSamples.reduce((sum, value) => sum + value, 0) /
      runtime.speedSamples.length;

    if (averageSpeed > runtime.highestSpeed) {
      runtime.highestSpeed = averageSpeed;
    }

    const speedRatio = averageSpeed / (runtime.highestSpeed + 0.001);

    const slowingDown = speedRatio < 0.7 && runtime.highestSpeed > 0.5;

    runtime.highestSpeed *= 0.99;

    const bendFromMotion = Math.min(1, liveSpeed * 0.08);

    if (liveSpeed > 0.05) {
      runtime.desiredBend = Math.max(runtime.desiredBend, bendFromMotion);
    }

    if (slowingDown || averageSpeed < 0.2) {
      const fadeAmount = slowingDown
        ? carouselMotion.bendFade
        : carouselMotion.bendFade * 0.9;

      runtime.desiredBend *= fadeAmount;
    }

    runtime.bendAmount +=
      (runtime.desiredBend - runtime.bendAmount) * carouselMotion.bendEase;

    const nearestItemIndex = wrapIndex(
      Math.round(runtime.offset / CARD_STRIDE),
      items.length,
    );

    const nearestProjectIndex = items[nearestItemIndex]?.projectIndex ?? 0;

    if (nearestProjectIndex !== activeProjectRef.current) {
      activeProjectRef.current = nearestProjectIndex;

      onActiveProjectChangeAction(nearestProjectIndex);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {items.map((item, index) => (
        <CurvedImageCard
          key={`${item.project.title}-${item.image}-${index}`}
          item={item}
          index={index}
          texture={textures[index]}
          trackWidth={trackWidth}
          runtimeRef={runtimeRef}
        />
      ))}
    </group>
  );
}
