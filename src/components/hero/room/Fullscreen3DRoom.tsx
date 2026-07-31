import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import RoomCanvas from "./RoomCanvas";
import RoomFocusButton from "./RoomFocusButton";
import RoomOverlayUI from "./RoomOverlayUI";
import RoomProgressControls from "./RoomProgressControls";

import {
  CAMERA_STOP_PROGRESS,
  ROOM_PROGRESS_STEP,
  roomOverlayEase,
} from "./roomConstants";

type Fullscreen3DRoomProps = {
  onCloseAction: () => void;
};

export default function Fullscreen3DRoom({
  onCloseAction,
}: Fullscreen3DRoomProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  const isAtEndRef = useRef(false);

  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [isAtEnd, setIsAtEnd] = useState(false);

  const [monitorFocused, setMonitorFocused] = useState(false);

  const [roomProgress, setRoomProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const moveToProgress = useCallback((nextProgress: number) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const clampedProgress = THREE.MathUtils.clamp(nextProgress, 0, 1);

    const maxScroll = container.scrollHeight - container.clientHeight;

    if (maxScroll <= 0) {
      return;
    }

    container.scrollTop = maxScroll * clampedProgress;
  }, []);

  const moveProgressBy = useCallback(
    (amount: number) => {
      const container = scrollContainerRef.current;

      if (!container) {
        return;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (maxScroll <= 0) {
        return;
      }

      const currentProgress = container.scrollTop / maxScroll;

      moveToProgress(currentProgress + amount);
    },
    [moveToProgress],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const safeProgress = THREE.MathUtils.clamp(latest, 0, 1);

    setRoomProgress(safeProgress);

    const nextIsAtEnd = safeProgress >= CAMERA_STOP_PROGRESS;

    if (nextIsAtEnd === isAtEndRef.current) {
      return;
    }

    isAtEndRef.current = nextIsAtEnd;
    setIsAtEnd(nextIsAtEnd);
  });

  const handleSceneReady = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setSceneLoaded(true);
      });
    });
  }, []);

  const toggleMonitorFocus = useCallback(() => {
    setMonitorFocused((current) => !current);
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";

    document.documentElement.style.overflow = "hidden";

    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = 0;

      scrollContainer.focus({
        preventScroll: true,
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isRangeInput =
        activeElement instanceof HTMLInputElement &&
        activeElement.type === "range";

      if (event.key === "Escape") {
        if (monitorFocused) {
          setMonitorFocused(false);
          return;
        }

        onCloseAction();
        return;
      }

      if (isRangeInput || monitorFocused) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();

        moveProgressBy(ROOM_PROGRESS_STEP);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();

        moveProgressBy(-ROOM_PROGRESS_STEP);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveToProgress(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        moveToProgress(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [monitorFocused, moveProgressBy, moveToProgress, onCloseAction]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const container = scrollContainerRef.current;

      if (!container || monitorFocused) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      container.scrollTop -= event.deltaY;
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, {
        capture: true,
      });
    };
  }, [monitorFocused]);

  const showFocusButton = isAtEnd || monitorFocused;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="3D room"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
        ease: roomOverlayEase,
      }}
      className="
        fixed
        inset-0
        z-[9999]
        overflow-hidden
        bg-[#c6c0c0]
        text-black
        dark:bg-[#757474]
        dark:text-stone-300
      "
    >
      <div
        ref={scrollContainerRef}
        tabIndex={-1}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="
          room-scroll
          absolute
          inset-0
          z-0
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          touch-pan-y
          outline-none
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <section
          ref={sectionRef}
          className="
            relative
            h-[178dvh]
            bg-[#c6c0c0]
            text-black
            dark:bg-[#757474]
            dark:text-stone-300
            md:h-[158dvh]
          "
        >
          <div
            className="
              sticky
              top-0
              h-dvh
              overflow-hidden
            "
          >
            <RoomCanvas
              sceneLoaded={sceneLoaded}
              scrollYProgress={scrollYProgress}
              monitorFocused={monitorFocused}
              onReadyAction={handleSceneReady}
            />

            <RoomProgressControls
              visible={sceneLoaded && !monitorFocused}
              progress={roomProgress}
              onChangeAction={moveToProgress}
              onStepAction={moveProgressBy}
            />

            <RoomFocusButton
              visible={showFocusButton}
              focused={monitorFocused}
              onToggleAction={toggleMonitorFocus}
            />
          </div>
        </section>
      </div>

      <RoomOverlayUI sceneLoaded={sceneLoaded} onCloseAction={onCloseAction} />
    </motion.div>
  );
}
