import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, IndianRupee, Truck, Gavel } from "lucide-react";
import { ListingFormData } from "@/pages/CreateListing";

interface PricingLocationStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const PricingLocationStep = ({ formData, updateFormData }: PricingLocationStepProps) => {
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-6">Pricing & Location Details</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <IndianRupee className="h-5 w-5 mr-2 text-primary" />
                Pricing Options
              </CardTitle>
              <CardDescription>
                Set your pricing strategy for the cattle listing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-base">Asking Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => updateFormData({ price: parseInt(e.target.value) || 0 })}
                  placeholder="50000"
                  min="0"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Set a competitive price based on market rates
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base flex items-center">
                    <Gavel className="h-4 w-4 mr-2" />
                    Enable Auction Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow buyers to bid on this cattle
                  </p>
                </div>
                <Switch
                  checked={formData.auction_enabled}
                  onCheckedChange={(checked) => updateFormData({ auction_enabled: checked })}
                />
              </div>

              {formData.auction_enabled && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Auction Mode:</strong> The price above will be the starting bid. 
                    Buyers can place higher bids, and you can accept the best offer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Location Details
              </CardTitle>
              <CardDescription>
                Specify where the cattle is located
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location_state">State *</Label>
                <Select 
                  value={formData.location_state} 
                  onValueChange={(value) => updateFormData({ location_state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location_city">City/District *</Label>
                <Input
                  id="location_city"
                  value={formData.location_city}
                  onChange={(e) => updateFormData({ location_city: e.target.value })}
                  placeholder="e.g., Pune, Ahmedabad, Bengaluru"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logistics Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Logistics & Delivery Options
            </CardTitle>
            <CardDescription>
              Specify how buyers can collect or receive the cattle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Pickup Available</Label>
                  <p className="text-sm text-muted-foreground">
                    Buyers can collect from your location
                  </p>
                </div>
                <Switch
                  checked={formData.pickup_available}
                  onCheckedChange={(checked) => updateFormData({ pickup_available: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Delivery Available</Label>
                  <p className="text-sm text-muted-foreground">
                    You can deliver to buyer's location
                  </p>
                </div>
                <Switch
                  checked={formData.delivery_available}
                  onCheckedChange={(checked) => updateFormData({ delivery_available: checked })}
                />
              </div>
            </div>

            {formData.delivery_available && (
              <div>
                <Label htmlFor="delivery_radius">Delivery Radius (km)</Label>
                <Input
                  id="delivery_radius"
                  type="number"
                  value={formData.delivery_radius_km || ""}
                  onChange={(e) => updateFormData({ delivery_radius_km: parseInt(e.target.value) || undefined })}
                  placeholder="50"
                  min="0"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum distance you're willing to deliver
                </p>
              </div>
            )}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">Transportation Tips:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Ensure proper transportation vehicle with adequate ventilation</li>
                <li>• Arrange for health certificates required for interstate transport</li>
                <li>• Consider insurance coverage during transportation</li>
                <li>• Coordinate timing to minimize stress on cattle</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingLocationStep;