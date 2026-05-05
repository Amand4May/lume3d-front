import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useShipping } from "@/contexts/ShippingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import ShippingCalculator from "@/components/ShippingCalculator";
import { apiCheckout } from "@/lib/api";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { items, totalPrice, totalPixPrice, applyCoupon, removeCoupon, discountAmount, coupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const { selectedOption, address } = useShipping();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingError, setShippingError] = useState(false);

  const [cidade, setCidade] = useState(address?.city ?? "");
  const [estado, setEstado] = useState(address?.state ?? "");

  useEffect(() => {
    if (address) {
      setCidade(address.city);
      setEstado(address.state);
    }
  }, [address]);

  const frete = selectedOption?.price ?? 0;
  const totalWithShipping = totalPrice + frete;
  const totalPixWithShipping = Number((totalWithShipping * 0.9).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOption) {
      setShippingError(true);
      return;
    }

    setShippingError(false);
    setLoading(true);

    try {
      const resultado = await apiCheckout(
        selectedOption ? { nome: selectedOption.name, valor: selectedOption.price } : undefined,
        discountAmount ?? 0
      );

      if (resultado.checkout_url) {
        // Redireciona para o Stripe Hosted Checkout
        window.location.href = resultado.checkout_url;
      } else {
        // STRIPE_SECRET_KEY não configurada — fallback para sucesso local
        navigate("/pedido-concluido", {
          state: {
            pedido_id: resultado.pedido_id,
            from_stripe: false,
          },
        });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao processar pedido. Tente novamente.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <h1 className="text-2xl font-bold text-foreground">Carrinho vazio</h1>
          <Link to="/"><Button>Ver Produtos</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <Link to="/carrinho" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-bold text-foreground">Dados de Entrega</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <Input placeholder="Seu nome" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Sobrenome</label>
                <Input placeholder="Seu sobrenome" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">CEP e frete</label>
              <div className="mt-1">
                <ShippingCalculator />
              </div>
              {shippingError && (
                <p className="text-sm text-destructive mt-1">
                  Selecione uma opção de entrega para continuar.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Cupom de desconto</label>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const res = applyCoupon(couponCode);
                    setCouponMsg(res.message);
                  }}
                >
                  {coupon ? "Atualizar" : "Aplicar"}
                </Button>
                {coupon && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      removeCoupon();
                      setCouponMsg("Cupom removido");
                      setCouponCode("");
                    }}
                  >
                    Remover
                  </Button>
                )}
              </div>
              {couponMsg && <p className="text-sm text-red-600 font-medium mt-2">{couponMsg}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Endereço</label>
              <Input placeholder="Rua, número, complemento" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <Input
                  placeholder="Cidade"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Estado</label>
                <Input
                  placeholder="UF"
                  required
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>

            {/* Aviso sobre pagamento via Stripe */}
            <div className="bg-muted rounded-md p-4 flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Pagamento seguro via Stripe</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Você será redirecionado para a página de pagamento do Stripe. Aceitamos cartão de crédito, débito, PIX e boleto.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecionando para pagamento...
                </>
              ) : (
                "Ir para Pagamento"
              )}
            </Button>
          </form>

          {/* Resumo do pedido */}
          <div className="bg-surface border border-border rounded-md p-6 h-fit">
            <h2 className="font-bold text-foreground mb-4">Resumo</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = item.product.tag === "Promoção"
                  ? item.product.price * 0.95
                  : item.product.price;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                      {item.product.tag === "Promoção" && (
                        <Badge className="ml-2" variant="secondary">Promo</Badge>
                      )}
                    </div>
                    <span className="text-foreground">
                      R$ {(unitPrice * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                );
              })}
            </div>
            <hr className="my-4 border-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>R$ {(totalPrice + discountAmount).toFixed(2).replace(".", ",")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-foreground">
                  <span>Desconto</span>
                  <span>- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground">
                <span>Frete{selectedOption ? ` (${selectedOption.name})` : ""}</span>
                {selectedOption ? (
                  <span>R$ {frete.toFixed(2).replace(".", ",")}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">Selecione uma opção</span>
                )}
              </div>
            </div>
            <hr className="my-4 border-border" />
            <div className="flex justify-between font-bold text-foreground text-lg">
              <span>Total</span>
              <span>R$ {totalWithShipping.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm text-success font-semibold mt-1">
              <span>Estimativa no PIX</span>
              <span>R$ {totalPixWithShipping.toFixed(2).replace(".", ",")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              O desconto PIX é aplicado na tela de pagamento do Stripe.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
