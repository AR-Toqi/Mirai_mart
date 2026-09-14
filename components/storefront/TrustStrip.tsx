import {
  GemIcon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
} from "@/components/ui/Icons";

export function TrustStrip() {
  const perks = [
    {
      id: "curated",
      title: "Curated with Care",
      desc: "Handpicked quality products for your loved ones",
    },
    {
      id: "certified",
      title: "Safe & Certified",
      desc: "All products are child-safe and quality tested",
    },
    {
      id: "delivery",
      title: "Fast Delivery",
      desc: "Quick delivery to your doorstep",
    },
    {
      id: "returns",
      title: "Hassle Free Returns",
      desc: "30 days easy return policy",
    },
  ];

  return (
    <section className="bg-white border border-neutral-border rounded-2xl p-6 sm:p-7 shadow-xs justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-between">
        {perks.map((item) => {
          return (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-surface/70 text-primary flex items-center justify-center shrink-0">
                {item.id === "curated" && <GemIcon size={24} className="w-6 h-6 stroke-[1.75]" />}
                {item.id === "certified" && <ShieldCheckIcon size={24} className="w-6 h-6 stroke-[1.75]" />}
                {item.id === "delivery" && <TruckIcon size={24} className="w-6 h-6 stroke-[1.75]" />}
                {item.id === "returns" && <RotateCcwIcon size={24} className="w-6 h-6 stroke-[1.75]" />}
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
