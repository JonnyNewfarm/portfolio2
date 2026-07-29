"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type PixelRevealImageProps = {
  src: string;
  alt: string;

  /**
   * Tailwind-klasser for wrapperen.
   * Wrapperen må ha bredde/høyde eller aspect-ratio.
   */
  className?: string;

  /**
   * Samme funksjon som object-position.
   *
   * Eksempler:
   * "center top"
   * "center center"
   * "50% 30%"
   */
  objectPosition?: string;

  /**
   * Next/Image sizes.
   */
  sizes?: string;

  /**
   * Total animasjonslengde i millisekunder.
   */
  duration?: number;

  /**
   * Størrelsen på dissolve-rutene.
   */
  tileSize?: number;

  /**
   * Maks devicePixelRatio.
   * 2 gir skarpt bilde uten å bli unødvendig tungt.
   */
  maxDpr?: number;

  /**
   * Kalles når bildet er lastet og canvasen er klar.
   */
  onReady?: () => void;
};

export default function PixelRevealImage({
  src,
  alt,
  className = "",
  objectPosition = "center top",
  sizes = "100vw",
  duration = 1850,
  tileSize = 14,
  maxDpr = 2,
  onReady,
}: PixelRevealImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const startFrameRef = useRef<number | null>(null);

  const hasStartedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (startFrameRef.current !== null) {
        window.cancelAnimationFrame(startFrameRef.current);
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startPixelReveal = useCallback(
    (image: HTMLImageElement) => {
      if (hasStartedRef.current) {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) {
        onReady?.();
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      startFrameRef.current = window.requestAnimationFrame(() => {
        const context = canvas.getContext("2d");

        if (!context) {
          onReady?.();
          return;
        }

        const rect = canvas.getBoundingClientRect();

        const displayWidth = Math.max(1, Math.round(rect.width));

        const displayHeight = Math.max(1, Math.round(rect.height));

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        if (
          !image.complete ||
          imageWidth <= 0 ||
          imageHeight <= 0 ||
          displayWidth <= 0 ||
          displayHeight <= 0
        ) {
          onReady?.();
          return;
        }

        hasStartedRef.current = true;
        onReady?.();

        const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

        const renderWidth = Math.max(1, Math.round(displayWidth * dpr));

        const renderHeight = Math.max(1, Math.round(displayHeight * dpr));

        canvas.width = renderWidth;
        canvas.height = renderHeight;

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        const coverCanvas = document.createElement("canvas");
        const coverContext = coverCanvas.getContext("2d");

        const pixelCanvas = document.createElement("canvas");
        const pixelContext = pixelCanvas.getContext("2d");

        if (!coverContext || !pixelContext) {
          return;
        }

        coverCanvas.width = renderWidth;
        coverCanvas.height = renderHeight;

        const coverScale = Math.max(
          renderWidth / imageWidth,
          renderHeight / imageHeight,
        );

        const renderedImageWidth = imageWidth * coverScale;

        const renderedImageHeight = imageHeight * coverScale;

        const parsedPosition = parseObjectPosition(objectPosition);

        const remainingX = renderWidth - renderedImageWidth;

        const remainingY = renderHeight - renderedImageHeight;

        const offsetX = remainingX * parsedPosition.x;

        const offsetY = remainingY * parsedPosition.y;

        coverContext.clearRect(0, 0, renderWidth, renderHeight);

        coverContext.imageSmoothingEnabled = true;
        coverContext.imageSmoothingQuality = "high";

        coverContext.drawImage(
          image,
          offsetX,
          offsetY,
          renderedImageWidth,
          renderedImageHeight,
        );

        if (prefersReducedMotion) {
          context.clearRect(0, 0, renderWidth, renderHeight);

          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";

          context.drawImage(coverCanvas, 0, 0, renderWidth, renderHeight);

          return;
        }

        const pixelSteps = [
          52, 44, 37, 31, 26, 21, 17, 14, 11, 9, 7, 5, 4, 3, 2, 1,
        ];

        const revealDuration = 0.72;
        const startTime = window.performance.now();

        const easeOutCubic = (value: number) => {
          return 1 - Math.pow(1 - value, 3);
        };

        const getNoise = (x: number, y: number) => {
          const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;

          return value - Math.floor(value);
        };

        const renderFrame = (currentTime: number) => {
          if (!canvasRef.current || canvasRef.current !== canvas) {
            return;
          }

          const elapsed = currentTime - startTime;

          const progress = Math.min(Math.max(elapsed / duration, 0), 1);

          const easedProgress = easeOutCubic(progress);

          const stepIndex = Math.min(
            pixelSteps.length - 1,
            Math.max(0, Math.floor(easedProgress * pixelSteps.length)),
          );

          const currentPixelSize = (pixelSteps[stepIndex] ?? 1) * dpr;

          const reducedWidth = Math.max(
            1,
            Math.ceil(renderWidth / currentPixelSize),
          );

          const reducedHeight = Math.max(
            1,
            Math.ceil(renderHeight / currentPixelSize),
          );

          if (pixelCanvas.width !== reducedWidth) {
            pixelCanvas.width = reducedWidth;
          }

          if (pixelCanvas.height !== reducedHeight) {
            pixelCanvas.height = reducedHeight;
          }

          if (pixelCanvas.width <= 0 || pixelCanvas.height <= 0) {
            animationFrameRef.current =
              window.requestAnimationFrame(renderFrame);

            return;
          }

          pixelContext.clearRect(0, 0, reducedWidth, reducedHeight);

          pixelContext.imageSmoothingEnabled = true;
          pixelContext.imageSmoothingQuality = "high";

          pixelContext.drawImage(
            coverCanvas,
            0,
            0,
            renderWidth,
            renderHeight,
            0,
            0,
            reducedWidth,
            reducedHeight,
          );

          context.clearRect(0, 0, renderWidth, renderHeight);

          context.imageSmoothingEnabled = false;

          context.drawImage(
            pixelCanvas,
            0,
            0,
            reducedWidth,
            reducedHeight,
            0,
            0,
            renderWidth,
            renderHeight,
          );

          const revealProgress = Math.min(
            Math.max(progress / revealDuration, 0),
            1,
          );

          if (revealProgress < 1) {
            const renderedTileSize = Math.max(1, Math.round(tileSize * dpr));

            for (let y = 0; y < renderHeight; y += renderedTileSize) {
              for (let x = 0; x < renderWidth; x += renderedTileSize) {
                const tileX = Math.floor(x / renderedTileSize);

                const tileY = Math.floor(y / renderedTileSize);

                const noise = getNoise(tileX, tileY);

                const verticalBias = (y / renderHeight) * 0.12;

                const threshold = Math.min(1, noise * 0.88 + verticalBias);

                if (revealProgress < threshold) {
                  context.clearRect(
                    x,
                    y,
                    renderedTileSize + 1,
                    renderedTileSize + 1,
                  );
                }
              }
            }
          }

          if (progress < 1) {
            animationFrameRef.current =
              window.requestAnimationFrame(renderFrame);

            return;
          }

          context.clearRect(0, 0, renderWidth, renderHeight);

          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";

          context.drawImage(coverCanvas, 0, 0, renderWidth, renderHeight);

          animationFrameRef.current = null;
        };

        animationFrameRef.current = window.requestAnimationFrame(renderFrame);
      });
    },
    [duration, maxDpr, objectPosition, onReady, tileSize],
  );

  return (
    <div
      className={`
        relative
        overflow-hidden
        ${className}
      `}
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        aria-hidden
        sizes={sizes}
        onLoad={(event) => {
          startPixelReveal(event.currentTarget);
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
        "
      />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className="
          absolute
          inset-0
          block
          h-full
          w-full
          [image-rendering:auto]
        "
      />
    </div>
  );
}

function parseObjectPosition(position: string) {
  const values = position.trim().toLowerCase().split(/\s+/);

  const first = values[0] ?? "center";
  const second = values[1];

  let horizontal = 0.5;
  let vertical = 0.5;

  const parseValue = (value: string | undefined, axis: "x" | "y") => {
    if (!value) {
      return 0.5;
    }

    if (value === "left") return 0;
    if (value === "right") return 1;
    if (value === "top") return 0;
    if (value === "bottom") return 1;
    if (value === "center") return 0.5;

    if (value.endsWith("%")) {
      const percentage = Number.parseFloat(value) / 100;

      if (Number.isFinite(percentage)) {
        return Math.min(1, Math.max(0, percentage));
      }
    }

    return axis === "x" ? 0.5 : 0.5;
  };

  if (!second) {
    if (first === "top" || first === "bottom") {
      vertical = parseValue(first, "y");
    } else {
      horizontal = parseValue(first, "x");
    }
  } else {
    horizontal = parseValue(first, "x");
    vertical = parseValue(second, "y");
  }

  return {
    x: horizontal,
    y: vertical,
  };
}
