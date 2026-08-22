import { ProductBadgeVariant } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  badge: ProductBadgeVariant;
  className?: string;
};

export function ProductBadge({ badge, className }: Props) {
  const badgeStyles: Record<ProductBadgeVariant, string> = {
    Bestseller: "bg-[#FCE35F] text-[#191C1E] font-semibold",
    New: "bg-[#22C55E] text-white font-medium",
    "-15%": "bg-[#FCE35F] text-[#191C1E] font-semibold",
    "-20%": "bg-[#FCE35F] text-[#191C1E] font-semibold",
    Sale: "bg-[#FEE2E2] text-[#EF4444] font-bold",
    Exclusive: "bg-[#B3EBFF] text-[#007EA3] font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] tracking-wide font-sans shadow-xs",
        badgeStyles[badge],
        className
      )}
    >
      {badge}
    </span>
  );
}
