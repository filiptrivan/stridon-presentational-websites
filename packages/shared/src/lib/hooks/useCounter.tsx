import { animate, useInView, useMotionValue } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

/**
 * Animates a number from 0 to a target value when the element enters the viewport.
 *
 * Uses motion values and viewport detection from Framer Motion.
 *
 * @param ref - React ref attached to the element that should trigger the animation when visible.
 * @param target - The final number the counter should animate to.
 * @param duration - Animation duration in seconds (default: 0.8).
 *
 * @returns The current animated number (rounded) that can be rendered in the UI.
 *
 * @example
 * const ref = useRef(null);
 * const users = useCounter(ref, 1000);
 *
 * return (
 *   <div ref={ref}>
 *     <span>{users}</span>
 *   </div>
 * );
 */

export function useCounter(
  ref: React.RefObject<HTMLElement> | RefObject<null>,
  target: number,
  duration?: number,
) {
  const mv = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(mv, target, { duration: duration ?? 0.8 });

    const unsub = mv.on("change", (v) => {
      setValue(Math.round(v));
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, target, mv, duration]);

  return value;
}
