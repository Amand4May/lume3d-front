import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

type OrderItem = {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
};

export default function PedidoConcluido() {
  const { state } = useLocation();
  const order = state as
    | {
        id: string;
        date: string;
        items: OrderItem[];
        totalPrice: number;
        totalPixPrice: number;
        shippingOption?: { name: string; price: number } | null;
        totalWithShipping?: number;
      }
    | undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container flex-1 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento concluído</h1>
          <p className="text-muted-foreground mb-6">Obrigado! Seu pedido foi processado com sucesso.</p>

          {order ? (
            <div className="bg-surface border border-border rounded-md p-6 text-left">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Número do pedido</div>
                  <div className="font-semibold text-foreground">{order.id}</div>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(order.date).toLocaleString()}</div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <div className="text-foreground">{it.name} × {it.quantity}</div>
                    <div className="text-foreground">R$ {it.price.toFixed(2).replace('.', ',')}</div>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-border" />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>R$ {order.totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                {order.shippingOption && (
                  <div className="flex justify-between text-foreground">
                    <span>Frete ({order.shippingOption.name})</span>
                    <span>R$ {order.shippingOption.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-bold text-foreground">
                    R$ {(order.totalWithShipping ?? order.totalPrice).toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">No PIX (produtos)</div>
                  <div className="font-semibold text-success">R$ {order.totalPixPrice.toFixed(2).replace('.', ',')}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-md p-6 mb-6">
              <p className="text-foreground">Seu pagamento foi concluído. Obrigado pela compra!</p>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Link to="/"><Button size="lg">Voltar à loja</Button></Link>
            <Link to="/perfil"><Button variant="outline" size="lg">Ver pedidos</Button></Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
