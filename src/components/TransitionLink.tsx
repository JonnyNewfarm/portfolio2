"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import {
  useVerticalPageTransition,
  type TransitionLabelInput,
} from "./VerticalTransitionWrapper";

interface VerticalTransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  className?: string;

  /**
   * Old single-label fallback.
   * Keeps working like before.
   */
  transitionLabel?: string;

  /**
   * New morph labels.
   * These should have the same number of characters.
   *
   * Example:
   * transitionFromLabel="Project"
   * transitionToLabel="Gallery"
   */
  transitionFromLabel?: string;
  transitionToLabel?: string;
}

export default function VerticalTransitionLink({
  href,
  children,
  className,
  target,
  onClick,
  transitionLabel,
  transitionFromLabel,
  transitionToLabel,
  ...props
}: VerticalTransitionLinkProps) {
  const { startTransition, isTransitioning } = useVerticalPageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    const isNewTab =
      target === "_blank" ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    const isAnchorOnly = href.startsWith("#");

    if (isExternal || isNewTab || isAnchorOnly) return;

    event.preventDefault();

    if (!isTransitioning) {
      const hasMorphLabels = transitionFromLabel || transitionToLabel;

      const labelInput: TransitionLabelInput | undefined = hasMorphLabels
        ? {
            from: transitionFromLabel ?? transitionLabel,
            to: transitionToLabel ?? transitionLabel,
          }
        : transitionLabel;

      startTransition(href, labelInput);
    }
  };

  return (
    <Link
      href={href}
      target={target}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
