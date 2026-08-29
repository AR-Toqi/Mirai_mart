import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#007EA3] via-[#0A98C3] to-[#48CAE4] text-white shadow-sm">
      {/* Decorative Circles */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-10 w-60 h-60 rounded-full bg-[#FCE35F]/15 blur-xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-8 sm:p-12 lg:p-14 relative z-10">
        {/* Left Copy */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col items-start">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Summer Fun <br />
            Up to <span className="text-[#FCE35F]">30% Off</span>
          </h2>
          <p className="text-sm sm:text-base text-white/90 font-sans mt-3 max-w-md">
            On selected toys & outdoor play collection
          </p>

          <Link
            href="/category/deals"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F8F9FC] text-neutral-dark font-sans font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md mt-6 active:scale-98"
          >
            <span>Shop Now</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>

        {/* Right Visuals & Limited Offer Badge */}
        <div className="md:col-span-6 lg:col-span-5 relative flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
          {/* Yellow Badge Sticker */}
          <div className="absolute top-2 right-4 sm:right-10 z-20 bg-[#FCE35F] text-[#191C1E] border-2 border-dashed border-[#F59E0B] rounded-full w-22 h-22 flex flex-col items-center justify-center p-2 text-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">
            <span className="font-heading font-bold text-[13px] leading-tight">Limited</span>
            <span className="font-heading font-bold text-[13px] leading-tight">Time Offer!</span>
          </div>

          {/* Graphic */}
          <div className="w-full h-44 sm:h-52 relative">
            <Image
              src="/images/promo-summer.svg"
              alt="Summer toys collection with scooter and teddy bear"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
