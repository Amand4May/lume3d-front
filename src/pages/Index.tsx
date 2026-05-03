import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { FeaturesSection } from "@/components/FeaturesSection";
import { BrandsSection } from "@/components/BrandsSection";
import { Footer } from "@/components/Footer";
import { useCatalog } from "@/contexts/CatalogContext";
import useSEO from "@/hooks/useSEO";

const Index = () => {
  const { products } = useCatalog();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState("default");

  useSEO({
    title: "Lume 3D - Filamentos e Impressão 3D",
    description: "Loja especializada em filamentos PLA, PETG, acessórios e impressão 3D profissional.",
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    let result = products.filter((p) => {
      if (category) {
        const normCat = normalize(category);
        if (normCat === normalize("Promoções")) {
          if (!p.tag || normalize(p.tag) !== normalize("Promoção")) return false;
        } else if (normCat === normalize("Lançamentos")) {
          if (!p.tag || normalize(p.tag) !== normalize("Lançamento")) return false;
        } else {
          if (normalize(p.category) !== normCat) return false;
        }
      }
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    if (sortBy === "default" && category === null) {
      result.sort((a, b) => {
        const aIsPrint = normalize(a.category) === normalize("impressao 3d") ? 1 : 0;
        const bIsPrint = normalize(b.category) === normalize("impressao 3d") ? 1 : 0;
        return bIsPrint - aIsPrint;
      });
    }

    return result;
  }, [category, searchQuery, priceRange, sortBy, products]);

  // Lida com filtros via query params (navbar) e hash (HeroSection)
  useEffect(() => {
    const applyFilters = () => {
      let cat: string | null = null;

      // Prioridade: query params (navegação pelo navbar)
      const paramCat = searchParams.get("category");
      if (paramCat) {
        cat = decodeURIComponent(paramCat);
      } else {
        // Fallback: hash (HeroSection)
        const hash = window.location.hash || "";
        if (hash.startsWith("#produtos")) {
          const parts = hash.split("?");
          const query = parts[1] ?? "";
          const params = new URLSearchParams(query);
          const hashCat = params.get("category");
          if (hashCat) cat = decodeURIComponent(hashCat);
        }
      }

      setCategory(cat);

      const paramSearch = searchParams.get("search");
      if (paramSearch) {
        setSearchQuery(decodeURIComponent(paramSearch));
      } else {
        setSearchQuery("");
      }

      const hasFilters = paramCat || paramSearch;
      if (hasFilters) {
        setTimeout(() => {
          document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    applyFilters();

    const handleHashChange = () => applyFilters();

    const handleCustom = (e: Event) => {
      try {
        const cat = (e as CustomEvent)?.detail?.category ?? null;
        setCategory(cat);
      } catch {
        setCategory(null);
      }
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("scrollToProducts", handleCustom as EventListener);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scrollToProducts", handleCustom as EventListener);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />

      <section id="produtos" className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8">Nossos Produtos</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <CategorySidebar
              selectedCategory={category}
              onCategoryChange={setCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <div className="flex-1">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">Nenhum produto encontrado.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BrandsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
