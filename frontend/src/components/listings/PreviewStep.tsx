import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Weight, 
  Milk, 
  Shield,
  FileText,
  Image,
  Video,
  Truck,
  Eye,
  CheckCircle
} from "lucide-react";
import { ListingFormData } from "@/pages/CreateListing";

interface PreviewStepProps {
  formData: ListingFormData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const PreviewStep = ({ formData, onSubmit, isSubmitting }: PreviewStepProps) => {
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'vaccinated': return 'bg-blue-100 text-blue-800';
      case 'under_treatment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVaccinationStatusColor = (status: string) => {
    switch (status) {
      case 'up_to_date': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
          <Eye className="h-5 w-5 mr-2" />
          Preview Your Listing
        </h3>
        <p className="text-muted-foreground">
          Review all details before publishing your cattle listing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Listing Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{formData.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {formData.breed}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {formData.gender}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {formData.price?.toLocaleString('en-IN')}
                  </p>
                  {formData.auction_enabled && (
                    <Badge variant="default" className="mt-1">
                      Auction Enabled
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{formData.age_months} months</p>
                  <p className="text-xs text-muted-foreground">Age</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Weight className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{formData.weight_kg} kg</p>
                  <p className="text-xs text-muted-foreground">Weight</p>
                </div>
                {formData.milk_capacity_liters && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Milk className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{formData.milk_capacity_liters}L</p>
                    <p className="text-xs text-muted-foreground">Daily Milk</p>
                  </div>
                )}
                <div className="text-center p-3 bg-muted rounded-lg">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium capitalize">{formData.location_city}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground text-sm">{formData.description}</p>
              </div>

              {/* Health Information */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Health Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Status</p>
                    <Badge className={getHealthStatusColor(formData.health_status)}>
                      {formData.health_status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vaccination</p>
                    <Badge className={getVaccinationStatusColor(formData.vaccination_status)}>
                      {formData.vaccination_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                {formData.last_vaccination_date && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last vaccinated: {new Date(formData.last_vaccination_date).toLocaleDateString()}
                  </p>
                )}
                
                {formData.breeding_history && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Breeding History</p>
                    <p className="text-sm text-muted-foreground">{formData.breeding_history}</p>
                  </div>
                )}
                
                {formData.special_notes && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Special Notes</p>
                    <p className="text-sm text-muted-foreground">{formData.special_notes}</p>
                  </div>
                )}
              </div>

              {/* Logistics */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Logistics
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pickup Available</span>
                    <Badge variant={formData.pickup_available ? "default" : "secondary"}>
                      {formData.pickup_available ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delivery Available</span>
                    <Badge variant={formData.delivery_available ? "default" : "secondary"}>
                      {formData.delivery_available ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {formData.delivery_available && formData.delivery_radius_km && (
                    <p className="text-sm text-muted-foreground">
                      Delivery within {formData.delivery_radius_km} km
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Documents Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Media Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Images</span>
                </div>
                <Badge variant="outline">{formData.images.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Videos</span>
                </div>
                <Badge variant="outline">{formData.videos.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Health Documents</span>
                </div>
                <Badge variant="outline">{formData.health_documents.length}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Ready to publish</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your listing will be visible to all buyers immediately after publication.
                </p>
              </div>
              
              <Button 
                onClick={onSubmit} 
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Publishing..." : "Publish Listing"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                You can edit or deactivate this listing anytime from your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;