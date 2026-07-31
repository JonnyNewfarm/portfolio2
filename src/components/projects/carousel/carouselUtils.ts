import { projects } from "../projectData";
import type {
  CarouselItem,
  CarouselRuntime,
} from "../projectsTypes";

export function wrapIndex(
  index: number,
  length: number,
) {
  return (
    ((index % length) + length) %
    length
  );
}

export function buildCarouselItems(): CarouselItem[] {
  return projects.flatMap(
    (project, projectIndex) =>
      project.images
        .slice(0, 4)
        .map((image, imageIndex) => ({
          project,
          projectIndex,
          image,
          imageIndex,
        })),
  );
}

export function createCarouselRuntime(): CarouselRuntime {
  return {
    offset: 0,
    desiredOffset: 0,
    glideSpeed: 0,
    hasMomentum: false,
    bendAmount: 0,
    desiredBend: 0,
    highestSpeed: 0,
    speedSamples: [0, 0, 0, 0, 0],
  };
}