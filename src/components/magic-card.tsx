"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientOpacity = 0.5,
  gradientFrom = "hsl(230 51% 41% / 0.25)",
  gradientTo = "hsl(230 51% 41% / 0.05)",
}: MagicCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-4",
        className
      )}
      initial={false}
      whileHover="hover"
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${gradientSize}px circle at var(--mouse-x) var(--mouse-y), ${gradientFrom}, ${gradientTo})`,
        }}
        variants={{
          hover: { opacity: gradientOpacity },
        }}
      />
      <div className="absolute inset-px rounded-[inherit] bg-card" />
    </motion.div>
  );
}
