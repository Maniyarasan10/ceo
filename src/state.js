// Shared, non-reactive runtime state read by animation loops (no React re-renders).
export const state = {
  mx: 0, my: 0,        // pointer, px
  nx: 0, ny: 0,        // pointer, -1..1
  speed: 0,            // smoothed pointer speed, px/frame
  scrollVel: 0,        // Lenis / scroll velocity
  touch: typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches,
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
