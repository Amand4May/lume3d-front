import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/svgbrancolume.svg";
import logoLight from "@/assets/svgpretolume.svg";

export function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="dark:bg-navy dark:text-navy-foreground bg-gray-200 text-gray-900 text-center text-sm py-2 font-body">
        🚀  Ganhe frete grátis em compras acima de R$ 199! Use o cupom <span className="font-semibold">PRINT10</span> (Válido até 22/09/2025)
      </div>

      <header className="sticky top-0 z-50 bg-surface border-b border-border">

        {/* ── DESKTOP (md+) ───────────────────────────────────────── */}
        <div className="hidden md:block relative">
          <div className="container relative py-2 flex items-center justify-between">

            {/* Esquerda: logo clicável */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 flex items-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center overflow-hidden">
                <img
                  key={theme}
                  src={(theme === "light" ? logoLight : logo) + `?v=${theme}`}
                  alt="Lume 3D"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Centro ABSOLUTO: busca + atalhos — não empurra nada */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col justify-end items-center pb-4 w-[480px] xl:w-[620px]">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <nav className="w-full flex justify-center gap-5 mt-4 flex-nowrap">
                  <a href="#produtos?category=Promo%C3%A7%C3%B5es" className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap transition-colors">Promoção</a>
                  <a href="#produtos?category=Lançamentos" className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap transition-colors">Lançamento</a>
                  <a href="#produtos?category=Impressao%203d" className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap transition-colors">Impressão 3D</a>
                  <a href="#produtos?category=Modelos%20Prontos" className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap transition-colors">Modelos prontos</a>
                  <a href="#produtos" className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap transition-colors">Todos</a>
                </nav>
            </div>

            {/* Direita: ações */}
            <div className="flex-shrink-0 flex items-center gap-1">
              <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Tema">
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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
        </div>

        {/* ── MOBILE (< md) ───────────────────────────────────────── */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-2">

            {/* Esquerda: hambúrguer */}
            <button className="p-2 text-muted-foreground hover:text-foreground" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
              <Menu className="w-6 h-6" />
            </button>

            {/* Centro: logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  key={theme + "-mobile"}
                  src={(theme === "light" ? logoLight : logo) + `?v=${theme}-mobile`}
                  alt="Lume 3D"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Direita: tema + carrinho */}
            <div className="flex items-center gap-1">
              <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Tema">
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Link to="/carrinho" className="relative p-2 text-muted-foreground hover:text-foreground" aria-label="Carrinho">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── DRAWER MOBILE ───────────────────────────────────────── */}
        {drawerOpen && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-border p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setDrawerOpen(false)} aria-label="Fechar" className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conta */}
              <div className="mb-4">
                <Link
                  to={user ? "/perfil" : "/login"}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                  onClick={() => setDrawerOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <div>
                    <div className="text-sm font-medium">{user ? user.name : "Entrar / Criar conta"}</div>
                    {user && <div className="text-xs text-muted-foreground">Ver perfil e pedidos</div>}
                  </div>
                </Link>
              </div>

              <hr className="my-2" />

              {/* Atalhos de categoria */}
              <nav className="flex flex-col gap-1 mt-2">
                <a href="#produtos?category=Promo%C3%A7%C3%B5es" className="py-2 px-3 rounded-md hover:bg-muted text-sm" onClick={() => setDrawerOpen(false)}>Promoção</a>
                <a href="#produtos?category=Lançamentos" className="py-2 px-3 rounded-md hover:bg-muted text-sm" onClick={() => setDrawerOpen(false)}>Lançamento</a>
                <a href="#produtos?category=Impressao%203d" className="py-2 px-3 rounded-md hover:bg-muted text-sm" onClick={() => setDrawerOpen(false)}>Impressão 3D</a>
                <a href="#produtos?category=Modelos%20Prontos" className="py-2 px-3 rounded-md hover:bg-muted text-sm" onClick={() => setDrawerOpen(false)}>Modelos prontos</a>
                <a href="#produtos" className="py-2 px-3 rounded-md hover:bg-muted text-sm" onClick={() => setDrawerOpen(false)}>Todos</a>
              </nav>
            </aside>
          </div>
        )}
      </header>
    </>
  );
}
