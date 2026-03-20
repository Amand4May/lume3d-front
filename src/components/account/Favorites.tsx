import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Favorites: React.FC = () => {
  // Placeholder UI — integrate with favorites data later
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Favoritos</h2>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-4">Você ainda não tem favoritos.</p>
        <Button variant="ghost">Ver produtos</Button>
      </Card>
    </div>
  );
};

export default Favorites;
