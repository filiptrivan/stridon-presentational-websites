import { animate, useInView, useMotionValue } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

/**
 * Animates a number from 0 to a target value when the element enters the viewport.
 *
 * Until then it returns the target itself, so the server HTML and a visitor
 * without JavaScript get the real figure rather than "0". The count from 0
 * starts in the same frame the stats band fades in, so the jump is not seen.
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
  const mv = useMotionValue(target);
  const isInView = useInView(ref, { once: true });

  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!isInView) return;

    const unsub = mv.on("change", (v) => {
      setValue(Math.round(v));
    });

    const controls = animate(mv, [0, target], { duration: duration ?? 0.8 });

    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, target, mv, duration]);

  return value;
}
