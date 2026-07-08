import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import type { SiteContent } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: heroData }, { data: signupData }] = await Promise.all([
    supabase.from("site_content").select("key,value").in("key", ["hero_title", "hero_subtitle", "hero_cta", "hero_bg_image_url"]),
    supabase.from("site_content").select("key,value").in("key", ["signup_title", "signup_subtitle"]),
  ]);

  const content = Object.fromEntries(
    [...((heroData as SiteContent[]) ?? []), ...((signupData as SiteContent[]) ?? [])].map((r) => [r.key, r.value ?? ""])
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <Image
          src={content.hero_bg_image_url || "https://jigmhnzhixerlqesqayq.supabase.co/storage/v1/object/public/wine-images/homepage-hero.webp"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/60 via-brand-slate/25 to-brand-bg/90" />
        <div className="relative z-10 max-w-2xl mx-auto pt-20">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1588209227733-Y5AIO011ZXJLMZQWARYA/LAF+LOGO+WHITE.png"
            alt="Lost and Found Wines"
            width={300}
            height={84}
            className="mx-auto mb-12 object-contain"
            priority
          />
          <p className="text-xs tracking-[0.3em] uppercase text-brand-cream mb-6">
            New Zealand
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.1em] uppercase text-white mb-6 leading-relaxed drop-shadow-md">
            {content.hero_title || "A Journey of Discovery"}
          </h1>
          <p className="text-brand-text text-lg leading-relaxed mb-12 font-light drop-shadow-md">
            {content.hero_subtitle ||
              "Lost and Found is on a journey of DISCOVERY. We'd love you to join us."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-brand-cream text-brand-cream-text px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors duration-200"
            >
              {content.hero_cta || "Explore Our Wines"}
            </Link>
            <Link
              href="/collections"
              className="border border-white/40 text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:border-white transition-colors duration-200"
            >
              Our Collections
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-brand-border" />
        </div>
      </section>

      {/* Collections teaser */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-slate text-center mb-4">Our Collections</p>
          <h2 className="text-2xl font-light tracking-[0.1em] uppercase text-white text-center mb-16">
            Two paths. One journey.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/shop/origin"
              className="group relative border border-brand-border p-10 hover:border-white transition-colors duration-300"
            >
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-brand-slate mb-3">Collection</p>
                <h3 className="text-xl font-light tracking-[0.15em] uppercase text-white mb-4">Origin</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Return to the source. The Origin collection celebrates the distinctive terroir of New Zealand&apos;s great wine regions — Central Otago, Nelson, and beyond.
                </p>
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-white border-b border-white pb-0.5 group-hover:tracking-[0.2em] transition-all duration-300">
                Explore Origin →
              </span>
            </Link>

            <Link
              href="/shop/uncharted"
              className="group relative border border-brand-border p-10 hover:border-white transition-colors duration-300"
            >
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-brand-slate mb-3">Collection</p>
                <h3 className="text-xl font-light tracking-[0.15em] uppercase text-white mb-4">Uncharted</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Into new territory. The Uncharted collection pushes boundaries on Waiheke Island — an island of volcanic soils, maritime winds, and remarkable wines.
                </p>
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-white border-b border-white pb-0.5 group-hover:tracking-[0.2em] transition-all duration-300">
                Explore Uncharted →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Astra spotlight */}
      <section className="py-24 px-6 border-y border-brand-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-brand-slate mb-4">Special Release</p>
          <h2 className="text-3xl font-light tracking-[0.15em] uppercase text-white mb-6">Ad Astra</h2>
          <p className="text-brand-muted leading-relaxed mb-10">
            To the stars. Our celebration wine — crafted in the traditional method, aged on lees, and released for the moments worth marking.
          </p>
          <Link
            href="/wines/ad-astra-nv"
            className="bg-brand-cream text-brand-cream-text px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors duration-200 inline-block"
          >
            Discover Ad Astra
          </Link>
        </div>
      </section>

      {/* Email signup */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1576118172230-796H1E52GYKJ6Z5S7TFJ/Logo_360_Whitex.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto mb-8 opacity-60 object-contain"
          />
          <h2 className="text-2xl font-light tracking-[0.15em] uppercase text-white mb-4">
            {content.signup_title || "Get Lost With Us"}
          </h2>
          <p className="text-brand-muted text-sm mb-10 leading-relaxed">
            {content.signup_subtitle ||
              "Join our community of explorers. Be first to hear about new releases and discoveries."}
          </p>
          <SignupForm />
        </div>
      </section>
    </div>
  );
}
