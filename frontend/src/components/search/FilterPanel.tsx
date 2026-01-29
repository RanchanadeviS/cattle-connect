import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterPanelProps {
  filters: {
    breed: string;
    ageRange: number[];
    weightRange: number[];
    milkYieldRange: number[];
    priceRange: number[];
    location: string;
  };
  onFilterChange: (key: string, value: any) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const breeds = [
    "Holstein", "Gir", "Jersey", "Sahiwal", "Red Sindhi", 
    "Tharparkar", "Rathi", "Hariana", "Ongole", "Deoni"
  ];

  const clearFilters = () => {
    onFilterChange("breed", "all");
    onFilterChange("ageRange", [0, 10]);
    onFilterChange("weightRange", [200, 800]);
    onFilterChange("milkYieldRange", [5, 40]);
    onFilterChange("priceRange", [20000, 200000]);
    onFilterChange("location", "");
  };

  return (
    <div className="space-y-6">
      {/* Breed Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Breed</Label>
        <Select 
          value={filters.breed} 
          onValueChange={(value) => onFilterChange("breed", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select breed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Breeds</SelectItem>
            {breeds.map((breed) => (
              <SelectItem key={breed} value={breed.toLowerCase()}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Input
          placeholder="Enter city or state"
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
        />
      </div>

      {/* Age Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
        </Label>
        <Slider
          value={filters.ageRange}
          onValueChange={(value) => onFilterChange("ageRange", value)}
          max={10}
          min={0}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Weight Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Weight Range: {filters.weightRange[0]} - {filters.weightRange[1]} kg
        </Label>
        <Slider
          value={filters.weightRange}
          onValueChange={(value) => onFilterChange("weightRange", value)}
          max={800}
          min={200}
          step={10}
          className="w-full"
        />
      </div>

      {/* Milk Yield Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Milk Yield: {filters.milkYieldRange[0]} - {filters.milkYieldRange[1]} L/day
        </Label>
        <Slider
          value={filters.milkYieldRange}
          onValueChange={(value) => onFilterChange("milkYieldRange", value)}
          max={40}
          min={5}
          step={1}
          className="w-full"
        />
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange("priceRange", value)}
          max={200000}
          min={20000}
          step={5000}
          className="w-full"
        />
      </div>

      {/* Clear Filters Button */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
};

export default FilterPanel;