/**
 * CatalogContext — busca o catálogo da API uma única vez e disponibiliza
 * para todo o app o mapa slug → db_id e os produtos enriquecidos.
 *
 * Isso resolve o problema de componentes (ProductDetail, CartContext) que
 * recebem um produto de products.ts (sem db_id) e precisam saber o db_id
 * real para chamar a API do carrinho.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { products as localProducts, Product } from "@/data/products";
import { apiCatalogo, ApiProduct } from "@/lib/api";

interface CatalogContextType {
  /** Produtos enriquecidos com db_id, preços e tags da API */
  products: Product[];
  /** Mapa rápido: slug/id do produto → db_id numérico do banco */
  dbIdMap: Record<string, number>;
  /** true enquanto o primeiro fetch ainda não terminou */
  loading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

function mergeProducts(apiItems: ApiProduct[], local: Product[]): Product[] {
  return apiItems.map((api) => {
    const loc = local.find((p) => p.id === api.id);
    return {
      id: api.id,
      db_id: api.db_id,
      name: api.name,
      category: api.category,
      price: api.price,
      pixPrice: api.pixPrice,
      image: loc?.image ?? "",
      images: loc?.images ?? [],
      tag: api.tag ?? undefined,
      description: api.description || (loc?.description ?? ""),
      specs: Object.keys(api.specs ?? {}).length ? api.specs : (loc?.specs ?? {}),
      reviews: loc?.reviews ?? [],
    } as Product & { db_id: number };
  });
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [dbIdMap, setDbIdMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCatalogo()
      .then((apiItems) => {
        const merged = mergeProducts(apiItems, localProducts);
        if (merged.length > 0) setProducts(merged);

        const map: Record<string, number> = {};
        for (const item of apiItems) {
          map[item.id] = item.db_id;
        }
        setDbIdMap(map);
      })
      .catch(() => {
        // API indisponível — mantém dados locais, mapa vazio
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CatalogContext.Provider value={{ products, dbIdMap, loading }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}