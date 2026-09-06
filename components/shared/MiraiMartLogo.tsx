import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface MiraiMartLogoProps {
  /**
   * - "mark": Isometric 3D "M" monogram vector mark with sunny yellow dot (default)
   * - "full": Isometric vector mark paired with typography
   * - "image": High-resolution raster PNG brand logo asset (`/mirai-mart_logo.png`)
   */
  variant?: "mark" | "full" | "image";
  className?: string;
  size?: number;
  priority?: boolean;
}

/**
 * Mirai Mart Official Brand Logo Component
 *
 * Implements the design tokens:
 * - Sky Blue / Primary: #0A98C3
 * - Primary Light: #71D7F6
 * - Primary Deep / Shadow: #087A9C
 * - Sunny Yellow Dot (Secondary): #FCE35F
 */
export function MiraiMartLogo({
  variant = "mark",
  className,
  size = 28,
  priority = false,
}: MiraiMartLogoProps) {
  if (variant === "image") {
    return (
      <Image
        src="/mirai-mart_logo.png"
        alt="Mirai Mart Logo"
        width={140}
        height={40}
        priority={priority}
        className={cn("h-7 w-auto object-contain select-none", className)}
      />
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 shrink-0"
          aria-hidden="true"
        >
          {/* Left Isometric Column */}
          <polygon points="5,12 11,8.5 16,11.5 10,15" fill="#71D7F6" />
          <polygon points="5,12 10,15 10,27 5,24" fill="#0A98C3" />
          <polygon points="10,15 16,11.5 16,23.5 10,27" fill="#087A9C" />

          {/* Center Valley / Diagonal fold */}
          <polygon points="16,11.5 20,11.5 18,16 14,16" fill="#BEE9FF" />
          <polygon points="14,16 18,16 18,22 14,19" fill="#0A98C3" />

          {/* Right Isometric Column */}
          <polygon points="20,11.5 25,8.5 30,12 25,15" fill="#71D7F6" />
          <polygon points="20,11.5 25,15 25,27 20,23.5" fill="#0A98C3" />
          <polygon points="25,15 30,12 30,24 25,27" fill="#087A9C" />

          {/* Sunny Yellow Accent Dot */}
          <circle cx="28.5" cy="7.5" r="3" fill="#FCE35F" />
          <circle cx="28.5" cy="7.5" r="3" stroke="#FFE680" strokeWidth="0.75" />
        </svg>

        <span className="font-heading font-bold text-xl tracking-tight text-neutral-dark">
          Mirai<span className="text-primary">Mart</span>
        </span>
      </div>
    );
  }

  // Default: Isometric M monogram mark with sunny yellow dot
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto aspect-square shrink-0 select-none", className)}
      aria-label="Mirai Mart Logo"
      role="img"
    >
      {/* Left Isometric Column */}
      <polygon points="5,12 11,8.5 16,11.5 10,15" fill="#71D7F6" />
      <polygon points="5,12 10,15 10,27 5,24" fill="#0A98C3" />
      <polygon points="10,15 16,11.5 16,23.5 10,27" fill="#087A9C" />

      {/* Center Valley / Diagonal fold */}
      <polygon points="16,11.5 20,11.5 18,16 14,16" fill="#BEE9FF" />
      <polygon points="14,16 18,16 18,22 14,19" fill="#0A98C3" />

      {/* Right Isometric Column */}
      <polygon points="20,11.5 25,8.5 30,12 25,15" fill="#71D7F6" />
      <polygon points="20,11.5 25,15 25,27 20,23.5" fill="#0A98C3" />
      <polygon points="25,15 30,12 30,24 25,27" fill="#087A9C" />

      {/* Sunny Yellow Accent Dot */}
      <circle cx="28.5" cy="7.5" r="3" fill="#FCE35F" />
      <circle cx="28.5" cy="7.5" r="3" stroke="#FFE680" strokeWidth="0.75" />
    </svg>
  );
}

export default MiraiMartLogo;
