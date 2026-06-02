import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
import { createServiceClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/mailersend";
import type Stripe from "stripe";
import type { Order } from "@/types/database";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (!orderId) return NextResponse.json({ error: "No order_id in metadata" }, { status: 400 });

    const supabase = await createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order } = await (supabase as any)
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (order) {
      const typedOrder = order as Order;
      const lineItems = (typedOrder.line_items as Array<{ product_name: string; quantity: number; price_nzd: number }>) ?? [];
      try {
        await sendOrderConfirmation(
          typedOrder.customer_email,
          typedOrder.customer_name || "Customer",
          typedOrder.id,
          lineItems.map((item) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.price_nzd,
          })),
          typedOrder.total_nzd || 0
        );
      } catch (e) {
        console.error("Failed to send order confirmation email:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
