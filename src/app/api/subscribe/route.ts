import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/mailersend";

export async function POST(req: NextRequest) {
  try {
    const { email, first_name, last_name } = await req.json();

    if (!email || !first_name) {
      return NextResponse.json({ error: "Email and first name are required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("email_subscribers")
      .insert({ email, first_name, last_name, source: "website" });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "You're already subscribed!" }, { status: 409 });
      }
      throw error;
    }

    try {
      await sendWelcomeEmail(email, first_name);
    } catch (e) {
      console.error("Failed to send welcome email:", e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
