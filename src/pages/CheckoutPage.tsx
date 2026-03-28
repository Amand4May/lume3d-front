import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useShipping } from "@/contexts/ShippingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from "lucide-react";
import ShippingCalculator from "@/components/ShippingCalculator";

const CheckoutPage = () => {
  const { items, totalPrice, totalPixPrice, clearCart, applyCoupon, removeCoupon, discountAmount, coupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const { selectedOption, address } = useShipping();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingError, setShippingError] = useState(false);

  const [cidade, setCidade] = useState(address?.city ?? '');
  const [estado, setEstado] = useState(address?.state ?? '');
  const [paymentMethod, setPaymentMethod] = useState<"pix"|"credit"|"debit"|"boleto">("pix");
  const [installments, setInstallments] = useState<number>(1);

  useEffect(() => {
    if (address) {
      setCidade(address.city);
      setEstado(address.state);
    }
  }, [address]);

  const frete = selectedOption?.price ?? 0;
  const totalWithShipping = totalPrice + frete;
  const totalPixWithShipping = Number((totalWithShipping * 0.9).toFixed(2))
  const payableTotal = paymentMethod === 'pix' ? totalPixWithShipping : totalWithShipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOption) {
      setShippingError(true);
      return;
    }

    setShippingError(false);
    setLoading(true);

    setTimeout(() => {
      const orderId = `PED-${Date.now().toString().slice(-6)}`;
      const finalTotal = paymentMethod === 'pix' ? totalPixWithShipping : totalWithShipping;

      const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        items: items.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          quantity: it.quantity,
          price: it.product.tag === 'Promoção' ? Number((it.product.price * 0.95).toFixed(2)) : it.product.price,
        })),
        totalPrice: totalWithShipping,
        totalPixPrice: totalPixWithShipping,
        payableTotal: finalTotal,
        coupon: coupon?.code ?? null,
        discountAmount: discountAmount,
        shippingOption: { name: selectedOption.name, price: selectedOption.price },
        totalWithShipping: totalWithShipping,
        payment: {
          method: paymentMethod,
          installments: paymentMethod === 'credit' ? installments : 1,
        },
      };

      clearCart();
      navigate("/pedido-concluido", { state: orderData });
      setLoading(false);
    }, 1500);
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
                <Input placeholder="Código do cupom" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Button onClick={() => { const res = applyCoupon(couponCode); setCouponMsg(res.message); }}>{coupon ? 'Atualizar' : 'Aplicar'}</Button>
                {coupon && <Button variant="ghost" onClick={() => { removeCoupon(); setCouponMsg('Cupom removido'); setCouponCode(''); }}>Remover</Button>}
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
            <div>
              <label className="text-sm font-medium text-foreground">Forma de pagamento</label>
              <div className="mt-2 space-y-2">
                <Select value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v as any); if (v !== 'credit') setInstallments(1); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX (10% desconto)</SelectItem>
                    <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit">Débito</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === 'credit' && (
                  <div>
                    {totalWithShipping > 50 ? (
                      <>
                        <label className="text-sm font-medium text-foreground">Parcelas</label>
                        <Select value={String(installments)} onValueChange={(v) => setInstallments(Number(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">R$ {(totalWithShipping / installments).toFixed(2).replace('.', ',')} por parcela</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Parcelamento disponível apenas para pedidos acima de R$ 50,00</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </form>

          <div className="bg-surface border border-border rounded-md p-6 h-fit">
            <h2 className="font-bold text-foreground mb-4">Resumo</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = item.product.tag === 'Promoção' ? item.product.price * 0.95 : item.product.price
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                      {item.product.tag === 'Promoção' && <Badge className="ml-2" variant="secondary">Promo</Badge>}
                    </div>
                    <span className="text-foreground">R$ {(unitPrice * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                )
              })}
            </div>
            <hr className="my-4 border-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>R$ {(totalPrice + discountAmount).toFixed(2).replace('.', ',')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-foreground">
                  <span>Desconto</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground">
                <span>Frete{selectedOption ? ` (${selectedOption.name})` : ''}</span>
                {selectedOption ? (
                  <span>R$ {frete.toFixed(2).replace(".", ",")}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">Selecione uma opção</span>
                )}
              </div>
            </div>
            <hr className="my-4 border-border" />
            <div className="flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>R$ {totalWithShipping.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm text-success font-semibold mt-1">
              <span>No PIX</span>
              <span>R$ {totalPixWithShipping.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
