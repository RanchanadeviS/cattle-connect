import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MapPin, 
  Star, 
  TrendingUp, 
  ListChecks,
  ShoppingCart,
  MessageCircle,
  Plus
} from "lucide-react";

import girImage from "@/assets/cattle-gir-1.jpg";
import holsteinImage from "@/assets/cattle-holstein-1.jpg";

const Dashboard = () => {
  const navigate = useNavigate();

  // Static user (no backend required)
  const [user] = useState({
    full_name: "Ranchana Devi",
    role: "Farmer",
    city: "Chennai",
    state: "Tamil Nadu",
  });

  // Updated Static sample cattle listings
  const sampleListings = [
    {
      id: 1,
      title: "Gir Cow",
      breed: "Gir",
      age: 3,
      milkCapacity: 12,
      weight: 420,
      price: 55000,
      status: "Available",
      image: girImage,
      emoji: "🐄"
    },
    {
      id: 2,
      title: "Holstein Cow",
      breed: "Holstein",
      age: 4,
      milkCapacity: 18,
      weight: 500,
      price: 65000,
      status: "Available",
      image: holsteinImage,
      emoji: "🐄"
    },
    {
      id: 3,
      title: "Gir Cow (Duplicate)",
      breed: "Gir",
      age: 5,
      milkCapacity: 10,
      weight: 430,
      price: 52000,
      status: "Available",
      image: girImage,
      emoji: "🐄"
    },
    {
      id: 4,
      title: "Holstein Cow (Duplicate)",
      breed: "Holstein",
      age: 6,
      milkCapacity: 20,
      weight: 540,
      price: 72000,
      status: "Available",
      image: holsteinImage,
      emoji: "🐄"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.full_name}</h1>
              <Badge variant="secondary" className="mt-1">{user.role}</Badge>

              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user.city}, {user.state}</span>
              </div>

              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                  />
                ))}
                <span className="ml-2 text-sm">(4/5)</span>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => navigate("/")}>
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sampleListings.length}</div>
              <p className="text-xs text-muted-foreground">Available for sale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sold Cattle</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Buffalo inquiry</p>
            </CardContent>
          </Card>
        </div>

        {/* My Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Listings</CardTitle>
            <Button onClick={() => navigate("/listings/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Button>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleListings.map((listing) => (
                <Card key={listing.id} className="cursor-pointer hover:shadow-md transition"
                  onClick={() => navigate(`/cattle/${listing.id}`)}
                >
                  <CardHeader className="p-0">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  </CardHeader>

                  <CardContent className="p-4">

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span>{listing.emoji}</span>
                        {listing.title}
                      </h3>

                      <Badge>{listing.status}</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">

                      <div className="flex justify-between">
                        <span>Breed:</span>
                        <span className="font-medium">{listing.breed}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Age:</span>
                        <span className="font-medium">{listing.age} years</span>
                      </div>

                      {listing.milkCapacity > 0 && (
                        <div className="flex justify-between">
                          <span>Milk:</span>
                          <span className="font-medium">{listing.milkCapacity}L/day</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{listing.weight} kg</span>
                      </div>

                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xl font-bold text-primary">
                        ₹{listing.price.toLocaleString()}
                      </p>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/health-records")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get instant help about cattle health, breeding, and market insights.
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/analytics")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View market trends, pricing insights, and performance analytics.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
