import Image from "next/image";
import Link from "next/link";
import { Folder } from "lucide-react";
import type { CategoryWithProductCount } from "@/actions/categories";

type Props = {
  categories?: CategoryWithProductCount[];
};

export function CategoryCircles({ categories = [] }: Props) {
  // If no categories exist, render nothing (zero hardcoded fallbacks)
  if (!categories || categories.length === 0) {
    return null;
  }

  // Display active top-level categories
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-2">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 max-w-4xl mx-auto">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center group w-24 sm:w-28 text-center"
          >
            {/* Circle Container */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white border border-neutral-border shadow-xs flex items-center justify-center p-3.5 group-hover:scale-108 group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
              {cat.image_url ? (
                <div className="relative w-full h-full">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="88px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <Folder className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
              )}
            </div>

            {/* Label */}
            <span className="font-sans font-semibold text-[13px] text-neutral-dark group-hover:text-primary transition-colors mt-2.5 block text-center leading-tight truncate w-full">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
