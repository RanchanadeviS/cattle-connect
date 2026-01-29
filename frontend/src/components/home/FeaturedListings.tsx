import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart } from "lucide-react";
import holsteinImage1 from "@/assets/cattle-holstein-1.jpg";
import jerseyImage1 from "@/assets/cattle-jersey-1.jpg";
import girImage1 from "@/assets/cattle-gir-1.jpg";

const featuredCattle = [
  {
    id: 1,
    name: "Holstein Dairy Cow",
    breed: "Holstein",
    age: "3 years",
    weight: "550 kg",
    milkYield: "25L/day",
    price: "₹85,000",
    location: "Punjab, India",
    image: holsteinImage1,
    seller: "Ram Singh Farm",
    rating: 4.8
  },
  {
    id: 2,
    name: "Gir Bull",
    breed: "Gir",
    age: "4 years",
    weight: "480 kg",
    milkYield: "20L/day",
    price: "₹95,000",
    location: "Gujarat, India",
    image: jerseyImage1,
    seller: "Patel Dairy",
    rating: 4.9
  },
  {
    id: 3,
    name: "Jersey Cow",
    breed: "Jersey",
    age: "2.5 years",
    weight: "400 kg",
    milkYield: "18L/day",
    price: "₹65,000",
    location: "Haryana, India",
    image: girImage1,
    seller: "Kumar Farm",
    rating: 4.7
  }
];

const FeaturedListings = () => {
  return (
    <section className="px-4 py-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Cattle</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCattle.map((cattle) => (
            <Card key={cattle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={cattle.image}
                    alt={cattle.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-primary">
                    Featured
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{cattle.name}</CardTitle>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Breed:</span>
                    <span className="font-medium">{cattle.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-medium">{cattle.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span className="font-medium">{cattle.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Milk Yield:</span>
                    <span className="font-medium text-primary">{cattle.milkYield}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{cattle.location}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{cattle.price}</p>
                    <p className="text-xs text-muted-foreground">{cattle.seller}</p>
                  </div>
                  <Link to={`/listings/${cattle.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;