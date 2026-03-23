import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useShipping } from "@/contexts/ShippingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import ShippingCalculator from "@/components/ShippingCalculator";

const CheckoutPage = () => {
  const { items, totalPrice, totalPixPrice, clearCart } = useCart();
  const { selectedOption, address } = useShipping();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingError, setShippingError] = useState(false);

  const [cidade, setCidade] = useState(address?.city ?? '');
  const [estado, setEstado] = useState(address?.state ?? '');

  useEffect(() => {
    if (address) {
      setCidade(address.city);
      setEstado(address.state);
    }
  }, [address]);

  const frete = selectedOption?.price ?? 0;
  const total = totalPrice + frete;

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
      const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        items: items.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          quantity: it.quantity,
          price: it.product.price,
        })),
        totalPrice,
        totalPixPrice,
        shippingOption: { name: selectedOption.name, price: selectedOption.price },
        totalWithShipping: total,
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
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </form>

          <div className="bg-surface border border-border rounded-md p-6 h-fit">
            <h2 className="font-bold text-foreground mb-4">Resumo</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                  <span className="text-foreground">R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
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
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm text-success font-semibold mt-1">
              <span>No PIX (produtos)</span>
              <span>R$ {totalPixPrice.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
