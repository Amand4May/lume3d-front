export function BrandsSection() {
  const brands = ["TechPrint", "FilaPro", "3DMax", "PrintCore", "NanoFil"];

  return (
    <section className="py-12 bg-navy">
      <div className="container text-center">
        <p className="text-navy-foreground/70 text-sm font-body mb-6">
          Impressões 3D personalizadas para todos!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {brands.map((b) => (
            <span key={b} className="text-navy-foreground/40 font-display font-bold text-xl tracking-wide">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
