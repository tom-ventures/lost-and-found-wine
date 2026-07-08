-- CRM: customers table
CREATE TABLE customers (
  email text PRIMARY KEY,
  name text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage customers" ON customers FOR ALL USING (auth.role() = 'authenticated');

-- Backfill from existing orders (most recent name/phone per email wins)
INSERT INTO customers (email, name, phone, created_at)
SELECT DISTINCT ON (customer_email)
  customer_email,
  customer_name,
  customer_phone,
  created_at
FROM orders
ORDER BY customer_email, created_at DESC
ON CONFLICT (email) DO NOTHING;

-- Backfill from existing subscribers not already captured via orders
INSERT INTO customers (email, name, created_at)
SELECT
  email,
  NULLIF(TRIM(CONCAT(first_name, ' ', last_name)), ''),
  subscribed_at
FROM email_subscribers
ON CONFLICT (email) DO NOTHING;

-- CMS: make hero/contact background images editable via /admin/content
INSERT INTO site_content (key, value) VALUES
('hero_bg_image_url', 'https://jigmhnzhixerlqesqayq.supabase.co/storage/v1/object/public/wine-images/homepage-hero.webp'),
('contact_bg_image_url', 'https://jigmhnzhixerlqesqayq.supabase.co/storage/v1/object/public/wine-images/contact-bg.webp')
ON CONFLICT (key) DO NOTHING;
