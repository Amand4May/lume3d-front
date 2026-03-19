import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalPixPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">Adicione produtos para começar.</p>
          <Link to="/">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-8">Carrinho de Compras</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 bg-surface border border-border rounded-md p-4">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="text-sm font-bold text-foreground mt-1">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 border border-border rounded-md">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded-l-md">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded-r-md">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive">
              Limpar carrinho
            </button>
          </div>

          <div className="bg-surface border border-border rounded-md p-6 h-fit">
            <h2 className="font-bold text-foreground mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-success font-semibold">
                <span>No PIX</span>
                <span>R$ {totalPixPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <hr className="my-4 border-border" />
            <div className="flex justify-between font-bold text-foreground mb-4">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full" size="lg">Finalizar Compra</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
