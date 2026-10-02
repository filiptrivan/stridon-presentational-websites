"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleUp";
  delay?: number;
}

const getAnimationVariants = (animation: string) => {
  switch (animation) {
    case "fadeUp":
      return { opacity: 0, y: 20 };
    case "fadeDown":
      return { opacity: 0, y: -20 };
    case "fadeLeft":
      return { opacity: 0, x: -20 };
    case "fadeRight":
      return { opacity: 0, x: 20 };
    case "scaleUp":
      return { opacity: 0, scale: 0.95 };
    default:
      return { opacity: 0, y: 20 };
  }
};

const Container = ({
  children,
  className,
  animation = "fadeUp",
  delay = 0,
}: Props) => {
  return (
    // framer-motion writes `initial` into the server HTML as an inline style,
    // so without JavaScript this would stay invisible forever. `data-reveal`
    // is what the <noscript> stylesheet in root-layout.tsx overrides.
    <motion.div
      data-reveal
      className={className}
      initial={getAnimationVariants(animation)}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.2,
        delay: delay * 0.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default Container;
