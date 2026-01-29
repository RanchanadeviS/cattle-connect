import { Card, CardContent } from "@/components/ui/card";
import { Milk, Zap, Beef } from "lucide-react";

const categories = [
  {
    id: "dairy-cows",
    name: "Dairy Cows",
    icon: Milk,
    count: "1,247",
    color: "text-primary"
  },
  {
    id: "bulls",
    name: "Bulls",
    icon: Zap,
    count: "832",
    color: "text-secondary"
  },
  {
    id: "buffaloes",
    name: "Buffaloes",
    icon: Beef,
    count: "654",
    color: "text-accent"
  }
];

const CategoryTiles = () => {
  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} mb-4 flex justify-center`}>
                    <IconComponent size={48} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.count} available</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;