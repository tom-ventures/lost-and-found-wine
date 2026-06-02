import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartSection from "@/components/wine/AddToCartSection";
import type { ProductWithWine, Wine } from "@/types/database";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name")
    .eq("sku", params.slug.toUpperCase())
    .single();
  if (!data) return { title: "Product not found" };
  const product = data as { name: string };
  return { title: `${product.name} — Lost and Found Wines` };
}

export default async function ProductPage({ params }: Props) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*, wines(*)")
    .eq("sku", params.slug.toUpperCase())
    .eq("active", true)
    .single();

  if (!data) notFound();

  const product = data as ProductWithWine;
  const wine = product.wines as Wine | null;

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <nav className="mb-12 flex gap-2 text-xs text-brand-muted">
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          {product.collection && (
            <>
              <Link href={`/shop/${product.collection}`} className="hover:text-white transition-colors capitalize">
                {product.collection}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="relative aspect-[3/4] bg-brand-surface border border-brand-border">
            {product.image_url || wine?.image_url ? (
              <Image
                src={(product.image_url || wine?.image_url)!}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/images/logo-round.png" alt="" width={100} height={100} className="opacity-20 object-contain" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {product.collection && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-3 capitalize">
                {product.collection} Collection
              </p>
            )}
            <h1 className="text-2xl font-light tracking-[0.05em] uppercase text-white mb-2">
              {product.name}
            </h1>
            {wine?.region && <p className="text-brand-muted text-sm mb-8">{wine.region}</p>}
            {wine?.description && (
              <p className="text-brand-text leading-relaxed mb-8 text-sm">{wine.description}</p>
            )}

            <AddToCartSection product={product} wine={wine} />

            {wine && (
              <div className="mt-8 pt-8 border-t border-brand-border space-y-3">
                {wine.variety && (
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted uppercase tracking-wide">Variety</span>
                    <span className="text-brand-text">{wine.variety}</span>
                  </div>
                )}
                {wine.vintage && (
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted uppercase tracking-wide">Vintage</span>
                    <span className="text-brand-text">{wine.vintage}</span>
                  </div>
                )}
                {wine.alcohol_pct && (
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted uppercase tracking-wide">Alcohol</span>
                    <span className="text-brand-text">{wine.alcohol_pct}%</span>
                  </div>
                )}
              </div>
            )}

            {wine && (
              <div className="mt-6">
                <Link
                  href={`/wines/${wine.slug}`}
                  className="text-xs tracking-[0.15em] uppercase text-brand-muted hover:text-white border-b border-brand-muted hover:border-white pb-0.5 transition-colors"
                >
                  Full wine details →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
