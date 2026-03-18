-- Cofelton Admin Panel - Supabase schema
-- 1. Create project at supabase.com
-- 2. Run this in SQL Editor

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  price_usd TEXT,
  price_som TEXT NOT NULL,
  features_ru TEXT[] DEFAULT '{}',
  features_uz TEXT[] DEFAULT '{}',
  image_url TEXT,
  delivery_days TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age TEXT,
  city TEXT NOT NULL,
  text_ru TEXT NOT NULL,
  text_uz TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  form_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  path TEXT DEFAULT '/',
  country TEXT,
  city TEXT,
  user_agent TEXT
);

-- Add columns if table exists (run separately if needed):
-- ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country TEXT;
-- ALTER TABLE page_views ADD COLUMN IF NOT EXISTS city TEXT;
-- ALTER TABLE page_views ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- RLS: allow public read for products, reviews; allow insert for forms and page_views
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert form_submissions" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);

-- Allow all for products/reviews (admin uses anon key - in production use service role or auth)
CREATE POLICY "Public all products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public all reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read form_submissions" ON form_submissions FOR SELECT USING (true);
CREATE POLICY "Public read page_views" ON page_views FOR SELECT USING (true);

-- Storage: maxsulot rasmlari uchun bucket (5MB limit)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage: barcha o'qish va yozish (anon key - productionda auth qo'shing)
CREATE POLICY "Public read products images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public upload products images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Public update products images" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "Public delete products images" ON storage.objects FOR DELETE USING (bucket_id = 'products');
