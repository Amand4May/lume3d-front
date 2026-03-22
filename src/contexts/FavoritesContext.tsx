import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (p: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (p: Product) => void;
  isFavorited: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const addFavorite = (p: Product) =>
    setFavorites((s) => (s.find((x) => x.id === p.id) ? s : [...s, p]));

  const removeFavorite = (productId: string) =>
    setFavorites((s) => s.filter((p) => p.id !== productId));

  const toggleFavorite = (p: Product) =>
    setFavorites((s) => (s.find((x) => x.id === p.id) ? s.filter((x) => x.id !== p.id) : [...s, p]));

  const isFavorited = (productId: string) => favorites.some((p) => p.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export default FavoritesContext;
