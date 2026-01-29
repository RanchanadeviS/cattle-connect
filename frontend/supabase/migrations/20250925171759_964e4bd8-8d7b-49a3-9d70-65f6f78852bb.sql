-- Add listing performance tracking
CREATE TABLE public.listing_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id INTEGER NOT NULL,
  viewer_id UUID, -- null for anonymous views
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on listing_views
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Policy for viewing listing views (only listing owners can see their views)
CREATE POLICY "Listing owners can view their listing analytics" 
ON public.listing_views 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM cattle_listings 
  WHERE cattle_listings.id = listing_views.cattle_id 
  AND cattle_listings.user_id = auth.uid()
));

-- Policy for inserting listing views (anyone can track views)
CREATE POLICY "Anyone can track listing views" 
ON public.listing_views 
FOR INSERT 
WITH CHECK (true);

-- Create analytics view for listing performance
CREATE OR REPLACE VIEW public.listing_analytics AS
SELECT 
  cl.id,
  cl.title,
  cl.price,
  cl.status,
  cl.created_at,
  cl.user_id,
  COALESCE(view_stats.total_views, 0) as total_views,
  COALESCE(view_stats.unique_views, 0) as unique_views,
  COALESCE(inquiry_stats.total_inquiries, 0) as total_inquiries,
  COALESCE(offer_stats.total_offers, 0) as total_offers,
  COALESCE(offer_stats.highest_offer, 0) as highest_offer
FROM cattle_listings cl
LEFT JOIN (
  SELECT 
    cattle_id,
    COUNT(*) as total_views,
    COUNT(DISTINCT COALESCE(viewer_id::text, ip_address::text)) as unique_views
  FROM listing_views 
  GROUP BY cattle_id
) view_stats ON cl.id = view_stats.cattle_id
LEFT JOIN (
  SELECT 
    cattle_id,
    COUNT(DISTINCT id) as total_inquiries
  FROM conversations 
  GROUP BY cattle_id
) inquiry_stats ON cl.id = inquiry_stats.cattle_id
LEFT JOIN (
  SELECT 
    cattle_id,
    COUNT(*) as total_offers,
    MAX(current_offer) as highest_offer
  FROM price_negotiations 
  GROUP BY cattle_id
) offer_stats ON cl.id = offer_stats.cattle_id;

-- Add indexes for better performance
CREATE INDEX idx_listing_views_cattle_id ON public.listing_views(cattle_id);
CREATE INDEX idx_listing_views_created_at ON public.listing_views(created_at);
CREATE INDEX idx_conversations_cattle_id ON public.conversations(cattle_id);
CREATE INDEX idx_price_negotiations_cattle_id ON public.price_negotiations(cattle_id);