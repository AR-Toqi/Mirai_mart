import { StarIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  reviewCount?: number;
  className?: string;
  size?: number;
};

export function RatingStars({ rating, reviewCount, className, size = 14 }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs text-neutral-muted font-sans", className)}>
      <div className="flex items-center gap-0.5 text-amber-500">
        <StarIcon size={size} filled={true} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      </div>
      <span className="font-semibold text-neutral-dark text-xs">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-neutral-muted text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
