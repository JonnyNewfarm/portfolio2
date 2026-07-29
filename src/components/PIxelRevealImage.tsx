"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type LiquidLensImageProps = {
  src: string;
  alt: string;
  className?: string;
  radius?: number;
  strength?: number;
  smoothing?: number;
  onReady?: () => void;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  amount: number;
  targetAmount: number;
};

type BulgePlaneProps = {
  src: string;
  radius: number;
  strength: number;
  smoothing: number;
  pointerRef: MutableRefObject<PointerState>;
  onReady?: () => void;
};

/*
 * Canvaset er 30 % større enn bildeområdet.
 * Plane-meshet skaleres tilbake slik at selve bildet
 * fyller den opprinnelige HTML-wrapperen nøyaktig.
 */
const OVERSCAN = 1.3;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  uniform vec2 uPointer;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uImageAspect;

  void main() {
    vUv = uv;

    vec3 transformed = position;

    vec2 offset = uv - uPointer;

    /*
     * Korriger avstanden slik at bulgen blir sirkulær
     * på både stående og liggende bilder.
     */
    vec2 correctedOffset = vec2(
      offset.x * uImageAspect,
      offset.y
    );

    float distanceToPointer = length(correctedOffset);

    float influence = 1.0 - smoothstep(
      0.0,
      max(uRadius, 0.0001),
      distanceToPointer
    );

    /*
     * Myk overgang.
     */
    influence = influence * influence;
    influence = influence * (3.0 - 2.0 * influence);

    vec2 direction = vec2(0.0);

    if (distanceToPointer > 0.0001) {
      direction = normalize(correctedOffset);
      direction.x /= max(uImageAspect, 0.0001);
    }

    /*
     * Deformer selve geometrien.
     * Derfor bøyes også ytterkantene på bildet.
     */
    float displacement = influence * uStrength;

    transformed.x += direction.x * displacement;
    transformed.y += direction.y * displacement;

    /*
     * Svak Z-bulge for mer naturlig gummifølelse.
     */
    transformed.z += influence * abs(uStrength) * 0.35;

    gl_Position = projectionMatrix
      * modelViewMatrix
      * vec4(transformed, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    vec4 textureColor = texture2D(uTexture, vUv);

    /*
     * Ingen tint, blur, brightness, contrast eller RGB-effekt.
     */
    gl_FragColor = textureColor;

    #include <colorspace_fragment>
  }
`;

function BulgePlane({
  src,
  radius,
  strength,
  smoothing,
  pointerRef,
  onReady,
}: BulgePlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const readyCalledRef = useRef(false);

  const texture = useLoader(THREE.TextureLoader, src);

  const { viewport } = useThree();

  const imageAspect = useMemo(() => {
    const image = texture.image as HTMLImageElement | ImageBitmap | undefined;

    if (!image || !image.width || !image.height) {
      return 1;
    }

    return image.width / image.height;
  }, [texture]);

  /*
   * Canvaset er større enn den synlige bilde-wrapperen.
   * Derfor deler vi viewporten på OVERSCAN for at bildet
   * fortsatt skal fylle wrapperen nøyaktig.
   */
  const planeWidth = viewport.width / OVERSCAN;
  const planeHeight = viewport.height / OVERSCAN;

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    if (!readyCalledRef.current) {
      readyCalledRef.current = true;
      onReady?.();
    }
  }, [texture, onReady]);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uPointer: {
        value: new THREE.Vector2(0.5, 0.5),
      },

      uRadius: {
        value: radius,
      },

      uStrength: {
        value: 0,
      },

      uImageAspect: {
        value: imageAspect,
      },
    }),
    [texture, radius, imageAspect],
  );

  useEffect(() => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    material.uniforms.uRadius.value = radius;
    material.uniforms.uImageAspect.value = imageAspect;
  }, [radius, imageAspect]);

  useFrame(() => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const pointer = pointerRef.current;

    pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, smoothing);

    pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, smoothing);

    pointer.amount = THREE.MathUtils.lerp(
      pointer.amount,
      pointer.targetAmount,
      smoothing,
    );

    material.uniforms.uPointer.value.set(pointer.x, pointer.y);

    material.uniforms.uRadius.value = radius;

    /*
     * Styrken skaleres mot den faktiske størrelsen på plane-meshet.
     */
    const baseSize = Math.min(planeWidth, planeHeight);

    material.uniforms.uStrength.value =
      pointer.amount * strength * baseSize * 0.12;
  });

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight, 96, 120]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiquidLensImage({
  src,
  alt,
  className = "",
  radius = 0.4,
  strength = 0.9,
  smoothing = 0.15,
  onReady,
}: LiquidLensImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loaded, setLoaded] = useState(false);

  const pointerRef = useRef<PointerState>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    amount: 0,
    targetAmount: 0,
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const x = (clientX - bounds.left) / bounds.width;

      const y = (clientY - bounds.top) / bounds.height;

      pointerRef.current.targetX = THREE.MathUtils.clamp(x, 0, 1);

      /*
       * DOM starter øverst.
       * WebGL UV starter nederst.
       */
      pointerRef.current.targetY = THREE.MathUtils.clamp(1 - y, 0, 1);

      pointerRef.current.targetAmount = 1;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      pointerRef.current.targetAmount = 0;
    };

    container.addEventListener("pointerenter", handlePointerEnter);

    container.addEventListener("pointermove", handlePointerMove);

    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointerenter", handlePointerEnter);

      container.removeEventListener("pointermove", handlePointerMove);

      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`
        relative
        isolate
        overflow-visible
        ${className}
      `}
    >
      {/*
       * Canvaset er større bare for å gi plass til bøyde kanter.
       * Det visuelle bildet fyller fortsatt wrapperen 100 %.
       *
       * Ingen border.
       * Ingen bakgrunn.
       * Ingen padding.
       * Ingen border-radius.
       */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[130%]
          w-[130%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <Canvas
          orthographic
          dpr={[1, 1.5]}
          camera={{
            position: [0, 0, 5],
            zoom: 100,
            near: 0.1,
            far: 20,
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
          }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;

            gl.toneMapping = THREE.NoToneMapping;

            gl.toneMappingExposure = 1;

            gl.setClearColor(new THREE.Color(0x000000), 0);
          }}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: "transparent",
            opacity: loaded ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        >
          <BulgePlane
            src={src}
            radius={radius}
            strength={strength}
            smoothing={smoothing}
            pointerRef={pointerRef}
            onReady={() => {
              setLoaded(true);
              onReady?.();
            }}
          />
        </Canvas>
      </div>
    </div>
  );
}
