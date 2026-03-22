
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";


const Favorites: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Favoritos</h2>
      <Card className="p-4">
        {favorites.length === 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Você ainda não tem favoritos.</p>
            <Button asChild>
              <Link to="/">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <Link to={`/produto/${p.id}`} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-muted-foreground">R$ {p.price.toFixed(2).replace(".", ",")}</div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => removeFavorite(p.id)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Favorites;
