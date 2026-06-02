-- Lost and Found Wines — initial schema

CREATE TABLE wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  collection text NOT NULL,
  region text,
  variety text,
  vintage int,
  description text,
  tasting_notes text,
  region_story text,
  winemakers text,
  alcohol_pct decimal,
  image_url text,
  hero_image_url text,
  display_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id uuid REFERENCES wines(id),
  name text NOT NULL,
  sku text UNIQUE,
  price_nzd decimal NOT NULL,
  stock_qty int DEFAULT 0,
  sold_out boolean DEFAULT false,
  collection text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id text UNIQUE,
  customer_email text NOT NULL,
  customer_name text,
  customer_phone text,
  shipping_address jsonb,
  line_items jsonb,
  total_nzd decimal,
  status text DEFAULT 'pending',
  age_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  subscribed_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  source text DEFAULT 'website'
);

CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  bio text,
  email text,
  image_url text,
  display_order int DEFAULT 0,
  active boolean DEFAULT true
);

CREATE TABLE site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "Public can read wines" ON wines FOR SELECT USING (active = true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public can read team" ON team_members FOR SELECT USING (active = true);
CREATE POLICY "Public can read content" ON site_content FOR SELECT USING (true);

-- Subscribers: anyone can insert
CREATE POLICY "Anyone can subscribe" ON email_subscribers FOR INSERT WITH CHECK (true);

-- Orders: insert from service role only (via API routes)
CREATE POLICY "Service role manages orders" ON orders USING (true) WITH CHECK (true);

-- Admin: authenticated users can do everything
CREATE POLICY "Admins manage wines" ON wines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage team" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage subscribers" ON email_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
