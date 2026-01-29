-- Fix the analytics view security issue by enabling SECURITY INVOKER
ALTER VIEW public.listing_analytics SET (security_invoker=on);