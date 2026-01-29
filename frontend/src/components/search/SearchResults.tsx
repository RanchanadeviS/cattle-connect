import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Eye, MessageCircle, MoreVertical, Bookmark } from "lucide-react";
import holsteinImage1 from "@/assets/cattle-holstein-1.jpg";
import holsteinImage2 from "@/assets/cattle-holstein-2.jpg";
import jerseyImage1 from "@/assets/cattle-jersey-1.jpg";
import jerseyImage2 from "@/assets/cattle-jersey-2.jpg";
import girImage1 from "@/assets/cattle-gir-1.jpg";
import girImage2 from "@/assets/cattle-gir-2.jpg";
import sindhiImage1 from "@/assets/cattle-sindhi-1.jpg";
import farmerAvatar1 from "@/assets/farmer-avatar-1.jpg";
import farmerAvatar2 from "@/assets/farmer-avatar-2.jpg";

interface SearchResultsProps {
  searchQuery: string;
  filters: {
    breed: string;
    ageRange: number[];
    weightRange: number[];
    milkYieldRange: number[];
    priceRange: number[];
    location: string;
  };
  sortBy: string;
  viewMode: "grid" | "list" | "map";
}

// Mock cattle data for Instagram-style feed
const mockCattleData = [
  {
    id: 1,
    name: "Holstein Dairy Cow",
    breed: "Holstein",
    age: 3.5,
    weight: 550,
    milkYield: 25,
    price: 85000,
    location: "Punjab, India",
    image: holsteinImage1,
    seller: "Ram Singh",
    sellerAvatar: farmerAvatar1,
    caption: "Healthy Holstein cow for sale! 🐄 Excellent milk production, well-maintained health records.",
    rating: 4.8,
    verified: true,
    featured: true,
    listedDays: 2,
    likes: 127,
    comments: 23
  },
  {
    id: 2,
    name: "Premium Gir Cow",
    breed: "Gir",
    age: 4,
    weight: 480,
    milkYield: 20,
    price: 95000,
    location: "Gujarat, India",
    image: girImage1,
    seller: "Patel Dairy",
    sellerAvatar: farmerAvatar2,
    caption: "Young Gir cow available 🌟 Pure breed with good milk yield. Contact for details!",
    rating: 4.9,
    verified: true,
    featured: false,
    listedDays: 5,
    likes: 89,
    comments: 15
  },
  {
    id: 3,
    name: "Jersey Cow",
    breed: "Jersey",
    age: 2.5,
    weight: 400,
    milkYield: 18,
    price: 65000,
    location: "Haryana, India",
    image: jerseyImage1,
    seller: "Kumar Farm",
    sellerAvatar: farmerAvatar1,
    caption: "Beautiful Jersey cow, perfect for dairy farming 🥛 Well-trained and healthy.",
    rating: 4.7,
    verified: true,
    featured: false,
    listedDays: 1,
    likes: 156,
    comments: 34
  },
  {
    id: 4,
    name: "Strong Holstein Bull",
    breed: "Holstein",
    age: 3,
    weight: 650,
    milkYield: 0,
    price: 120000,
    location: "Maharashtra, India",
    image: holsteinImage2,
    seller: "Sharma Farm",
    sellerAvatar: farmerAvatar2,
    caption: "Premium Holstein bull for breeding purposes 💪 Strong genetics and excellent health.",
    rating: 4.6,
    verified: true,
    featured: false,
    listedDays: 3,
    likes: 98,
    comments: 12
  },
  {
    id: 5,
    name: "Gir Dairy Cow",
    breed: "Gir",
    age: 2.8,
    weight: 420,
    milkYield: 22,
    price: 88000,
    location: "Rajasthan, India",
    image: girImage2,
    seller: "Rajesh Cattle Farm",
    sellerAvatar: farmerAvatar1,
    caption: "Healthy Gir cow with excellent milk capacity 🐮 All vaccinations up-to-date.",
    rating: 4.8,
    verified: true,
    featured: true,
    listedDays: 1,
    likes: 143,
    comments: 28
  },
  {
    id: 6,
    name: "Jersey Calf",
    breed: "Jersey",
    age: 0.8,
    weight: 180,
    milkYield: 0,
    price: 35000,
    location: "Punjab, India",
    image: jerseyImage2,
    seller: "Singh Dairy",
    sellerAvatar: farmerAvatar2,
    caption: "Young calf available for sale 🍼 Perfect for starting your dairy farm!",
    rating: 4.5,
    verified: false,
    featured: false,
    listedDays: 2,
    likes: 67,
    comments: 8
  }
];

