"use client";

import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

type Project = {
  title: string;
  year: string;
  category: string;
  link: string;
  about: string;
  stack: string;
  role: string;
  images: string[];
};

type CarouselItem = {
  project: Project;
  projectIndex: number;
  image: string;
  imageIndex: number;
};

type TextRevealTag = "p" | "span" | "h1" | "h2" | "label" | "div";

type TextRevealProps = {
  children: string;
  as?: TextRevealTag;
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
  active?: boolean;
};

type CarouselRuntime = {
  offset: number;
  desiredOffset: number;
  glideSpeed: number;
  hasMomentum: boolean;
  bendAmount: number;
  desiredBend: number;
  highestSpeed: number;
  speedSamples: number[];
};

const TEXT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const projects: Project[] = [
  {
    title: "Kerimov Designs",
    year: "2026",
    category: "Web Design & Branding",
    link: "https://kerimovdesigns.com",
    about: "Portfolio website for graphic designer Rustam Kerimov.",
    stack:
      "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    role: "Design, frontend and backend.",
    images: [
      "kerimov-001.jpg",
      "kerimov-002.jpg",
      "kerimov-003.jpg",
      "kerimov-04.jpg",
      "kerimov-05.jpg",
      "kerimov-06.jpg",
    ],
  },
  {
    title: "Calero Studio",
    year: "2026",
    category: "E-commerce & 3D",
    link: "https://www.calero.studio/",
    about:
      "E-commerce product page with visual direction, product storytelling, 3D presentation and smooth motion.",
    stack: "React, Prisma, Three.js, GSAP, TailwindCSS, Neon, Stripe.",
    role: "Design, frontend, backend, Stripe and motion.",
    images: [
      "calero-01.jpg",
      "calero-001.jpg",
      "calero-03.jpg",
      "calero-04.jpg",
      "calero-05.jpg",
      "calero-06.jpg",
    ],
  },
  {
    title: "Petsaco",
    year: "2025",
    category: "E-commerce & Brand",
    link: "https://petsaco.com",
    about:
      "E-commerce store with product browsing, authentication, checkout and animated brand experience.",
    stack:
      "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, Neon, NextAuth, Stripe, Zustand.",
    role: "Design, frontend, backend, auth, checkout and animations.",
    images: [
      "petsaco-01.jpg",
      "petsaco-02.jpg",
      "petsaco-03.jpg",
      "petsaco-04.jpg",
      "petsaco-05.jpg",
      "petsaco-06.jpg",
    ],
  },
];

const carouselMotion = {
  wheelForce: 0.0065,
  dragForce: 0.008,
  inertiaBoost: 2,
  positionEase: 0.09,
  cardEase: 0.085,
  bendFade: 0.94,
  bendLimit: 1.65,
  bendInputScale: 0.14,
  bendEase: 0.08,
};

