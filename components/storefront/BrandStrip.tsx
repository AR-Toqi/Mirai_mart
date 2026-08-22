export function BrandStrip() {
  const brands = [
    { name: "Fisher-Price", style: "font-serif italic font-bold tracking-tight text-xl text-neutral-dark/80" },
    { name: "vtech", style: "font-sans font-extrabold tracking-tighter text-2xl text-neutral-dark/85 lowercase" },
    { name: "Melissa & Doug", style: "font-mono font-bold tracking-tight text-lg text-neutral-dark/80 px-2 py-0.5 rounded-full border border-neutral-dark/30" },
    { name: "mideer", style: "font-sans font-bold tracking-wide text-2xl text-neutral-dark/80 lowercase" },
    { name: "winfun", style: "font-sans font-black tracking-normal text-2xl text-neutral-dark/80 lowercase" },
  ];

  return (
    <section className="bg-white border border-neutral-border rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Heading */}
        <div className="text-center lg:text-left shrink-0">
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-neutral-dark leading-tight">
            Trusted by parents. <br />
            <span className="text-primary">Loved by kids.</span>
          </h3>
        </div>

        {/* Brand Logos Row */}
        <div className="flex-1 w-full flex flex-wrap items-center justify-center lg:justify-around gap-6 sm:gap-10 opacity-80 hover:opacity-100 transition-opacity">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all hover:scale-105"
            >
              <span className={brand.style}>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
