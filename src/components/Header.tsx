import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="bg-navy text-navy-foreground text-center text-sm py-2 font-body">
        🚀  Ganhe frete grátis em compras acima de R$ 199! Use o cupom <span className="font-semibold">PRINT10</span> (Válido até 22/09/2025)
      </div>

      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">Lume 3D</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Loja</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Tema">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>
            <Link to={user ? "/perfil" : "/login"} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Conta">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/carrinho" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Carrinho">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border bg-surface py-3">
            <div className="container">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
