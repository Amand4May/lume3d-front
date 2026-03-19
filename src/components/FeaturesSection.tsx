import { Truck, Shield, Headphones, CreditCard } from "lucide-react";

const features = [
  { icon: Truck, title: "Entrega Rápida", desc: "Envio para todo o Brasil em até 3 dias úteis" },
  { icon: Shield, title: "Garantia Nacional", desc: "Todos os produtos com garantia de fábrica" },
  { icon: Headphones, title: "Suporte Técnico", desc: "Equipe especializada para tirar suas dúvidas" },
  { icon: CreditCard, title: "Pagamento Facilitado", desc: "Até 12x sem juros ou desconto no PIX" },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 p-4">
              <div className="shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
