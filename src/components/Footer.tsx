import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logolume3d.png";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Lume 3D" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-sm text-navy-foreground/60 max-w-xs">
              Loja especializada em filamentos PLA, PETG e impressão 3D profissional. Qualidade e confiança.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Atendimento</h4>
            <ul className="space-y-3 text-sm text-navy-foreground/70">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@lume3d.com.br</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (11) 99999-0000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> São Paulo, SP</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              {["PIX", "Cartão", "Boleto"].map((m) => (
                <span key={m} className="text-xs px-3 py-1.5 border border-navy-foreground/20 rounded-md text-navy-foreground/70">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-navy-foreground/10 text-center text-xs text-navy-foreground/40">
          © 2026 Lume 3D. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
