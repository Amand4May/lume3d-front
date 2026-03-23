import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { products, type Product } from "@/data/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, ArrowLeft, Heart, UploadCloud } from "lucide-react";
import ShippingCalculator from "@/components/ShippingCalculator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filament, setFilament] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const pricePerCm3 = product?.specs && product.specs["Preço por cm³"] ? parseFloat(product.specs["Preço por cm³"].replace(",", ".")) : 0;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  const handleToggleFavorite = () => {
    const currently = isFavorited(product.id);
    toggleFavorite(product);
    if (!currently) toast.success(`${product.name} adicionado aos favoritos!`);
    else toast(`${product.name} removido dos favoritos.`);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    } catch {
      toast("Não foi possível copiar o link.");
    }
  };

  const handleSendWhatsApp = () => {
    if (!product) return;
    if (!filament || !file) {
      toast("Por favor selecione o tipo de filamento e envie o arquivo antes de enviar via WhatsApp.");
      return;
    }
    // Brazil country code +55, area code 15
    const phone = "5515996289226";
    const fileName = file ? file.name : "(sem arquivo)";
    const obs = observations.trim() || "(sem observações)";
    const message = `Olá, gostaria de solicitar uma impressão 3D personalizada.%0AProduto: ${product.name}%0AFilamento: ${filament}%0AObservações: ${obs}%0AArquivo: ${fileName}`;
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
    toast.success("Arquivo removido.");
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.id === "impressao-3d-personalizada") {
      toast("Serviço sob consulta — envie o arquivo e solicite orçamento nesta página.");
      return;
    }
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  // Small inline component to toggle between two images (cycles back on second click)
  const ImageToggle = ({ product }: { product: Product }) => {
    const imgs = product.images && product.images.length > 0 ? product.images : [product.image];
    const limit = product.id.startsWith("impressao-3d") ? imgs.length : Math.min(2, imgs.length);
    const [index, setIndex] = useState(0);
    const toggle = () => setIndex((i) => (i + 1) % (limit || 1));

    return (
      <div className="relative">
        <img src={imgs[index]} alt={product.name} className="w-full aspect-square object-cover" />
        {limit > 1 && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              onClick={toggle}
              aria-label="Alternar imagem"
              className="pointer-events-auto bg-black/50 text-white rounded-full p-3 hover:bg-black/60"
            >
              {index === 0 ? "›" : "‹"}
            </button>
          </div>
        )}
      </div>
    );
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image gallery */}
          <div className="bg-surface border border-border rounded-md overflow-hidden relative">
            {/* image toggle */}
            <ImageToggle product={product} />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{product.category}</span>
              {product.tag && (() => {
                const normalize = (s: string) =>
                  s
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .toLowerCase();
                const tagNorm = normalize(product.tag);
                const isPromo = tagNorm === "promocao";
                const isLanc = tagNorm === "lancamento";
                const badgeClass = `text-xs ${isPromo ? "bg-[#fb542b] text-white" : isLanc ? "bg-[#13bc16] text-white" : "bg-accent text-accent-foreground"}`;
                return <Badge className={badgeClass}>{product.tag}</Badge>;
              })()}
            </div>
            {product.id.startsWith("impressao-3d") ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

                <div className="bg-surface border border-border rounded-md p-6 mb-6">
                  <h3 className="font-semibold mb-2">Impressão 3D Personalizada</h3>
                  <p className="text-sm text-muted-foreground mb-3">Envie o arquivo e escolha o tipo de filamento. Use o campo de observações para solicitações especiais.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm block mb-1">Arquivo do modelo</label>
                      <input
                        ref={fileInputRef}
                        id="file-input"
                        type="file"
                        accept=".stl,.obj,.zip"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          if (f) {
                            if (f.size > MAX_FILE_SIZE) {
                              toast.error("Arquivo muito grande. Máximo 50MB.");
                              // reset input
                              if (fileInputRef.current) fileInputRef.current.value = "";
                              setFile(null);
                              return;
                            }
                          }
                          setFile(f);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        title="Aceita: .stl, .obj, .zip — Máx 50MB"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Enviar arquivo
                      </button>
                      <p className="text-xs text-muted-foreground mt-2">Aceita: .stl, .obj, .zip — Máx 50MB</p>
                      {file && (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="text-sm text-muted-foreground">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleRemoveFile}>Remover arquivo</Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm block mb-1">Tipo de filamento</label>
                        <select value={filament} onChange={(e) => setFilament(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2">
                          <option value="">Não selecionado</option>
                          <option value="PLA">PLA</option>
                          <option value="ABS">ABS</option>
                          <option value="PETG">PETG</option>
                          <option value="TPU">TPU</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm block mb-1">Observações</label>
                        <textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Informe acabamento, escala, tolerâncias ou outras solicitações" className="w-full bg-background border border-border rounded-md px-3 py-2" rows={4} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSendWhatsApp}
                        variant="outline"
                        disabled={!filament || !file}
                        className={`${!filament || !file ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Enviar via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                <p className="text-muted-foreground text-sm mb-6">{product.description}</p>
              </>
            )}

            {!product.id.startsWith("impressao-3d") && (
              <>
                <div className="bg-surface border border-border rounded-md p-6 mb-6">
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
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                            <p className="text-3xl font-bold text-foreground leading-none">R$ {discounted.toFixed(2).replace(".", ",")}</p>
                            <span className="text-sm text-success font-medium ml-2">-5%</span>
                          </div>
                          <p className="text-lg text-success font-semibold mt-1">
                            R$ {discountedPix.toFixed(2).replace(".", ",")} <span className="text-sm font-normal">no PIX</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ou 12x de R$ {(discounted / 12).toFixed(2).replace(".", ",")} sem juros
                          </p>
                        </>
                      );
                    }
                    return (
                      <>
                        <p className="text-3xl font-bold text-foreground">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-lg text-success font-semibold mt-1">
                          R$ {product.pixPrice.toFixed(2).replace(".", ",")} <span className="text-sm font-normal">no PIX</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ou 12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")} sem juros
                        </p>
                      </>
                    );
                  })()
                ) : (
                  <>
                          <p className="text-3xl font-bold text-foreground">Valor sob consulta</p>
                    {pricePerCm3 > 0 ? (
                      <p className="text-lg text-success font-semibold mt-1">Preço por cm³: R$ {pricePerCm3.toFixed(2).replace(".", ",")}</p>
                    ) : (
                      <p className="text-lg text-success font-semibold mt-1">Preço por cm³</p>
                    )}
                  </>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">Calcular frete</p>
                <ShippingCalculator />
              </div>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="" onClick={handleAddToCart}>
                Adicionar ao Carrinho
              </Button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-md transition-colors ${isFavorited(product.id) ? "bg-destructive text-destructive-foreground" : "bg-surface border"}`}
                  aria-label={isFavorited(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart className="w-5 h-5" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-12 h-12 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 100-4 2 2 0 000 4zM14 10a2 2 0 100-4 2 2 0 000 4zM10 14a2 2 0 100-4 2 2 0 000 4z" /></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => { handleAddToCart(); }}>Adicionar ao carrinho</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleToggleFavorite}>{isFavorited(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleShare}>Compartilhar link</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Shipping consult removed from product detail view */}
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
