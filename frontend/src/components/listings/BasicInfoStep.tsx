import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingFormData } from "@/pages/CreateListing";

interface BasicInfoStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const cattleBreeds = [
    "Holstein", "Jersey", "Gir", "Sindhi", "Sahiwal", "Red Sindhi",
    "Tharparkar", "Rathi", "Hariana", "Kangayam", "Ongole", "Nelore",
    "Brahman", "Angus", "Hereford", "Charolais", "Simmental", "Other"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Cattle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Premium Holstein Dairy Cow"
              required
            />
          </div>

          <div>
            <Label htmlFor="breed">Breed *</Label>
            <Select 
              value={formData.breed} 
              onValueChange={(value) => updateFormData({ breed: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {cattleBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed.toLowerCase()}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age">Age (months) *</Label>
            <Input
              id="age"
              type="number"
              value={formData.age_months || ""}
              onChange={(e) => updateFormData({ age_months: parseInt(e.target.value) || 0 })}
              placeholder="24"
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight_kg || ""}
              onChange={(e) => updateFormData({ weight_kg: parseInt(e.target.value) || 0 })}
              placeholder="450"
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value: "male" | "female") => updateFormData({ gender: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="milk_capacity">Daily Milk Yield (liters)</Label>
            <Input
              id="milk_capacity"
              type="number"
              value={formData.milk_capacity_liters || ""}
              onChange={(e) => updateFormData({ milk_capacity_liters: parseInt(e.target.value) || undefined })}
              placeholder="15"
              min="0"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank if not a dairy cow
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Provide detailed description including temperament, health condition, breeding history, etc."
            rows={4}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Minimum 50 characters. Be detailed to attract serious buyers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;