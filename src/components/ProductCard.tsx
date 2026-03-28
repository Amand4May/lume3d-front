import { Link } from "react-router-dom";
import { useState } from "react";
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
    if (product.id === "impressao-3d-personalizada") {
      toast("Serviço sob consulta — acesse a página do produto para enviar o arquivo e solicitar orçamento.");
      return;
    }

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

  // Shipping lookup (simple CEP input + mock calculation)
  const [cep, setCep] = useState("");
  const [shippingVisible, setShippingVisible] = useState(false);
  const handleCheckShipping = () => {
    const digits = (cep || "").replace(/\D/g, "");
    if (digits.length !== 8) {
      toast("Por favor insira um CEP válido (8 dígitos).");
      return;
    }
    const last = parseInt(digits[digits.length - 1], 10) || 0;
    const cost = (9.9 + (last % 5)).toFixed(2);
    toast.success(`Frete estimado: R$ ${cost.replace(".", ",")}`);
  };

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group bg-surface border border-border rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-105" loading="lazy" />
        {product.tag && (() => {
          const normalize = (s: string) =>
            s
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase();
          const tagNorm = normalize(product.tag);
          const isPromo = tagNorm === "promocao";
          const isLanc = tagNorm === "lancamento";
          const badgeClass = `absolute top-2 left-2 text-xs font-semibold ${isPromo ? "bg-[#fb542b] text-white" : isLanc ? "bg-[#13bc16] text-white" : "bg-accent text-accent-foreground"}`;
          return <Badge className={badgeClass}>{product.tag}</Badge>;
        })()}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.category}</span>
        <h3 className="text-sm font-medium text-foreground mt-1 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="mt-3 min-h-[56px] flex flex-col justify-end">
          {product.price > 0 ? (
            (() => {
              const normalize = (s: string) =>
                s
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .toLowerCase();
              const isPromo = product.tag ? normalize(product.tag) === "promocao" || normalize(product.tag) === "promoção" : false;
              if (isPromo) {
                const discounted = Number((product.price * 0.95).toFixed(2));
                const discountedPix = Number((product.pixPrice * 0.95).toFixed(2));
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                      <p className="text-lg font-bold text-foreground leading-none">R$ {discounted.toFixed(2).replace(".", ",")}</p>
                      <span className="text-sm text-success font-medium ml-2">-5%</span>
                    </div>
                    <p className="text-sm text-success font-medium">R$ {discountedPix.toFixed(2).replace(".", ",")} no PIX</p>
                  </>
                );
              }
              return (
                <>
                  <p className="text-lg font-bold text-foreground">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                  <p className="text-sm text-success font-medium">R$ {product.pixPrice.toFixed(2).replace(".", ",")} no PIX</p>
                </>
              );
            })()
          ) : (
            <>
              <p className="text-lg font-bold text-foreground">Valor sob consulta</p>
              {product.specs && product.specs["Preço por grama"] ? (
                (() => {
                  const raw = product.specs["Preço por grama"].toString();
                  const num = parseFloat(raw.replace(",", "."));
                  return Number.isFinite(num) ? (
                    <p className="text-sm text-success font-medium">Preço por grama: R$ {num.toFixed(2).replace(".", ",")}</p>
                  ) : (
                    <p className="text-sm text-success font-medium">Preço por grama</p>
                  );
                })()
              ) : (
                <p className="text-sm text-success font-medium">Preço por grama</p>
              )}
            </>
          )}
          {/* Shipping consult removed from product list view */}
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
