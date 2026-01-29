-- Create storage buckets for cattle media
INSERT INTO storage.buckets (id, name, public) VALUES ('cattle-images', 'cattle-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cattle-videos', 'cattle-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('health-documents', 'health-documents', false);

-- Create cattle listings table
CREATE TABLE public.cattle_listings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  breed TEXT NOT NULL,
  age_months INTEGER NOT NULL,
  weight_kg INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  milk_capacity_liters INTEGER,
  description TEXT,
  price INTEGER NOT NULL,
  auction_enabled BOOLEAN NOT NULL DEFAULT false,
  location_city TEXT NOT NULL,
  location_state TEXT NOT NULL,
  pickup_available BOOLEAN NOT NULL DEFAULT true,
  delivery_available BOOLEAN NOT NULL DEFAULT false,
  delivery_radius_km INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'inactive')),
  health_status TEXT NOT NULL DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'under_treatment', 'vaccinated')),
  vaccination_status TEXT NOT NULL DEFAULT 'up_to_date' CHECK (vaccination_status IN ('up_to_date', 'partial', 'pending')),
  last_vaccination_date DATE,
  breeding_history TEXT,
  feed_type TEXT,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cattle_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cattle_listings
CREATE POLICY "Users can view active listings" 
ON public.cattle_listings 
FOR SELECT 
USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can create their own listings" 
ON public.cattle_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.cattle_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.cattle_listings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create cattle media table for images/videos
CREATE TABLE public.cattle_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id INTEGER NOT NULL REFERENCES public.cattle_listings(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size INTEGER,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cattle_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cattle_media
CREATE POLICY "Users can view media for visible listings" 
ON public.cattle_media 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cattle_listings 
  WHERE id = cattle_media.cattle_id 
  AND (status = 'active' OR user_id = auth.uid())
));

CREATE POLICY "Users can manage media for their listings" 
ON public.cattle_media 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.cattle_listings 
  WHERE id = cattle_media.cattle_id 
  AND user_id = auth.uid()
));

-- Create health documents table
CREATE TABLE public.health_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id INTEGER NOT NULL REFERENCES public.cattle_listings(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('vaccination_record', 'health_certificate', 'medical_report', 'breeding_certificate')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  issued_date DATE,
  expiry_date DATE,
  issued_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_documents
CREATE POLICY "Users can view health docs for visible listings" 
ON public.health_documents 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cattle_listings 
  WHERE id = health_documents.cattle_id 
  AND (status = 'active' OR user_id = auth.uid())
));

CREATE POLICY "Users can manage health docs for their listings" 
ON public.health_documents 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.cattle_listings 
  WHERE id = health_documents.cattle_id 
  AND user_id = auth.uid()
));

-- Storage policies for cattle-images bucket
CREATE POLICY "Authenticated users can upload cattle images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cattle-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all cattle images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cattle-images');

CREATE POLICY "Users can update their own cattle images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cattle-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cattle images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cattle-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for cattle-videos bucket
CREATE POLICY "Authenticated users can upload cattle videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cattle-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all cattle videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cattle-videos');

CREATE POLICY "Users can update their own cattle videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cattle-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cattle videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cattle-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for health-documents bucket (private)
CREATE POLICY "Users can upload health documents for their listings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'health-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view health documents for their listings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'health-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own health documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'health-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own health documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'health-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for updated_at
CREATE TRIGGER update_cattle_listings_updated_at
BEFORE UPDATE ON public.cattle_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();