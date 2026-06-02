import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Wine } from "@/types/database";

export const metadata: Metadata = {
  title: "Collections — Lost and Found Wines",
  description: "Explore the Origin and Uncharted wine collections from Lost and Found Wines.",
};

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wines")
    .select("*")
    .eq("active", true)
    .order("display_order");

  const wines = (data as Wine[]) ?? [];
  const origin = wines.filter((w) => w.collection === "origin");
  const uncharted = wines.filter((w) => w.collection === "uncharted");
  const adAstra = wines.filter((w) => w.collection === "ad-astra");

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Lost and Found</p>
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-white mb-6">
            Our Collections
          </h1>
          <p className="text-brand-muted max-w-xl mx-auto leading-relaxed text-sm">
            Two collections, one spirit of adventure. Each wine carries the story of its place, its vintage, and the journey that brought it to you.
          </p>
        </div>

        {/* Ad Astra */}
        {adAstra.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-6 mb-10">
              <div className="flex-1 h-px bg-brand-border" />
              <p className="text-xs tracking-[0.3em] uppercase text-brand-muted">Special Release</p>
              <div className="flex-1 h-px bg-brand-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adAstra.map((wine) => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          </section>
        )}

        {/* Origin */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-4">
            <div className="flex-1 h-px bg-brand-border" />
            <h2 className="text-sm tracking-[0.25em] uppercase text-white">Origin</h2>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <p className="text-center text-brand-muted text-sm mb-10">
            Return to the source — New Zealand&apos;s great wine regions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {origin.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop/origin" className="text-xs tracking-[0.15em] uppercase text-brand-muted hover:text-white border-b border-brand-muted hover:border-white pb-0.5 transition-colors">
              Shop Origin Collection →
            </Link>
          </div>
        </section>

        {/* Uncharted */}
        <section>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex-1 h-px bg-brand-border" />
            <h2 className="text-sm tracking-[0.25em] uppercase text-white">Uncharted</h2>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <p className="text-center text-brand-muted text-sm mb-10">
            Into new territory — Waiheke Island, Auckland
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {uncharted.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop/uncharted" className="text-xs tracking-[0.15em] uppercase text-brand-muted hover:text-white border-b border-brand-muted hover:border-white pb-0.5 transition-colors">
              Shop Uncharted Collection →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function WineCard({ wine }: { wine: Wine }) {
  return (
    <Link href={`/wines/${wine.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-brand-surface border border-brand-border overflow-hidden mb-4">
        {wine.image_url ? (
          <Image src={wine.image_url} alt={wine.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/images/logo-round.png" alt="" width={60} height={60} className="opacity-20 object-contain" />
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-1">
          {wine.variety}{wine.vintage ? ` · ${wine.vintage}` : ""}
        </p>
        <h3 className="text-sm text-white">{wine.name}</h3>
        {wine.region && <p className="text-brand-muted text-xs mt-1">{wine.region}</p>}
      </div>
    </Link>
  );
}
