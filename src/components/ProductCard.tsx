import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currently = isFavorited(product.id);
    toggleFavorite(product);
    if (!currently) toast.success(`${product.name} adicionado aos favoritos!`);
    else toast(`${product.name} removido dos favoritos.`);
  };

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group bg-surface border border-border rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-105" loading="lazy" />
        {product.tag && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-semibold">{product.tag}</Badge>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.category}</span>
        <h3 className="text-sm font-medium text-foreground mt-1 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="mt-3">
          {product.price > 0 ? (
            <>
              <p className="text-lg font-bold text-foreground">R$ {product.price.toFixed(2).replace(".", ",")}</p>
              <p className="text-sm text-success font-medium">R$ {product.pixPrice.toFixed(2).replace(".", ",")} no PIX</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-white">Valor sob consulta</p>
              {product.specs && product.specs["Preço por cm³"] ? (
                (() => {
                  const raw = product.specs["Preço por cm³"].toString();
                  const num = parseFloat(raw.replace(",", "."));
                  return Number.isFinite(num) ? (
                    <p className="text-sm text-success font-medium">Preço por cm³: R$ {num.toFixed(2).replace(".", ",")}</p>
                  ) : (
                    <p className="text-sm text-success font-medium">Preço por cm³</p>
                  );
                })()
              ) : (
                <p className="text-sm text-success font-medium">Preço por cm³</p>
              )}
            </>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <span className="flex-1 text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md transition-colors group-hover:bg-primary/90">
            Ver opções
          </span>
          <button
            onClick={handleToggleFavorite}
            className={`px-3 py-2 rounded-md transition-colors flex items-center justify-center ${
              isFavorited(product.id) ? "bg-destructive text-destructive-foreground" : "bg-transparent border"
            }`}
            aria-label={isFavorited(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddToCart}
            className="px-3 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