const cardWidth = 2.85;
const cardHeight = 1.62;
const cardGap = 0.16;
const cardStride = cardWidth + cardGap;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
  active,
}: TextRevealProps) {
  const MotionTag = motion[as] as any;

  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease: TEXT_EASE,
      },
    },
  };

  const motionProps =
    active === undefined
      ? {
          whileInView: "visible",
          viewport: {
            once,
            amount: 0.35,
          },
        }
      : {
          animate: active ? "visible" : "hidden",
        };

  return (
    <MotionTag
      htmlFor={htmlFor}
      variants={containerVariants}
      initial="hidden"
      className={className}
      {...motionProps}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden py-[0.08em] -my-[0.08em]"
              : "inline-block overflow-hidden py-[0.04em] -my-[0.04em] align-top"
          }
        >
          <motion.span
            variants={itemVariants}
            className="inline-block will-change-transform"
          >
            {item}
            {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

function buildCarouselItems() {
  return projects.flatMap((project, projectIndex) =>
    project.images.slice(0, 4).map((image, imageIndex) => ({
      project,
      projectIndex,
      image,
      imageIndex,
    })),
  );
}

function useCarouselImages(items: CarouselItem[]) {
  const paths = useMemo(
    () => items.map((item) => `/projects/${item.image}`),
    [items],
  );

  const textures = useTexture(paths) as THREE.Texture[];

  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return textures;
}

type CurvedImageCardProps = {
  item: CarouselItem;
  index: number;
  texture: THREE.Texture;
  trackWidth: number;
  runtimeRef: MutableRefObject<CarouselRuntime>;
};

function CurvedImageCard({
  item,
  index,
  texture,
  trackWidth,
  runtimeRef,
}: CurvedImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseVerticesRef = useRef<Float32Array | null>(null);
  const animatedXRef = useRef(index * cardStride - trackWidth / 2);
  const intendedXRef = useRef(index * cardStride - trackWidth / 2);

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
    if (!mesh) return;

    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const positionAttribute = geometry.attributes.position;

    if (!baseVerticesRef.current) {
      baseVerticesRef.current = new Float32Array(
        positionAttribute.array as Float32Array,
      );
    }

    let wrappedX = index * cardStride - runtimeRef.current.offset;
    wrappedX = ((wrappedX % trackWidth) + trackWidth) % trackWidth;

    if (wrappedX > trackWidth / 2) {
      wrappedX -= trackWidth;
    }

    const jumpedAcrossLoop =
      Math.abs(wrappedX - intendedXRef.current) > cardWidth * 2;

    if (jumpedAcrossLoop) {
      animatedXRef.current = wrappedX;
    }

    intendedXRef.current = wrappedX;

    animatedXRef.current +=
      (intendedXRef.current - animatedXRef.current) * carouselMotion.cardEase;

    mesh.position.x = animatedXRef.current;

    const baseVertices = baseVerticesRef.current;
    const bendOrigin = new THREE.Vector2(0, 0);
    const bendRadius = 2.35;
    const bendPeak = carouselMotion.bendLimit * runtimeRef.current.bendAmount;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = baseVertices[i * 3];
      const y = baseVertices[i * 3 + 1];

      const worldX = mesh.position.x + x;

      const distanceToBendOrigin = Math.sqrt(
        Math.pow(worldX - bendOrigin.x, 2) + Math.pow(y - bendOrigin.y, 2),
      );

      const bendStrength = Math.max(0, 1 - distanceToBendOrigin / bendRadius);

      const zCurve =
        Math.pow(Math.sin((bendStrength * Math.PI) / 2), 1.5) * bendPeak;

      positionAttribute.setZ(i, zCurve);
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
      <planeGeometry args={[cardWidth, cardHeight, 36, 18]} />
    </mesh>
  );
}

type ImageBendSceneProps = {
  items: CarouselItem[];
  runtimeRef: MutableRefObject<CarouselRuntime>;
  onActiveProjectChange: (index: number) => void;
  isDark: boolean;
};

