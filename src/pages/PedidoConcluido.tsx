import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import { apiCheckoutStatus, ApiCheckoutStatus } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function PedidoConcluido() {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "aprovado" | "pendente" | "recusado" | "erro">("loading");
  const [pedido, setPedido] = useState<ApiCheckoutStatus | null>(null);

  useEffect(() => {
    // Limpa o carrinho assim que chegar nesta página
    clearCart();

    if (!sessionId) {
      // Chegou sem session_id (fallback sem Stripe configurado)
      setStatus("aprovado");
      return;
    }

    // Consulta o status no backend — tenta algumas vezes pois o webhook
    // pode chegar com pequeno atraso após o redirecionamento do Stripe
    let tentativas = 0;
    const MAX = 6;

    const verificar = async () => {
      try {
        const data = await apiCheckoutStatus(sessionId);
        setPedido(data);

        if (data.status === "aprovado") {
          setStatus("aprovado");
        } else if (data.status === "recusado") {
          setStatus("recusado");
        } else if (tentativas < MAX) {
          // Ainda pendente — aguarda e tenta de novo
          tentativas++;
          setTimeout(verificar, 2000);
        } else {
          // Esgotou tentativas — mostra pendente
          setStatus("pendente");
        }
      } catch {
        if (tentativas < MAX) {
          tentativas++;
          setTimeout(verificar, 2000);
        } else {
          setStatus("erro");
        }
      }
    };

    verificar();
  }, [sessionId]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h1 className="text-2xl font-bold text-foreground">Confirmando pagamento...</h1>
          <p className="text-muted-foreground">Aguarde um momento enquanto verificamos seu pagamento.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Recusado ─────────────────────────────────────────────────────────────────
  if (status === "recusado") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container flex-1 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento recusado</h1>
            <p className="text-muted-foreground mb-8">
              Seu pagamento não foi aprovado. Nenhum valor foi cobrado. Tente novamente com outro método de pagamento.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/carrinho"><Button size="lg">Tentar novamente</Button></Link>
              <Link to="/"><Button variant="outline" size="lg">Voltar à loja</Button></Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Pendente ─────────────────────────────────────────────────────────────────
  if (status === "pendente") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container flex-1 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento em processamento</h1>
            <p className="text-muted-foreground mb-4">
              Seu pedido foi criado e o pagamento está sendo processado. Você receberá uma confirmação em breve.
            </p>
            {pedido && (
              <p className="text-sm text-muted-foreground mb-8">Pedido #{pedido.pedido_id}</p>
            )}
            <div className="flex justify-center gap-3">
              <Link to="/perfil"><Button size="lg">Ver meus pedidos</Button></Link>
              <Link to="/"><Button variant="outline" size="lg">Voltar à loja</Button></Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Erro ─────────────────────────────────────────────────────────────────────
  if (status === "erro") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container flex-1 py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Não foi possível verificar o pagamento</h1>
            <p className="text-muted-foreground mb-8">
              Acesse "Meus Pedidos" no perfil para verificar o status do seu pedido.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/perfil"><Button size="lg">Ver meus pedidos</Button></Link>
              <Link to="/"><Button variant="outline" size="lg">Voltar à loja</Button></Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Aprovado ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container flex-1 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento confirmado!</h1>
          <p className="text-muted-foreground mb-6">Obrigado! Seu pedido foi processado com sucesso.</p>

          {pedido && (
            <div className="bg-surface border border-border rounded-md p-6 text-left mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Número do pedido</div>
                  <div className="font-semibold text-foreground">#{pedido.pedido_id}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(pedido.criado_em).toLocaleString("pt-BR")}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {pedido.itens.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{it.nome} × {it.quantidade}</span>
                    <span className="text-foreground">R$ {it.subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-border" />
              <div className="flex justify-between font-bold text-foreground">
                <span>Total pago</span>
                <span>R$ {pedido.valor_total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          )}

          {/* Fallback sem pedido (sem Stripe configurado) */}
          {!pedido && (
            <div className="bg-surface border border-border rounded-md p-6 mb-6">
              <p className="text-foreground">Seu pagamento foi concluído. Obrigado pela compra!</p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Link to="/"><Button size="lg">Voltar à loja</Button></Link>
            <Link to="/perfil"><Button variant="outline" size="lg">Ver meus pedidos</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
