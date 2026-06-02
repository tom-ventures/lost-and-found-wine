"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatNZD } from "@/lib/utils";
import type { Product } from "@/types/database";

interface Props {
  product: Product & { wines?: { slug: string; name: string; collection: string; variety: string | null } | null };
}

export default function ProductCard({ product }: Props) {
  const addItem = useCart((s) => s.addItem);

  const wineSlug = product.wines?.slug;
  const href = wineSlug ? `/shop/${product.sku?.toLowerCase() || product.id}` : "#";

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (product.sold_out) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      wine_name: product.wines?.name || product.name,
      price_nzd: product.price_nzd,
      quantity: 1,
      image_url: product.image_url || product.wines?.slug ? null : null,
      sku: product.sku,
    });
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] bg-brand-surface border border-brand-border overflow-hidden mb-4">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo-round.png"
              alt=""
              width={80}
              height={80}
              className="opacity-20 object-contain"
            />
          </div>
        )}
        {product.sold_out && (
          <div className="absolute inset-0 bg-brand-bg/60 flex items-center justify-center">
            <span className="text-xs tracking-[0.2em] uppercase text-brand-muted border border-brand-muted px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {product.wines?.collection && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-brand-muted">
            {product.wines.collection} Collection
          </p>
        )}
        <h3 className="text-sm text-white leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-brand-text">{formatNZD(product.price_nzd)}</span>
          {!product.sold_out && (
            <button
              onClick={handleAdd}
              className="text-[10px] tracking-[0.15em] uppercase text-brand-muted hover:text-white border border-brand-border hover:border-white px-3 py-1.5 transition-colors"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
