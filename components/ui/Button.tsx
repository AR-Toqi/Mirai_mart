import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: Props) {
  const variantStyles = {
    primary:
      "bg-primary text-white hover:opacity-95 font-medium shadow-sm active:scale-[0.99]",
    secondary:
      "bg-primary-surface text-tertiary hover:bg-primary-surface/80 font-medium active:scale-[0.99]",
    accent:
      "bg-secondary text-neutral-dark hover:bg-secondary-light font-bold shadow-sm active:scale-[0.99]",
    outline:
      "bg-transparent border border-neutral-border text-neutral-dark hover:bg-neutral-bg font-medium active:scale-[0.99]",
    ghost:
      "bg-transparent text-neutral-dark hover:bg-neutral-bg font-medium active:scale-[0.99]",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-md",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 cursor-pointer font-sans transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
