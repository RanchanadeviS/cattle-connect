import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Shield, Heart } from "lucide-react";
import { ListingFormData } from "@/pages/CreateListing";
import { toast } from "sonner";

interface HealthInfoStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const HealthInfoStep = ({ formData, updateFormData }: HealthInfoStepProps) => {
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validDocs = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Use PDF or image files.`);
        return false;
      }
      return true;
    });

    if (formData.health_documents.length + validDocs.length > 5) {
      toast.error("Maximum 5 health documents allowed per listing.");
      return;
    }

    updateFormData({ health_documents: [...formData.health_documents, ...validDocs] });
  };

  const removeDocument = (index: number) => {
    const newDocs = formData.health_documents.filter((_, i) => i !== index);
    updateFormData({ health_documents: newDocs });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Health Information & Records
        </h3>
        <p className="text-muted-foreground mb-6">
          Provide health details and upload vaccination records to build buyer confidence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Status */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="health_status" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Overall Health Status *
              </Label>
              <Select 
                value={formData.health_status} 
                onValueChange={(value: "healthy" | "under_treatment" | "vaccinated") => 
                  updateFormData({ health_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="vaccinated">Recently Vaccinated</SelectItem>
                  <SelectItem value="under_treatment">Under Treatment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vaccination_status">Vaccination Status *</Label>
              <Select 
                value={formData.vaccination_status} 
                onValueChange={(value: "up_to_date" | "partial" | "pending") => 
                  updateFormData({ vaccination_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up_to_date">Up to Date</SelectItem>
                  <SelectItem value="partial">Partially Vaccinated</SelectItem>
                  <SelectItem value="pending">Vaccination Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="last_vaccination">Last Vaccination Date</Label>
              <Input
                id="last_vaccination"
                type="date"
                value={formData.last_vaccination_date || ""}
                onChange={(e) => updateFormData({ last_vaccination_date: e.target.value })}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="feed_type">Feed Type</Label>
              <Input
                id="feed_type"
                value={formData.feed_type || ""}
                onChange={(e) => updateFormData({ feed_type: e.target.value })}
                placeholder="e.g., Grass-fed, Organic feed, Mixed diet"
              />
            </div>

            <div>
              <Label htmlFor="breeding_history">Breeding History</Label>
              <Textarea
                id="breeding_history"
                value={formData.breeding_history || ""}
                onChange={(e) => updateFormData({ breeding_history: e.target.value })}
                placeholder="Number of calves, breeding dates, pregnancy status, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="special_notes">Special Care Notes</Label>
              <Textarea
                id="special_notes"
                value={formData.special_notes || ""}
                onChange={(e) => updateFormData({ special_notes: e.target.value })}
                placeholder="Any special care requirements, medications, behavioral notes, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Health Documents Upload */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Health Documents & Certificates
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => documentInputRef.current?.click()}
              disabled={formData.health_documents.length >= 5}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents ({formData.health_documents.length}/5)
            </Button>
          </div>

          <input
            ref={documentInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentUpload}
            className="hidden"
          />

          {formData.health_documents.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Health Documents
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {formData.health_documents.map((file, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Recommended Documents:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Vaccination certificates</li>
              <li>• Health clearance certificates</li>
              <li>• Veterinary inspection reports</li>
              <li>• Breeding certificates (if applicable)</li>
              <li>• Medical treatment records</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Accepted formats: PDF, JPG, PNG (Max 10MB each)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfoStep;