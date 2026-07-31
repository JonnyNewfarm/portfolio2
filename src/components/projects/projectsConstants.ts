export const TEXT_EASE = [
  0.76,
  0,
  0.24,
  1,
] as const;

export const CAROUSEL_EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

export const carouselMotion = {
  wheelForce: 0.0065,
  dragForce: 0.008,
  inertiaBoost: 2,
  positionEase: 0.09,
  cardEase: 0.085,
  bendFade: 0.94,
  bendLimit: 1.05,
  bendInputScale: 0.11,
  bendEase: 0.08,
} as const;

export const CARD_WIDTH = 2.85;
export const CARD_HEIGHT = 1.62;
export const CARD_GAP = 0.16;

export const CARD_STRIDE =
  CARD_WIDTH + CARD_GAP;