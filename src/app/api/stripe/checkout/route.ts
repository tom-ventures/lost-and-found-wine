import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
import { createServiceClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types/database";

export async function POST(req: NextRequest) {
  try {
    const { items, customer, age_verified } = await req.json() as {
      items: CartItem[];
      customer: {
        email: string;
        name: string;
        phone: string;
        address_line1: string;
        address_line2: string;
        city: string;
        region: string;
        postcode: string;
      };
      age_verified: boolean;
    };

    if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!age_verified) return NextResponse.json({ error: "Age verification required" }, { status: 400 });
    if (!customer.email || !customer.name) return NextResponse.json({ error: "Customer details required" }, { status: 400 });
    if (!customer.region) return NextResponse.json({ error: "New Zealand delivery only" }, { status: 400 });

    const subtotal = items.reduce((sum, i) => sum + i.price_nzd * i.quantity, 0);
    const shipping = subtotal >= 200 ? 0 : 12;
    const total = subtotal + shipping;

    const supabase = await createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from("orders")
      .insert({
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone,
        shipping_address: {
          line1: customer.address_line1,
          line2: customer.address_line2,
          city: customer.city,
          region: customer.region,
          postcode: customer.postcode,
          country: "NZ",
        },
        line_items: items,
        total_nzd: total,
        status: "pending",
        age_verified,
      })
      .select("id")
      .single();

    if (orderError || !order) throw orderError || new Error("Failed to create order");

    const lineItems = [
      ...items.map((item) => ({
        price_data: {
          currency: "nzd",
          product_data: {
            name: item.product_name,
            ...(item.image_url ? { images: [item.image_url] } : {}),
          },
          unit_amount: Math.round(item.price_nzd * 100),
        },
        quantity: item.quantity,
      })),
      ...(shipping > 0
        ? [{
            price_data: {
              currency: "nzd",
              product_data: { name: "Shipping — New Zealand" },
              unit_amount: Math.round(shipping * 100),
            },
            quantity: 1,
          }]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      metadata: { order_id: (order as { id: string }).id },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${(order as { id: string }).id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
