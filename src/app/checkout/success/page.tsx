"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutSuccessPage() {
  const clearCart = useCart((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <Image
          src="/images/logo-white.png"
          alt="Lost and Found Wines"
          width={200}
          height={56}
          className="mx-auto mb-10 object-contain"
        />
        <p className="text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-4">Order Confirmed</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white mb-6">
          Thank you for your order
        </h1>
        <p className="text-brand-muted leading-relaxed mb-10">
          Your order has been confirmed and is being prepared for dispatch.
          We&apos;ll send you an email confirmation with the details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="border border-white text-white px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-brand-bg transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-brand-border text-brand-muted px-8 py-3 text-xs tracking-[0.15em] uppercase hover:border-white hover:text-white transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
