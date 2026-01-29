import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BasicInfoStep from "@/components/listings/BasicInfoStep";
import MediaUploadStep from "@/components/listings/MediaUploadStep";
import HealthInfoStep from "@/components/listings/HealthInfoStep";
import PricingLocationStep from "@/components/listings/PricingLocationStep";

interface FormData {
  title: string;
  breed: string;
  gender: "female" | "male";
  age_months: number;
  weight_kg: number;
  milk_capacity_liters: number | null;
  description: string;
  health_status: "healthy" | "under_treatment" | "vaccinated";
  vaccination_status: "up_to_date" | "partial" | "pending";
  last_vaccination_date: string;
  breeding_history: string;
  special_notes: string;
  feed_type: string;
  price: number;
  auction_enabled: boolean;
  location_city: string;
  location_state: string;
  pickup_available: boolean;
  delivery_available: boolean;
  delivery_radius_km: number | null;
  images: File[];
  videos: File[];
  health_documents: File[];
}

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    breed: "",
    gender: "female",
    age_months: 0,
    weight_kg: 0,
    milk_capacity_liters: null,
    description: "",
    health_status: "healthy",
    vaccination_status: "up_to_date",
    last_vaccination_date: "",
    breeding_history: "",
    special_notes: "",
    feed_type: "",
    price: 0,
    auction_enabled: false,
    location_city: "",
    location_state: "",
    pickup_available: true,
    delivery_available: false,
    delivery_radius_km: null,
    images: [],
    videos: [],
    health_documents: [],
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to edit listings");
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('cattle_listings')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("Listing not found or you don't have permission to edit it");
          navigate('/my-listings');
          return;
        }
        throw error;
      }

      setFormData({
        title: data.title || "",
        breed: data.breed || "",
        gender: (data.gender as "female" | "male") || "female",
        age_months: data.age_months || 0,
        weight_kg: data.weight_kg || 0,
        milk_capacity_liters: data.milk_capacity_liters,
        description: data.description || "",
        health_status: (data.health_status as "healthy" | "under_treatment" | "vaccinated") || "healthy",
        vaccination_status: (data.vaccination_status as "up_to_date" | "partial" | "pending") || "up_to_date",
        last_vaccination_date: data.last_vaccination_date || "",
        breeding_history: data.breeding_history || "",
        special_notes: data.special_notes || "",
        feed_type: data.feed_type || "",
        price: data.price || 0,
        auction_enabled: data.auction_enabled || false,
        location_city: data.location_city || "",
        location_state: data.location_state || "",
        pickup_available: data.pickup_available || true,
        delivery_available: data.delivery_available || false,
        delivery_radius_km: data.delivery_radius_km,
        images: [],
        videos: [],
        health_documents: [],
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error("Failed to load listing");
      navigate('/my-listings');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to update listings");
        return;
      }

      const { error } = await supabase
        .from('cattle_listings')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parseInt(id!))
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Listing updated successfully!");
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/my-listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Listing</h1>
              <p className="text-muted-foreground">Update your cattle listing details</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoStep
                formData={formData}
                updateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent>
              <HealthInfoStep
                formData={formData}
                updateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
            </CardHeader>
            <CardContent>
              <PricingLocationStep
                formData={formData}
                updateFormData={updateFormData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditListing;