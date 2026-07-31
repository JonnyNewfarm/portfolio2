import { useTexture } from "@react-three/drei";
import {
  useEffect,
  useMemo,
} from "react";
import * as THREE from "three";

import type { CarouselItem } from "../projectsTypes";

export default function useCarouselImages(
  items: CarouselItem[],
) {
  const paths = useMemo(
    () =>
      items.map(
        (item) =>
          `/projects/${item.image}`,
      ),
    [items],
  );

  const textures = useTexture(
    paths,
  ) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return textures;
}