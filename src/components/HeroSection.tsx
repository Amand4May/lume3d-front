import videoBg from "@/assets/video_fundo_site.mp4";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useCallback } from "react";

export function HeroSection() {
  const scrollToProducts = useCallback((category?: string) => {
    if (category) {
      // set hash with category param (keeps SPA behavior)
      window.location.hash = `#produtos?category=${encodeURIComponent(category)}`;
    } else {
      window.location.hash = "#produtos";
    }

    // dispatch a custom event so parent page can reliably update filters
    window.dispatchEvent(new CustomEvent("scrollToProducts", { detail: { category: category ?? null } }));

    const el = document.getElementById("produtos");
    if (el) {
      // small timeout to allow hash change to be applied
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <video
          src={videoBg}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative container py-20 md:py-32">
        <div className="max-w-xl">
          <div className="mb-4">
              <span className="w-fit inline-block bg-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase text-white shadow-sm backdrop-blur-sm border border-white/10 flex items-center gap-2">
                <Zap className="w-4 h-4 text-white flex-shrink-0" />
              Inovação em cada camada
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-navy-foreground leading-tight mb-4">
            Impressões 3D personalizadas
          </h1>
          <p className="text-lg text-navy-foreground/80 mb-8 font-body">
            Modelos prontos, personalizados e de alta qualidade para suas criações.
          </p>
          <div className="flex gap-3">
            <Button size="lg" onClick={() => scrollToProducts()}>
              Ver Produtos
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="!bg-transparent !border-white/30 dark:!border-navy-foreground/30 text-white hover:!text-white hover:!bg-navy/10 transition-transform duration-150 transform hover:-translate-y-0.5"
              onClick={() => scrollToProducts("Lançamentos")} >
              Lançamentos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
