"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled = false,
  className = "",
}: Props) {
  const isSm = size === "sm";

  return (
    <div
      className={`inline-flex items-center border border-neutral-border rounded-md bg-surface shadow-2xs ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center font-bold text-neutral-dark transition-colors hover:bg-neutral-bg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer ${
          isSm ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
        }`}
      >
        <Minus size={isSm ? 12 : 14} />
      </button>

      <span
        className={`text-center font-sans font-bold text-neutral-dark select-none ${
          isSm ? "w-7 text-xs" : "w-9 text-sm"
        }`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={`flex items-center justify-center font-bold text-neutral-dark transition-colors hover:bg-neutral-bg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer ${
          isSm ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
        }`}
      >
        <Plus size={isSm ? 12 : 14} />
      </button>
    </div>
  );
}
