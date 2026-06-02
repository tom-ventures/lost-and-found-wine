import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartSection from "@/components/wine/AddToCartSection";
import type { Wine, Product } from "@/types/database";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("wines").select("name,description").eq("slug", params.slug).single();
  const wine = data as Pick<Wine, "name" | "description"> | null;
  if (!wine) return { title: "Wine not found" };
  return {
    title: `${wine.name} — Lost and Found Wines`,
    description: wine.description ?? undefined,
  };
}

export default async function WinePage({ params }: Props) {
  const supabase = await createClient();

  const { data: wineData } = await supabase
    .from("wines")
    .select("*")
    .eq("slug", params.slug)
    .eq("active", true)
    .single();

  const wine = wineData as Wine | null;
  if (!wine) notFound();

  const { data: productData } = await supabase
    .from("products")
    .select("*")
    .eq("wine_id", wine.id)
    .eq("active", true)
    .single();

  const product = productData as Product | null;

  const collectionLabel =
    wine.collection === "origin"
      ? "Origin Collection"
      : wine.collection === "uncharted"
      ? "Uncharted Collection"
      : wine.collection === "ad-astra"
      ? "Ad Astra"
      : "Lost and Found";

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-end border-b border-brand-border">
        {wine.hero_image_url ? (
          <div className="absolute inset-0">
            <Image src={wine.hero_image_url} alt={wine.name} fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-surface to-brand-bg" />
        )}
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <p className="text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-3">{collectionLabel}</p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.1em] uppercase text-white mb-2">
            {wine.name}
          </h1>
          {wine.region && <p className="text-brand-muted text-sm">{wine.region}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="relative aspect-[3/4] bg-brand-surface border border-brand-border">
              {wine.image_url ? (
                <Image src={wine.image_url} alt={wine.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1576118172230-796H1E52GYKJ6Z5S7TFJ/Logo_360_Whitex.png" alt="" width={80} height={80} className="opacity-20 object-contain" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              {wine.description && (
                <p className="text-brand-text leading-relaxed mb-6">{wine.description}</p>
              )}
              <AddToCartSection product={product} wine={wine} />
            </div>
          </div>

          {wine.tasting_notes && (
            <div className="border-t border-brand-border pt-10">
              <h2 className="text-xs tracking-[0.25em] uppercase text-brand-muted mb-4">Tasting Notes</h2>
              <p className="text-brand-text leading-relaxed">{wine.tasting_notes}</p>
            </div>
          )}

          {wine.region_story && (
            <div className="border-t border-brand-border pt-10">
              <h2 className="text-xs tracking-[0.25em] uppercase text-brand-muted mb-4">The Region</h2>
              <p className="text-brand-text leading-relaxed">{wine.region_story}</p>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="border border-brand-border p-6">
            <h3 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-5">Details</h3>
            <dl className="space-y-3">
              {wine.variety && <Detail label="Variety" value={wine.variety} />}
              {wine.vintage && <Detail label="Vintage" value={String(wine.vintage)} />}
              {wine.region && <Detail label="Region" value={wine.region} />}
              {wine.alcohol_pct && <Detail label="Alcohol" value={`${wine.alcohol_pct}%`} />}
              {wine.winemakers && <Detail label="Winemakers" value={wine.winemakers} />}
            </dl>
          </div>

          <div className="border-t border-brand-border pt-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-3">Collection</p>
            <Link
              href={`/shop/${wine.collection}`}
              className="text-xs tracking-[0.1em] uppercase text-white hover:text-brand-muted transition-colors border-b border-brand-border pb-0.5"
            >
              {collectionLabel} →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-xs text-brand-muted uppercase tracking-wide">{label}</dt>
      <dd className="text-xs text-brand-text text-right">{value}</dd>
    </div>
  );
}
