import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, totalPixPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast.success("Pedido realizado com sucesso!");
      navigate("/");
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
              <label className="text-sm font-medium text-foreground">CEP</label>
              <Input placeholder="00000-000" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Endereço</label>
              <Input placeholder="Rua, número, complemento" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <Input placeholder="Cidade" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Estado</label>
                <Input placeholder="UF" required />
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
            <div className="flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm text-success font-semibold mt-1">
              <span>No PIX</span>
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
