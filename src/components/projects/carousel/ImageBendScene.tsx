import { useFrame, useThree } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";

import { CARD_GAP, CARD_HEIGHT, carouselMotion } from "../projectsConstants";

import type { CarouselItem, CarouselRuntimeRef } from "../projectsTypes";

import CurvedImageCard from "./CurvedImageCard";
import useCarouselImages from "./useCarouselImages";
import { wrapPosition } from "./carouselUtils";

type ImageBendSceneProps = {
  items: CarouselItem[];

  runtimeRef: CarouselRuntimeRef;

  onActiveProjectChangeAction: (index: number) => void;

  onReadyAction: () => void;
};

const FRAME_PADDING_X = 0.1;

export default function ImageBendScene({
  items,
  runtimeRef,
  onActiveProjectChangeAction,
  onReadyAction,
}: ImageBendSceneProps) {
  const textures = useCarouselImages(items);

  const { camera, size } = useThree();

  const activeProjectRef = useRef(0);

  const hasReportedReadyRef = useRef(false);

  const imageWidths = useMemo(() => {
    return textures.map((texture) => {
      const image = texture.image as
        | {
            width?: number;
            height?: number;
          }
        | undefined;

      if (!image?.width || !image?.height) {
        return CARD_HEIGHT;
      }

      const aspectRatio = image.width / image.height;

      return CARD_HEIGHT * aspectRatio;
    });
  }, [textures]);

  const layout = useMemo(() => {
    if (imageWidths.length === 0) {
      return {
        positions: [] as number[],
        trackWidth: 0,
      };
    }

    const visualWidths = imageWidths.map((width) => width + FRAME_PADDING_X);

    const positions: number[] = new Array(visualWidths.length);

    positions[0] = 0;

    for (let index = 1; index < visualWidths.length; index += 1) {
      const previousWidth = visualWidths[index - 1];

      const currentWidth = visualWidths[index];

      positions[index] =
        positions[index - 1] + previousWidth / 2 + CARD_GAP + currentWidth / 2;
    }

    const lastIndex = visualWidths.length - 1;

    const trackWidth =
      positions[lastIndex] +
      visualWidths[lastIndex] / 2 +
      CARD_GAP +
      visualWidths[0] / 2;

    return {
      positions,
      trackWidth,
    };
  }, [imageWidths]);

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

    if (!items.length || layout.trackWidth <= 0) {
      return;
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

    let nearestItemIndex = 0;
    let nearestDistance = Infinity;

    for (let index = 0; index < layout.positions.length; index += 1) {
      const x = wrapPosition(
        layout.positions[index] - runtime.offset,

        layout.trackWidth,
      );

      const distance = Math.abs(x);

      if (distance < nearestDistance) {
        nearestDistance = distance;

        nearestItemIndex = index;
      }
    }

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
          texture={textures[index]}
          imageWidth={imageWidths[index]}
          baseX={layout.positions[index] ?? 0}
          trackWidth={layout.trackWidth}
          runtimeRef={runtimeRef}
        />
      ))}
    </group>
  );
}
