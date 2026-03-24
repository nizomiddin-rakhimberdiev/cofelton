-- Mavjud Supabase loyihasi uchun migratsiya
-- SQL Editor da bajaring

-- Products: aksiya tugash sanasi (kalendardan)
ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_until DATE;

-- Eski promo_date TEXT bo'lsa, keraksiz (ixtiyoriy):
-- ALTER TABLE products DROP COLUMN IF EXISTS promo_date;

-- Reviews: kasb, YouTube, avatar
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar_url TEXT;
