import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";
import type { ProductWithWine } from "@/types/database";

export const metadata: Metadata = {
  title: "Uncharted Collection — Lost and Found Wines",
  description: "The Uncharted collection pushes boundaries on Waiheke Island.",
};

export default async function ShopUnchartedPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, wines(*)")
    .eq("active", true)
    .eq("collection", "uncharted")
    .order("created_at");

  const products = (data as ProductWithWine[]) ?? [];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Collection</p>
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-white mb-6">Uncharted</h1>
          <p className="text-brand-muted text-sm max-w-xl mx-auto leading-relaxed">
            Into new territory. The Uncharted collection pushes boundaries on Waiheke Island — an island of volcanic soils, maritime winds, and remarkable wines.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link href="/shop" className="text-xs tracking-[0.15em] uppercase border border-brand-border text-brand-muted hover:border-white hover:text-white px-6 py-2 transition-colors">All</Link>
          <Link href="/shop/origin" className="text-xs tracking-[0.15em] uppercase border border-brand-border text-brand-muted hover:border-white hover:text-white px-6 py-2 transition-colors">Origin</Link>
          <Link href="/shop/uncharted" className="text-xs tracking-[0.15em] uppercase border border-white text-white px-6 py-2">Uncharted</Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-center py-20">No products in this collection right now.</p>
        )}
      </div>
    </div>
  );
}
