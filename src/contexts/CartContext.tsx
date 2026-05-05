import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import { useCatalog } from "@/contexts/CatalogContext";
import {
  apiGetCart,
  apiAddToCart,
  apiUpdateCart,
  apiRemoveFromCart,
  apiClearCart,
  ApiCartItem,
} from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  totalPixPrice: number;
  coupon: { code: string; type: "percent" | "fixed"; value: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  subtotalAfterDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function apiItemToCartItem(apiItem: ApiCartItem, localProducts: Product[]): CartItem {
  const local = localProducts.find((p) => p.id === apiItem.id);
  if (local) {
    return { product: { ...local, db_id: apiItem.db_id } as Product, quantity: apiItem.quantity };
  }
  const synthetic: Product = {
    id: apiItem.id,
    name: apiItem.name,
    category: apiItem.category,
    price: apiItem.price,
    pixPrice: Math.round(apiItem.price * 0.9 * 100) / 100,
    image: "",
    images: [],
    tag: apiItem.tag ?? undefined,
    description: "",
    specs: {},
    reviews: [],
  };
  return { product: { ...synthetic, db_id: apiItem.db_id } as Product, quantity: apiItem.quantity };
}

const AVAILABLE_COUPONS: Record<
  string,
  { type: "percent" | "fixed"; value: number; description?: string; expired?: boolean }
> = {
  PROMO10: { type: "percent", value: 10, description: "10% de desconto" },
  DESCONTO20: { type: "fixed", value: 20, description: "R$20 de desconto" },
  PRINT10: { type: "percent", value: 10, description: "Cupom expirado", expired: true },
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { products: catalogProducts, dbIdMap } = useCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
  } | null>(null);

  // Resolve o db_id de um produto: tenta na ordem abaixo
  // 1. db_id já injetado no objeto (quando veio da API via CatalogContext)
  // 2. dbIdMap do CatalogContext (lookup por slug/id)
  function resolveDbId(product: Product): number | undefined {
    const injected = (product as any).db_id as number | undefined;
    if (injected) return injected;
    return dbIdMap[product.id];
  }

  const syncFromBackend = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cart = await apiGetCart();
      setItems(cart.itens.map((i) => apiItemToCartItem(i, catalogProducts)));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, catalogProducts]);

  useEffect(() => {
    if (!authLoading) {
      syncFromBackend();
    }
  }, [authLoading, syncFromBackend]);

  const effectivePrice = (product: Product) =>
    product.tag === "Promoção" ? product.price * 0.95 : product.price;

  const addItem = async (product: Product, qty = 1) => {
    if (!user) {
      // Sem login: só memória
      setItems((prev) => {
        const ex = prev.find((i) => i.product.id === product.id);
        if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
        return [...prev, { product, quantity: qty }];
      });
      return;
    }

    const dbId = resolveDbId(product);
    if (!dbId) {
      console.warn("Produto sem db_id no catálogo:", product.id);
      return;
    }

    await apiAddToCart(dbId, qty);
    await syncFromBackend();
  };

  const removeItem = async (productId: string) => {
    if (!user) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      const dbId = resolveDbId(item.product);
      if (dbId) await apiRemoveFromCart(dbId);
    }
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId);
    if (!user) {
      setItems((prev) =>
        prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
      );
      return;
    }
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      const dbId = resolveDbId(item.product);
      if (dbId) await apiUpdateCart(dbId, quantity);
    }
    setItems((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
    );
  };

  const clearCart = async () => {
    if (user) await apiClearCart().catch(() => {});
    setItems([]);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (s, i) => s + effectivePrice(i.product) * i.quantity,
    0
  );

  const discountAmount = (() => {
    if (!coupon) return 0;
    if (coupon.type === "percent")
      return Number(((subtotal * coupon.value) / 100).toFixed(2));
    return Math.min(coupon.value, subtotal);
  })();

  const subtotalAfterDiscount = Number(Math.max(0, subtotal - discountAmount).toFixed(2));
  const totalPrice = subtotalAfterDiscount;
  const totalPixPrice = Number((totalPrice * 0.9).toFixed(2));

  const applyCoupon = (code: string) => {
    if (!code) return { success: false, message: "Código inválido" };
    const key = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS[key];
    if (!found) return { success: false, message: "Cupom não encontrado" };
    if (found.expired)
      return { success: false, message: `Cupom ${key} expirado ou fora da validade` };
    setCoupon({ code: key, type: found.type, value: found.value });
    return { success: true, message: `Cupom ${key} aplicado (${found.description ?? ""})` };
  };

  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
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
