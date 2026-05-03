export function BrandsSection() {
  const brands = ["TechPrint", "FilaPro", "3DMax", "PrintCore", "NanoFil"];

  return (
    <section className="py-12 bg-navy">
      <div className="container text-center">
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
