import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useSEO from "@/hooks/useSEO";

const Index = () => {
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
          if (!p.tag) return false;
          if (normalize(p.tag) !== normalize("Promoção")) return false;
        } else if (normCat === normalize("Lançamentos")) {
          if (!p.tag) return false;
          if (normalize(p.tag) !== normalize("Lançamento")) return false;
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

    // Relevância: quando em 'Todos' (categoria null) e ordenação padrão,
    // colocar produtos de 'Impressao 3d' no topo
    if (sortBy === "default" && category === null) {
      result.sort((a, b) => {
        const aIsPrint = normalize(a.category) === normalize("impressao 3d") ? 1 : 0;
        const bIsPrint = normalize(b.category) === normalize("impressao 3d") ? 1 : 0;
        return bIsPrint - aIsPrint; // print items first
      });
    }

    return result;
  }, [category, searchQuery, priceRange, sortBy]);

  // Listen to hash changes so HeroSection can trigger scroll+category via hash
  // Also listen to query params for category navigation from other pages
  useEffect(() => {
    let isFirstLoad = true;

    const applyFilters = (shouldScroll = false) => {
      let cat = null;
      
      // First check query params (from navbar navigation)
      const paramCat = searchParams.get("category");
      if (paramCat) {
        cat = decodeURIComponent(paramCat);
        shouldScroll = true;
      } else {
        // Fall back to hash (from HeroSection)
        const hash = window.location.hash || "";
        if (hash.startsWith("#produtos")) {
          const parts = hash.split("?");
          const query = parts[1] ?? "";
          const params = new URLSearchParams(query);
          const hashCat = params.get("category");
          if (hashCat) {
            cat = decodeURIComponent(hashCat);
            shouldScroll = true;
          }
        }
      }
      
      setCategory(cat);
      
      // Check for search query param
      const paramSearch = searchParams.get("search");
      if (paramSearch) {
        setSearchQuery(decodeURIComponent(paramSearch));
        shouldScroll = true;
      } else {
        setSearchQuery("");
      }
      
      // Only scroll to produtos if there's a filter/search or explicit request (but NOT on first load)
      if (shouldScroll && !isFirstLoad) {
        const el = document.getElementById("produtos");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      
      isFirstLoad = false;
    };

    applyFilters();
    
    const handleHashChange = () => {
      isFirstLoad = false;
      applyFilters(true);
    };
    
    window.addEventListener("hashchange", handleHashChange);
    
    const handleCustom = (e: Event) => {
      // handle custom event from HeroSection
      try {
        // @ts-ignore
        const cat = e?.detail?.category ?? null;
        setCategory(cat);
      } catch {
        setCategory(null);
      }
      const el = document.getElementById("produtos");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    
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

      {/* Products section */}
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

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
