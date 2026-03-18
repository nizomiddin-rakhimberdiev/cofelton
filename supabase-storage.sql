-- Rasm yuklash uchun Storage sozlash
-- Agar asosiy schema allaqachon ishlatilgan bo'lsa, faqat shu faylni SQL Editor da bajaring

-- Bucket yaratish
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy'lar (agar xato bersa, Dashboard > Storage > products > Policies dan qo'lda qo'shing)
DROP POLICY IF EXISTS "Public read products images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload products images" ON storage.objects;
DROP POLICY IF EXISTS "Public update products images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete products images" ON storage.objects;

CREATE POLICY "Public read products images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public upload products images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Public update products images" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "Public delete products images" ON storage.objects FOR DELETE USING (bucket_id = 'products');
