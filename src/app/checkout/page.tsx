"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatNZD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

const NZ_PROVINCES = [
  "Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay",
  "Manawatū-Whanganui", "Marlborough", "Nelson", "Northland", "Otago",
  "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast",
];

function isDeliveryRestricted(): string | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();

  // Christmas Day (Dec 25)
  if (month === 12 && day === 25) return "We cannot deliver on Christmas Day.";
  // Good Friday / Easter Sunday — approximate (would need proper NZ holiday lib for exact dates)
  // After 11pm any day
  if (hour >= 23) return "Orders placed after 11pm will be processed the following day.";

  return null;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    postcode: "",
  });
  const [ageVerified, setAgeVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const restriction = isDeliveryRestricted();
  const subtotal = totalPrice();
  const shipping = subtotal >= 200 ? 0 : 12;
  const total = subtotal + shipping;

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ageVerified) {
      setError("You must confirm you are 18 or older to purchase alcohol.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
          age_verified: ageVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Lost and Found</p>
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white">Checkout</h1>
        </div>

        {restriction && (
          <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-800/50 text-amber-300 text-sm px-5 py-4 mb-8">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{restriction}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <section>
                <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-5">Contact Details</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-5">
                  Shipping Address <span className="text-brand-muted">(New Zealand only)</span>
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    value={form.address_line1}
                    onChange={(e) => update("address_line1", e.target.value)}
                    className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, unit, etc. (optional)"
                    value={form.address_line2}
                    onChange={(e) => update("address_line2", e.target.value)}
                    className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City / Town"
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Postcode"
                      required
                      value={form.postcode}
                      onChange={(e) => update("postcode", e.target.value)}
                      className="bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <select
                    required
                    value={form.region}
                    onChange={(e) => update("region", e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="" disabled>Select Region</option>
                    {NZ_PROVINCES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <p className="text-xs text-brand-muted">
                    New Zealand delivery only. We cannot ship internationally.
                  </p>
                </div>
              </section>

              {/* Age verification */}
              <section className="border border-brand-border p-6">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageVerified}
                    onChange={(e) => setAgeVerified(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-white flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-white mb-1">
                      I confirm that I am 18 years of age or older
                    </p>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      New Zealand law requires all alcohol purchases to be made by persons aged 18 or over.
                      By checking this box you confirm you meet the legal age requirement.
                    </p>
                  </div>
                </label>
              </section>
            </div>

            {/* Order summary */}
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

                <div className="border-t border-brand-border pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="text-brand-text">{formatNZD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="text-brand-text">{shipping === 0 ? "Free" : formatNZD(shipping)}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-[10px] text-brand-muted">Free shipping on orders over $200</p>
                  )}
                </div>

                <div className="border-t border-brand-border pt-4 mb-6 flex justify-between">
                  <span className="text-sm text-white">Total</span>
                  <span className="text-lg text-white">{formatNZD(total)}</span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mb-4">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Processing..." : "Pay Securely"}
                </Button>

                <p className="text-[10px] text-brand-muted text-center mt-3">
                  Powered by Stripe · All prices in NZD
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
