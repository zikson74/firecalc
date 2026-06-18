"use client";

import { useSpring, useTransform, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  formatter: (n: number) => string;
  className?: string;
}

export function AnimatedCounter({ value, formatter, className }: AnimatedCounterProps) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20, mass: 0.5 });
  const display = useTransform(spring, (v) => formatter(Math.round(v)));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
