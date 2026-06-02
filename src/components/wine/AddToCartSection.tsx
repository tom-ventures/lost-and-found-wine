"use client";

import { useCart } from "@/lib/cart";
import { formatNZD } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Product, Wine } from "@/types/database";
import { useState } from "react";

interface Props {
  product: Product | null;
  wine: Wine | null;
}

export default function AddToCartSection({ product, wine }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <p className="text-brand-muted text-sm">
        This wine is not currently available for purchase.
      </p>
    );
  }

  if (product.sold_out) {
    return (
      <div>
        <p className="text-lg text-white mb-4">{formatNZD(product.price_nzd)}</p>
        <p className="text-brand-muted text-sm border border-brand-border px-6 py-3 text-center text-xs tracking-[0.15em] uppercase">
          Sold Out
        </p>
      </div>
    );
  }

  function handleAdd() {
    if (!product) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      wine_name: wine?.name ?? product.name,
      price_nzd: product.price_nzd,
      quantity: 1,
      image_url: product.image_url || wine?.image_url || null,
      sku: product.sku,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <p className="text-2xl text-white mb-6">{formatNZD(product.price_nzd)}</p>
      <Button onClick={handleAdd} variant="outline" size="md" className="w-full">
        {added ? "Added ✓" : "Add to Cart"}
      </Button>
    </div>
  );
}
