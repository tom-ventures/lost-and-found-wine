import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewsletter } from "@/lib/mailersend";

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, body } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }

    const { data: subscribers } = await supabase
      .from("email_subscribers")
      .select("email, first_name")
      .eq("active", true);

    if (!subscribers?.length) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
    }

    await sendNewsletter(subscribers, subject, body);

    return NextResponse.json({ success: true, count: subscribers.length });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
