import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleOrders = [
  { id: "#1001", date: "2026-03-01", total: "R$ 120.00" },
  { id: "#1000", date: "2026-02-15", total: "R$ 45.50" },
];

const Orders: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Compras</h2>
      <div className="space-y-3">
        {sampleOrders.map((o) => (
          <Card key={o.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">Pedido {o.id}</div>
              <div className="text-sm text-muted-foreground">{o.date}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{o.total}</div>
              <Button variant="link" className="text-sm">Ver</Button>
            </div>
          </Card>
        ))}
        {sampleOrders.length === 0 && (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Nenhuma compra encontrada.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;
