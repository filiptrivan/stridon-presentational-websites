"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HeroDecorations = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -80, rotate: 118 }}
        animate={{ opacity: 1, x: 0, rotate: 130 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="absolute -left-30 -top-52 lg:-left-40 lg:-top-120"
      >
        <Image
          src="/klešta.png"
          alt=""
          aria-hidden="true"
          width={900}
          height={900}
          className="w-40 opacity-20 lg:w-83 lg:opacity-70"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 80, rotate: -118 }}
        animate={{ opacity: 1, x: 0, rotate: -130 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
        className="absolute -right-45 -top-85 lg:-right-80 lg:-top-187"
      >
        <Image
          src="/ključ.png"
          alt=""
          aria-hidden="true"
          width={280}
          height={280}
          className="w-30 opacity-20 lg:w-62 lg:opacity-70"
        />
      </motion.div>
    </div>
  );
};

export default HeroDecorations;
