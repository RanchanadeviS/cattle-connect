import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import BasicInfoStep from "@/components/listings/BasicInfoStep";
import MediaUploadStep from "@/components/listings/MediaUploadStep";
import HealthInfoStep from "@/components/listings/HealthInfoStep";
import PricingLocationStep from "@/components/listings/PricingLocationStep";
import PreviewStep from "@/components/listings/PreviewStep";
import { supabase } from "@/integrations/supabase/client";

export interface ListingFormData {
  // Basic Info
  title: string;
  breed: string;
  age_months: number;
  weight_kg: number;
  gender: "male" | "female";
  milk_capacity_liters?: number;
  description: string;
  
  // Media
  images: File[];
  videos: File[];
  
  // Health Info
  health_status: "healthy" | "under_treatment" | "vaccinated";
  vaccination_status: "up_to_date" | "partial" | "pending";
  last_vaccination_date?: string;
  breeding_history?: string;
  feed_type?: string;
  special_notes?: string;
  health_documents: File[];
  
  // Pricing & Location
  price: number;
  auction_enabled: boolean;
  location_city: string;
  location_state: string;
  pickup_available: boolean;
  delivery_available: boolean;
  delivery_radius_km?: number;
}

const CreateListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    breed: "",
    age_months: 0,
    weight_kg: 0,
    gender: "female",
    description: "",
    images: [],
    videos: [],
    health_status: "healthy",
    vaccination_status: "up_to_date",
    health_documents: [],
    price: 0,
    auction_enabled: false,
    location_city: "",
    location_state: "",
    pickup_available: true,
    delivery_available: false,
  });

  const steps = [
    { title: "Basic Info", description: "Cattle details and description" },
    { title: "Media", description: "Upload images and videos" },
    { title: "Health Info", description: "Health records and documents" },
    { title: "Pricing & Location", description: "Set price and location" },
    { title: "Preview", description: "Review and publish" },
  ];

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to create a listing");
        return;
      }

      // Create the listing
      const { data: listing, error: listingError } = await supabase
        .from("cattle_listings")
        .insert({
          user_id: user.id,
          title: formData.title,
          breed: formData.breed,
          age_months: formData.age_months,
          weight_kg: formData.weight_kg,
          gender: formData.gender,
          milk_capacity_liters: formData.milk_capacity_liters,
          description: formData.description,
          price: formData.price,
          auction_enabled: formData.auction_enabled,
          location_city: formData.location_city,
          location_state: formData.location_state,
          pickup_available: formData.pickup_available,
          delivery_available: formData.delivery_available,
          delivery_radius_km: formData.delivery_radius_km,
          health_status: formData.health_status,
          vaccination_status: formData.vaccination_status,
          last_vaccination_date: formData.last_vaccination_date,
          breeding_history: formData.breeding_history,
          feed_type: formData.feed_type,
          special_notes: formData.special_notes,
          status: 'active'
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images
      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        const fileName = `${user.id}/${listing.id}/image_${i + 1}_${Date.now()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cattle-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save to cattle_media table
        await supabase.from('cattle_media').insert({
          cattle_id: listing.id,
          file_path: fileName,
          file_name: file.name,
          file_type: 'image',
          file_size: file.size,
          is_primary: i === 0
        });
      }

      // Upload videos
      for (let i = 0; i < formData.videos.length; i++) {
        const file = formData.videos[i];
        const fileName = `${user.id}/${listing.id}/video_${i + 1}_${Date.now()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cattle-videos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        await supabase.from('cattle_media').insert({
          cattle_id: listing.id,
          file_path: fileName,
          file_name: file.name,
          file_type: 'video',
          file_size: file.size
        });
      }

      // Upload health documents
      for (let i = 0; i < formData.health_documents.length; i++) {
        const file = formData.health_documents[i];
        const fileName = `${user.id}/${listing.id}/health_${i + 1}_${Date.now()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('health-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        await supabase.from('health_documents').insert({
          cattle_id: listing.id,
          document_type: 'vaccination_record',
          file_path: fileName,
          file_name: file.name
        });
      }

      toast.success("Listing created successfully!");
      navigate(`/listings/${listing.id}`);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <MediaUploadStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <HealthInfoStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PricingLocationStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <PreviewStep formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Create Cattle Listing</h1>
          <p className="text-muted-foreground">
            Follow the steps below to create your cattle listing
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep - 1].description}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </div>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateListing;