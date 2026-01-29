import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, MoreHorizontal, MapPin, IndianRupee, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import holsteinImage1 from "@/assets/cattle-holstein-1.jpg";
import girImage1 from "@/assets/cattle-gir-1.jpg";
import jerseyImage1 from "@/assets/cattle-jersey-1.jpg";

interface CattleListing {
  id: number;
  title: string;
  breed: string;
  age_months: number;
  price: number;
  location_city: string;
  location_state: string;
  status: string;
  created_at: string;
  auction_enabled: boolean;
  user_id: string;
  total_views: number;
  unique_views: number;
  total_inquiries: number;
  total_offers: number;
  highest_offer: number;
}

const MyListings = () => {
  const [listings, setListings] = useState<CattleListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to view your listings");
        return;
      }

      const { data, error } = await supabase
        .from('cattle_listings')
        .select(`
          id,
          title,
          breed,
          age_months,
          price,
          location_city,
          location_state,
          status,
          created_at,
          auction_enabled,
          user_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get analytics data for each listing
      const listingsWithAnalytics = await Promise.all(
        (data || []).map(async (listing) => {
          const { data: analytics } = await supabase
            .from('listing_analytics')
            .select('total_views, unique_views, total_inquiries, total_offers, highest_offer')
            .eq('id', listing.id)
            .single();

          return {
            ...listing,
            total_views: analytics?.total_views || 0,
            unique_views: analytics?.unique_views || 0,
            total_inquiries: analytics?.total_inquiries || 0,
            total_offers: analytics?.total_offers || 0,
            highest_offer: analytics?.highest_offer || 0,
          };
        })
      );

      // If no listings, show sample data
      if (listingsWithAnalytics.length === 0) {
        setListings([
          {
            id: 1,
            title: "Holstein Dairy Cow - High Milk Producer",
            breed: "Holstein",
            age_months: 42,
            price: 85000,
            location_city: "Pune",
            location_state: "Maharashtra",
            status: "active",
            created_at: new Date().toISOString(),
            auction_enabled: false,
            user_id: user?.id || '',
            total_views: 245,
            unique_views: 187,
            total_inquiries: 23,
            total_offers: 8,
            highest_offer: 82000
          },
          {
            id: 2,
            title: "Gir Bull - Premium Breeding Stock",
            breed: "Gir",
            age_months: 48,
            price: 95000,
            location_city: "Rajkot",
            location_state: "Gujarat",
            status: "active",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            auction_enabled: false,
            user_id: user?.id || '',
            total_views: 189,
            unique_views: 142,
            total_inquiries: 18,
            total_offers: 5,
            highest_offer: 90000
          },
          {
            id: 3,
            title: "Jersey Cow - Excellent Milk Quality",
            breed: "Jersey",
            age_months: 30,
            price: 65000,
            location_city: "Dehradun",
            location_state: "Uttarakhand",
            status: "sold",
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            auction_enabled: false,
            user_id: user?.id || '',
            total_views: 312,
            unique_views: 234,
            total_inquiries: 45,
            total_offers: 15,
            highest_offer: 67000
          }
        ] as any);
      } else {
        setListings(listingsWithAnalytics);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (listingId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('cattle_listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus }
          : listing
      ));

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : newStatus}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error("Failed to update listing status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Cattle Listings</h1>
            <p className="text-muted-foreground">
              Manage your cattle listings and track their performance
            </p>
          </div>
          <Link to="/listings/create">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">
                        {listing.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="capitalize">
                          {listing.breed}
                        </Badge>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/listings/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/listings/${listing.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Listing
                          </Link>
                        </DropdownMenuItem>
                        {listing.status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => updateListingStatus(listing.id, 'inactive')}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        {listing.status === 'inactive' && (
                          <DropdownMenuItem 
                            onClick={() => updateListingStatus(listing.id, 'active')}
                          >
                            Activate
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'sold' && (
                          <DropdownMenuItem 
                            onClick={() => updateListingStatus(listing.id, 'sold')}
                          >
                            Mark as Sold
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {listing.price.toLocaleString('en-IN')}
                    </span>
                    {listing.auction_enabled && (
                      <Badge variant="outline">Auction</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {listing.age_months} months old
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {listing.location_city}, {listing.location_state}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-xs text-muted-foreground">Views</div>
                      <div className="font-medium">{listing.total_views} ({listing.unique_views} unique)</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Inquiries</div>
                      <div className="font-medium">{listing.total_inquiries}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Offers</div>
                      <div className="font-medium">{listing.total_offers}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Highest Offer</div>
                      <div className="font-medium">
                        {listing.highest_offer > 0 ? `₹${listing.highest_offer.toLocaleString('en-IN')}` : 'None'}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(listing.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/listings/${listing.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/listings/${listing.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {listings.length > 0 && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              💡 <strong>Sample Data:</strong> These are demo listings to help you get started. Create your own listings to replace them!
            </p>
            <Link to="/listings/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Real Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;