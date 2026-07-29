"use client";

import { Canvas, extend, useFrame } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const PixelImageMaterial = shaderMaterial(
  {
    uImageA: null,
    uImageB: null,
    uProgress: 0,
    uPixelAmount: 20,
    uContainerResolution: new THREE.Vector2(1, 1),
    uImageAResolution: new THREE.Vector2(1, 1),
    uImageBResolution: new THREE.Vector2(1, 1),
  },

  /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      // Tegner planet direkte over hele canvasen.
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,

  /* glsl */ `
    uniform sampler2D uImageA;
    uniform sampler2D uImageB;

    uniform float uProgress;
    uniform float uPixelAmount;

    uniform vec2 uContainerResolution;
    uniform vec2 uImageAResolution;
    uniform vec2 uImageBResolution;

    varying vec2 vUv;

    vec2 coverUv(
      vec2 uv,
      vec2 containerResolution,
      vec2 imageResolution
    ) {
      float containerAspect =
        containerResolution.x / containerResolution.y;

      float imageAspect =
        imageResolution.x / imageResolution.y;

      vec2 scale = vec2(1.0);

      if (containerAspect > imageAspect) {
        scale.y = imageAspect / containerAspect;
      } else {
        scale.x = containerAspect / imageAspect;
      }

      return (uv - 0.5) * scale + 0.5;
    }

    float random(vec2 position) {
      return fract(
        sin(dot(position, vec2(12.9898, 78.233))) *
        43758.5453123
      );
    }

    void main() {
      /*
        0 ved starten og slutten.
        1 midt i overgangen.
      */
      float pixelStrength =
        sin(uProgress * 3.14159265359);

      float columns = mix(
        800.0,
        uPixelAmount,
        pixelStrength
      );

      float aspect =
        uContainerResolution.x /
        uContainerResolution.y;

      vec2 grid = vec2(
        columns,
        columns / aspect
      );

      vec2 pixelUv =
        (floor(vUv * grid) + 0.5) / grid;

      vec2 uvA = coverUv(
        pixelUv,
        uContainerResolution,
        uImageAResolution
      );

      vec2 uvB = coverUv(
        pixelUv,
        uContainerResolution,
        uImageBResolution
      );

      vec4 imageA = texture2D(uImageA, uvA);
      vec4 imageB = texture2D(uImageB, uvB);

      float cellNoise = random(floor(vUv * grid));

      float reveal = smoothstep(
        uProgress - 0.15,
        uProgress + 0.15,
        cellNoise
      );

      /*
        Reveal må reverseres, ellers vises bilde B først.
      */
      vec4 finalColor = mix(
        imageA,
        imageB,
        1.0 - reveal
      );

      gl_FragColor = finalColor;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
);

extend({
  PixelImageMaterial,
});

type PixelMaterialInstance = THREE.ShaderMaterial & {
  uProgress: number;
  uContainerResolution: THREE.Vector2;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    pixelImageMaterial: {
      ref?: React.Ref<PixelMaterialInstance>;
      uImageA?: THREE.Texture;
      uImageB?: THREE.Texture;
      uProgress?: number;
      uPixelAmount?: number;
      uContainerResolution?: THREE.Vector2;
      uImageAResolution?: THREE.Vector2;
      uImageBResolution?: THREE.Vector2;
      toneMapped?: boolean;
    };
  }
}

type PixelPlaneProps = {
  hovered: boolean;
  firstImage: string;
  secondImage: string;
  pixelAmount: number;
  speed: number;
  onLoad?: () => void;
};

function getTextureResolution(texture: THREE.Texture) {
  const image = texture.image as HTMLImageElement | ImageBitmap | undefined;

  return new THREE.Vector2(image?.width || 1, image?.height || 1);
}

function PixelPlane({
  hovered,
  firstImage,
  secondImage,
  pixelAmount,
  speed,
  onLoad,
}: PixelPlaneProps) {
  const materialRef = useRef<PixelMaterialInstance | null>(null);

  const loadedRef = useRef(false);

  const [textureA, textureB] = useTexture([firstImage, secondImage]);

  useEffect(() => {
    [textureA, textureB].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    });

    if (!loadedRef.current) {
      loadedRef.current = true;
      onLoad?.();
    }
  }, [textureA, textureB, onLoad]);

  useFrame(({ size }, delta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    material.uProgress = THREE.MathUtils.damp(
      material.uProgress,
      hovered ? 1 : 0,
      speed,
      delta,
    );

    material.uContainerResolution.set(size.width, size.height);
  });

  return (
    <mesh>
      {/* Clip-space går fra -1 til 1 */}
      <planeGeometry args={[2, 2]} />

      <pixelImageMaterial
        ref={materialRef}
        uImageA={textureA}
        uImageB={textureB}
        uProgress={0}
        uPixelAmount={pixelAmount}
        uContainerResolution={new THREE.Vector2(1, 1)}
        uImageAResolution={getTextureResolution(textureA)}
        uImageBResolution={getTextureResolution(textureB)}
        toneMapped={false}
      />
    </mesh>
  );
}

type PixelHoverImageProps = {
  firstImage?: string;
  secondImage?: string;
  alt?: string;
  className?: string;
  pixelAmount?: number;
  speed?: number;
  onLoad?: () => void;
};

export default function PixelHoverImage({
  firstImage = "/jonas-0003.jpg",
  secondImage = "/jonas-01.jpg",
  alt = "Jonas Nygaard",
  className = "",
  pixelAmount = 18,
  speed = 5,
  onLoad,
}: PixelHoverImageProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="img"
      aria-label={alt}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`
        relative
        h-full
        w-full
        overflow-hidden
        ${className}
      `}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 1],
        }}
      >
        <PixelPlane
          hovered={hovered}
          firstImage={firstImage}
          secondImage={secondImage}
          pixelAmount={pixelAmount}
          speed={speed}
          onLoad={onLoad}
        />
      </Canvas>
    </div>
  );
}

useTexture.preload("/jonas-0003.jpg");
useTexture.preload("/jonas-01.jpg");
