import Image from "next/image";
import Link from "next/link";
import { CATEGORY_CIRCLES } from "@/lib/mock-data";

export function CategoryCircles() {
  return (
    <section className="py-2">
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
        {CATEGORY_CIRCLES.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center group w-full text-center"
          >
            {/* Circle Container */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white border border-neutral-border shadow-xs flex items-center justify-center p-3.5 group-hover:scale-108 group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
              {cat.imageUrl && (
                <div className="relative w-full h-full">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="88px"
                    className="object-contain"
                  />

                </div>
              )}
            </div>

            {/* Label */}
            <span className="font-sans font-semibold text-[13px] text-neutral-dark group-hover:text-primary transition-colors mt-2.5 block text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
