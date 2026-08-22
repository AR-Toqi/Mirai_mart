import {
  GemIcon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
} from "@/components/ui/Icons";

export function TrustStrip() {
  const perks = [
    {
      icon: GemIcon,
      title: "Curated with Care",
      desc: "Handpicked quality products for your loved ones",
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe & Certified",
      desc: "All products are child-safe and quality tested",
    },
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      desc: "Quick delivery to your doorstep",
    },
    {
      icon: RotateCcwIcon,
      title: "Hassle Free Returns",
      desc: "30 days easy return policy",
    },
  ];

  return (
    <section className="bg-white border border-neutral-border rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {perks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-surface/70 text-primary flex items-center justify-center shrink-0">
                <Icon size={24} className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[15px] text-neutral-dark leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-muted mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
