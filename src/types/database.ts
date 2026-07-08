export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Wine {
  id: string;
  slug: string;
  name: string;
  collection: string;
  region: string | null;
  variety: string | null;
  vintage: number | null;
  description: string | null;
  tasting_notes: string | null;
  region_story: string | null;
  winemakers: string | null;
  alcohol_pct: number | null;
  image_url: string | null;
  hero_image_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  wine_id: string | null;
  name: string;
  sku: string | null;
  price_nzd: number;
  stock_qty: number;
  sold_out: boolean;
  collection: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export interface ProductWithWine extends Product {
  wines: Wine | null;
}

export interface Order {
  id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: Json;
  line_items: Json;
  total_nzd: number | null;
  status: string;
  age_verified: boolean;
  created_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  subscribed_at: string;
  active: boolean;
  source: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  image_url: string | null;
  display_order: number;
  active: boolean;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface Customer {
  email: string;
  name: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  wine_name: string;
  price_nzd: number;
  quantity: number;
  image_url: string | null;
  sku: string | null;
}
