import Lenis from "lenis";

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => 1 - Math.pow(1 - t, 4),
  smoothWheel: true,
};

let sharedLenis: Lenis | null = null;
let animationFrameId: number | null = null;
let consumerCount = 0;

function raf(time: number): void {
  if (!sharedLenis || consumerCount === 0) {
    animationFrameId = null;
    return;
  }

  sharedLenis.raf(time);
  animationFrameId = window.requestAnimationFrame(raf);
}

/**
 * Acquire the app-wide Lenis instance. The instance and its RAF loop are
 * shared so mounting multiple smooth-scroll consumers can never create
 * competing Lenis instances or animation loops.
 */
export function acquireLenis(): {
  instance: Lenis;
  release: () => void;
} {
  if (!sharedLenis) {
    sharedLenis = new Lenis(lenisOptions);
  }

  consumerCount += 1;

  if (animationFrameId === null) {
    animationFrameId = window.requestAnimationFrame(raf);
  }

  let released = false;

  return {
    instance: sharedLenis,
    release: () => {
      if (released) return;
      released = true;
      consumerCount = Math.max(0, consumerCount - 1);

      if (consumerCount === 0 && animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // Lenis attaches input listeners when constructed. Destroy the idle
      // instance so routes without a smooth-scroll consumer keep native scroll.
      if (consumerCount === 0 && sharedLenis) {
        sharedLenis.destroy();
        sharedLenis = null;
      }
    },
  };
}
