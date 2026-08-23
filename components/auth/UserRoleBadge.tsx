import React from "react";
import type { UserRole } from "@/types";

type Props = {
  role: UserRole | null | undefined;
  className?: string;
  size?: "sm" | "md";
};

export function UserRoleBadge({ role, className = "", size = "md" }: Props) {
  if (!role) return null;

  const config: Record<
    UserRole,
    { label: string; bg: string; text: string; border: string }
  > = {
    admin: {
      label: "Admin",
      bg: "bg-error-surface",
      text: "text-error",
      border: "border-error/20",
    },
    "store-manager": {
      label: "Store Manager",
      bg: "bg-warning-surface",
      text: "text-warning-foreground",
      border: "border-warning/30",
    },
    customer: {
      label: "Customer",
      bg: "bg-primary-surface",
      text: "text-tertiary",
      border: "border-primary/20",
    },
  };

  const current = config[role] || config.customer;
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-sans uppercase tracking-wider ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {current.label}
    </span>
  );
}
