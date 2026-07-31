import type { MutableRefObject } from "react";

export type Project = {
  title: string;
  year: string;
  category: string;
  link: string;
  about: string;
  stack: string;
  role: string;
  images: string[];
};

export type CarouselItem = {
  project: Project;
  projectIndex: number;
  image: string;
  imageIndex: number;
};

export type CarouselRuntime = {
  offset: number;
  desiredOffset: number;
  glideSpeed: number;
  hasMomentum: boolean;
  bendAmount: number;
  desiredBend: number;
  highestSpeed: number;
  speedSamples: number[];
};

export type CarouselRuntimeRef =
  MutableRefObject<CarouselRuntime>;