function ImageBendScene({
  items,
  runtimeRef,
  onActiveProjectChange,
  isDark,
}: ImageBendSceneProps) {
  const textures = useCarouselImages(items);
  const { camera, size, gl } = useThree();

  const trackWidth = items.length * cardStride;
  const activeProjectRef = useRef(0);

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.setClearColor(new THREE.Color(isDark ? "#1e1c1c" : "#fbfafa"), 1);
  }, [gl, isDark]);

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    perspectiveCamera.fov = size.width < 1100 ? 48 : 43;
    perspectiveCamera.position.z = size.width < 1100 ? 5.3 : 4.75;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame((_, delta) => {
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
      Math.round(runtime.offset / cardStride),
      items.length,
    );

    const nearestProjectIndex = items[nearestItemIndex]?.projectIndex ?? 0;

    if (nearestProjectIndex !== activeProjectRef.current) {
      activeProjectRef.current = nearestProjectIndex;
      onActiveProjectChange(nearestProjectIndex);
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

type DesktopWorkCarouselProps = {
  activeProjectIndex: number;
  setActiveProjectIndex: React.Dispatch<React.SetStateAction<number>>;
  isDark: boolean;
};

function DesktopWorkCarousel({
  activeProjectIndex,
  setActiveProjectIndex,
  isDark,
}: DesktopWorkCarouselProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef(0);
  const touchLastXRef = useRef(0);
  const momentumTimerRef = useRef<number | null>(null);

  const items = useMemo(() => buildCarouselItems(), []);
  const activeProject = projects[activeProjectIndex];

  const runtimeRef = useRef<CarouselRuntime>({
    offset: 0,
    desiredOffset: 0,
    glideSpeed: 0,
    hasMomentum: false,
    bendAmount: 0,
    desiredBend: 0,
    highestSpeed: 0,
    speedSamples: [0, 0, 0, 0, 0],
  });

  const addBend = useCallback((amount: number) => {
    runtimeRef.current.desiredBend = Math.min(
      1,
      runtimeRef.current.desiredBend + amount,
    );
  }, []);

  const releaseMomentumSoon = useCallback((delay = 160) => {
    if (momentumTimerRef.current) {
      window.clearTimeout(momentumTimerRef.current);
    }

    momentumTimerRef.current = window.setTimeout(() => {
      runtimeRef.current.hasMomentum = false;
    }, delay);
  }, []);

  const nudgeCarousel = useCallback(
    (delta: number) => {
      runtimeRef.current.desiredOffset += delta;
      runtimeRef.current.hasMomentum = true;

      addBend(Math.min(1, Math.abs(delta) * 0.065));
      releaseMomentumSoon(220);
    },
    [addBend, releaseMomentumSoon],
  );

  const handlePrev = useCallback(() => {
    nudgeCarousel(-cardStride);
  }, [nudgeCarousel]);

  const handleNext = useCallback(() => {
    nudgeCarousel(cardStride);
  }, [nudgeCarousel]);

  const jumpToProject = useCallback(
    (projectIndex: number) => {
      const firstItemIndex = items.findIndex(
        (item) => item.projectIndex === projectIndex,
      );

      if (firstItemIndex === -1) return;

      runtimeRef.current.desiredOffset = firstItemIndex * cardStride;
      runtimeRef.current.hasMomentum = true;

      runtimeRef.current.desiredBend = Math.min(
        1,
        runtimeRef.current.desiredBend + 0.55,
      );

      setActiveProjectIndex(projectIndex);
      releaseMomentumSoon(420);
    },
    [items, setActiveProjectIndex, releaseMomentumSoon],
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;

      if (!section) return;
      if (window.innerWidth < 768) return;

      const rect = section.getBoundingClientRect();

      const isInside =
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.65;

      if (!isInside) return;

      event.preventDefault();

      const wheelBend = Math.abs(event.deltaY) * 0.001;

      addBend(wheelBend);

      runtimeRef.current.desiredOffset +=
        event.deltaY * carouselMotion.wheelForce;

      runtimeRef.current.hasMomentum = true;

      runtimeRef.current.glideSpeed =
        Math.min(Math.abs(event.deltaY) * 0.00045, 0.045) *
        Math.sign(event.deltaY);

      releaseMomentumSoon(150);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (momentumTimerRef.current) {
        window.clearTimeout(momentumTimerRef.current);
      }
    };
  }, [addBend, releaseMomentumSoon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth < 768) return;

      if (event.key === "ArrowLeft") {
        handlePrev();
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0].clientX;
    touchLastXRef.current = event.touches[0].clientX;
    runtimeRef.current.hasMomentum = false;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchX = event.touches[0].clientX;
    const deltaX = touchX - touchLastXRef.current;

    touchLastXRef.current = touchX;

    const touchBend = Math.abs(deltaX) * 0.018;

    addBend(touchBend);

    runtimeRef.current.desiredOffset -= deltaX * carouselMotion.dragForce;

    runtimeRef.current.hasMomentum = true;
  };

  const handleTouchEnd = () => {
    const velocity = (touchLastXRef.current - touchStartXRef.current) * 0.005;

    if (Math.abs(velocity) > 0.5) {
      runtimeRef.current.glideSpeed =
        -velocity * carouselMotion.inertiaBoost * 0.05;

      runtimeRef.current.desiredBend = Math.min(
        1,
        Math.abs(velocity) * 3 * carouselMotion.bendInputScale,
      );

      runtimeRef.current.hasMomentum = true;

      window.setTimeout(() => {
        runtimeRef.current.hasMomentum = false;
      }, 800);
    }
  };

  return (
    <div
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative hidden h-screen w-full overflow-hidden bg-[#fbfafa] text-[#161310] transition-colors duration-500 dark:bg-[#1e1c1c] dark:text-stone-300 md:block"
    >
      <div className="absolute left-8 top-[112px] z-40">
        <p className="pointer-events-none text-[11px] font-black uppercase tracking-[0.28em] opacity-35">
          Selected Work
        </p>

        <div className="mt-5 flex items-center gap-5">
          <button
            type="button"
            onClick={handlePrev}
            className="text-[22px] font-black cursor-pointer uppercase leading-none tracking-[-0.04em] transition-opacity hover:opacity-55"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="text-[22px] font-black cursor-pointer uppercase leading-none tracking-[-0.04em] transition-opacity hover:opacity-55"
          >
            Next
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 top-[112px] z-40 max-w-[430px] text-right">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] opacity-35">
          {activeProject.category} / {activeProject.year}
        </p>

        <p className="text-[clamp(15px,1.15vw,20px)] leading-[1.02] tracking-[-0.035em] opacity-70">
          {activeProject.about}
        </p>
      </div>

      <div className="absolute inset-0 z-10">
        <Canvas
          dpr={[1, 1.65]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          camera={{
            fov: 43,
            near: 0.1,
            far: 100,
            position: [0, 0, 4.75],
          }}
        >
          <ImageBendScene
            items={items}
            runtimeRef={runtimeRef}
            onActiveProjectChange={setActiveProjectIndex}
            isDark={isDark}
          />

          <Preload all />
        </Canvas>
      </div>

      <div className="absolute bottom-8 left-8 z-40 flex items-center justify-start gap-9">
        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            onClick={() => jumpToProject(index)}
            className={`whitespace-nowrap cursor-pointer text-[clamp(19px,1.55vw,30px)] font-black uppercase leading-none tracking-[-0.055em] transition-all duration-500 ${
              index === activeProjectIndex
                ? "scale-110 opacity-100"
                : "opacity-25 hover:opacity-60"
            }`}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-40 flex flex-col items-end gap-4 text-right">
        <p className="max-w-[360px] text-[12px] font-black uppercase leading-[1.15] tracking-[0.04em] opacity-45">
          {activeProject.role}
        </p>

        <a
          href={activeProject.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[30px] font-black uppercase leading-none tracking-[-0.04em] transition-opacity hover:opacity-55"
        >
          Live Link
        </a>
      </div>
    </div>
  );
}

const ProjectsClient = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    const updateTheme = () => {
      setIsDark(htmlElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SmoothScroll>
      <section className="relative min-h-screen w-full bg-[#fbfafa] text-[#161310] transition-colors duration-500 dark:bg-[#1e1c1c] dark:text-stone-300 md:h-screen">
        <DesktopWorkCarousel
          activeProjectIndex={activeProjectIndex}
          setActiveProjectIndex={setActiveProjectIndex}
          isDark={isDark}
        />

        <div className="px-6 pb-16 pt-28 md:hidden">
          <div>
            <TextReveal
              active
              delay={0.05}
              as="p"
              className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#161310]/45 dark:text-stone-300/45"
            >
              Selected Work
            </TextReveal>

            <TextReveal
              active
              delay={0.1}
              as="h1"
              className="text-4xl font-anton uppercase leading-[0.92] tracking-[-0.01em] text-[#161310] dark:text-stone-200"
            >
              My Work
            </TextReveal>

            <TextReveal
              active
              delay={0.16}
              as="p"
              className="mt-4 text-sm uppercase tracking-[0.18em] text-[#161310]/55 dark:text-stone-300/55"
            >
              Code / Design / Fullstack
            </TextReveal>
          </div>

          <div className="mt-14 flex flex-col gap-16">
            {projects.map((project, i) => (
              <motion.article key={project.title} className="flex flex-col">
                <div>
                  <TextReveal
                    active
                    delay={0.12 + i * 0.06}
                    as="p"
                    className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#161310]/35 dark:text-stone-300/35"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </TextReveal>

                  <TextReveal
                    active
                    delay={0.16 + i * 0.06}
                    as="h2"
                    className="mb-5 text-2xl uppercase cursor-pointer leading-[0.95] tracking-[-0.04em] text-[#161310] dark:text-stone-200"
                  >
                    {project.title}
                  </TextReveal>
                </div>

                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={false}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: TEXT_EASE,
                  }}
                  className="block"
                >
                  <div className="relative h-[260px] w-full border border-[#161310]/20 p-4 dark:border-stone-300/20">
                    <div className="relative h-full w-full">
                      <Image
                        src={`/projects/${project.images[0]}`}
                        alt={project.title}
                        fill
                        sizes="100vw"
                        className="object-contain transition-opacity duration-300 hover:opacity-90"
                        draggable={false}
                      />
                    </div>
                  </div>
                </motion.a>

                <div className="mt-6 border-t border-[#161310]/15 pt-5 dark:border-stone-300/15">
                  <TextReveal
                    active
                    delay={0.22 + i * 0.06}
                    as="p"
                    className="text-sm leading-relaxed text-[#161310]/75 dark:text-stone-300/75"
                  >
                    {project.about}
                  </TextReveal>

                  <div className="mt-5 flex flex-col gap-4 border-t border-[#161310]/15 pt-4 dark:border-stone-300/15">
                    <div>
                      <TextReveal
                        active
                        delay={0.28 + i * 0.06}
                        as="p"
                        className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#161310]/40 dark:text-stone-300/40"
                      >
                        Stack
                      </TextReveal>

                      <TextReveal
                        active
                        delay={0.32 + i * 0.06}
                        as="p"
                        className="text-sm leading-relaxed text-[#161310]/70 dark:text-stone-300/70"
                      >
                        {project.stack}
                      </TextReveal>
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-fit border border-[#161310] px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#161310] dark:border-stone-300 dark:text-stone-300"
                    >
                      <TextReveal active delay={0.36 + i * 0.06} as="span">
                        View Website
                      </TextReveal>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ProjectsClient;
