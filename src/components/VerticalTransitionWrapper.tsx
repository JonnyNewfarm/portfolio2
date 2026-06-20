"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type TransitionStatus = "idle" | "entering" | "leaving";

export type TransitionLabelPair = {
  from?: string;
  to?: string;
};

export type TransitionLabelInput = string | TransitionLabelPair;

type ResolvedTransitionLabels = {
  from: string;
  to: string;
};

type VerticalPageTransitionContextType = {
  startTransition: (href: string, labels?: TransitionLabelInput) => void;
  isTransitioning: boolean;
};

const VerticalPageTransitionContext =
  createContext<VerticalPageTransitionContextType | null>(null);

export function useVerticalPageTransition() {
  const context = useContext(VerticalPageTransitionContext);

  if (!context) {
    throw new Error(
      "useVerticalPageTransition must be used inside VerticalPageTransitionWrapper",
    );
  }

  return context;
}

interface VerticalPageTransitionWrapperProps {
  children: ReactNode;
}

/**
 * Timing flow:
 * 1. Panel slides up
 * 2. Small pause
 * 3. Letters switch smoothly
 * 4. Route changes
 * 5. Whole panel slides up and away with the word
 */
const ENTER_DURATION = 2300;
const LEAVE_DURATION = 950;

const PANEL_ENTER_DURATION = 1.05;
const PANEL_LEAVE_DURATION = 0.95;

const TEXT_MORPH_DELAY = 0.98;
const TEXT_MORPH_DURATION = 0.9;
const TEXT_STAGGER_WINDOW = 0.26;

const transitionEase = [0.76, 0, 0.24, 1] as const;
const softEase = [0.83, 0, 0.17, 1] as const;
const letterEase = [0.65, 0, 0.35, 1] as const;

