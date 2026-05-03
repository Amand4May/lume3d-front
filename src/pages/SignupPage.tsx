import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import logo from "@/assets/svgbrancolume.svg";
import videoBg from "@/assets/video_fundo_site.mp4";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const ok = await signup(name, email, password);
    setLoading(false);
    if (ok) {
      toast.success("Conta criada com sucesso!");
      navigate("/");
    } else {
      toast.error("Não foi possível criar a conta. Tente outro e-mail.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Vídeo de fundo */}
      <div className="absolute inset-0 -z-10">
        <video
          src={videoBg}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Header com botão de voltar */}
      <header className="sticky top-0 z-50">
        <div className="flex items-center justify-start py-2 pl-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o início</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="mb-8">
          <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Lume 3D" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Criar Conta</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Junte-se à Lume 3D</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Senha</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
