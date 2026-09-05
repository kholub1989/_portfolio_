import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fades/slides/scales `targets` up into their resting state - either once
 * `trigger` (defaults to `targets`) scrolls into view, or immediately when
 * `trigger` is explicitly `false`. Replaces the old scrub-linked reveals,
 * which tied opacity directly to a few pixels of scroll and made items
 * flicker in and out instead of settling into place. Snaps straight to the
 * resting state when the visitor prefers reduced motion.
 */
export function revealOnScroll(targets, options = {}) {
  const {
    from = {},
    trigger,
    start = "top 85%",
    stagger = 0,
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
  } = options;

  if (!targets || (Array.isArray(targets) && targets.length === 0)) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1 });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, x: 0, y: 0, scale: 1, ...from },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger:
        trigger === false
          ? undefined
          : { trigger: trigger || targets, start, once: true },
    }
  );
}