const SearchResults = ({ searchQuery, filters, sortBy, viewMode }: SearchResultsProps) => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter and sort the data based on current filters
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockCattleData.filter(cattle => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        cattle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cattle.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cattle.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Breed filter
      const matchesBreed = !filters.breed || filters.breed === "all" || 
        cattle.breed.toLowerCase() === filters.breed;

      // Location filter
      const matchesLocation = !filters.location ||
        cattle.location.toLowerCase().includes(filters.location.toLowerCase());

      // Range filters
      const matchesAge = cattle.age >= filters.ageRange[0] && cattle.age <= filters.ageRange[1];
      const matchesWeight = cattle.weight >= filters.weightRange[0] && cattle.weight <= filters.weightRange[1];
      const matchesMilkYield = cattle.milkYield >= filters.milkYieldRange[0] && cattle.milkYield <= filters.milkYieldRange[1];
      const matchesPrice = cattle.price >= filters.priceRange[0] && cattle.price <= filters.priceRange[1];

      return matchesSearch && matchesBreed && matchesLocation && 
             matchesAge && matchesWeight && matchesMilkYield && matchesPrice;
    });

    // Sort the filtered data
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "newest":
        return filtered.sort((a, b) => a.listedDays - b.listedDays);
      case "milk-yield":
        return filtered.sort((a, b) => b.milkYield - a.milkYield);
      default: // relevance
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [searchQuery, filters, sortBy]);

  if (viewMode === "map") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Map View</p>
              <p className="text-muted-foreground">Interactive map showing cattle locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-muted-foreground">
          {filteredAndSortedData.length} posts
        </p>
      </div>

      {/* Instagram-style Feed */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "max-w-2xl mx-auto space-y-6"
      }>
        {filteredAndSortedData.map((cattle) => (
          viewMode === "grid" ? (
            // Grid Instagram Card
            <Card key={cattle.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              {/* User Header */}
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={cattle.sellerAvatar} alt={cattle.seller} />
                    <AvatarFallback>{cattle.seller.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {cattle.seller}
                      {cattle.verified && (
                        <Badge variant="secondary" className="h-4 px-1 text-xs bg-blue-500 text-white">✓</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{cattle.location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Image */}
              <Link to={`/listings/${cattle.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={cattle.image}
                    alt={cattle.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {cattle.featured && (
                    <Badge className="absolute top-3 left-3 bg-primary/90">
                      Featured
                    </Badge>
                  )}
                </div>
              </Link>

              {/* Actions */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleLike(cattle.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedPosts.has(cattle.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                    <Link to={`/listings/${cattle.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleSave(cattle.id)}
                  >
                    <Bookmark
                      className={`h-5 w-5 ${savedPosts.has(cattle.id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>

                {/* Likes and Caption */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {cattle.likes + (likedPosts.has(cattle.id) ? 1 : 0)} likes
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{cattle.seller}</span>
                    {cattle.caption}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    View all {cattle.comments} comments
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <span className="font-semibold text-primary text-sm">₹{cattle.price.toLocaleString()}</span>
                    <span>•</span>
                    <span>{cattle.breed}</span>
                    <span>•</span>
                    <span>{cattle.age} yrs</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase">
                    {cattle.listedDays} {cattle.listedDays === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            // List View - Full Instagram Post Style
            <Card key={cattle.id} className="overflow-hidden border shadow-md">
              {/* User Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={cattle.sellerAvatar} alt={cattle.seller} />
                    <AvatarFallback>{cattle.seller.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      {cattle.seller}
                      {cattle.verified && (
                        <Badge variant="secondary" className="h-4 px-1.5 text-xs bg-blue-500 text-white">✓</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {cattle.location}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Image */}
              <Link to={`/listings/${cattle.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={cattle.image}
                    alt={cattle.name}
                    className="w-full h-full object-cover"
                  />
                  {cattle.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-sm py-1">
                      ⭐ Featured
                    </Badge>
                  )}
                </div>
              </Link>

              {/* Actions */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 px-2"
                      onClick={() => toggleLike(cattle.id)}
                    >
                      <Heart
                        className={`h-6 w-6 ${likedPosts.has(cattle.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                    <Link to={`/listings/${cattle.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2 px-2">
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    onClick={() => toggleSave(cattle.id)}
                  >
                    <Bookmark
                      className={`h-6 w-6 ${savedPosts.has(cattle.id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>

                {/* Likes Count */}
                <p className="text-sm font-semibold">
                  {cattle.likes + (likedPosts.has(cattle.id) ? 1 : 0)} likes
                </p>

                {/* Caption */}
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{cattle.seller}</span>
                    {cattle.caption}
                  </p>
                  <Link to={`/listings/${cattle.id}`} className="text-sm text-muted-foreground hover:underline inline-block">
                    View all {cattle.comments} comments
                  </Link>
                </div>

                {/* Cattle Details */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="text-xs">
                    {cattle.breed}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {cattle.age} years old
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {cattle.weight} kg
                  </Badge>
                  {cattle.milkYield > 0 && (
                    <Badge variant="outline" className="text-xs text-primary border-primary">
                      {cattle.milkYield}L/day
                    </Badge>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-2xl font-bold text-primary">
                    ₹{cattle.price.toLocaleString()}
                  </p>
                  <Link to={`/listings/${cattle.id}`}>
                    <Button size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>

                {/* Time */}
                <p className="text-xs text-muted-foreground uppercase">
                  {cattle.listedDays} {cattle.listedDays === 1 ? 'day' : 'days'} ago
                </p>
              </div>
            </Card>
          )
        ))}
      </div>

      {filteredAndSortedData.length === 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            </div>
            <p className="text-xl font-semibold mb-2">No posts found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more cattle
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;