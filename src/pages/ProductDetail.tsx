import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Produto não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar à loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{product.category}</span>
              {product.tag && (
                <Badge className="bg-accent text-accent-foreground text-xs">{product.tag}</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

            <div className="bg-surface border border-border rounded-md p-6 mb-6">
              <p className="text-3xl font-bold text-foreground">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-lg text-success font-semibold mt-1">
                R$ {product.pixPrice.toFixed(2).replace(".", ",")} <span className="text-sm font-normal">no PIX</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ou 12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")} sem juros
              </p>
            </div>

            <Button size="lg" className="w-full" onClick={() => { addItem(product); toast.success(`${product.name} adicionado ao carrinho!`); }}>
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specs">
            <TabsList className="bg-surface border border-border">
              <TabsTrigger value="specs">Especificações Técnicas</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações ({product.reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-4">
              <div className="bg-surface border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-3 font-medium text-foreground">{key}</td>
                        <td className="px-4 py-3 text-muted-foreground">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              {product.reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">Nenhuma avaliação ainda.</p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="bg-surface border border-border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-foreground">{r.author}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3.5 h-3.5 ${j < r.rating ? "fill-primary text-primary" : "text-border"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
