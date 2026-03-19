import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <User className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Faça login para ver seu perfil</h1>
          <Link to="/login">
            <Button>Entrar</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8 flex-1 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-8">Meu Perfil</h1>
        <div className="bg-surface border border-border rounded-md p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
          </div>
          <hr className="border-border" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => { logout(); navigate("/"); }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
