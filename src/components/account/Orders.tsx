import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiPedidos, ApiOrder } from "@/lib/api";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  aberto: { label: "Em andamento", variant: "secondary" },
  pago: { label: "Pago", variant: "default" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiPedidos()
      .then(setOrders)
      .catch(() => setError("Não foi possível carregar os pedidos."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Compras</h2>
        <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Compras</h2>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Compras</h2>
      {orders.length === 0 ? (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Nenhuma compra encontrada.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const s = statusLabel[order.status] ?? { label: order.status, variant: "outline" as const };
            return (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-foreground">Pedido #{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.criado_em).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={s.variant}>{s.label}</Badge>
                    <div className="font-semibold text-foreground mt-1">
                      R$ {order.valor_total.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.itens.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                      <span>{it.nome} × {it.quantidade}</span>
                      <span>R$ {it.subtotal.toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