function formatRouteLabel(href: string) {
  if (href === "/") return "Home";

  const cleanHref = href.split("?")[0].split("#")[0];
  const lastSegment = cleanHref.split("/").filter(Boolean).at(-1);

  if (!lastSegment) return "Loading";

  return lastSegment
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanLabel(label?: string) {
  return label?.replace(/\s+/g, " ").trim();
}

function equalizeLabels(fromLabel: string, toLabel: string) {
  const fromLetters = Array.from(fromLabel);
  const toLetters = Array.from(toLabel);

  if (fromLetters.length === 0 && toLetters.length === 0) {
    return {
      from: "Loading",
      to: "Loading",
    };
  }

  if (fromLetters.length !== toLetters.length) {
    const maxLength = Math.max(fromLetters.length, toLetters.length);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[VerticalPageTransition] transitionFromLabel and transitionToLabel should have the same number of characters. Received "${fromLabel}" (${fromLetters.length}) and "${toLabel}" (${toLetters.length}). The shorter label will be padded with spaces.`,
      );
    }

    while (fromLetters.length < maxLength) {
      fromLetters.push(" ");
    }

    while (toLetters.length < maxLength) {
      toLetters.push(" ");
    }
  }

  return {
    from: fromLetters.join(""),
    to: toLetters.join(""),
  };
}

function resolveTransitionLabels(
  href: string,
  labels?: TransitionLabelInput,
): ResolvedTransitionLabels {
  const routeLabel = formatRouteLabel(href);

  if (typeof labels === "string") {
    const label = cleanLabel(labels) || routeLabel;

    return equalizeLabels(label, label);
  }

  const fromLabel = cleanLabel(labels?.from);
  const toLabel = cleanLabel(labels?.to);

  const resolvedFrom = fromLabel || toLabel || routeLabel;
  const resolvedTo = toLabel || fromLabel || routeLabel;

  return equalizeLabels(resolvedFrom, resolvedTo);
}

function displayLetter(letter: string) {
  return letter === " " ? "\u00A0" : letter;
}

function TransitionText({ labels }: { labels: ResolvedTransitionLabels }) {
  const letters = useMemo(() => {
    const fromLetters = Array.from(labels.from);
    const toLetters = Array.from(labels.to);
    const length = Math.max(fromLetters.length, toLetters.length);

    return Array.from({ length }, (_, index) => {
      return {
        from: fromLetters[index] ?? " ",
        to: toLetters[index] ?? " ",
        direction: index % 2 === 0 ? "up" : "down",
      };
    });
  }, [labels.from, labels.to]);

  const labelLength = Math.max(letters.length, 1);

  const fontVw = Math.min(
    12,
    Math.max(4.2, 105 / Math.max(labelLength * 0.9, 8)),
  );

  const morphStagger =
    letters.length > 1 ? TEXT_STAGGER_WINDOW / (letters.length - 1) : 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5 md:px-10">
      <h2
        aria-label={labels.to}
        className="page-transition-font m-0 font-anton flex max-w-[94vw] -translate-y-[0.03em] whitespace-nowrap text-center uppercase leading-[1.05]"
        style={{
          fontSize: `clamp(42px, ${fontVw}vw, 220px)`,
        }}
      >
        {letters.map((letter, index) => {
          const slideUp = letter.direction === "up";

          const fromExitY = slideUp ? "-105%" : "105%";
          const toStartY = slideUp ? "105%" : "-105%";

          const delay = TEXT_MORPH_DELAY + index * morphStagger;

          return (
            <span
              key={`${letter.from}-${letter.to}-${index}`}
              aria-hidden="true"
              className="relative inline-grid h-[1.15em] overflow-hidden px-[0.012em] align-middle leading-none"
            >
              <span className="invisible col-start-1 row-start-1 inline-block leading-none">
                {displayLetter(letter.from)}
              </span>

              <span className="invisible col-start-1 row-start-1 inline-block leading-none">
                {displayLetter(letter.to)}
              </span>

              <motion.span
                className="col-start-1 row-start-1 inline-block justify-self-center leading-none will-change-transform"
                initial={{
                  y: "0%",
                }}
                animate={{
                  y: fromExitY,
                }}
                transition={{
                  duration: TEXT_MORPH_DURATION,
                  delay,
                  ease: letterEase,
                }}
              >
                {displayLetter(letter.from)}
              </motion.span>

              <motion.span
                className="col-start-1 row-start-1 inline-block justify-self-center leading-none will-change-transform"
                initial={{
                  y: toStartY,
                }}
                animate={{
                  y: "0%",
                }}
                transition={{
                  duration: TEXT_MORPH_DURATION,
                  delay,
                  ease: letterEase,
                }}
              >
                {displayLetter(letter.to)}
              </motion.span>
            </span>
          );
        })}
      </h2>
    </div>
  );
}

export default function VerticalPageTransitionWrapper({
  children,
}: VerticalPageTransitionWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [transitionLabels, setTransitionLabels] =
    useState<ResolvedTransitionLabels>({
      from: "",
      to: "",
    });

  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTransition = (href: string, labels?: TransitionLabelInput) => {
    if (!href || href === pathname || status !== "idle") return;

    if (shouldReduceMotion) {
      router.push(href);
      return;
    }

    clearCurrentTimeout();

    setPendingHref(href);
    setTransitionLabels(resolveTransitionLabels(href, labels));
    setStatus("entering");

    timeoutRef.current = setTimeout(() => {
      router.push(href);
    }, ENTER_DURATION);
  };

  useEffect(() => {
    if (pathname === previousPathname.current) return;

    previousPathname.current = pathname;

    if (!pendingHref) return;

    clearCurrentTimeout();

    setStatus("leaving");

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      setPendingHref(null);
      setTransitionLabels({
        from: "",
        to: "",
      });
    }, LEAVE_DURATION);
  }, [pathname, pendingHref]);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, []);

  const isTransitioning = status !== "idle";

  return (
    <VerticalPageTransitionContext.Provider
      value={{
        startTransition,
        isTransitioning,
      }}
    >
      {children}

      <AnimatePresence mode="wait">
        {isTransitioning && !shouldReduceMotion && (
          <motion.div
            key="vertical-page-transition"
            className="
              fixed inset-0 z-[99999] pointer-events-none overflow-hidden
              bg-[#1e1c1c] text-stone-300
              dark:bg-[#fbfafa] dark:text-[#161310]
            "
            initial={{
              y: "100%",
            }}
            animate={{
              y: status === "entering" ? "0%" : "-100%",
            }}
            exit={{
              y: "-100%",
            }}
            transition={{
              y: {
                duration:
                  status === "entering"
                    ? PANEL_ENTER_DURATION
                    : PANEL_LEAVE_DURATION,
                ease: status === "entering" ? transitionEase : softEase,
              },
            }}
          >
            <TransitionText labels={transitionLabels} />
          </motion.div>
        )}
      </AnimatePresence>
    </VerticalPageTransitionContext.Provider>
  );
}
