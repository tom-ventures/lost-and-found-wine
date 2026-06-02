"use client";

import { useCart } from "@/lib/cart";
import { formatNZD } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-6">Lost and Found</p>
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white mb-6">Your Cart</h1>
          <p className="text-brand-muted mb-10">Your cart is empty.</p>
          <Link
            href="/shop"
            className="border border-white text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-brand-bg transition-colors duration-200 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Lost and Found</p>
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.product_id} className="flex gap-6 border-b border-brand-border pb-6">
                <div className="relative w-20 h-28 bg-brand-surface border border-brand-border flex-shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src="/images/logo-round.png" alt="" width={32} height={32} className="opacity-20 object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white mb-1 truncate">{item.product_name}</h3>
                  <p className="text-brand-muted text-xs mb-4">{formatNZD(item.price_nzd)} each</p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 border border-brand-border text-brand-muted hover:border-white hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 border border-brand-border text-brand-muted hover:border-white hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between">
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-brand-muted hover:text-white transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-sm text-white">{formatNZD(item.price_nzd * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-brand-border p-6 sticky top-24">
              <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-xs">
                    <span className="text-brand-muted truncate pr-2">{item.product_name} ×{item.quantity}</span>
                    <span className="text-brand-text whitespace-nowrap">{formatNZD(item.price_nzd * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-4 mb-6 flex justify-between">
                <span className="text-sm text-white">Total</span>
                <span className="text-lg text-white">{formatNZD(totalPrice())}</span>
              </div>

              <p className="text-[10px] text-brand-muted text-center mb-4">Shipping calculated at checkout</p>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-4 text-center">
                <Link href="/shop" className="text-xs text-brand-muted hover:text-white transition-colors">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
