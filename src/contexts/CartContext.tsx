import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPixPrice: number;
  // coupon support
  coupon: { code: string; type: "percent" | "fixed"; value: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  subtotalAfterDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; type: "percent" | "fixed"; value: number } | null>(null);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.product.id !== productId));

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const effectivePrice = (product: any) => {
    if (product?.tag === 'Promoção') return product.price * 0.95 // 5% off for promo-tag items
    return product.price
  }

  const subtotal = items.reduce((s, i) => s + effectivePrice(i.product) * i.quantity, 0);

  // available coupons (sample). Keys are case-insensitive.
  // add `expired` to mark coupons that are no longer valid
  const availableCoupons: Record<string, { type: "percent" | "fixed"; value: number; description?: string; expired?: boolean }> = {
    'PROMO10': { type: 'percent', value: 10, description: '10% de desconto' },
    'DESCONTO20': { type: 'fixed', value: 20, description: 'R$20 de desconto' },
    // PRINT10 is expired — will return an expiration message when attempted
    'PRINT10': { type: 'percent', value: 10, description: 'Cupom expirado', expired: true }
  }

  const discountAmount = (() => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Number(((subtotal * coupon.value) / 100).toFixed(2));
    return Math.min(Number(coupon.value.toFixed ? coupon.value : Number(coupon.value)), subtotal);
  })();

  const subtotalAfterDiscount = Number((Math.max(0, subtotal - discountAmount)).toFixed(2));

  const totalPrice = subtotalAfterDiscount;
  // totalPixPrice here is items-only 10% off; final PIX with shipping is computed in UI
  const totalPixPrice = Number((totalPrice * 0.9).toFixed(2));

  const applyCoupon = (code: string) => {
    if (!code || typeof code !== 'string') return { success: false, message: 'Código inválido' };
    const key = code.trim().toUpperCase();
    const found = availableCoupons[key];
    if (!found) return { success: false, message: 'Cupom não encontrado' };
    if (found.expired) return { success: false, message: `Cupom ${key} expirado ou fora da validade` };
    setCoupon({ code: key, type: found.type, value: found.value });
    return { success: true, message: `Cupom ${key} aplicado (${found.description ?? ''})` };
  }

  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalPixPrice,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        subtotalAfterDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
