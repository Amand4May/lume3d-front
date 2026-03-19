import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { FeaturesSection } from "@/components/FeaturesSection";
import { BrandsSection } from "@/components/BrandsSection";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

const Index = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [category, searchQuery, priceRange, sortBy]);

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

      <BrandsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
